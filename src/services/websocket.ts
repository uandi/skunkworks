// src/services/websocket.ts
import { WebSocketResponse } from './types';

export function initializeWebSocket(
  onMessageCallback: (response: WebSocketResponse) => void,
  onOpenCallback: () => void
): WebSocket {
  const ws = new WebSocket('wss://ws-api.runware.ai/v1');

  ws.onopen = () => {
    console.log('WebSocket connection opened.');
    
    // Check if API key is present
    const apiKey = process.env.VUE_APP_API_KEY || '';
    if (!apiKey) {
      console.warn('API Key is missing! Please set VUE_APP_API_KEY in your environment.');
    }

    // Authentication message
    const authMessage = [{
      taskType: 'authentication',
      apiKey: apiKey,
    }];
    
    // Send the authentication message
    ws.send(JSON.stringify(authMessage));
    console.log('Authentication message sent:', authMessage);

    // Trigger the open callback if provided
    if (onOpenCallback) {
      onOpenCallback();
    }
  };

  ws.onmessage = (event: MessageEvent) => {
    try {
      // Parse the incoming message as WebSocketResponse
      const response: WebSocketResponse = JSON.parse(event.data);
      
      // Call the provided callback with the parsed response
      if (onMessageCallback) {
        onMessageCallback(response);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  ws.onerror = (error: Event) => {
    console.error('WebSocket error occurred:', error);
  };

  ws.onclose = (event: CloseEvent) => {
    console.log('WebSocket connection closed.', event.reason);
    
    // Optional: Reconnection logic can be added here
    // reconnectWebSocket(onMessageCallback, onOpenCallback);  // Uncomment if you want to add reconnection
  };

  return ws;
}