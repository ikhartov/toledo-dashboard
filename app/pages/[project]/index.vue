<script setup lang="ts">
import { resolveComponent } from 'vue'
import type { DiskSpace, FormatedBytes } from '~~/shared/types'
import type { ProgressProps } from '@nuxt/ui'

definePageMeta({
  middleware: 'auth'
})

const UBadge = resolveComponent('UBadge')

const { t } = useI18n()
const { ui } = useAppConfig()
const route = useRoute()
const { showErrorMessage } = useNotifications()

const { data: diskSpaceData, error: diskSpaceError } = await useFetch<DiskSpace<FormatedBytes> | null>(
  `/api/${route.params.project}/disk-space`
)

if (diskSpaceError.value) {
  showErrorMessage(diskSpaceError.value)
}

function getPercentOf(value: number, total: number) {
  const percent = (value / total) * 100
  const factor = Math.pow(10, 2)

  return Math.round(percent * factor) / factor
}

const storageUsedPercent = computed(() => {
  const { capacity, used } = diskSpaceData.value || {}
  if (used?.bytes && capacity?.bytes) {
    return getPercentOf(used.bytes, capacity.bytes)
  }

  return 0
})
const storageText = computed(() => {
  const { capacity, used } = diskSpaceData.value || {}
  if (used?.text && capacity?.text) {
    return t('controlPanel.diskUsage.used', {
      capacity: capacity.text,
      used: used.text
    })
  }

  return ''
})
const storageColor = computed(() => {
  let color: ProgressProps['color'] = 'info'

  if (storageUsedPercent.value >= 50 && storageUsedPercent.value <= 74) {
    color = 'warning'
  }

  if (storageUsedPercent.value >= 75) {
    color = 'error'
  }

  return color
})
</script>

<template>
  <UiDashboardContent class="pb-24 h-full gap-2 lg:gap-4">
    <UPageGrid id="control-panel" class="gap-2 lg:gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 items-start">
      <UPageCard v-bind="ui.presets.pageCard.space" :icon="ui.icons.hardDrive">
        <template #header>
          <span>{{ t('controlPanel.diskUsage.title') }}</span>
        </template>
        <template #body>
          <div class="flex flex-col gap-2">
            <UProgress :model-value="storageUsedPercent" :color="storageColor" :max="100" />
            <div class="flex gap-2 justify-between items-center text-muted text-sm text-pretty">
              <span>{{ `${storageUsedPercent}%` }}</span>
              <span>{{ storageText }}</span>
            </div>
          </div>
          <USeparator class="my-2" />
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(folder, key) in diskSpaceData?.folders"
              :key="key"
              class="flex gap-1 items-center text-xs text-pretty"
            >
              <UBadge
                variant="subtle"
                color="secondary"
                :label="t(`controlPanel.diskUsage.${key}`, { text: folder?.text })"
              />
            </div>
          </div>
        </template>
      </UPageCard>
    </UPageGrid>
  </UiDashboardContent>
</template>
