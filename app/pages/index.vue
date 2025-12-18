<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
const { t } = useI18n()
const { ui } = useAppConfig()

const { projectsList } = storeToRefs(useConfigStore())
</script>

<template>
  <UiDashboardContent class="pb-24 h-full">
    <UPageGrid id="home" class="gap-2 lg:gap-4 md:grid-cols-3 xl:grid-cols-4 items-start">
      <div v-for="project in projectsList" :key="project.id">
        <UPageCard
          v-bind="ui.presets.pageCard.dashboard"
          :to="`/${project.id}`"
          :title="t('home.card.title')"
          :description="project.label"
          :icon="project.icon"
        />
      </div>
    </UPageGrid>
  </UiDashboardContent>
</template>
