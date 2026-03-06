<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const { apiUrl } = storeToRefs(useConfigStore())
</script>

<template>
  <UiDashboardContent class="h-full">
    <iframe class="w-full h-full" :src="`${apiUrl}/report?reportId=${route.params.id}&storageType=reports`" />
  </UiDashboardContent>
</template>
