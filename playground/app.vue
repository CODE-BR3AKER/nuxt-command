<template>
  <div class="min-h-screen dark:bg-gray-900 dark:text-white">
    <CommandMenu :items="menuItems" :theme="colorMode.value"/>

    <header class="border-b dark:border-gray-800 p-4">
      <div class="container mx-auto flex justify-between items-center">
        <NuxtLink to="/" class="text-xl font-bold">Nuxt Command Blog</NuxtLink>
        <div class="flex items-center gap-4">
          <button @click="toggleColorMode" class="p-2">
            <span v-if="colorMode.value === 'dark'">🌙</span>
            <span v-else>☀️</span>
          </button>
          <button @click="$command.toggle" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md">
            ⌘K
          </button>
        </div>
      </div>
    </header>

    <NuxtPage />
  </div>
</template>

<script setup>
const colorMode = useColorMode()
const { $command } = useNuxtApp()

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const { data: posts } = await useAsyncData('posts', () =>
  queryCollection('blog').all()
)

const menuItems = computed(() => {
  if (!posts.value) return []

  return [
    {
      label: 'Blog Posts',
      items: posts.value.map(post => ({
        id: post.path,
        label: post.title,
        description: post.description || 'No description',
        icon: 'FileText',
        handler: () => {
          navigateTo(post.path)
          $command.toggle()
        }
      }))
    },
    {
      label: 'Theme',
      items: [
        {
          id: 'light',
          label: 'Light',
          icon: 'Sun',
          active: colorMode.value === 'light',
          handler: () => {
            colorMode.preference = 'light'
          }
        },
        {
          id: 'dark',
          label: 'Dark',
          icon: 'Moon',
          active: colorMode.value === 'dark',
          handler: () => {
            colorMode.preference = 'dark'
          }
        }
      ]
    }
  ]
})
</script>

<style>
body {
  @apply antialiased;
}
</style>
