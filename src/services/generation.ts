import { WebSocketResponse } from './types';
import { initializeWebSocket } from './websocket';

let retryAttempts = 0;
const maxRetryAttempts = 3;
const taskTimeout = 30000;  // 30 seconds

export function initiateImageGeneration(  
  generationRequest: any,
  onMessageCallback: (response: WebSocketResponse) => void,
  onFailureCallback: (errorMessage: string) => void,
  onSuccessCallback: () => void,
  onRetryCallback?: (attempt: number) => void
) {
  const ws = initializeWebSocket(onMessageCallback, onSuccessCallback);

  let timeoutId: number | undefined = undefined;  // Update the type to number | undefined

  const handleTimeout = () => {
    console.error('Image generation timed out.');
    onFailureCallback('Image generation took too long. Please try again.');
  
    if (retryAttempts < maxRetryAttempts) {
      retryAttempts++;
      onRetryCallback && onRetryCallback(retryAttempts);
      initiateImageGeneration(generationRequest, onMessageCallback, onFailureCallback, onSuccessCallback, onRetryCallback);
    } else {
      onFailureCallback('Image generation failed after multiple attempts.');
    }
  
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  };
  
  ws.onopen = () => {
    console.log('Sending generation request:', generationRequest); // Debug log to check request
    ws.send(JSON.stringify([generationRequest]));
    timeoutId = window.setTimeout(handleTimeout, taskTimeout);
  };
  
  ws.onmessage = (event: MessageEvent) => {
    try {
      const response: WebSocketResponse = JSON.parse(event.data);
  
      if (response.data[0]?.taskType === 'imageInference' && response.data[0]?.imageURL) {
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId);
        }
        retryAttempts = 0;
        onSuccessCallback();
        onMessageCallback(response);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  ws.onerror = (error: Event) => {
    console.error('WebSocket error occurred:', error);  // Debugging log
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  
    if (retryAttempts < maxRetryAttempts) {
      retryAttempts++;
      onRetryCallback && onRetryCallback(retryAttempts);
      initiateImageGeneration(generationRequest, onMessageCallback, onFailureCallback, onSuccessCallback, onRetryCallback);
    } else {
      onFailureCallback('Image generation failed after multiple errors.');
    }
  };

  ws.onclose = (event: CloseEvent) => {
    if (retryAttempts < maxRetryAttempts) {
      retryAttempts++;
      onRetryCallback && onRetryCallback(retryAttempts);
      initiateImageGeneration(generationRequest, onMessageCallback, onFailureCallback, onSuccessCallback, onRetryCallback);
    } else {
      onFailureCallback('Image generation failed after connection loss.');
    }

    if (timeoutId) clearTimeout(timeoutId);
  };
}