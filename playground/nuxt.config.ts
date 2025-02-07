export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@nuxt/content',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss'
  ],
  colorMode: {
    classSuffix: ''
  },
  content: {

  },
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    // and more...
  },

  command: {
    style: {
      maxWidth: "400px",
      backgroundColor: "rgba(255, 255, 255, 1)",
      darkBackgroundColor: "rgba(23, 23, 23, 1)",
      overlayColor: "rgba(0, 0, 0, 0.2)",
      darkOverlayColor: "rgba(0, 0, 0, 0.4)",
      opacity: 1,
    },
  },

  devtools: { enabled: true },
  compatibilityDate: "2025-01-27",
});
