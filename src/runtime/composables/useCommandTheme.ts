import { computed } from 'vue'
import { useRuntimeConfig } from '#imports'

export const useCommandTheme = () => {
  const config = useRuntimeConfig()
  const options = config.public.commandMenu

  const defaultColors = {
    light: {
      background: '#ffffff',
      text: '#111827',
      border: '#0000001a',
      overlay: '#00000033',
      secondary: '#6b7280',
      hover: '#0000000a',
      active: '#10B981'
    },
    dark: {
      background: '#111827',
      text: '#ffffff',
      border: '#ffffff1a',
      overlay: '#00000066',
      secondary: '#9ca3af',
      hover: '#ffffff0a',
      active: '#10B981' // Added active color
    }
  }

  // Merge user config with defaults
  const themeColors = computed(() => ({
    light: { ...defaultColors.light, ...options?.style?.colors?.light },
    dark: { ...defaultColors.dark, ...options?.style?.colors?.dark }
  }))

  // Initialize CSS variables once
  const initializeThemeColors = () => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    type themeType = 'light' | 'dark'
    const themes: themeType[] = ['light', 'dark']

    themes.forEach((theme) => {
      Object.entries(themeColors.value[theme]).forEach(([key, value]) => {
        root.style.setProperty(`--command-${theme}-${key}`, value as string)
      })
    })
  }

  return {
    themeColors,
    initializeThemeColors
  }
}
