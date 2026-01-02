<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { DiskSpace, Scenario } from '~~/shared/types'
import type { TableColumn } from '@nuxt/ui'

interface ScenariosTableRow {
  label: string
}

definePageMeta({
  middleware: 'auth'
})

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')

const { t } = useI18n()
const { ui } = useAppConfig()
const route = useRoute()
const { showErrorMessage } = useNotifications()

const { data: diskSpaceData, error: diskSpaceError } = await useFetch<DiskSpace | null>(
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

const bulkDelete = ref<Record<string, boolean | undefined>>({})

const table = useTemplateRef('table')
const columnFilters = ref([{ id: 'label', value: '' }])
const rowSelection = ref({})
const sorting = ref([{ id: 'label', desc: false }])

const isRowsSelected = computed(() => Object.keys(bulkDelete.value).length)

const items = computed(() => {
  return scenariosData.value.map((scenario) => ({
    label: scenario.label
  }))
})

const columns: TableColumn<ScenariosTableRow>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => {
          table.toggleAllPageRowsSelected(!!value)
          if (value) {
            scenariosData.value.forEach((item) => {
              bulkDelete.value[item.label] = !!value
            })
          } else {
            if (Object.keys(bulkDelete.value).length) {
              for (const key in bulkDelete.value) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete bulkDelete.value[key]
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
          if (value) {
            bulkDelete.value[row.original.label] = !!value
          } else if (bulkDelete.value[row.original.label]) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete bulkDelete.value[row.original.label]
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
      return h('span', { class: 'font-semibold' }, row.getValue('label'))
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
          onClick: () => console.log(row.original)
        })
      ])
    }
  }
]
</script>

<template>
  <UiDashboardContent class="pb-24 h-full gap-2 lg:gap-4">
    <UPageGrid
      id="control-panel"
      class="gap-2 lg:gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 items-start"
    >
      <UPageCard
        v-bind="ui.presets.pageCard.space"
        :title="
          t('controlPanel.diskUsage.description', {
            label: t('controlPanel.diskUsage.test'),
            total: '20000',
            used: Number(diskSpaceData?.testFolderSize).toFixed(2)
          })
        "
        :description="
          t('controlPanel.diskUsage.description', {
            label: t('controlPanel.diskUsage.reference'),
            total: '1000',
            used: Number(diskSpaceData?.referenceFolderSize).toFixed(2)
          })
        "
        :icon="ui.icons.hardDriveDownload"
      >
        <template #header>
          <span>{{ t('controlPanel.diskUsage.title') }}</span>
        </template>
      </UPageCard>
      <UPageCard
        v-bind="ui.presets.pageCard.dashboard"
        :title="t('controlPanel.reference.title')"
        :icon="ui.icons.image"
      >
        <div class="ml-14 flex flex-wrap gap-4 gap-y-2">
          <UButton :label="t('actions.createReference')" />
          <UButton :label="t('controlPanel.reference.page')" />
        </div>
      </UPageCard>
      <UPageCard
        v-bind="ui.presets.pageCard.dashboard"
        :title="t('controlPanel.test.title')"
        :icon="ui.icons.imagePlus"
      >
        <div class="ml-14 flex flex-wrap gap-4 gap-y-2">
          <UButton :label="t('actions.startTest')" />
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
            <UInput
              :model-value="table?.tableApi?.getColumn('label')?.getFilterValue() as string"
              class="max-w-sm"
              :placeholder="t('global.filter')"
              @update:model-value="table?.tableApi?.getColumn('label')?.setFilterValue($event)"
            />

            <div v-if="isRowsSelected" class="flex gap-2">
              <UButton color="secondary" variant="outline">{{ t('actions.startSelectedTest') }}</UButton>
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
