<template>
  <div class="min-h-screen dark:bg-gray-900 dark:text-white">
    <!-- Header -->
    <header class="border-b dark:border-gray-800 py-4 max-w-6xl mx-auto">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <nuxt-link to="/" class="text-2xl font-bold">Playground</nuxt-link>
        <div class="flex items-center gap-4">
          <button
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            @click="toggleColorMode"
          >
            <Sun v-if="colorMode.value === 'dark'" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
          </button>
          <button
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            @click="$command.toggle"
          >
            <Search class="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
    <CommandMenu :items="menuItems" :theme="colorMode.value" />
    <NuxtPage />
  </div>
</template>

<script setup>
import { Sun, Moon, Search } from "lucide-vue-next";
const colorMode = useColorMode();
const { $command } = useNuxtApp();

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const { data: posts } = await useAsyncData("posts", () =>
  queryCollection("blog").all()
);

const { data: searchSections } = await useAsyncData("search", () =>
  queryCollectionSearchSections("content")
);

const menuItems = computed(() => {
  if (!posts.value) return [];

  return [
    {
      label: "Blog Posts",
      items: posts.value.map((post) => {
        // Find all sections for this post
        const postSections =
          searchSections.value?.filter((section) =>
            section.id.startsWith(post.path)
          ) || [];

        // Combine all section content for full-text search
        const fullContent = postSections.map((s) => s.content).join(" ");

        return {
          id: post.path,
          label: post.title,
          description: post.description || "No description",
          fullContent, // Add full content for Fuse.js to search
          icon: "FileText",
          handler: () => {
            navigateTo(post.path);
            $command.toggle();
          },
        };
      }),
    },
    {
      label: "Theme",
      items: [
        {
          id: "light",
          label: "Light",
          icon: "Sun",
          active: colorMode.value === "light",
          handler: () => {
            colorMode.preference = "light";
          },
        },
        {
          id: "dark",
          label: "Dark",
          icon: "Moon",
          active: colorMode.value === "dark",
          handler: () => {
            colorMode.preference = "dark";
          },
        },
      ],
    },
  ];
});
</script>

<style>
body {
  @apply antialiased;
}
</style>
