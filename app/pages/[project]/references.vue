<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  breadcrumb: 'references'
})

const route = useRoute()
const { showErrorMessage } = useNotifications()

const { data: items, error } = await useFetch<unknown[]>(`/api/${route.params.project}/reference-list`, {
  default: () => []
})

if (error.value) {
  showErrorMessage(error.value)
}
</script>

<template>
  <UiDashboardContent class="pb-24 h-full">
    <UPageGrid id="project-references" class="h-full">
      <pre>{{ { items } }}</pre>
    </UPageGrid>
  </UiDashboardContent>
</template>
