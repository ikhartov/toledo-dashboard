<script setup lang="ts">
const { t } = useI18n()
const { ui } = useAppConfig()

const { taxonomy } = storeToRefs(useNavigationStore())

const open = ref(false)
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <div class="text-primary flex gap-2 items-center">
          <UIcon :name="ui.icons.image" class="mx-auto size-8" />
          <h1 :class="['text-lg font-bold', { hidden: collapsed }]">{{ t('global.title') }}</h1>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          v-if="taxonomy"
          :collapsed="collapsed"
          :items="taxonomy"
          orientation="vertical"
          tooltip
          popover
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel id="content" class="bg-elevated/25">
      <AppNavbar />
      <slot />
    </UDashboardPanel>
  </UDashboardGroup>
</template>
