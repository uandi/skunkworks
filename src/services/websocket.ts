// script.ts
import { generateUUID } from '../services/utils';  // Updated path to reflect the new location


// Define interfaces for WebSocket messages
interface AuthMessage {
    taskType: string;
    apiKey: string;
}

interface ImageRequest {
    taskType: string;
    taskUUID: string;
    outputType: string;
    outputFormat: string;
    positivePrompt: string;
    height: number;
    width: number;
    model: string;
    steps: number;
    CFGScale: number;
    numberResults: number;
}

interface WebSocketResponse {
    data: Array<{
        taskType: string;
        connectionSessionUUID?: string;
        imageURL?: string;
    }>;
}

interface PingMessage {
    taskType: string;
    ping: boolean;
}

// Declare the WebSocket variable
const ws: WebSocket = new WebSocket('wss://ws-api.runware.ai/v1');

// Reference DOM elements
const loadingIndicator = document.getElementById('loading-indicator') as HTMLDivElement;
const imageOutput = document.getElementById('image-output') as HTMLDivElement;
const statusMessages = document.getElementById('status-messages') as HTMLDivElement;
const imageActions = document.getElementById('image-actions') as HTMLDivElement;
const lightbox = document.getElementById('lightbox') as HTMLDivElement;
const lightboxImg = document.getElementById('lightbox-img') as HTMLImageElement;
const closeLightbox = document.getElementById('close-lightbox') as HTMLButtonElement;

// Function to update status messages in the frontend
function updateStatusMessage(message: string): void {
    if (statusMessages) {
        statusMessages.innerHTML += `<p>${message}</p>`;
    }
}

ws.onopen = function (): void {
    const message = 'WebSocket connection opened.';
    console.log(message);
    updateStatusMessage(message);

    // Send the authentication request
    const authMessage: AuthMessage[] = [
        {
            taskType: "authentication",
            apiKey: "Qw9LhZpi2wuHyRk5LDh6ZOnHwDYQ8O3D"  // Replace with your actual API key
        }
    ];
    ws.send(JSON.stringify(authMessage));
};

ws.onmessage = function (event: MessageEvent): void {
    const response: WebSocketResponse = JSON.parse(event.data);
    console.log('Received response:', response);

    // Handle authentication response
    if (response.data && response.data[0].taskType === "authentication") {
        const message = `Authenticated successfully. Connection session UUID: ${response.data[0].connectionSessionUUID}`;
        console.log(message);
        updateStatusMessage(message);

        // When authenticated, set up the form submission handler
        const form = document.getElementById('text-form') as HTMLFormElement;
        form.onsubmit = function (event: Event): void {
            event.preventDefault();
            const textInput = (document.getElementById('text-input') as HTMLInputElement).value.trim();
            const model = (document.getElementById('model-select') as HTMLSelectElement).value;
            const steps = parseInt((document.getElementById('steps-input') as HTMLInputElement).value);
            const width = parseInt((document.getElementById('dimension-width') as HTMLInputElement).value);
            const height = parseInt((document.getElementById('dimension-height') as HTMLInputElement).value);

            // Validate input
            if (textInput === '') {
                updateStatusMessage('Error: The input cannot be empty.');
                return;
            }

            // Show loading indicator
            loadingIndicator.classList.remove('hidden');
            imageOutput.innerHTML = ''; // Clear any previous image
            imageActions.classList.add('hidden'); // Hide download/share buttons

            const imageRequest: ImageRequest[] = [
                {
                    taskType: "imageInference",
                    taskUUID: generateUUID(),  // Using the imported function
                    outputType: "URL",
                    outputFormat: "JPG",
                    positivePrompt: textInput,
                    height: height,
                    width: width,
                    model: model,
                    steps: steps,
                    CFGScale: 8.0,
                    numberResults: 1
                }
            ];

            const requestMessage = 'Sending image generation request...';
            console.log(requestMessage);
            updateStatusMessage(requestMessage);

            ws.send(JSON.stringify(imageRequest));
        };
    }

    // Handle image generation response
    if (response.data && response.data[0].taskType === "imageInference") {
        const imageUrl = response.data[0].imageURL;
        if (imageUrl) {
            const message = 'Image generated successfully!';
            console.log(message);
            updateStatusMessage(message);

            // Hide loading indicator and display the image
            loadingIndicator.classList.add('hidden');
            imageOutput.innerHTML = `<img id="generated-img" class="rounded cursor-pointer" src="${imageUrl}" alt="Generated Image">`;

            // Display download/share buttons
            imageActions.classList.remove('hidden');

            // Add event listener to the generated image to open lightbox
            const generatedImg = document.getElementById('generated-img') as HTMLImageElement;
            generatedImg.onclick = function (): void {
                lightboxImg.src = imageUrl;
                lightbox.classList.remove('hidden');
            };

            // Download button functionality
            const downloadBtn = document.getElementById('download-btn') as HTMLButtonElement;
            downloadBtn.onclick = function (): void {
                const a = document.createElement('a');
                a.href = imageUrl;
                a.download = 'generated_image.jpg';
                a.click();
            };

            // Share button functionality
            const shareBtn = document.getElementById('share-btn') as HTMLButtonElement;
            shareBtn.onclick = function (): void {
                if (navigator.share) {
                    navigator.share({
                        title: 'Generated Image',
                        url: imageUrl
                    }).then(() => {
                        console.log('Thanks for sharing!');
                    }).catch(console.error);
                } else {
                    alert('Sharing is not supported in this browser.');
                }
            };
        } else {
            const errorMessage = "Failed to generate image. Please try again.";
            console.log(errorMessage);
            updateStatusMessage(errorMessage);
            loadingIndicator.classList.add('hidden');
        }
    }
};

ws.onclose = function (): void {
    const message = 'WebSocket connection closed.';
    console.log(message);
    updateStatusMessage(message);
    loadingIndicator.classList.add('hidden');
};

ws.onerror = function (error: Event): void {
    const errorMessage = 'WebSocket error occurred. Please try again.';
    console.error(errorMessage);
    updateStatusMessage(errorMessage);
    loadingIndicator.classList.add('hidden');
};

// Close lightbox when clicking the close button
closeLightbox.onclick = function (): void {
    lightbox.classList.add('hidden');
};

// Keep the connection alive by sending ping messages every 60 seconds
setInterval(function (): void {
    if (ws.readyState === WebSocket.OPEN) {
        const pingMessage: PingMessage[] = [
            {
                taskType: "ping",
                ping: true
            }
        ];
        ws.send(JSON.stringify(pingMessage));
        const pingMessageLog = 'Ping message sent to keep connection alive.';
        console.log(pingMessageLog);
        updateStatusMessage(pingMessageLog);
    }
}, 60000);  // 60000ms = 60 seconds