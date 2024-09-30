<template>
	<!-- Preloader -->
	<div id="preloader" class="preloader-overlay">
	  <div class="preloader-content">
		<img src="/Skunk_works_Logo.svg" alt="Skunkworks Logo" class="preloader-logo">
		<h1 class="preloader-headline">SkunkAI ADE</h1>
		<div class="preloader-spinner"></div>
	  </div>
	</div>
  </template>
  
  <script>
  export default {
	name: "Preloader",
	mounted() {
	  // Show the preloader for 3 seconds, then hide it
	  setTimeout(() => {
		const preloader = document.getElementById("preloader");
		if (preloader) {
		  preloader.style.opacity = "0"; // Fade out
		  preloader.style.visibility = "hidden"; // Hide after fade
		  preloader.style.transition = "opacity 0.5s ease"; // Smooth fade
		}
	  }, 2000); // 3 seconds (3000 milliseconds)
	},
  };
  </script>
  