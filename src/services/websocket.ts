import { WebSocketResponse } from './types';

let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

export function initializeWebSocket(
  onMessageCallback: (response: WebSocketResponse) => void,
  onOpenCallback: () => void,
  onCloseCallback?: () => void,
  onErrorCallback?: (error: Event) => void
): WebSocket {
  const ws = new WebSocket('wss://ws-api.runware.ai/v1');

  ws.onopen = () => {
    console.log('WebSocket connection opened.');
    reconnectAttempts = 0;  // Reset reconnection attempts on successful connection

    // Check for API key
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

    // Trigger the error callback if provided
    if (onErrorCallback) {
      onErrorCallback(error);
    }
  };

  ws.onclose = (event: CloseEvent) => {
    console.log('WebSocket connection closed.', event.reason);

    // Trigger the close callback if provided
    if (onCloseCallback) {
      onCloseCallback();
    }

    // Optional: Reconnection logic
    if (reconnectAttempts < maxReconnectAttempts) {
      const reconnectDelay = Math.pow(2, reconnectAttempts) * 1000;  // Exponential backoff
      console.log(`Reconnecting in ${reconnectDelay / 1000} seconds...`);
      setTimeout(() => {
        reconnectAttempts++;
        initializeWebSocket(onMessageCallback, onOpenCallback, onCloseCallback, onErrorCallback);
      }, reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached.');
    }
  };

  return ws;
}