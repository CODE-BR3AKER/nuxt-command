<template>
  <main class="container mx-auto py-12 px-4">
    <article class="prose prose-lg dark:prose-invert mx-auto">
      <ContentRenderer v-if="page" :value="page">
        <template #empty>
          <div class="text-center py-12">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              No content found
            </h2>
          </div>
        </template>
      </ContentRenderer>
    </article>
  </main>
</template>

<script setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first()
)
</script>
