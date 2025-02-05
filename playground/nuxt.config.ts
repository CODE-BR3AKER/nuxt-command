export default defineNuxtConfig({
  modules: ["../src/module"],

  commandMenu: {
    theme: "light",
    transparency: 0.5,
    style: {
      maxWidth: "400px",
    },
  },

  devtools: { enabled: true },
  compatibilityDate: "2025-01-27",
});
