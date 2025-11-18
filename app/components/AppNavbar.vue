<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const { t } = useI18n()
const { selectedProject } = storeToRefs(useConfigStore())
const { setSelectedProject } = useConfigStore()
const route = useRoute()
const localePath = useLocalePath()

const breadcrumbs = computed<BreadcrumbItem[]>(() => [
  {
    label: t('breadcrumbs.home'),
    to: localePath('/'),
    onClick: () => {
      setSelectedProject()
    }
  },
  {
    label: selectedProject.value?.label,
    to: selectedProject.value?.to
  }
])
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
