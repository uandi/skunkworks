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
        <h2 class="text-lg">Prompt Guide:</h2>
        <p class="text-white text-xs">
          Use concise descriptions and combine elements like “mountains + cityscape.” Emphasize with (object:1.5) or reduce with (object:0.5). Use + for strong additions and / for blending. Add light effects like (soft glow:1.3) or moods like (mystical atmosphere:1.4). Experiment with layering (multiple objects in one prompt), textures (e.g., “smooth, rough”), and color specifics (“vivid colors”, “monochrome”). Mix time periods (e.g., “ancient + futuristic”).
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
          <textarea v-model="textInput" id="text-input" rows="6" class="text-input resize-none" required></textarea>
        </div>

        <!-- <div>
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
        </div> -->
        
        <div class="flex space-x-4">
          <!-- Model Selection (Dropdown and Custom Input) -->
          <div class="w-1/2">
            <label for="model-select" class="input-label">Choose Model:</label>
            <select v-model="selectedModelOption" id="model-select" class="select-input w-full">
              <option value="civitai:618692@691639">Flux 1.1 (Text)</option>
              <option value="civitai:788550@915279">General Purpose</option>
              <option value="civitai:4384@128713">Unreal Engine</option>
              <option value="civitai:8030@261539">Analog Realistic</option>
              <option value="civitai:30240@102996">Cartoon</option>
              <option value="other">Other</option>
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

        <!-- Custom Model ID Input -->
        <div class="w-full mb-4">
          <!-- <div class="w-full mb-4" v-if="selectedModelOption === 'other'"> -->
          <label for="custom-model-id" class="input-label">Choose ‘Other’ to Enter Model ID:</label>
          <input
            type="text"
            v-model="customModelId"
            id="custom-model-id"
            class="text-input w-full"
            placeholder="civitai:123456@789012"
          />
          <p v-if="modelIdError" class="text-red-500 text-xs mt-1">{{ modelIdError }}</p>
        </div>


        
        <div class="relative group">
          <label for="cfgscale-input" class="input-label">
            CFG Scale: {{ cfgScale }}
            <!-- Tooltip Trigger (Hover) -->
            <span class="ml-2 text-gray-400 cursor-pointer">ⓘ</span>
            <!-- Tooltip Content -->
            <div class="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-cs p-2 z-10">
              Min: 0, Max: 30, Default: 7<br />
              Guidance scale represents how closely the images will resemble the
              prompt. Higher values are closer to the prompt. Low values may
              reduce the quality of the results.
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
              Controls the number of iterations. Higher steps can lead to more
              detail but increase generation time.
            </div>
          </label>
          <input type="range" v-model="steps" id="steps-input" class="slider-input w-full" min="1" max="100" />
        </div>

        <div class="flex space-x-4">
          <!-- Seed Input -->
          <!-- Add this to the seed input field section for initial random seed value -->
          <div class="w-1/2 relative group">
            <label for="seed-input" class="input-label">
              Seed: {{ seed !== null ? seed : "Random" }}
              <!-- Tooltip Trigger (Hover) -->
              <!-- <span class="ml-2 text-gray-400 cursor-pointer">ⓘ</span> -->
              <!-- Tooltip Content -->
              <div
                class="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-sm p-2 shadow-lg w-64 z-10">
                Min: 1, Max: 9223372036854776000<br />
                Use the same seed to reproduce images. Leave empty for a random
                seed.
              </div>
            </label>
            <input type="number" v-model="seedInput" id="seed-input" class="number-input w-full" min="1"
              :max="9223372036854776000" placeholder="Random" />
          </div>

          <!-- Aspect Ratio Selection -->
          <div class="w-1/2">
            <label for="aspect-ratio-select" class="input-label">Select<br>Aspect Ratio:</label>
            <select v-model="aspectRatio" id="aspect-ratio-select" class="select-input w-full">
              <option value="1:1">1:1 (Square)</option>
              <option value="3:2">3:2 (Classic)</option>
              <option value="2:3">2:3 (Reverse)</option>
            </select>
          </div>
        </div>

        <div>
          <p class="text-sm text-gray-400">
            Calculated Dimensions: {{ width }} x {{ height }}
          </p>
        </div>

        <div class="flex flex-col items-start w-full">
          <button @click="handleSubmit" :disabled="loading" class="generate-button mb-2 w-full">
            {{ loading ? "Generating..." : "Generate Image" }}
          </button>
          <p class="text-xs text-gray-400 text-start">
            By generating, you accept the terms and agree that you are solely responsible for the images you create, not the service provider.
          </p>
        </div>
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
                <button @click="openModal" class="view-button">
                  View Full Size
                </button>
                <button @click="downloadImage" class="download-button">
                  Download Image
                </button>
              </div>
            </div>

            <!-- Display the seed -->
            <div class="text-white text-center my-4">
              <p>Seed: {{ generatedSeed }}</p>
              <!-- Use the generatedSeed variable to display the seed -->
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
      <div class="col-span-2 lg:h-full grid gap-4 auto-rows-fr justify-items-start">
        <div class="flex w-full justify-between">
          <template v-if="oldImages.length > 0">
            <div
              v-for="(image, index) in oldImages.slice(-4)"
              :key="index"
              class="cursor-pointer hover:opacity-80 transition-opacity duration-200 m-2"
              @click="viewImage(image)"
            >
            <img
            :src="image"
            alt="Old Generated Image"
            class="max-h-24 md:max-h-32 lg:max-h-40 max-w-24 md:max-w-32 lg:max-w-40 object-contain"
          />
            </div>
          </template>
          <template v-else>
            <div
              v-for="index in 4"
              :key="index"
              class="cursor-pointer"
            >
              <div class="w-32 h-32 border border-white flex items-center justify-center rounded-md">
                <p>Placeholder</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>


    <div class="w-full h-px bg-white my-4"></div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
      <!-- First Column: skunkwork details -->
      <div class="col-span-1 w-full text-start mb-8">
        <h2 class="text-lg">Text-to-Image:</h2>
        <p class="text-white text-xs">
          Generate images from descriptive text prompts. This process translates your text
          into high-quality visuals, allowing you to create detailed and vivid images based on your ideas.
        </p>
      </div>

      <!-- Second Column: Usage Rules -->
      <div class="col-span-2 w-full text-start mb-8">
        <h2 class="text-lg mb-2">Text-to-Image Generation:</h2>
        <ul class="text-white text-xs space-y-1">
          <li class="flex items-start">
            <span class="inline-block w-4 shrink-0 mr-2">•</span>
            <span>Goal: Generate a simple image based on a straightforward text description.</span>
          </li>
          <li class="flex items-start">
            <span class="inline-block w-4 shrink-0 mr-2">•</span>
            <span>User enters a descriptive text prompt, e.g., "A sunset over the ocean with palm trees."</span>
          </li>
          <li class="flex items-start">
            <span class="inline-block w-4 shrink-0 mr-2">•</span>
            <span>User leaves the default values for other parameters like steps, CFGScale, and dimensions.</span>
          </li>
          <li class="flex items-start">
            <span class="inline-block w-4 shrink-0 mr-2">•</span>
            <span>User selects the default model, e.g., epiCRealism.</span>
          </li>
          <li class="flex items-start">
            <span class="inline-block w-4 shrink-0 mr-2">•</span>
            <span>User clicks the "Generate Image" button.</span>
          </li>
          <li class="flex items-start">
            <span class="inline-block w-4 shrink-0 mr-2">•</span>
            <span>The generated image appears with the seed number displayed below it.</span>
          </li>
        </ul>
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

    const seed = ref<number | null>(null); // Seed used in generation (random by default)
    const seedInput = ref<number | null>(null); // Define seedInput
    const generatedSeed = ref<number | null>(null);
    const cfgScale = ref(7); // Default value for CFG Scale
    const modalVisible = ref(false);
    const textInput = ref("A logo for a mobile business named 'Mobile World'+. The text 'Mobile World'+ is in orange and is placed on a grey background. There is an animated mobile cartoon character with orange hair and glasses in the background. The character is holding a mobile phone and is standing on a cloud.");
    const model = ref("civitai:618692@691639");
    const selectedMode = ref("quality");
    const steps = ref(20);

    const selectedModelOption = ref("civitai:618692@691639"); // Tracks dropdown selection
    const customModelId = ref(""); // Stores user-entered model ID
    const modelIdError = ref(""); // Stores validation error message

    const aspectRatio = ref("3:2");
    const width = ref(1024);
    const height = ref(704);
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
        width.value = Math.max(
          minDimension,
          Math.min(baseDimension, maxDimension)
        );
        height.value = Math.max(
          minDimension,
          Math.min(
            Math.round((baseDimension * aspectHeight) / aspectWidth),
            maxDimension
          )
        );
      } else {
        height.value = Math.max(
          minDimension,
          Math.min(baseDimension, maxDimension)
        );
        width.value = Math.max(
          minDimension,
          Math.min(
            Math.round((baseDimension * aspectWidth) / aspectHeight),
            maxDimension
          )
        );
      }

      // Ensure dimensions are multiples of 64
      width.value = Math.round(width.value / 64) * 64;
      height.value = Math.round(height.value / 64) * 64;

      // Ensure dimensions are within the valid range
      width.value = Math.max(minDimension, Math.min(width.value, maxDimension));
      height.value = Math.max(
        minDimension,
        Math.min(height.value, maxDimension)
      );
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
        statusMessage.value =
          "Please wait for the current request to complete.";
        return; // Prevent multiple submissions
      }

      if (!ws || ws.readyState !== WebSocket.OPEN) {
        statusMessage.value = "WebSocket connection is not ready. Please wait.";
        return;
      }

      loading.value = true; // Set loading to true when starting request
      imageUrl.value = null;

      // If user has not provided a seed, generate a random one
      seed.value =
        seedInput.value || Math.floor(Math.random() * 9223372036854776000) + 1;

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
        seed: seed.value, // Use the generated or user-provided seed
        CFGScale: cfgScale.value, // Include the CFG Scale value
        numberResults: 1,
      };

      // Include reference image if used
      if (useReferenceImage.value && imageUUID.value) {
        imageRequest.seedImage = imageUUID.value;
        imageRequest.strength = 0.8;
      }

      ws.send(JSON.stringify([imageRequest]));

      statusMessage.value = `Sending image generation request:
    - Model: ${model.value}
    - Width: ${width.value}px
    - Height: ${height.value}px
    - Steps: ${steps.value}
    - Seed: ${seed.value !== null ? seed.value : "Random"}`;

      startLoadingAnimation();

      timeoutId = window.setTimeout(() => {
        statusMessage.value += "\nRequest timed out. Please try again.";
        resetLoadingState();
      }, 60000); // 30 seconds timeout
    };

    const handleImageResponse = (response: WebSocketResponse) => {
      // Check if response or response data is valid
      if (
        !response ||
        !response.data ||
        !Array.isArray(response.data) ||
        response.data.length === 0
      ) {
        console.error(
          "Received an invalid response or empty data array",
          response
        );
        return;
      }

      // Access the first element safely
      const responseData = response.data[0];

      // Handle image upload response
      if (responseData.taskType === "imageUpload") {
        if (responseData.imageUUID) {
          imageUUID.value = responseData.imageUUID; // Save the image UUID from the response
          statusMessage.value = "Image uploaded successfully!";
        } else {
          statusMessage.value = "Image upload failed.";
        }
      }
      // Handle image inference response (image generation)
      else if (responseData.taskType === "imageInference") {
        const generatedImageUrl = responseData.imageURL; // Get the generated image URL from the response

        if (generatedImageUrl) {
          // Set the generated image URL to display
          imageUrl.value = generatedImageUrl;

          // Check if the seed is available and set it; if not, use the fallback
          if (responseData.seed !== undefined && responseData.seed !== null) {
            generatedSeed.value = responseData.seed;
            console.log("Seed received and set:", generatedSeed.value); // Debugging
          } else {
            console.warn("Seed is missing from the response. Using fallback.");
            generatedSeed.value = seed.value; // Fallback to the initially generated or provided seed
          }

          // Add the new image to the oldImages array to keep history
          oldImages.value.push(generatedImageUrl);

          // Ensure only the latest 4 images are kept
          if (oldImages.value.length > 4) {
            oldImages.value.shift(); // Remove the oldest image from the array
          }

          // Update status message to inform the user of success
          statusMessage.value = "Image generated successfully!";
          resetLoadingState(); // Reset loading state and clear any ongoing animations or timeouts
        } else {
          // If the image URL is not in the response, show an error
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
          updateStatusMessage(
            `Authenticated successfully with model: ${model.value}`
          );
        });
      }, 500);
    };

    watch([selectedMode, aspectRatio], calculateDimensions, {
      immediate: true,
    });

    watch(model, () => {
      console.log(`Model changed to: ${model.value}`);
      reinitializeWebSocket();
      updateStatusMessage(
        `Authenticated successfully with model: ${model.value}`
      );
    });

    watch([selectedModelOption, customModelId], ([newOption, newCustomId]) => {
  if (newOption === "other") {
    // Validate the custom model ID format
    const modelIdPattern = /^civitai:\d+@\d+$/;
    if (modelIdPattern.test(newCustomId)) {
      model.value = newCustomId;
      modelIdError.value = "";
    } else {
      modelIdError.value = "Invalid model ID format. Expected format: civitai:123456@789012";
    }
  } else {
    model.value = newOption;
    customModelId.value = "";
    modelIdError.value = "";
  }
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
    watch([selectedMode, aspectRatio], calculateDimensions, {
      immediate: true,
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
      seedInput,
      selectedModelOption,
      customModelId,
      modelIdError,
    };
  },
});
</script>
