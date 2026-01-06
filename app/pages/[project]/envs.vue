<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

interface EnvironmentsTableRow {
  name: string
}

definePageMeta({
  middleware: 'auth',
  breadcrumb: 'envs'
})

const UButton = resolveComponent('UButton')

const { t } = useI18n()
const { ui } = useAppConfig()
const route = useRoute()
const { showErrorMessage } = useNotifications()

const { data, error } = await useFetch<string[]>(`/api/${route.params.project}/environments`, {
  default: () => []
})

if (error.value) {
  showErrorMessage(error.value)
}

const table = useTemplateRef('table')
const columnFilters = ref([{ id: 'name', value: '' }])
const sorting = ref([{ id: 'name', desc: false }])

const items = computed(() => {
  return data.value?.map((env) => ({ name: env }))
})
const columns: TableColumn<EnvironmentsTableRow>[] = [
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
      return h('span', { class: 'font-semibold' }, row.getValue('name'))
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h('div', { class: 'flex flex-wrap gap-4 lg:gap-8 justify-between sm:justify-end' }, [
        h(UButton, {
          label: t('actions.startTest'),
          onClick: () => console.log(row)
        }),
        h(UButton, {
          label: t('actions.showReport'),
          variant: 'outline',
          color: 'secondary',
          onClick: () => console.log(row)
        }),
        h(UButton, {
          label: t('actions.jira'),
          variant: 'outline',
          color: 'info',
          onClick: () => console.log(row)
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
