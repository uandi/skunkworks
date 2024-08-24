// src/services/websocket.ts
import { WebSocketResponse } from './types';

export function initializeWebSocket(
  onMessageCallback: (response: WebSocketResponse) => void,
  onOpenCallback: () => void
): WebSocket {
  const ws = new WebSocket('wss://ws-api.runware.ai/v1');

  ws.onopen = () => {
    console.log('WebSocket connection opened.');
    const authMessage = [{
      taskType: 'authentication',
      apiKey: process.env.VUE_APP_API_KEY || '',
    }];
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