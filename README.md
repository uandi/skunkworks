# skunkworks
![Skunkworks Logo](readme_assets/Skunk_works_Logo.svg)
## Current Status

### Text-to-Image
- **Status**: **Working**  
- The `Text-to-Image` generation is functioning as expected. Users can input a text prompt, and the application generates an image based on that prompt.

### Image-to-Image (img2img)
- **Status**: **Working**  

To help you plan your roadmap towards the goal of allowing users to choose between **img2img** and **text2img**, here’s a structured approach that balances stability improvements and feature development.

### 1. **Stabilize the Current Code**
   Before adding new features, you need to ensure the current implementation is robust. Here are key areas to improve:

   #### Code Improvements
   - **WebSocket Error Handling:** **Working**  
     Ensure better error handling around WebSocket connections. For instance, handle cases where the WebSocket might close unexpectedly, and reinitialize the connection smoothly.
     
     **Action:** Implement retries and better connection state monitoring.
     
   - **Timeouts and Fail-Safes:** **Working**  
     Ensure that timeouts (currently set to 30 seconds) are consistently managed. If an image generation task takes longer than expected, you should provide better feedback to the user.
     
     **Action:** Add retries or error messages when timeouts occur.

   - **Memory Optimization:**
     Check the handling of large image files, especially when the user uploads a reference image. Ensure that the application doesn’t run into memory issues when handling multiple images.
     
     **Action:** Optimize how images are stored and handled in memory (use compression or lazy loading techniques).

   - **UI Feedback:**
     Currently, the status message and loading indicators work, but adding visual cues, like progress bars or spinners, would improve the user experience.
     
     **Action:** Add more intuitive feedback elements during image generation.

   - **Prevent Multiple Submissions:**
     If the user clicks "Generate Image" multiple times, it could trigger multiple generation requests. Prevent this by disabling the button or queuing requests.

     **Action:** Disable the submit button or show a message indicating a request is already in progress.

---

### 2. **Implement Selection Between img2img and text2img**
   Once stability is improved, you can start working on the feature that allows users to choose between the two modes.

   #### Feature Development:
   - **Design a Toggle System:**
     Create a UI component (radio buttons, toggle switch, or dropdown) where the user can select between img2img or text2img modes.
     
     **Action:** Add a new state variable (e.g., `generationMode` with values `img2img` or `text2img`) and adjust the form accordingly.

   - **Dynamic Form Adjustments:**
     When img2img is selected, show the image upload section and the relevant controls (e.g., strength slider). When text2img is selected, hide the image upload controls.
     
     **Action:** Use conditional rendering to display or hide form fields based on the selected mode.

   - **Validation and State Management:**
     Make sure that when switching between img2img and text2img, the state (uploaded image, input text, etc.) is handled gracefully without resetting unnecessarily.

     **Action:** Implement reactive form handling and data persistence between mode changes.

---

### 3. **Testing and Feedback Loop**
   After implementing the new feature, ensure that you have proper testing in place:
   
   - **User Testing:** Perform tests with real users to get feedback on the flow and ensure both modes (img2img and text2img) work as expected.
   
   - **Edge Case Testing:** Ensure that users cannot submit a form with incomplete information, such as missing prompts or missing reference images.

   - **Error and Performance Monitoring:** Set up logging or tracking mechanisms to capture any errors or performance issues in the image generation process.

---

### Roadmap Summary

1. **Stabilization (1-2 weeks)**
   - Improve WebSocket error handling
   - Add better timeouts and error messages
   - Optimize memory usage for image handling
   - Enhance UI feedback and prevent multiple submissions

2. **Feature Implementation (2-3 weeks)**
   - Create a toggle for img2img vs text2img
   - Dynamically adjust the form based on the selection
   - Ensure proper state management and validation

3. **Testing and Feedback (1 week)**
   - Perform edge case and user testing
   - Monitor for errors and performance issues


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