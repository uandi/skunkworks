<template>
	<div v-if="isVisible" class="modal-overlay">
	  <div class="modal-content">
		<img :src="imageUrl" alt="Full-size image" class="modal-image" />
		<div class="flex space-x-4">
		  <button @click="downloadImage" class="download-button">
			Download Image
		  </button>
		  <button @click="$emit('close')" class="close-button">
			Close
		  </button>
		</div>
	  </div>
	</div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  
  export default defineComponent({
	props: {
	  isVisible: {
		type: Boolean,
		required: true,
	  },
	  imageUrl: {
		type: String,
		required: true,
	  },
	},
	setup(props) {
	  const downloadFilename = computed(() => {
		const imageExtension = props.imageUrl.split('.').pop();
		return `skunkworks_${Date.now()}.${imageExtension}`;
	  });
  
	  const downloadImage = async () => {
		try {
		  const response = await fetch(props.imageUrl);
		  const blob = await response.blob();
		  const link = document.createElement('a');
		  link.href = URL.createObjectURL(blob);
		  link.download = downloadFilename.value;
		  document.body.appendChild(link);
		  link.click();
		  document.body.removeChild(link);
		  URL.revokeObjectURL(link.href);
		} catch (error) {
		  console.error('Download failed:', error);
		}
	  };
  
	  return {
		downloadImage,
	  };
	},
  });
  </script>
  
