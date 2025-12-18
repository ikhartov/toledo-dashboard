<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const { showErrorMessage } = useNotifications()

const { data: diskSpaceData, error: diskSpaceError } = await useFetch(`/api/${route.params.project}/disk-space`)
const { data: scenariosData, error: scenariosError } = await useFetch(`/api/${route.params.project}/scenarios`)

if (diskSpaceError.value) {
  showErrorMessage(diskSpaceError.value)
}

if (scenariosError.value) {
  showErrorMessage(diskSpaceError.value)
}
</script>

<template>
  <UiDashboardContent class="pb-24 h-full">
    <h1>Project page</h1>
    <pre>{{ { diskSpaceData } }}</pre>
    <pre>{{ { scenariosData } }}</pre>
  </UiDashboardContent>
</template>
