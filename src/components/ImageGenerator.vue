<template>
	<div class="flex flex-col items-center justify-center min-h-screen bg-gray-900">
		<div class="items-start">
			<h1 class="text-4xl font-bold mb-8 text-white text-start"></h1>
		</div>

		<!-- Flex container for form and image output -->
		<div class="flex flex-row items-start justify-between space-x-8">
			<!-- Form Section -->
			<form @submit.prevent="handleSubmit" class="bg-gray-800 p-6 rounded-lg shadow-lg w-96 space-y-4">
				<!-- Textarea for Prompt -->
				<div>
					<label for="text-input" class="block text-sm font-medium mb-2 text-gray-200">Enter your text:</label>
					<textarea v-model="textInput" id="text-input" rows="4"
						class="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white focus:outline-none focus:ring focus:ring-gray-500 resize-none"
						required></textarea>
				</div>

				<!-- Model Selection -->
				<div>
					<label for="model-select" class="block text-sm font-medium mb-2 text-gray-200">Choose Model:</label>
					<select v-model="model" id="model-select"
						class="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white focus:outline-none focus:ring focus:ring-gray-500">
						<option value="civitai:158441@358398">epiCRealism</option>
						<option value="civitai:204099@375938">JJ's Interior Space</option>
					</select>
				</div>

				<!-- Steps Input -->
				<div>
					<label for="steps-input" class="block text-sm font-medium mb-2 text-gray-200">Steps:</label>
					<input type="number" v-model="steps" id="steps-input"
						class="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white focus:outline-none focus:ring focus:ring-gray-500"
						min="1" max="50" />
				</div>

				<!-- Generate Button -->
				<button type="submit" :disabled="loading"
					class="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded text-white font-semibold disabled:opacity-50">
					Generate Image
				</button>
			</form>

			<!-- Image Output -->
			<div id="image-output" class="flex items-center justify-center bg-gray-800 rounded-lg shadow-lg w-96 h-96">
				<!-- Display generated image or placeholder if image is not yet generated -->
				<div v-if="imageUrl">
					<img :src="imageUrl || undefined" alt="Generated Image"
						class="rounded shadow-lg max-h-full max-w-full" />
				</div>
				<div v-else class="text-gray-500 text-center">
					<p>No image generated yet.</p>
				</div>
			</div>
		</div>

		<!-- Loading Indicator -->
		<div v-if="loading" id="loading-indicator" class="mt-6 text-gray-400">
			{{ loadingAnimation }} Processing...
		</div>

		<!-- Status Message -->
		<div v-if="statusMessage" class="mt-4 text-gray-400 text-sm">
			<p>{{ statusMessage }}</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { initializeWebSocket } from '../services/websocket';
import { generateUUID } from '../services/utils';
import { WebSocketResponse } from '../services/types';

export default defineComponent({
	setup() {
		const textInput = ref('');
		const model = ref('civitai:158441@358398');
		const steps = ref(10);
		const width = ref(512);
		const height = ref(512);
		const imageUrl = ref<string | null>(null);
		const loading = ref(false);
		const statusMessage = ref('');
		const loadingAnimation = ref(''); // This will hold the current frame of the animation
		let ws: WebSocket;
		let timeoutId: number | null = null;
		let animationInterval: number | null = null;

		const updateStatusMessage = (message: string) => {
			statusMessage.value = message;
		};

		const startLoadingAnimation = () => {
			const frames = ['.  ', '.. ', '...', ' ..', '  .', '   ']; // Dots Spinner
			let frameIndex = 0;

			animationInterval = window.setInterval(() => {
				loadingAnimation.value = frames[frameIndex];
				frameIndex = (frameIndex + 1) % frames.length;
			}, 200); // Change frame every 200ms
		};

		const stopLoadingAnimation = () => {
			if (animationInterval !== null) {
				clearInterval(animationInterval);
				animationInterval = null;
				loadingAnimation.value = ''; // Clear the animation
			}
		};

		const resetLoadingState = () => {
			loading.value = false;
			stopLoadingAnimation();
			if (timeoutId !== null) {
				clearTimeout(timeoutId);
				timeoutId = null;
			}
		};

		const handleSubmit = () => {
			if (loading.value) {
				updateStatusMessage('Please wait for the current request to complete.');
				return;
			}

			loading.value = true;
			imageUrl.value = null;

			const imageRequest = {
				taskType: 'imageInference',
				taskUUID: generateUUID(),
				outputType: 'URL',
				outputFormat: 'JPG',
				positivePrompt: textInput.value,
				height: height.value,
				width: width.value,
				model: model.value,
				steps: steps.value,
				CFGScale: 8.0,
				numberResults: 1,
			};

			updateStatusMessage('Sending image generation request...');
			ws.send(JSON.stringify([imageRequest]));

			updateStatusMessage('Image request successfully sent. Processing...');
			startLoadingAnimation(); // Start the loading animation

			// Set a timeout to handle unresponsive requests
			timeoutId = window.setTimeout(() => {
				updateStatusMessage('Request timed out. Please try again.');
				resetLoadingState();
			}, 30000); // 30 seconds timeout
		};

		const handleImageResponse = (response: WebSocketResponse) => {
			if (response.data && response.data[0].taskType === 'imageInference') {
				const imageUrlFromResponse = response.data[0].imageURL;
				if (imageUrlFromResponse) {
					updateStatusMessage('Image generated successfully!');
					imageUrl.value = imageUrlFromResponse;
					resetLoadingState();
				} else {
					updateStatusMessage('Failed to generate image. Please try again.');
					resetLoadingState();
				}
			}
		};

		onMounted(() => {
			ws = initializeWebSocket(handleImageResponse, () => {
				updateStatusMessage('Authenticated successfully.');
			});

			// Ping every 60 seconds to keep WebSocket connection alive
			setInterval(() => {
				if (ws.readyState === WebSocket.OPEN) {
					const pingMessage = { taskType: 'ping', ping: true };
					ws.send(JSON.stringify([pingMessage]));
					updateStatusMessage('Ping message sent to keep connection alive.');
				}
			}, 60000);
		});

		return {
			textInput,
			model,
			steps,
			width,
			height,
			imageUrl,
			loading,
			statusMessage,
			loadingAnimation,
			handleSubmit,
		};
	},
});
</script>
