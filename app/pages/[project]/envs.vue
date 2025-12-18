<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  breadcrumb: 'envs'
})

const route = useRoute()
const { showErrorMessage } = useNotifications()

const { data, error } = await useFetch(`/api/${route.params.project}/environments`)

if (error.value) {
  showErrorMessage(error.value)
}
</script>

<template>
  <UiDashboardContent class="pb-24 h-full">
    <h1>Envs page</h1>
    <pre>{{ data }}</pre>
  </UiDashboardContent>
</template>
