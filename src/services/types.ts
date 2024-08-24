// src/services/types.ts

export interface WebSocketResponse {
	data: Array<{
	  taskType: string;
	  connectionSessionUUID?: string;
	  imageURL?: string;
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
  }
  
  export interface PingMessage {
	taskType: string;
	ping: boolean;
  }