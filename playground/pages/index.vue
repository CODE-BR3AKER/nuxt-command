<template>
  <main class="container mx-auto p-8">
    <div class="max-w-2xl mx-auto">
      <h2 class="text-4xl font-bold mb-12 text-center">Latest Posts</h2>
      <div class="space-y-8">
        <article
          v-for="post in posts"
          :key="post.path"
          class="border dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800/50"
        >
          <NuxtLink :to="post.path" class="block space-y-4">
            <h3 class="text-2xl font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {{ post.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ post.description }}
            </p>
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span class="flex items-center">
                <span class="mr-2">📅</span>
                {{ formatDate(post.meta.createdAt) }}
              </span>
            </div>
          </NuxtLink>
        </article>
      </div>
    </div>
  </main>
</template>

<script setup>
const { data: posts } = await useAsyncData('posts', () =>
  queryCollection('content').all()
)


function formatDate(date) {
  if (!date) return ''
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (e) {
    console.error('Invalid date:', date)
    return ''
  }
}
</script>
