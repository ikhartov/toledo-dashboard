<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Environment, Report } from '~~/shared/types'

definePageMeta({
  middleware: 'auth',
  breadcrumb: 'envs'
})

const UButton = resolveComponent('UButton')
const ULink = resolveComponent('ULink')

const { t } = useI18n()
const { ui } = useAppConfig()
const route = useRoute()
const { showErrorMessage, showSuccessMessage } = useNotifications()

const { data: items, error } = await useFetch<Environment[]>(`/api/${route.params.project}/environments`, {
  default: () => []
})

const { data: reports, error: reportsError } = await useFetch<Report[]>(`/api/${route.params.project}/reports`, {
  default: () => []
})

if (error.value) {
  showErrorMessage(error.value)
}

if (reportsError.value) {
  showErrorMessage(reportsError.value)
}

async function handleStartTest(row: Environment) {
  try {
    await $fetch(`/api/${route.params.project}/start`, {
      query: { service: row.id }
    })
    showSuccessMessage(t('notifications.tests.start'), row.name)
  } catch (error) {
    showErrorMessage(error)
  }
}

const table = useTemplateRef('table')
const columnFilters = ref([{ id: 'name', value: '' }])
const sorting = ref([{ id: 'name', desc: false }])

const columns: TableColumn<Environment>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: t('envs.columns.name'),
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
      return h(ULink, { class: 'font-semibold', external: true, target: '_blank', href: row.original.url }, () =>
        row.getValue('name')
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h('div', { class: 'flex flex-wrap gap-4 lg:gap-6 justify-between sm:justify-end' }, [
        reports.value.find((report) => row.original.name?.includes(report.name))
          ? h(UButton, {
              label: t('actions.showReport'),
              variant: 'outline',
              color: 'secondary',
              to: `/${route.params.project}/reports/${row.original.name}`
            })
          : undefined,
        h(UButton, {
          label: t('actions.startTest'),
          onClick: () => handleStartTest(row.original)
        })
      ])
    }
  }
]
</script>

<template>
  <UiDashboardContent class="pb-24 h-full">
    <UPageGrid id="project-envs" class="h-full">
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
          </div>
        </template>
        <UTable
          ref="table"
          v-model:column-filters="columnFilters"
          v-model:sorting="sorting"
          class="border-t border-accented"
          :columns="columns"
          :data="items"
          :ui="{
            tr: 'grid sm:grid-cols-2 lg:table-row',
            td: 'nth-1:whitespace-pre-wrap'
          }"
        />
      </UPageCard>
    </UPageGrid>
  </UiDashboardContent>
</template>
