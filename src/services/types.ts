// src/services/types.ts

// Interface for WebSocket responses
export interface WebSocketResponse {
    data: Array<{
        taskType: string;                     // Type of task being performed
        connectionSessionUUID?: string;       // Optional UUID for the session
        imageURL?: string;                    // Optional URL of the generated image
        taskUUID?: string;                    // Optional UUID for the task
        imageUUID?: string;                   // Optional UUID for the uploaded image
        errorMessage?: string;                // Optional error message
        seed?: number;                        // Optional seed used for image generation
    }>;
}

// Interface for authentication message
export interface AuthMessage {
    taskType: string;                         // Type of task (authentication in this case)
    apiKey: string;                           // API key for authentication
}

// Interface for image generation request
export interface ImageRequest {
    taskType: string;                         // Type of task (image generation)
    taskUUID: string;                         // UUID for the task
    outputType: string;                       // Output type (e.g., URL, base64)
    outputFormat: string;                     // Format of the output (e.g., JPG, PNG)
    positivePrompt: string;                   // Prompt for the image generation
    height: number;                           // Height of the generated image
    width: number;                            // Width of the generated image
    model: string;                            // Model to be used for image generation
    steps: number;                            // Number of steps for the generation process
    CFGScale: number;                         // CFG scale for guidance strength
    numberResults: number;                    // Number of results to generate
    seedImage?: string;                       // Optional reference image UUID
    strength?: number;                        // Optional strength value for the reference image
    seed?: number;                            // Optional seed value for reproducibility
}

// Interface for ping message
export interface PingMessage {
    taskType: string;                         // Type of task (ping)
    ping: boolean;                            // Ping boolean to keep the connection alive
}