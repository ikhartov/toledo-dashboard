<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Report } from '~~/shared/types'
import { DEFAULT_DELETE_TIMEOUT } from '~~/shared/constants'

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
const { showErrorMessage, showSuccessMessage } = useNotifications()

const { data: items, error } = await useFetch<Report[]>(`/api/${route.params.project}/reports`, {
  default: () => []
})

if (error.value) {
  showErrorMessage(error.value)
}

const loading = ref(false)
const backupModel = ref<Report>()
const deleteModel = ref<Report>()
const modal = reactive({
  backup: false,
  bulkBackup: false,
  bulkDelete: false,
  delete: false
})

const selectedRows = ref<Record<string, boolean | undefined>>({})

const table = useTemplateRef('table')
const columnFilters = ref([{ id: 'name', value: '' }])
const rowSelection = ref({})
const sorting = ref([{ id: 'name', desc: false }])

const isRowsSelected = computed(() => Object.keys(selectedRows.value).length)

function toggleBackupModal(row?: Report) {
  console.log(row)
  modal.backup = !modal.backup
  backupModel.value = row
}

function toggleDeleteModal(row?: Report) {
  console.log(row)
  modal.delete = !modal.delete
  deleteModel.value = row
}

function toggleBackupSelected() {
  console.log('Backup selected rows', selectedRows.value)
  modal.bulkBackup = !modal.bulkBackup
}

function toggleDeleteSelected() {
  console.log('Delete selected rows', selectedRows.value)
  modal.bulkDelete = !modal.bulkDelete
}

function deleteReport() {
  console.log('Delete report', deleteModel.value)

  loading.value = true

  setTimeout(() => {
    loading.value = false
    showSuccessMessage(t('notifications.report.delete', 1), deleteModel.value?.name)
    modal.delete = false
    deleteModel.value = undefined
  }, DEFAULT_DELETE_TIMEOUT)
}

function deleteReports() {
  console.log('Delete reports', selectedRows.value)

  loading.value = true

  setTimeout(() => {
    loading.value = false
    table.value?.tableApi?.toggleAllPageRowsSelected(false)
    showSuccessMessage(t('notifications.report.delete', 2))
    modal.bulkDelete = false
    selectedRows.value = {}
  }, DEFAULT_DELETE_TIMEOUT)
}

function backupReport() {
  console.log('Backup report', backupModel.value)

  loading.value = true

  setTimeout(() => {
    loading.value = false
    showSuccessMessage(t('notifications.report.backup', 1), backupModel.value?.name)
    modal.backup = false
    backupModel.value = undefined
  }, DEFAULT_DELETE_TIMEOUT)
}

function backupReports() {
  console.log('Backup reports', selectedRows.value)

  loading.value = true

  setTimeout(() => {
    loading.value = false
    table.value?.tableApi?.toggleAllPageRowsSelected(false)
    showSuccessMessage(t('notifications.report.backup', 2))
    modal.bulkBackup = false
    selectedRows.value = {}
  }, DEFAULT_DELETE_TIMEOUT)
}

function getStatusBadge(status: string) {
  const color = {
    passed: 'success' as const,
    failed: 'error' as const,
    pending: 'neutral' as const
  }[status]

  return h(UBadge, { variant: 'subtle', color }, () => {
    return t(`reports.status.${status}`)
  })
}

function getResultContent(result: Report['result']) {
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

const columns: TableColumn<Report>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => {
          table.toggleAllPageRowsSelected(!!value)
          if (value) {
            items.value.forEach((item) => {
              selectedRows.value[item.name] = !!value
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
          if (value) {
            selectedRows.value[row.original.name] = !!value
          } else if (selectedRows.value[row.original.name]) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete selectedRows.value[row.original.name]
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
    cell: ({ row }) => getStatusBadge(row.getValue('status'))
  },
  {
    accessorKey: 'result',
    header: t('reports.columns.result'),
    cell: ({ row }) => getResultContent(row.getValue('result'))
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
          onClick: () => toggleBackupModal(row.original)
        }),
        h(UButton, {
          label: t('actions.delete'),
          variant: 'outline',
          color: 'error',
          onClick: () => toggleDeleteModal(row.original)
        })
      ])
    }
  }
]
</script>

<template>
  <UiDashboardContent class="pb-24 h-full">
    <UPageGrid id="project-reports" class="h-full">
      <UPageCard
        class="col-span-3 h-full overflow-auto"
        :ui="{ header: 'w-full mb-0', container: 'lg:flex', wrapper: 'flex-0' }"
      >
        <template #header>
          <div class="w-full flex flex-wrap gap-2 justify-between">
            <UInput
              :model-value="table?.tableApi?.getColumn('name')?.getFilterValue() as string"
              class="max-w-sm"
              :placeholder="t('global.filter')"
              @update:model-value="table?.tableApi?.getColumn('name')?.setFilterValue($event)"
            />

            <div v-if="isRowsSelected" class="flex gap-2">
              <UButton color="secondary" variant="outline" @click="toggleBackupSelected">
                {{ t('actions.backupSelected') }}
              </UButton>
              <UButton color="error" variant="outline" @click="toggleDeleteSelected">
                {{ t('actions.deleteSelected') }}
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
            th: 'hidden first:table-cell nth-2:table-cell nth-2:col-span-3 lg:table-cell',
            tr: 'grid grid-cols-[33px_repeat(3,minmax(0,1fr))] sm:items-center lg:table-row',
            td: 'nth-2:col-span-2 nth-2:whitespace-pre-wrap nth-3:text-right lg:nth-3:text-left nth-4:col-start-2 nth-4:col-span-2 sm:nth-4:col-start-2 sm:nth-4:col-span-1 nth-5:col-start-2 nth-5:col-span-3 sm:nth-5:col-start-3 sm:nth-5:col-span-2'
          }"
          sticky
        />
      </UPageCard>
    </UPageGrid>

    <UModal
      v-model:open="modal.delete"
      :title="t('modal.delete.title', 1)"
      :description="t('modal.delete.description', 1)"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <UPageCard :ui="{ container: 'p-2 sm:p-4' }">
          <template v-for="(value, key) in deleteModel" :key="key">
            <div class="flex items-center">
              <span class="w-1/5">{{ key }}:&nbsp;</span>
              <component :is="getStatusBadge(value as string)" v-if="key === 'status'" />
              <component
                :is="getResultContent(value as Report['result'])"
                v-else-if="key === 'result'"
                class="text-sm sm:flex-row sm:gap-2"
              />
              <span v-else class="font-bold">{{ value }}</span>
            </div>
          </template>
        </UPageCard>
      </template>
      <template #footer>
        <UButton color="error" :label="t('actions.delete')" :loading="loading" @click="deleteReport" />
        <UButton color="neutral" variant="outline" :label="t('actions.cancel')" @click="() => toggleDeleteModal()" />
      </template>
    </UModal>
    <UModal
      v-model:open="modal.bulkDelete"
      :title="t('modal.delete.title', 2)"
      :description="t('modal.delete.description', 2)"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <UScrollArea
          v-slot="{ item, index }"
          :items="Object.keys(selectedRows).map((key) => ({ description: key }))"
          class="w-full max-h-64"
        >
          <UPageCard
            v-bind="item as object"
            :variant="index % 2 === 0 ? 'soft' : 'outline'"
            class="rounded-none"
            :ui="{ container: 'p-2 sm:p-2' }"
          />
        </UScrollArea>
      </template>
      <template #footer>
        <UButton color="error" :label="t('actions.delete')" :loading="loading" @click="deleteReports" />
        <UButton color="neutral" variant="outline" :label="t('actions.cancel')" @click="() => toggleDeleteSelected()" />
      </template>
    </UModal>
    <UModal
      v-model:open="modal.backup"
      :title="t('modal.backup.title', 1)"
      :description="t('modal.backup.description', 1)"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <UPageCard :ui="{ container: 'p-2 sm:p-4' }">
          <template v-for="(value, key) in backupModel" :key="key">
            <div class="flex items-center">
              <span class="w-1/5">{{ key }}:&nbsp;</span>
              <component :is="getStatusBadge(value as string)" v-if="key === 'status'" />
              <component
                :is="getResultContent(value as Report['result'])"
                v-else-if="key === 'result'"
                class="text-sm sm:flex-row sm:gap-2"
              />
              <span v-else class="font-bold">{{ value }}</span>
            </div>
          </template>
        </UPageCard>
      </template>
      <template #footer>
        <UButton color="primary" :label="t('actions.backup')" :loading="loading" @click="backupReport" />
        <UButton color="neutral" variant="outline" :label="t('actions.cancel')" @click="() => toggleBackupModal()" />
      </template>
    </UModal>
    <UModal
      v-model:open="modal.bulkBackup"
      :title="t('modal.backup.title', 2)"
      :description="t('modal.backup.description', 2)"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <UScrollArea
          v-slot="{ item, index }"
          :items="Object.keys(selectedRows).map((key) => ({ description: key }))"
          class="w-full max-h-64"
        >
          <UPageCard
            v-bind="item as object"
            :variant="index % 2 === 0 ? 'soft' : 'outline'"
            class="rounded-none"
            :ui="{ container: 'p-1 sm:p-1' }"
          />
        </UScrollArea>
      </template>
      <template #footer>
        <UButton color="primary" :label="t('actions.backup')" :loading="loading" @click="backupReports" />
        <UButton color="neutral" variant="outline" :label="t('actions.cancel')" @click="() => toggleBackupSelected()" />
      </template>
    </UModal>
  </UiDashboardContent>
</template>
