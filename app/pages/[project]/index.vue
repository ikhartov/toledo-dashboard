<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { DiskSpace, FormatedBytes, Scenario } from '~~/shared/types'
import type { TableColumn, ProgressProps } from '@nuxt/ui'

definePageMeta({
  middleware: 'auth'
})

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const ULink = resolveComponent('ULink')
const UCheckbox = resolveComponent('UCheckbox')

const { t } = useI18n()
const { ui } = useAppConfig()
const route = useRoute()
const { showErrorMessage, showSuccessMessage } = useNotifications()
const { mockUrl } = storeToRefs(useConfigStore())

const { data: diskSpaceData, error: diskSpaceError } = await useFetch<DiskSpace<FormatedBytes> | null>(
  `/api/${route.params.project}/disk-space`
)
const { data: scenariosData, error: scenariosError } = await useFetch<Scenario[]>(
  `/api/${route.params.project}/scenarios`,
  { default: () => [] }
)

if (diskSpaceError.value) {
  showErrorMessage(diskSpaceError.value)
}

if (scenariosError.value) {
  showErrorMessage(diskSpaceError.value)
}

const selectedRows = ref<Record<string, boolean | undefined>>({})

const table = useTemplateRef('table')
const columnFilters = ref([{ id: 'label', value: '' }])
const rowSelection = ref({})
const sorting = ref([{ id: 'label', desc: false }])

const isRowsSelected = computed(() => Object.keys(selectedRows.value).length)
const items = computed(() => {
  return scenariosData.value.map((scenario) => ({
    label: scenario.label,
    url: scenario.url
  }))
})

const columns: TableColumn<Scenario>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => {
          table.toggleAllPageRowsSelected(!!value)
          if (value) {
            scenariosData.value.forEach((item) => {
              if (item.label) {
                selectedRows.value[item.label] = !!value
              }
            })
          } else {
            if (Object.keys(selectedRows.value).length) {
              for (const key in selectedRows.value) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete selectedRows.value[key]
              }
            }
          }
        }
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => {
          row.toggleSelected(!!value)
          if (value && row.original.label) {
            selectedRows.value[row.original.label] = !!value
          } else if (row.original.label && selectedRows.value[row.original.label]) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete selectedRows.value[row.original.label]
          }
        }
      })
  },
  {
    accessorKey: 'label',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: t('controlPanel.columns.name'),
        icon: isSorted
          ? isSorted === 'asc'
            ? ui.icons.arrowNarrowUp
            : ui.icons.arrowNarrowDown
          : ui.icons.arrowUpDown,
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => {
      const url = row.original.url?.charAt(0) === '/' ? row.original.url.slice(1) : row.original.url

      return h(
        ULink,
        {
          class: 'font-semibold',
          href: `${mockUrl}/${url}`,
          external: true,
          target: '_blank'
        },
        () => row.getValue('label')
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h('div', { class: 'flex gap-8 justify-between sm:justify-end' }, [
        h(UButton, {
          label: t('actions.startTest'),
          variant: 'outline',
          color: 'secondary',
          onClick: async () => {
            try {
              await $fetch(`/api/${route.params.project}/start`, {
                method: 'post',
                body: [row.original.label]
              })
              showSuccessMessage(t('notifications.tests.start'), row.original.label)
            } catch (error) {
              showErrorMessage(error)
            }
          }
        })
      ])
    }
  }
]

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

async function handleStartTest() {
  try {
    await $fetch(`/api/${route.params.project}/start`)
    showSuccessMessage(t('notifications.tests.start'))
  } catch (error) {
    showErrorMessage(error)
  }
}
async function handleCreateReferences() {
  try {
    await $fetch(`/api/${route.params.project}/create-references`)
    showSuccessMessage(t('notifications.references.start'))
  } catch (error) {
    showErrorMessage(error)
  }
}
async function handleStartSelectedTests() {
  try {
    await $fetch(`/api/${route.params.project}/start`, {
      method: 'post',
      body: Object.entries(selectedRows.value)
        .filter(([_, value]) => value)
        .map(([key]) => key)
    })
    showSuccessMessage(t('notifications.tests.startSelected'))
  } catch (error) {
    showErrorMessage(error)
  }
}
</script>

<template>
  <UiDashboardContent class="pb-24 h-full gap-2 lg:gap-4">
    <UPageGrid
      id="control-panel"
      class="gap-2 lg:gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 items-start"
    >
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
      <UPageCard
        v-bind="ui.presets.pageCard.dashboard"
        :title="t('controlPanel.reference.title')"
        :icon="ui.icons.image"
      >
        <div class="ml-14 flex flex-wrap gap-4 gap-y-2">
          <UButton :label="t('actions.createReference')" @click="handleCreateReferences" />
          <UButton :label="t('controlPanel.reference.page')" :to="`/${route.params.project}/references`" />
        </div>
      </UPageCard>
      <UPageCard
        v-bind="ui.presets.pageCard.dashboard"
        :title="t('controlPanel.test.title')"
        :icon="ui.icons.imagePlus"
      >
        <div class="ml-14 flex flex-wrap gap-4 gap-y-2">
          <UButton :label="t('actions.startTest')" @click="handleStartTest" />
        </div>
      </UPageCard>
    </UPageGrid>
    <UPageGrid id="control-panel-tests" class="h-full">
      <UPageCard
        class="col-span-3 h-full overflow-auto"
        :ui="{ header: 'w-full mb-0', container: 'lg:flex', wrapper: 'flex-0' }"
      >
        <template #header>
          <div class="w-full flex flex-wrap gap-2 justify-between">
            <div class="max-w-sm flex gap-2 items-center">
              <UBadge
                color="neutral"
                variant="subtle"
                :label="t('controlPanel.scenarios.total', { total: scenariosData.length })"
              />
              <USeparator orientation="vertical" class="h-full" />
              <UInput
                :model-value="table?.tableApi?.getColumn('label')?.getFilterValue() as string"
                class="max-w-sm"
                :placeholder="t('global.filter')"
                @update:model-value="table?.tableApi?.getColumn('label')?.setFilterValue($event)"
              />
            </div>

            <div v-if="isRowsSelected" class="flex gap-2">
              <UButton color="secondary" variant="outline" @click="handleStartSelectedTests">
                {{ t('actions.startSelectedTest') }}
              </UButton>
            </div>
          </div>
        </template>
        <UTable
          ref="table"
          v-model:column-filters="columnFilters"
          v-model:row-selection="rowSelection"
          v-model:sorting="sorting"
          class="border-t border-accented"
          :columns="columns"
          :data="items"
          :ui="{
            tr: 'grid grid-cols-[33px_repeat(2,minmax(0,1fr))] sm:table-row',
            td: 'nth-2:whitespace-pre-wrap nth-2:col-span-2 nth-3:col-start-2'
          }"
          sticky
        />
      </UPageCard>
    </UPageGrid>
  </UiDashboardContent>
</template>
