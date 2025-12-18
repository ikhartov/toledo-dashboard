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
    failed: report.result.failed,
    passed: report.result.passed
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
    }
  },
  { accessorKey: 'failed', header: t('reports.columns.failed') },
  { accessorKey: 'passed', header: t('reports.columns.passed') },
  {
    id: 'open',
    cell: ({ row }) => {
      return h(UButton, {
        label: t('actions.open'),
        to: `/${route.params.project}/reports/${row.original.name}`
      })
    }
  },
  {
    id: 'backup',
    cell: ({ row }) => {
      return h(UButton, {
        label: t('actions.backup'),
        variant: 'outline',
        color: 'secondary',
        onSelect: () => toggleBackupModal(row.original)
      })
    }
  },
  {
    id: 'delete',
    cell: ({ row }) => {
      return h(UButton, {
        label: t('actions.delete'),
        variant: 'outline',
        color: 'error',
        onSelect: () => toggleDeleteModal(row.original)
      })
    }
  }
]
</script>

<template>
  <UiDashboardContent class="pb-24 h-full">
    <UPageGrid class="h-full">
      <UPageCard
        variant="naked"
        class="col-span-3 2xl:col-span-1"
        :title="t('budget.expenses.title')"
        :description="t('budget.expenses.description')"
      >
        <template #footer> </template>
      </UPageCard>
      <UPageCard
        class="col-span-3 2xl:col-span-2 h-full overflow-auto"
        :ui="{ header: 'w-full mb-0', container: 'lg:flex', wrapper: 'flex-0' }"
      >
        <template #header>
          <div class="w-full flex gap-2 justify-between">
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
          sticky
        />
      </UPageCard>
    </UPageGrid>
  </UiDashboardContent>
</template>
