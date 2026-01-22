<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  breadcrumb: 'references'
})
</script>

<template>
  <UiDashboardContent class="pb-24 h-full">
    <UPageGrid id="project-references" class="h-full"> References page </UPageGrid>
  </UiDashboardContent>
</template>
