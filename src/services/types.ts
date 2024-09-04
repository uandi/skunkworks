// src/services/types.ts

export interface WebSocketResponse {
    data: Array<{
        taskType: string;
        connectionSessionUUID?: string;
        imageURL?: string;
        taskUUID?: string;
        imageUUID?: string;
        errorMessage?: string; 
    }>;
}

export interface AuthMessage {
    taskType: string;
    apiKey: string;
}

export interface ImageRequest {
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
    seedImage?: string;  
    strength?: number;   
}

export interface PingMessage {
    taskType: string;
    ping: boolean;
}