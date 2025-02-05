import {
  defineNuxtModule,
  createResolver,
  addPlugin,
  addComponent,
} from "@nuxt/kit";
import type { CommandMenuOptions } from "./types";

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<CommandMenuOptions>({
  meta: {
    name: "nuxt-command",
    configKey: "command",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    placeholder: "Search commands...",
    theme: "system",
    shortcut: ["meta", "k"],
    fuzzySearch: true,
    showShortcuts: true,
    closeOnSelect: true,
    minimal: false,
    transparency: 1,
    style: {
      maxWidth: "600px",
      minWidth: "300px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      darkBackgroundColor: "rgba(23, 23, 23, 0.9)",
      overlayColor: "rgba(0, 0, 0, 0.2)",
      darkOverlayColor: "rgba(0, 0, 0, 0.4)",
      blur: "12px",
    },
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // Add components
    addComponent({
      name: "CommandMenu",
      filePath: resolver.resolve("./runtime/components/CommandMenu.vue"),
    });
    addComponent({
      name: "CommandMenuItem",
      filePath: resolver.resolve("./runtime/components/CommandMenuItem.vue"),
    });

    // Add plugin (client-side only)
    addPlugin({
      src: resolver.resolve("./runtime/plugins/command.client"),
      mode: "client",
    });

    // Inject options into public runtime config
    nuxt.options.runtimeConfig.public.commandMenu = options;
  },
});

// Type support
declare module "@nuxt/schema" {
  interface PublicRuntimeConfig {
    commandMenu: CommandMenuOptions;
  }
}
