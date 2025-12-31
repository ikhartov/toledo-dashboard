<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Report } from '~~/shared/types'

interface ReportTableRow {
  name: string
  failed: number
  passed: number
}

definePageMeta({
  middleware: 'auth',
  breadcrumb: 'reports'
})

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')

const { t } = useI18n()
const { ui } = useAppConfig()
const route = useRoute()
const { showErrorMessage } = useNotifications()

const { data, error } = await useFetch<Report[]>(`/api/${route.params.project}/reports`, {
  default: () => []
})

if (error.value) {
  showErrorMessage(error.value)
}

const isBackupModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const backupModel = ref<ReportTableRow>()
const deleteModel = ref<ReportTableRow>()

const bulkDelete = ref<Record<string, boolean | undefined>>({})

const table = useTemplateRef('table')
const columnFilters = ref([{ id: 'name', value: '' }])
const rowSelection = ref({})
const sorting = ref([{ id: 'name', desc: true }])

function toggleBackupModal(row: ReportTableRow) {
  isBackupModalOpen.value = !isBackupModalOpen.value
  backupModel.value = row
}

function toggleDeleteModal(row: ReportTableRow) {
  isDeleteModalOpen.value = !isDeleteModalOpen.value
  deleteModel.value = row
}

const isRowsSelected = computed(() => Object.keys(bulkDelete.value).length)

const items = computed(() => {
  return data.value.map((report) => ({
    name: report.name,
    status: report.result.failed ? 'failed' : report.result.passed ? 'passed' : 'pending',
    result: { passed: report.result.passed, failed: report.result.failed }
  }))
})

const columns: TableColumn<ReportTableRow>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => {
          table.toggleAllPageRowsSelected(!!value)
          if (value) {
            data.value.forEach((item) => {
              bulkDelete.value[item.name] = !!value
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
            bulkDelete.value[row.original.name] = !!value
          } else if (bulkDelete.value[row.original.name]) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete bulkDelete.value[row.original.name]
          }
        }
      })
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: t('reports.columns.name'),
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
      return h('span', { class: 'font-semibold' }, row.getValue('name'))
    }
  },
  {
    accessorKey: 'status',
    header: t('reports.columns.status'),
    cell: ({ row }) => {
      const color = {
        passed: 'success' as const,
        failed: 'error' as const,
        pending: 'neutral' as const
      }[row.getValue('status') as string]

      return h(UBadge, { variant: 'subtle', color }, () => {
        return t(`reports.status.${row.getValue('status')}`)
      })
    }
  },
  {
    accessorKey: 'result',
    header: t('reports.columns.result'),
    cell: ({ row }) => {
      const result = row.getValue('result') as object
      const colorMap = {
        passed: 'text-success',
        failed: 'text-error'
      }

      const content = Object.entries(result).map(([label, value]) => {
        return h(
          'span',
          { class: `${colorMap[label as keyof typeof colorMap]}` },
          `${t(`reports.status.${label}`)}: ${value}`
        )
      })

      return h('div', { class: 'flex gap-4 sm:flex-col sm:gap-1' }, content)
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h('div', { class: 'flex gap-8 justify-between sm:justify-end' }, [
        h(UButton, {
          label: t('actions.open'),
          to: `/${route.params.project}/reports/${row.original.name}`
        }),
        h(UButton, {
          label: t('actions.backup'),
          variant: 'outline',
          color: 'secondary',
          onSelect: () => toggleBackupModal(row.original)
        }),
        h(UButton, {
          label: t('actions.delete'),
          variant: 'outline',
          color: 'error',
          onSelect: () => toggleDeleteModal(row.original)
        })
      ])
    }
  }
]
</script>

<template>
  <UiDashboardContent class="pb-24 h-full">
    <UPageGrid class="h-full">
      <UPageCard
        class="col-span-3 h-full overflow-auto"
        :ui="{ header: 'w-full mb-0', container: 'lg:flex', wrapper: 'flex-0' }"
      >
        <template #header>
          <div class="w-full flex flex-wrap gap-2 justify-between">
            <UInput
              :model-value="table?.tableApi?.getColumn('name')?.getFilterValue() as string"
              class="max-w-sm"
              :placeholder="t('reports.filter')"
              @update:model-value="table?.tableApi?.getColumn('name')?.setFilterValue($event)"
            />

            <div v-if="isRowsSelected" class="flex gap-2">
              <UButton color="secondary" variant="outline">{{ t('actions.backupSelected') }}</UButton>
              <UButton color="error" variant="outline">{{ t('actions.deleteSelected') }}</UButton>
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
            th: 'hidden first:table-cell nth-2:table-cell nth-2:col-span-3 lg:table-cell',
            tr: 'grid grid-cols-[33px_repeat(3,minmax(0,1fr))] sm:items-center lg:table-row',
            td: 'nth-2:col-span-2 nth-2:whitespace-pre-wrap nth-3:text-right lg:nth-3:text-left nth-4:col-start-2 nth-4:col-span-2 sm:nth-4:col-start-2 sm:nth-4:col-span-1 nth-5:col-start-2 nth-5:col-span-3 sm:nth-5:col-start-3 sm:nth-5:col-span-2'
          }"
          sticky
        />
      </UPageCard>
    </UPageGrid>
  </UiDashboardContent>
</template>
