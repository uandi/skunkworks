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
				<div>
					<label for="image-upload" class="input-label">Upload Reference Image:</label>
					<input type="file" id="image-upload" @change="handleImageUpload"
						accept="image/jpeg,image/png,image/webp,image/bmp,image/gif" class="file-input" />
				</div>
				<div class="flex items-baseline space-x-2">
					<input type="checkbox" id="use-reference-image" v-model="useReferenceImage"
						class="form-checkbox h-3 w-3 text-green" />
					<label for="use-reference-image" class="input-label">
						Use Reference Image
					</label>
				</div>
				<!-- Model Selection -->
				<div>
					<label for="model-select" class="input-label">Choose Model:</label>
					<select v-model="model" id="model-select" class="select-input">
						<option value="civitai:158441@358398">epiCRealism</option>
						<option value="civitai:158441@358398">SocaRealism XL</option>
						<option value="civitai:133005@471120">Juggernaut XL</option>
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
					<input type="range" v-model="steps" id="steps-input" class="slider-input w-full" min="1" max="50" />
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
					<div v-if="imageUrl" class="flex flex-col items-center justify-center h-full">
						<img :src="imageUrl || undefined" alt="Generated Image"
							class="max-h-full max-w-full object-contain p-4" />
						<div class="flex flex-col space-y-2 mb-4">
							<div class="flex space-x-4">
								<button @click="openModal" class="view-button">
									View Full Size
								</button>
								<button @click="downloadImage" class="download-button">
									Download Image
								</button>
							</div>
							<!-- Display success message here -->
							<span v-if="statusMessage.includes('Image generated successfully!')"
								class="text-sm text-green-400">
								{{ statusMessage }}
							</span>
						</div>
					</div>
					<div v-else class="text-white text-center">
						<p>No image generated yet.</p>
					</div>
				</div>
			</div>
			<!-- Image Modal -->
			<image-modal v-if="modalVisible" :isVisible="modalVisible" :imageUrl="imageUrl || ''" @close="closeModal" />
			<!-- Existing template code -->
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
						class="flex items-center justify-center cursor-pointer" @click="viewImage(image)">
						<img :src="image" alt="Old Generated Image" class="max-h-32 max-w-32 object-contain" />
					</div>
				</template>
				<template v-else>
					<!-- Placeholder for when there are no images -->
					<div v-for="index in 4" :key="index" class="flex items-center justify-center cursor-pointer">
						<div
							class="w-32 h-32 bg-gray-800 border border-gray-600 flex items-center justify-center text-gray-500">
							<p>Placeholder</p>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, computed } from "vue";
import { initializeWebSocket } from "../services/websocket";
import { generateUUID } from "../services/utils";
import { WebSocketResponse } from "../services/types";
import ImageModal from "./ImageModal.vue";

export default defineComponent({
	components: {
		ImageModal,
	},
	setup() {
		const modalVisible = ref(false);
		const textInput = ref("");
		const model = ref("civitai:158441@358398");
		const steps = ref(10);
		const preference = ref("quality");
		const aspectRatio = ref("4:3");
		const width = ref(1024);
		const height = ref(1024);
		const imageUrl = ref<string | null>(null);
		const loading = ref(false);
		const statusMessage = ref("");
		const loadingAnimation = ref("");
		const oldImages = ref<string[]>([]);
		const uploadedImage = ref<string | null>(null);
		const imageUUID = ref<string | null>(null);
		const useReferenceImage = ref(false);

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

		const handleImageUpload = async (event: Event) => {
			const file = (event.target as HTMLInputElement).files?.[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onload = async () => {
				uploadedImage.value = reader.result as string;

				const imageUploadUUID = generateUUID();
				const uploadRequest = {
					taskType: "imageUpload",
					taskUUID: imageUploadUUID,
					image: uploadedImage.value,
				};

				ws.send(JSON.stringify([uploadRequest]));

				ws.onmessage = (event: MessageEvent) => {
					const response: WebSocketResponse = JSON.parse(event.data);
					const imageUploadResponse = response.data[0];

					if (imageUploadResponse.taskType === "imageUpload") {
						if (imageUploadResponse.imageUUID) {
							imageUUID.value = imageUploadResponse.imageUUID;
							statusMessage.value = "Image uploaded successfully!";
						} else {
							statusMessage.value = "Image upload failed: no imageUUID returned.";
						}
					}
				};
			};

			reader.readAsDataURL(file);
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

			const imageRequest: any = {
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

			if (useReferenceImage.value && imageUUID.value) {
				imageRequest.seedImage = imageUUID.value; // Add seedImage for image-to-image
				imageRequest.strength = 0.8; // Control the influence of the seed image
			}

			ws.send(JSON.stringify([imageRequest]));

			statusMessage.value = `Sending image generation request with${useReferenceImage.value && imageUUID.value ? " reference image" : ""
				}:
    - Model: ${model.value}
    - Width: ${width.value}px
    - Height: ${height.value}px
    - Steps: ${steps.value}
    - Preference: ${preference.value}
    - Aspect Ratio: ${aspectRatio.value}`;

			startLoadingAnimation();

			timeoutId = window.setTimeout(() => {
				statusMessage.value += "\nRequest timed out. Please try again.";
				resetLoadingState();
			}, 30000);
		};

		const handleImageResponse = (response: WebSocketResponse) => {
			if (response.data && response.data[0].taskType === "imageInference") {
				const imageUrlFromResponse = response.data[0].imageURL;

				if (imageUrlFromResponse) {
					statusMessage.value += "\nImage generated successfully!";
					imageUrl.value = imageUrlFromResponse;

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
			if (ws && ws.readyState === WebSocket.OPEN) {
				ws.close();
			}
			setTimeout(() => {
				ws = initializeWebSocket(handleImageResponse, () => {
					updateStatusMessage(`Authenticated successfully with model: ${model.value}`);
				});
			}, 500);
		};

		watch([aspectRatio, preference], calculateDimensions, { immediate: true });

		watch(model, () => {
			console.log(`Model changed to: ${model.value}`);
			reinitializeWebSocket();
			updateStatusMessage(`Authenticated successfully with model: ${model.value}`);
		});

		onMounted(() => {
			reinitializeWebSocket();
			setInterval(() => {
				if (ws && ws.readyState === WebSocket.OPEN) {
					const pingMessage = { taskType: "ping", ping: true };
					ws.send(JSON.stringify([pingMessage]));
					updateStatusMessage("Ping message sent to keep connection alive.");
				}
			}, 60000);
		});

		const openModal = () => {
			modalVisible.value = true;
		};

		const closeModal = () => {
			modalVisible.value = false;
		};

		const viewImage = (imageUrlToView: string) => {
			imageUrl.value = imageUrlToView;
			openModal();
		};

		const downloadFilename = computed(() => {
			if (imageUrl.value) {
				const imageExtension = imageUrl.value.split(".").pop();
				return `skunkworks_${generateUUID()}.${imageExtension}`;
			}
			return "skunkworks_image.jpg";
		});

		const downloadImage = async () => {
			if (imageUrl.value) {
				try {
					const response = await fetch(imageUrl.value);
					const blob = await response.blob();

					const link = document.createElement("a");
					link.href = URL.createObjectURL(blob);
					link.download = downloadFilename.value;

					document.body.appendChild(link);
					link.click();

					document.body.removeChild(link);
					URL.revokeObjectURL(link.href);
				} catch (error) {
					console.error("Download failed:", error);
				}
			}
		};

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
			downloadFilename,
			downloadImage,
			modalVisible,
			openModal,
			closeModal,
			viewImage,
			handleImageUpload,
			uploadedImage,
			imageUUID,
			useReferenceImage,
		};
	},
});
</script>