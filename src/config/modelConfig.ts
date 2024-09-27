// src/config/modelConfig.ts

export interface ModelConfiguration {
	name: string;
	recommendedSettings: {
	  steps: number;
	  cfgScale: number;
	  sizes: {
		normal: { width: number; height: number };
		max: { width: number; height: number };
	  };
	};
  }
  
  const modelConfigurations: Record<string, ModelConfiguration> = {
	"civitai:158441@358398": {
	  name: "General Purpose",
	  recommendedSettings: {
		steps: 30,
		cfgScale: 5,
		sizes: {
		  normal: { width: 512, height: 512 },
		  max: { width: 1024, height: 1024 },
		},
	  },
	},
	"civitai:30240@102996": {
	  name: "Cartoon",
	  recommendedSettings: {
		steps: 25,
		cfgScale: 7,
		sizes: {
		  normal: { width: 640, height: 640 },
		  max: { width: 1280, height: 960 },
		},
	  },
	},
  };
  
  export default modelConfigurations;