import { computed } from "vue";
import { useRuntimeConfig } from "#imports";

export const useCommandTheme = () => {
  const config = useRuntimeConfig();
  const options = config.public.commandMenu;

  // Just use the config values directly - they already have defaults from module.ts
  const themeColors = computed(() => ({
    light: options?.style?.colors?.light ?? {},
    dark: options?.style?.colors?.dark ?? {},
  }));

  const initializeThemeColors = () => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    type themeType = "light" | "dark";
    const themes: themeType[] = ["light", "dark"];

    themes.forEach((theme) => {
      const colors = themeColors.value[theme];
      if (!colors) return;

      // Set each color as a CSS variable
      Object.entries(colors).forEach(([key, value]) => {
        if (value) {
          root.style.setProperty(`--command-${theme}-${key}`, value);
        }
      });
    });
  };

  return {
    themeColors,
    initializeThemeColors,
  };
};
