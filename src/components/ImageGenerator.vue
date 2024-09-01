<template>
	<div class="image-generator-container px-8">
		<div class="w-full text-start mb-8">
			<h1 class="headline-text">skunkwork 1.0</h1>
			<p class="text-white">WIP: //unstable //Beta</p>
		</div>
		<div class="w-full h-px bg-white my-4"></div>
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
			<form @submit.prevent="handleSubmit" class="form-section col-span-1 flex flex-col border-r border-white">
				<div>
					<label for="text-input" class="input-label">Enter your text:</label>
					<textarea v-model="textInput" id="text-input" rows="4" class="text-input resize-none" required
						placeholder="Enter your prompt">
					</textarea>
				</div>
				<!-- Model Selection -->
				<div>
					<label for="model-select" class="input-label">Choose Model:</label>
					<select v-model="model" id="model-select" class="select-input">
						<option value="civitai:158441@358398">epiCRealism</option>
						<option value="civitai:12597@14856">JJ's Interior Space</option>
					</select>
				</div>

				<!-- Preference Selection -->
				<div>
					<label for="preference-select" class="input-label">
						Select Preference:
					</label>
					<select v-model="preference" id="preference-select" class="select-input">
						<option value="speed">Speed</option>
						<option value="quality">Quality</option>
					</select>
				</div>

				<div>
    <label for="steps-input" class="input-label">Steps: {{ steps }}</label>
    <input 
      type="range" 
      v-model="steps" 
      id="steps-input" 
      class="slider-input w-full" 
      min="1" 
      max="50" 
    />
  </div>

				<!-- Aspect Ratio Selection -->
				<div>
					<label for="aspect-ratio-select" class="input-label">Select Aspect Ratio:</label>
					<select v-model="aspectRatio" id="aspect-ratio-select" class="select-input">
						<option value="1:1">1:1 (Square)</option>
						<option value="16:9">16:9 (Widescreen)</option>
						<option value="4:3">4:3 (Standard)</option>
						<option value="3:2">3:2 (Classic)</option>
						<option value="21:9">21:9 (Ultra-Widescreen)</option>
						<option value="9:16">9:16 (Portrait)</option>
						<option value="1.85:1">1.85:1 (Cinematic)</option>
					</select>
				</div>

				<!-- Display Calculated Dimensions -->
				<div>
					<p class="text-sm text-gray-400">Calculated Dimensions: {{ width }} x {{ height }}</p>
				</div>

				<button type="submit" :disabled="loading" class="generate-button">
					Generate Image
				</button>
			</form>

			<div class="col-span-2 lg:h-full flex bg-fill-secondary items-center justify-center">
				<div id="image-output" class="image-output w-full h-full lg:h-auto">
					<div v-if="imageUrl" class="flex items-center justify-center h-full">
						<img :src="imageUrl || undefined" alt="Generated Image"
							class="max-h-full max-w-full object-contain" />
					</div>
					<div v-else class="text-white text-center">
						<p>No image generated yet.</p>
					</div>
				</div>
			</div>
		</div>
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full mt-8">
			<div class="col-span-1 flex flex-col border-r border-white">
				<div class="terminal-container">
					<div v-if="statusMessage" class="status-message">
						Status: <span>{{ statusMessage }}</span><span class="terminal-cursor"></span>
					</div>
					<div v-if="loading" id="loading-indicator" class="loading-indicator">
						Processing Data {{ loadingAnimation }}
					</div>
				</div>
			</div>
			<div class="col-span-2 lg:h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
				<template v-if="oldImages.length > 0">
					<div v-for="(image, index) in oldImages.slice(-4)" :key="index"
						class="flex items-center justify-center">
						<img :src="image" alt="Old Generated Image" class="max-h-24 max-w-24 object-contain" />
					</div>
				</template>
				<div v-else class="flex items-center justify-center col-span-4">
					<p class="text-white">No old images available.</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue";
import { initializeWebSocket } from "../services/websocket";
import { generateUUID } from "../services/utils";
import { WebSocketResponse } from "../services/types";

export default defineComponent({
	setup() {
		const textInput = ref("");
		const model = ref("civitai:158441@358398");
		const steps = ref(10);
		const preference = ref("quality"); // Default preference is "quality"
		const aspectRatio = ref("1:1"); // Default aspect ratio
		const width = ref(1024); // Default max width
		const height = ref(1024); // Default max height
		const imageUrl = ref<string | null>(null);
		const loading = ref(false);
		const statusMessage = ref("");
		const loadingAnimation = ref("");
		const oldImages = ref<string[]>([]);

		let ws: WebSocket;
		let timeoutId: number | null = null;
		let animationInterval: number | null = null;

		const updateStatusMessage = (message: string) => {
			statusMessage.value = message;
		};

		const resetLoadingState = () => {
			loading.value = false;
			stopLoadingAnimation();
			if (timeoutId !== null) {
				clearTimeout(timeoutId);
				timeoutId = null;
			}
		};

		const calculateDimensions = () => {
			const maxDimension = preference.value === "speed" ? 512 : 1024;
			let aspectWidth, aspectHeight;

			switch (aspectRatio.value) {
				case "16:9":
					aspectWidth = 16;
					aspectHeight = 9;
					break;
				case "4:3":
					aspectWidth = 4;
					aspectHeight = 3;
					break;
				case "3:2":
					aspectWidth = 3;
					aspectHeight = 2;
					break;
				case "21:9":
					aspectWidth = 21;
					aspectHeight = 9;
					break;
				case "9:16":
					aspectWidth = 9;
					aspectHeight = 16;
					break;
				case "1.85:1":
					aspectWidth = 1.85;
					aspectHeight = 1;
					break;
				case "1:1":
				default:
					aspectWidth = 1;
					aspectHeight = 1;
					break;
			}

			const maxAspectRatio = Math.max(aspectWidth, aspectHeight);
			if (maxAspectRatio === aspectWidth) {
				width.value = maxDimension;
				height.value = Math.round((maxDimension * aspectHeight) / aspectWidth);
			} else {
				height.value = maxDimension;
				width.value = Math.round((maxDimension * aspectWidth) / aspectHeight);
			}
		};

		const startLoadingAnimation = () => {
			const frames = [".  ", ".. ", "...", " ..", "  .", "   "];
			let frameIndex = 0;

			animationInterval = window.setInterval(() => {
				loadingAnimation.value = frames[frameIndex];
				frameIndex = (frameIndex + 1) % frames.length;
			}, 200);
		};

		const stopLoadingAnimation = () => {
			if (animationInterval !== null) {
				clearInterval(animationInterval);
				animationInterval = null;
				loadingAnimation.value = "";
			}
		};

		const handleSubmit = () => {
			if (loading.value) {
				statusMessage.value = "Please wait for the current request to complete.";
				return;
			}

			if (!ws || ws.readyState !== WebSocket.OPEN) {
				statusMessage.value = "WebSocket connection is not ready. Please wait.";
				return;
			}

			loading.value = true;
			imageUrl.value = null;

			const imageRequestUUID = generateUUID();

			const imageRequest = {
				taskType: "imageInference",
				taskUUID: imageRequestUUID,
				outputType: "URL",
				outputFormat: "JPG",
				positivePrompt: textInput.value,
				height: height.value,
				width: width.value,
				model: model.value,
				steps: steps.value,
				CFGScale: 8.0,
				numberResults: 1,
			};

			// Set initial detailed status message
			statusMessage.value = `Sending image generation request:
    - Model: ${model.value}
    - Width: ${width.value}px
    - Height: ${height.value}px
    - Steps: ${steps.value}
    - Preference: ${preference.value}
    - Aspect Ratio: ${aspectRatio.value}`;

			ws.send(JSON.stringify([imageRequest]));

			// Append the success message
			statusMessage.value += "\nImage request successfully sent.";

			startLoadingAnimation();

			timeoutId = window.setTimeout(() => {
				statusMessage.value += "\nRequest timed out. Please try again.";
				resetLoadingState();
			}, 30000); // Increased timeout duration for stability
		};

		const handleImageResponse = (response: WebSocketResponse) => {
			if (response.data && response.data[0].taskType === "imageInference") {
				const imageUrlFromResponse = response.data[0].imageURL;

				if (imageUrlFromResponse) {
					statusMessage.value += "\nImage generated successfully!";
					imageUrl.value = imageUrlFromResponse;

					// Add the new image to the list of old images
					oldImages.value.push(imageUrlFromResponse);

					resetLoadingState();
				} else {
					statusMessage.value += "\nFailed to generate image. Please try again.";
					resetLoadingState();
				}
			}
		};

		const reinitializeWebSocket = () => {
			console.log("Reinitializing WebSocket due to model change...");
			// Close the existing WebSocket connection if it exists
			if (ws && ws.readyState === WebSocket.OPEN) {
				ws.close();
			}
			// Re-initialize the WebSocket connection after a short delay
			setTimeout(() => {
				ws = initializeWebSocket(handleImageResponse, () => {
					updateStatusMessage(`Authenticated successfully with model: ${model.value}`);
				});
			}, 500); // Short delay to ensure the previous connection is properly closed
		};

		watch([aspectRatio, preference], calculateDimensions, { immediate: true });

		watch(model, () => {
			updateStatusMessage(`Model changed to "${model.value}". Reinitializing WebSocket...`);
			reinitializeWebSocket();
		});

		onMounted(() => {
			reinitializeWebSocket(); // Initialize WebSocket on mount
			setInterval(() => {
				if (ws && ws.readyState === WebSocket.OPEN) {
					const pingMessage = { taskType: "ping", ping: true };
					ws.send(JSON.stringify([pingMessage]));
					updateStatusMessage("Ping message sent to keep connection alive.");
				}
			}, 60000);
		});

		return {
			textInput,
			model,
			steps,
			preference,
			aspectRatio,
			width,
			height,
			imageUrl,
			loading,
			statusMessage,
			loadingAnimation,
			handleSubmit,
			oldImages,
		};
	},
});
</script>
