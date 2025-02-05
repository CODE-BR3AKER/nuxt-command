import { defineNuxtPlugin, useRuntimeConfig } from "#app";
import { useEventListener } from "@vueuse/core";
import { useCommandMenu } from "../composables/useCommandMenu";

export default defineNuxtPlugin((nuxtApp) => {
  const { toggle, setMinimal } = useCommandMenu();

  // Get config
  const config = useRuntimeConfig();
  const options = config.public.commandMenu;

  // Set minimal mode from config
  setMinimal(options?.minimal ?? true);

  // Setup keyboard shortcut
  const shortcut = options?.shortcut ?? ["meta", "k"];
  useEventListener("keydown", (e: KeyboardEvent) => {
    const isShortcut = shortcut.every((key) => {
      if (key === "meta") return e.metaKey;
      if (key === "ctrl") return e.ctrlKey;
      if (key === "alt") return e.altKey;
      if (key === "shift") return e.shiftKey;
      return e.key.toLowerCase() === key.toLowerCase();
    });

    if (isShortcut) {
      e.preventDefault();
      toggle();
    }
  });

  return {
    provide: {
      command: {
        toggle,
      },
    },
  };
});
