<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const { projectsList } = storeToRefs(useConfigStore())

const reportUrl = computed(() => {
  const apiUrl = projectsList.value.find((project) => project.id === route.params.project)?.apiUrl

  if (!apiUrl) {
    return ''
  }

  return `${apiUrl}/report?test=${route.params.id}`
})
</script>

<template>
  <UiDashboardContent class="h-full">
    <iframe class="w-full h-full" :src="reportUrl" />
  </UiDashboardContent>
</template>
