import { WebSocketResponse } from "./types";

let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
let isReconnecting = false;
const maxReconnectDelay = 32000; // Cap reconnection delay at 32 seconds

export function initializeWebSocket(
  onMessageCallback: (response: WebSocketResponse) => void,
  onOpenCallback: () => void,
  onCloseCallback?: () => void,
  onErrorCallback?: (error: Event) => void
): WebSocket {
  const ws = new WebSocket("wss://ws-api.runware.ai/v1");

  ws.onopen = () => {
    console.log("WebSocket connection opened.");
    reconnectAttempts = 0; // Reset reconnection attempts on successful connection

    const apiKey = process.env.VUE_APP_API_KEY || "";
    if (!apiKey) {
      console.error(
        "API Key is missing! Please set VUE_APP_API_KEY in your environment."
      );
      ws.close(); // Close WebSocket if no API key
      return;
    }

    const authMessage = [
      {
        taskType: "authentication",
        apiKey: apiKey,
      },
    ];

    ws.send(JSON.stringify(authMessage));
    console.log("Authentication message sent:", authMessage);

    if (onOpenCallback) {
      onOpenCallback();
    }
  };

  ws.onmessage = (event: MessageEvent) => {
    try {
      console.log("WebSocket message received:", event.data); // Log the raw message for debugging

      const response: WebSocketResponse = JSON.parse(event.data);
      console.log("Parsed WebSocket response:", response); // Log the parsed response

      // Handle authentication errors separately
      if (response.data && response.data[0].errorMessage) {
        console.error("Authentication failed:", response.data[0].errorMessage);
        ws.close(); // Optionally close the WebSocket connection
        return;
      }

      // Ensure different task types are handled properly
      const taskType = response.data[0]?.taskType;
      if (taskType === "imageInference") {
        console.log("Handling image inference task...");
      } else if (taskType === "imageUpload") {
        console.log("Handling image upload task...");
      }

      // Pass the parsed response to the provided callback
      if (onMessageCallback) {
        onMessageCallback(response);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  ws.onerror = (error: Event) => {
    console.error("WebSocket error occurred:", error);

    // Provide more detailed information on the error for debugging purposes
    if (error instanceof ErrorEvent) {
      console.error("Error event message:", error.message);
    } else {
      console.error("Non-error event:", error);
    }

    if (onErrorCallback) {
      onErrorCallback(error);
    }
  };

  ws.onclose = (event: CloseEvent) => {
    console.log("WebSocket connection closed.", event.reason);

    if (onCloseCallback) {
      onCloseCallback();
    }

    if (!isReconnecting && reconnectAttempts < maxReconnectAttempts) {
      isReconnecting = true;
      const reconnectDelay = Math.min(
        Math.pow(2, reconnectAttempts) * 1000,
        maxReconnectDelay
      );
      console.log(`Reconnecting in ${reconnectDelay / 1000} seconds...`);
      setTimeout(() => {
        reconnectAttempts++;
        initializeWebSocket(
          onMessageCallback,
          onOpenCallback,
          onCloseCallback,
          onErrorCallback
        );
        isReconnecting = false; // Reset flag
      }, reconnectDelay);
    } else if (reconnectAttempts >= maxReconnectAttempts) {
      console.error("Max reconnection attempts reached.");
    }
  };

  return ws;
}
