<template>
	<div>
	  <h1>Image Generator</h1>
	  <form @submit.prevent="handleSubmit">
		<label for="text-input">Enter your text:</label>
		<input type="text" v-model="textInput" id="text-input" required />
  
		<button type="submit">Generate Image</button>
	  </form>
  
	  <div v-if="loading" id="loading-indicator">
		Processing...
	  </div>
  
	  <div v-if="imageUrl" id="image-output">
		<img :src="imageUrl" alt="Generated Image" />
	  </div>
  
	  <div v-if="statusMessage" id="status-messages">
		{{ statusMessage }}
	  </div>
	</div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { generateUUID } from '../services/utils';
    
  export default defineComponent({
	name: 'ImageGenerator',
	setup() {
	  const textInput = ref('');
	  const imageUrl = ref<string | null>(null);
	  const loading = ref(false);
	  const statusMessage = ref('');
  
	  let ws: WebSocket;
  
	  const updateStatusMessage = (message: string) => {
		statusMessage.value += `${message}\n`;
	  };
  
	  onMounted(() => {
		ws = new WebSocket('wss://ws-api.runware.ai/v1');
  
		ws.onopen = () => {
		  const message = 'WebSocket connection opened.';
		  console.log(message);
		  updateStatusMessage(message);
  
		  const authMessage = [{
			taskType: "authentication",
			apiKey: process.env.VUE_APP_API_KEY
		  }];
		  ws.send(JSON.stringify(authMessage));
		};
  
		ws.onmessage = (event: MessageEvent) => {
		  const response = JSON.parse(event.data);
		  console.log('Received response:', response);
  
		  if (response.data && response.data[0].taskType === "authentication") {
			const message = `Authenticated successfully. Connection session UUID: ${response.data[0].connectionSessionUUID}`;
			console.log(message);
			updateStatusMessage(message);
		  }
  
		  if (response.data && response.data[0].taskType === "imageInference") {
			const imageUrlFromResponse = response.data[0].imageURL;
			if (imageUrlFromResponse) {
			  const message = 'Image generated successfully!';
			  console.log(message);
			  updateStatusMessage(message);
			  imageUrl.value = imageUrlFromResponse;
			  loading.value = false;
			} else {
			  const errorMessage = "Failed to generate image. Please try again.";
			  console.log(errorMessage);
			  updateStatusMessage(errorMessage);
			  loading.value = false;
			}
		  }
		};
  
		ws.onclose = () => {
		  const message = 'WebSocket connection closed.';
		  console.log(message);
		  updateStatusMessage(message);
		};
  
		ws.onerror = (error: Event) => {
		  const errorMessage = 'WebSocket error occurred. Please try again.';
		  console.error(errorMessage);
		  updateStatusMessage(errorMessage);
		  loading.value = false;
		};
	  });
  
	  const handleSubmit = () => {
		loading.value = true;
		imageUrl.value = '';  // Clear previous image
  
		const imageRequest = [{
		  taskType: "imageInference",
		  taskUUID: generateUUID(),
		  outputType: "URL",
		  outputFormat: "JPG",
		  positivePrompt: textInput.value,
		  height: 512,
		  width: 512,
		  model: "civitai:158441@358398",
		  steps: 100,
		  CFGScale: 8.0,
		  numberResults: 1
		}];
  
		ws.send(JSON.stringify(imageRequest));
		updateStatusMessage('Sending image generation request...');
	  };
  
	  return {
		textInput,
		imageUrl,
		loading,
		statusMessage,
		handleSubmit,
	  };
	}
  });
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>../services/utils