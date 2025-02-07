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
      opacity: 1,
      colors: {
        light: {
          background: '#ffffff',
          text: '#111827',
          border: '#0000001a',
          overlay: '#00000033',
          secondary: '#6b7280',
          hover: '#0000000a'
        },
        dark: {
          background: '#111827',
          text: '#ffffff',
          border: '#ffffff1a',
          overlay: '#00000066',
          secondary: '#9ca3af',
          hover: '#ffffff0a'
        }
      }
    },
  },

  devtools: { enabled: true },
  compatibilityDate: "2025-01-27",
});
