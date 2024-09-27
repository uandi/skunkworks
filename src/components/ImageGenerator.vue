<template>
  <div class="image-generator-container px-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
      <!-- First Column: skunkwork details -->
      <div class="col-span-1 w-full text-start mb-8">
        <h1 class="headline-text">skunkwork 1.0.1</h1>
        <p class="text-white">WIP: //unstable //Beta</p>
      </div>

      <!-- Second Column: Usage Rules -->
      <div class="col-span-1 w-full text-start mb-8">
        <h2 class="text-lg">Usage Rules:</h2>
        <p class="text-white text-xs">
          Compliance with Applicable Law. You agree to abide by all applicable local, state, national,
          and foreign laws, treaties, and regulations, in connection with your use of the Service.
          SkunkWorksAI agrees to abide by all applicable local, state, national, and foreign laws, treaties,
          and regulations, in connection with its provision of the Service.
        </p>
      </div>

      <!-- Third Column: SVG logo on the very right -->
      <div class="col-span-1 w-full flex items-center justify-end mb-8">
        <img src="/Skunk_works_Logo.svg" alt="Skunkworks Logo" class="w-32 h-auto" />
      </div>
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
        <div v-if="useReferenceImage && uploadedImage" class="mb-4">
          <p class="input-label">Reference Image:</p>
          <img :src="uploadedImage" alt="Reference Image" class="max-w-full max-h-64 object-contain border p-2" />
        </div>
        <div class="flex space-x-4">
          <!-- Model Selection -->
          <div class="w-1/2">
            <label for="model-select" class="input-label">Choose Model:</label>
            <select v-model="model" id="model-select" class="select-input w-full">
              <option value="civitai:158441@358398">General Purpose</option>
            </select>
          </div>

          <div class="w-1/2">
            <label for="preference-select" class="input-label">Select Mode:</label>
            <select v-model="selectedMode" id="preference-select" class="select-input w-full">
              <option value="speed">Speed</option>
              <option value="quality">Quality</option>
              <option value="hd">HD (Max Size)</option>
            </select>
          </div>

        </div>
        <div class="relative group">
          <label for="cfgscale-input" class="input-label">
            CFG Scale: {{ cfgScale }}
            <!-- Tooltip Trigger (Hover) -->
            <span class="ml-2 text-gray-400 cursor-pointer">ⓘ</span>
            <!-- Tooltip Content -->
            <div class="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-cs p-2 z-10">
              Min: 0, Max: 30, Default: 7<br />
              Guidance scale represents how closely the images will resemble the prompt. Higher values are closer to the
              prompt. Low values may reduce the quality of the results.
            </div>
          </label>
          <input type="range" v-model="cfgScale" id="cfgscale-input" class="slider-input w-full" min="0" max="30" />
        </div>

        <div class="relative group">
          <label for="steps-input" class="input-label">
            Steps: {{ steps }}
            <!-- Tooltip Trigger (Hover) -->
            <span class="ml-2 text-gray-400 cursor-pointer">ⓘ</span>
            <!-- Tooltip Content -->
            <div class="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-cs p-2 z-10">
              Min: 1, Max: 100, Default: 20<br />
              Controls the number of iterations. Higher steps can lead to more detail but increase
              generation time.
            </div>
          </label>
          <input type="range" v-model="steps" id="steps-input" class="slider-input w-full" min="1" max="100" />
        </div>

        <div class="flex space-x-4">
          <!-- Seed Input -->
          <!-- Add this to the seed input field section for initial random seed value -->
          <div class="w-1/2 relative group">
            <label for="seed-input" class="input-label">
              Seed: {{ generatedSeed !== null ? generatedSeed : 'Random' }}
              <!-- Tooltip Trigger (Hover) -->
              <span class="ml-2 text-gray-400 cursor-pointer">ⓘ</span>
              <!-- Tooltip Content -->
              <div
                class="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-sm p-2 shadow-lg w-64 z-10">
                Min: 1, Max: 9223372036854776000<br />
                Use the same seed to reproduce images. Leave empty for a random seed.
              </div>
            </label>
            <input type="number" v-model="seed" id="seed-input" class="number-input w-full" min="1"
              :max="9223372036854776000" placeholder="Random" />
          </div>



            <!-- Aspect Ratio Selection -->
  <div class="w-1/2">
    <label for="aspect-ratio-select" class="input-label">Select Aspect Ratio:</label>
    <select v-model="aspectRatio" id="aspect-ratio-select" class="select-input w-full">
      <option value="1:1">1:1 (Square)</option>
      <option value="3:2">3:2 (Classic)</option>
      <option value="2:3">2:3 (Reverse)</option>
    </select>
  </div>

        </div>

        <div>
          <p class="text-sm text-gray-400">Calculated Dimensions: {{ width }} x {{ height }}</p>
        </div>

        <button @click="handleSubmit" :disabled="loading" class="generate-button">
          {{ loading ? 'Generating...' : 'Generate Image' }}
        </button>
      </form>

      <!-- Image Display Section -->
      <div class="col-span-2 lg:h-full flex bg-fill-secondary items-center justify-center rounded-lg">
        <div id="image-output" class="image-output w-full h-full lg:h-auto">
          <!-- Show loading message when loading is true -->
          <div v-if="loading" class="text-white text-center">
            <p>Generating image...</p>
          </div>
          <!-- Show the image when imageUrl is set and loading is false -->
          <div v-else-if="imageUrl" class="flex flex-col items-center justify-center h-full">
            <!-- Image element using the reactive imageUrl -->
            <img :src="imageUrl" alt="Generated Image" class="max-h-full max-w-full object-contain p-4" />

            <!-- Buttons for viewing and downloading the image -->
            <div class="flex flex-col space-y-2 mb-4">
              <div class="flex space-x-4">
                <button @click="openModal" class="view-button">View Full Size</button>
                <button @click="downloadImage" class="download-button">Download Image</button>
              </div>
            </div>

            <!-- Display the seed -->
            <div class="text-white text-center mt-4">
              <p>Seed: {{ generatedSeed }}</p> <!-- Use the generatedSeed variable to display the seed -->
            </div>
          </div>

          <!-- Placeholder text if no image has been generated yet and not loading -->
          <div v-else class="text-white text-center">
            <p>No image generated yet.</p>
          </div>
        </div>
      </div>

      <!-- Image Modal -->
      <image-modal v-if="modalVisible" :isVisible="modalVisible" :imageUrl="imageUrl || ''"
        :seed="generatedSeed !== null ? generatedSeed : undefined" @close="closeModal" />
    </div>

    <!-- Status Messages and Old Images -->
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
            <div class="w-32 h-32 border border-white flex items-center justify-center rounded-md">
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
    const generateRandomSeed = () => {
      return Math.floor(Math.random() * 9223372036854776000) + 1;
    };

    const seed = ref<number | null>(null); // User-provided seed
    const generatedSeed = ref<number | null>(null); // Seed used in the generated image
    const cfgScale = ref(7); // Default value for CFG Scale
    const modalVisible = ref(false);
    const textInput = ref("");
    const model = ref("civitai:158441@358398");
    const selectedMode = ref("speed"); 
    const steps = ref(15);

    const aspectRatio = ref("1:1");
    const width = ref(512);
    const height = ref(512);
    const imageUrl = ref<string | null>(null);
    const loading = ref(false);
    const statusMessage = ref("");
    const loadingAnimation = ref("");
    const oldImages = ref<string[]>([]);
    const uploadedImage = ref<string | null>(null);
    const imageUUID = ref<string | null>(null);
    const useReferenceImage = ref(false);

    const preference = ref("speed"); // Default to speed mode

    let ws: WebSocket;
    let timeoutId: number | null = null;
    let animationInterval: number | null = null;

    const updateStatusMessage = (message: string) => {
      statusMessage.value = message;
    };

    const resetLoadingState = () => {
      loading.value = false; // Stop the loading state
      stopLoadingAnimation(); // Stop any animations
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const calculateDimensions = () => {
  const minDimension = 512; // Minimum dimension size
  const maxDimension = 2048; // Maximum dimension size

  let aspectWidth, aspectHeight;

  // Set aspect ratio dimensions based on selected aspectRatio value
  switch (aspectRatio.value) {
    case "3:2":
      aspectWidth = 3;
      aspectHeight = 2;
      break;
    case "2:3":
      aspectWidth = 2;
      aspectHeight = 3;
      break;
    case "1:1":
    default:
      aspectWidth = 1;
      aspectHeight = 1;
      break;
  }

  // Determine the max possible dimension based on the selected mode
  let baseDimension;
  switch (selectedMode.value) {
    case "quality":
      baseDimension = 1024;
      break;
    case "hd":
      baseDimension = 2048;
      break;
    case "speed":
    default:
      baseDimension = 512;
      break;
  }

  // Calculate width and height while respecting minimum and maximum dimensions
  if (aspectWidth >= aspectHeight) {
    width.value = Math.max(minDimension, Math.min(baseDimension, maxDimension));
    height.value = Math.max(
      minDimension,
      Math.min(Math.round((baseDimension * aspectHeight) / aspectWidth), maxDimension)
    );
  } else {
    height.value = Math.max(minDimension, Math.min(baseDimension, maxDimension));
    width.value = Math.max(
      minDimension,
      Math.min(Math.round((baseDimension * aspectWidth) / aspectHeight), maxDimension)
    );
  }

  // Ensure dimensions are multiples of 64
  width.value = Math.round(width.value / 64) * 64;
  height.value = Math.round(height.value / 64) * 64;

  // Ensure dimensions are within the valid range
  width.value = Math.max(minDimension, Math.min(width.value, maxDimension));
  height.value = Math.max(minDimension, Math.min(height.value, maxDimension));
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

        // Do not reassign ws.onmessage here
      };

      reader.readAsDataURL(file); // Convert the image to base64 for upload
    };

    const handleSubmit = () => {
  if (loading.value) {
    statusMessage.value = "Please wait for the current request to complete.";
    return; // Prevent multiple submissions
  }

  if (!ws || ws.readyState !== WebSocket.OPEN) {
    statusMessage.value = "WebSocket connection is not ready. Please wait.";
    return;
  }

  loading.value = true; // Set loading to true when starting request
  imageUrl.value = null;
  generatedSeed.value = seed.value || generateRandomSeed(); // Use provided seed or generate new random seed

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
    seed: generatedSeed.value, // Send the seed used
    CFGScale: cfgScale.value, // Include the CFG Scale value
    numberResults: 1,
  };

  // Include reference image if used
  if (useReferenceImage.value && imageUUID.value) {
    imageRequest.seedImage = imageUUID.value;
    imageRequest.strength = 0.8;
  }

  ws.send(JSON.stringify([imageRequest]));

  statusMessage.value = `Sending image generation request ${useReferenceImage.value && imageUUID.value ? "with reference image" : ""}:
  - Model: ${model.value}
  - Width: ${width.value}px
  - Height: ${height.value}px
  - Steps: ${steps.value}
  - Mode: ${selectedMode.value}
  - Seed: ${generatedSeed.value !== null ? generatedSeed.value : "Random"}`;

  startLoadingAnimation();

  timeoutId = window.setTimeout(() => {
    statusMessage.value += "\nRequest timed out. Please try again.";
    resetLoadingState();
  }, 30000); // 30 seconds timeout
};

    const handleImageResponse = (response: WebSocketResponse) => {
      if (!response || !response.data || !Array.isArray(response.data) || response.data.length === 0) {
        console.error("Received an invalid response or empty data array", response);
        return;
      }

      const responseData = response.data[0]; // Access the first element safely

      // Handle image upload response
      if (responseData.taskType === "imageUpload") {
        if (responseData.imageUUID) {
          imageUUID.value = responseData.imageUUID;
          statusMessage.value = "Image uploaded successfully!";
        } else {
          statusMessage.value = "Image upload failed.";
        }
      }
      // Handle image inference response
      else if (responseData.taskType === "imageInference") {
        const generatedImageUrl = responseData.imageURL;

        if (generatedImageUrl) {
          imageUrl.value = generatedImageUrl; // Set the generated image URL

          // Store the seed used for the image generation
          if (responseData.seed !== undefined) {
            generatedSeed.value = responseData.seed;
          }

          // Add the new image to oldImages array
          oldImages.value.push(generatedImageUrl);

          // Ensure only the latest 4 images are kept
          if (oldImages.value.length > 4) {
            oldImages.value.shift(); // Remove the oldest image
          }

          statusMessage.value = "Image generated successfully!";
          resetLoadingState(); // Reset loading state and clear animations or timeouts
        } else {
          statusMessage.value = "Failed to generate image. Please try again.";
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

    watch([selectedMode, aspectRatio], calculateDimensions, { immediate: true });

    watch(model, () => {
      console.log(`Model changed to: ${model.value}`);
      reinitializeWebSocket();
      updateStatusMessage(`Authenticated successfully with model: ${model.value}`);
    });

    onMounted(() => {
  seed.value = generateRandomSeed(); // Set initial random seed
  reinitializeWebSocket(); // Initialize WebSocket connection

  calculateDimensions(); // Set initial dimensions based on current preference and aspect ratio

  setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const pingMessage = { taskType: "ping", ping: true };
      ws.send(JSON.stringify([pingMessage]));
      updateStatusMessage("Ping message sent to keep connection alive.");
    }
  }, 60000);
});

// Watch for changes in preference and aspect ratio to recalculate dimensions
watch([selectedMode, aspectRatio], calculateDimensions, { immediate: true });

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
      cfgScale,
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
      handleImageResponse,
      seed,
      generatedSeed,
      selectedMode, 

    };
  },
});
</script>