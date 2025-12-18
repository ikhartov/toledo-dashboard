<script setup lang="ts">
const { getProjectNavigation } = useNavigationStore()

const route = useRoute()

const links = computed(() => getProjectNavigation(route.params.project))
</script>

<template>
  <main class="h-full flex flex-col">
    <UDashboardToolbar :ui="{ root: 'overflow-x-auto' }">
      <template #left>
        <UNavigationMenu orientation="horizontal" :items="links" />
      </template>
    </UDashboardToolbar>
    <NuxtPage />
  </main>
</template>
