<template>
	<div>
		<h1>skunkworks</h1>
		<form id="text-form" @submit.prevent="handleSubmit">
			<label for="text-input">Enter your text:</label>
			<input type="text" v-model="textInput" id="text-input" required />

			<label for="model-select">Choose Model:</label>
			<select id="model-select" v-model="model">
				<option value="civitai:158441@358398">Model A</option>
				<option value="anotherModel:123456">Model B</option>
			</select>

			<label for="steps-input">Steps:</label>
			<input type="number" v-model="steps" id="steps-input" value="10" min="1" max="50">

			<label for="dimension-width">Width:</label>
			<input type="number" v-model="width" id="dimension-width" value="512" min="64" max="1024">

			<label for="dimension-height">Height:</label>
			<input type="number" v-model="height" id="dimension-height" value="512" min="64" max="1024">

			<button type="submit" :disabled="loading">Generate Image</button>
		</form>

		<div v-if="loading" id="loading-indicator">
			<span>Processing...</span>
		</div>

		<div v-if="imageUrl" id="image-output">
			<img id="generated-img" class="rounded cursor-pointer" :src="imageUrl" alt="Generated Image"
				@click="openLightbox" />
		</div>

		<div id="image-actions" v-if="imageUrl">
			<button id="download-btn" @click="downloadImage">Download Image</button>
			<button id="share-btn" @click="shareImage">Share Image</button>
		</div>

		<div id="status-messages" class="text-right text-gray-400 mt-2">
			<p v-for="message in statusMessage.split('\n')" :key="message">{{ message }}</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { initializeWebSocket } from '../services/websocket';
import { generateUUID } from '../services/utils';

export default defineComponent({
		setup() {
	const textInput = ref('');
	const model = ref('civitai:158441@358398');
	const steps = ref(15);
	const width = ref(512);
	const height = ref(512);
	const imageUrl = ref<string | null>(null);
	const loading = ref(false);
	const statusMessage = ref('');
	const isLightboxVisible = ref(false);
	let ws: WebSocket;

	const updateStatusMessage = (message: string) => {
		statusMessage.value += `${message}\n`;
	};

	const downloadImage = () => {
		const a = document.createElement('a');
		a.href = imageUrl.value!;
		a.download = 'generated_image.jpg';
		a.click();
	};

	const shareImage = () => {
		if (navigator.share) {
		navigator.share({
			title: 'Generated Image',
			url: imageUrl.value!,
		}).then(() => {
			console.log('Thanks for sharing!');
		}).catch(console.error);
		} else {
		alert('Sharing is not supported in this browser.');
		}
	};

	const openLightbox = () => {
		isLightboxVisible.value = true;
	};

	const closeLightbox = () => {
		isLightboxVisible.value = false;
	};

	const handleSubmit = () => {
		loading.value = true;
		imageUrl.value = null;  // Clear previous image

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
	};

	const handleImageResponse = (response: any) => {
		if (response.data && response.data[0].taskType === 'imageInference') {
		const imageUrlFromResponse = response.data[0].imageURL;
		if (imageUrlFromResponse) {
			updateStatusMessage('Image generated successfully!');
			imageUrl.value = imageUrlFromResponse;
			loading.value = false;
		} else {
			updateStatusMessage('Failed to generate image. Please try again.');
			loading.value = false;
		}
		}
	};

	// Reconnection logic
	let reconnectAttempts = 0;
	const maxReconnectAttempts = 5;

	function connectWebSocket() {
		ws = initializeWebSocket(handleImageResponse, () => {
		updateStatusMessage('Authenticated successfully.');
		reconnectAttempts = 0; // Reset attempts after successful connection
		});

		ws.onclose = () => {
		if (reconnectAttempts < maxReconnectAttempts) {
			const timeout = Math.pow(2, reconnectAttempts) * 1000; // Exponential backoff
			setTimeout(() => {
			reconnectAttempts++;
			updateStatusMessage(`Reconnecting... Attempt ${reconnectAttempts}`);
			connectWebSocket();
			}, timeout);
		} else {
			updateStatusMessage('Failed to reconnect after several attempts.');
		}
		};
	}

	// Initially connect WebSocket
	connectWebSocket();

	// Ping every 60 seconds to keep WebSocket connection alive
	setInterval(() => {
		if (ws.readyState === WebSocket.OPEN) {
		const pingMessage = { taskType: 'ping', ping: true };
		ws.send(JSON.stringify([pingMessage]));
		updateStatusMessage('Ping message sent to keep connection alive.');
		}
	}, 60000); // 60 seconds interval

	return {
		textInput,
		model,
		steps,
		width,
		height,
		imageUrl,
		loading,
		statusMessage,
		isLightboxVisible,
		downloadImage,
		shareImage,
		openLightbox,
		closeLightbox,
		handleSubmit,
		updateStatusMessage,
	};
	},
});
</script>

<style scoped>
/* Add your styles here */
body {
	font-family: 'Roboto', sans-serif;
	background-color: #000;
	color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	max-width: 1024px;
}

h1 {
	text-align: left;
	margin-bottom: 2rem;
	font-size: 2rem;
	font-weight: 700;
}

form {
	display: flex;
	flex-direction: column;
	width: 100%;
}

label,
input,
select,
button {
	width: 100%;
	margin-bottom: 1rem;
}

label {
	text-align: left;
	font-size: 1rem;
	font-weight: 400;
}

input,
select {
	background-color: #fff;
	color: #000;
	border: 1px solid #444;
	padding: 0.5rem;
	border-radius: 0.25rem;
}

button {
	background-color: #000;
	color: #fff;
	border: 1px solid #444;
	padding: 0.75rem;
	border-radius: 0.25rem;
	cursor: pointer;
	transition: background-color 0.3s ease;
}

button:hover {
	background-color: #333;
}

#loading-indicator {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 0.5rem;
	text-align: left;
}

#image-output {
	margin-top: 2rem;
	display: flex;
	justify-content: center;
	align-items: center;
	border: 1px dashed #444;
	padding: 2rem;
	border-radius: 0.25rem;
	width: 300px;
	height: 300px;
}

#image-actions {
	display: flex;
	justify-content: space-between;
	margin-top: 1rem;
	width: 300px;
}

#lightbox {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.8);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 50;
	padding: 2rem;
}

#lightbox img {
	max-width: 100%;
	max-height: 100%;
}

#close-lightbox {
	position: absolute;
	top: 1rem;
	left: 1rem;
	font-size: 1.5rem;
	background: transparent;
	border: none;
	color: #fff;
	cursor: pointer;
}
</style>