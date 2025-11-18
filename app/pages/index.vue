<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
const { t } = useI18n()
const { ui } = useAppConfig()

const { projectsList } = storeToRefs(useConfigStore())
const { setSelectedProject } = useConfigStore()
</script>

<template>
  <UPageGrid id="home" class="gap-2 lg:gap-4 md:grid-cols-3 xl:grid-cols-4 items-start">
    <div v-for="project in projectsList" :key="project.id">
      <UPageCard
        v-bind="ui.presets.pageCard.dashboard"
        :to="project.to"
        :title="t('home.card.title')"
        :description="project.label"
        :icon="project.icon"
        @click="() => setSelectedProject(project)"
      />
    </div>
  </UPageGrid>
</template>
