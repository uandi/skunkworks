## Current Status

### Text-to-Image
- **Status**: **Working**  
- The `Text-to-Image` generation is functioning as expected. Users can input a text prompt, and the application generates an image based on that prompt.

### Image-to-Image (img2img)
- **Status**: **Not Working**  
- The `Image-to-Image` (img2img) functionality, which should allow users to upload a reference image and generate a modified image based on that reference, is not functioning correctly. Although the image upload is successful and returns an `imageUUID`, the image generation process using the reference image is not working as expected. Further debugging and adjustments are required.

# skunkworks


![Skunkworks Logo](readme_assets/Skunk_works_Logo.svg)


## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Compiles and minifies for production

```bash
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).



│
├── dist/                           # Production build output
├── node_modules/                   # Project dependencies (auto-generated)
├── public/                         # Public assets, accessible without bundling
├── readme_assets/                  # Assets used in documentation (e.g., logos)
│   └── Skunk_works_Logo.svg        # Project logo
│
├── src/                            # Main source code directory
│   ├── assets/                     # Static assets (fonts, styles, etc.)
│   │   ├── fonts/                  # Font files
│   │   └── styles.css              # Global styles
│   ├── components/                 # Vue.js components
│   │   ├── ImageGenerator.vue       # Component for image generation
│   │   └── ImageModal.vue           # Modal component for displaying images
│   ├── services/                   # Utility services and helper functions
│   │   ├── types.ts                # TypeScript type definitions
│   │   ├── utils.ts                # Utility functions
│   │   └── websocket.ts            # WebSocket management
│   ├── App.vue                     # Root Vue.js component
│   ├── main.ts                     # Entry point for the Vue.js app
│   └── shims-vue.d.ts              # TypeScript definitions for .vue files
│
├── .browserslistrc                 # Browser compatibility configuration
├── .env                            # Environment variables
├── .gitignore                      # Git ignored files
├── babel.config.js                 # Babel configuration
├── package-lock.json               # Auto-generated, locks dependency versions
├── package.json                    # Project dependencies and scripts
├── postcss.config.js               # PostCSS configuration (used with Tailwind CSS)
├── README.md                       # Project documentation
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript compiler options
└── vue.config.js                   # Vue CLI configuration