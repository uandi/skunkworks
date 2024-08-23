import { generateUUID } from '../services/utils';  // Import the UUID generator function

// Define interfaces used for WebSocket communication
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

export function initializeWebSocket(
    onMessageCallback: (response: WebSocketResponse) => void,
    onOpenCallback: () => void
): WebSocket {
    const ws = new WebSocket('wss://ws-api.runware.ai/v1');

    ws.onopen = () => {
        console.log('WebSocket connection opened.');
        const authMessage: AuthMessage[] = [
            {
                taskType: 'authentication',
                apiKey: process.env.VUE_APP_API_KEY || '',
            },
        ];
        ws.send(JSON.stringify(authMessage));
        console.log('Authentication message sent:', authMessage);
    
        if (onOpenCallback) {
            onOpenCallback();
        }
    };

    ws.onmessage = (event: MessageEvent) => {
        const response: WebSocketResponse = JSON.parse(event.data);

        if (onMessageCallback) {
            onMessageCallback(response);
        }
    };

    ws.onerror = (error: Event) => {
        console.error('WebSocket error occurred:', error);
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed.');
    };

    return ws;
}