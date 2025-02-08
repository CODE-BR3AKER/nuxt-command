<template>
    <main class="container mx-auto p-8">
      <div class="max-w-6xl mx-auto">
        <div class="mb-12 text-center">
          <h2 class="text-4xl font-bold mb-4">Latest Posts</h2>
          <p class="text-gray-600 dark:text-gray-400">
            Press <kbd class="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded">⌘K</kbd> to search all articles
          </p>
        </div>
        <!-- Responsive Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="post in posts"
            :key="post.path"
            class="border dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800/50"
          >
            <NuxtLink :to="post.path" class="block space-y-4">
              <h3 class="text-xl font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                {{ post.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                {{ post.description }}
              </p>
              <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span class="flex items-center gap-2">
                  <Calendar class="w-4 h-4" />
                  {{ formatDate(post.meta.createdAt) }}
                </span>
                <span class="flex items-center gap-2">
                  <Clock class="w-4 h-4" />
                  {{ post.meta.readingTime }} min read
                </span>
              </div>
            </NuxtLink>
          </article>
        </div>
      </div>
    </main>
</template>

<script setup>
import { Calendar, Clock } from 'lucide-vue-next'

const colorMode = useColorMode()
const { data: posts } = await useAsyncData('posts', () => queryCollection('content').all())

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style>
/* Optional: Add smooth transition for color mode changes */
body {
  @apply antialiased transition-colors duration-200;
}
</style>
