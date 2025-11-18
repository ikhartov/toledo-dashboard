<script setup lang="ts">
const route = useRoute()

const { breadcrumbs } = useBreadcrumbs()
</script>

<template>
  <UDashboardNavbar id="app-navbar" as="aside">
    <template #leading>
      <UDashboardSidebarCollapse />
      <UBreadcrumb :class="{ hidden: route.name === 'index' }" :items="breadcrumbs" />
    </template>

    <template #right>
      <UColorModeSwitch />
    </template>
  </UDashboardNavbar>
</template>
