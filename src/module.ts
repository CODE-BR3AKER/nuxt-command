import {
  defineNuxtModule,
  createResolver,
  addPlugin,
  addComponent,
} from "@nuxt/kit";
import type { CommandMenuOptions } from "./types";
import type { IFuseOptions } from "fuse.js";
import type { CommandMenuItem } from "./types";

// Module options TypeScript interface definition
export interface ModuleOptions {}

const defaultFuseOptions: IFuseOptions<CommandMenuItem> = {
  keys: ["label", "description", "fullContent"],
  threshold: 0.2,
  distance: 100,
  minMatchCharLength: 2,
};

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
    shortcut: ["meta", "k"],
    fuzzySearch: true,
    showShortcuts: true,
    closeOnSelect: true,
    minimal: false,
    style: {
      maxWidth: "600px",
      minWidth: "300px",
      colors: {
        light: {
          background: "#ffffff",
          text: "#111827",
          border: "#0000001a",
          overlay: "#00000033",
          secondary: "#6b7280",
          hover: "#F8F9FB",
          active: "#F2F5F9",
        },
        dark: {
          background: "#111827",
          text: "#ffffff",
          border: "#ffffff1a",
          overlay: "#00000066",
          secondary: "#9ca3af",
          hover: "#182033",
          active: "#1F283B",
        },
      },
      blur: "12px",
      opacity: 1,
    },
    fuseOptions: defaultFuseOptions,
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
