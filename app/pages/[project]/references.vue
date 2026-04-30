<script setup lang="ts">
type ReferenceData = {
  label: string
  images: {
    mobile?: string
    desktop?: string
  }
}

definePageMeta({
  middleware: 'auth',
  breadcrumb: 'references'
})

const route = useRoute()
const { apiUrl } = storeToRefs(useConfigStore())
const { showErrorMessage } = useNotifications()

const { data: references, error } = await useFetch<string[]>(`/api/${route.params.project}/references`, {
  default: () => []
})

if (error.value) {
  showErrorMessage(error.value)
}

const modalOpen = ref(false)
const fullSizeReference = reactive<Record<string, string | undefined>>({
  label: '',
  image: ''
})

const refs = computed(() => {
  const result: ReferenceData[] = []

  references.value.forEach((ref) => {
    const itemData: ReferenceData = {
      label: '',
      images: {
        desktop: 'references/no_image.png',
        mobile: 'references/no_image.png'
      }
    }
    const isMobile = ref.includes('mobile.png')
    const path = ref
      .replace(/^\w+\/\w+\/backstop_/, '')
      .replace(/_0.+$/, '')
      .replace('_', ' ')

    const item = result.find((item) => item.label === path)

    if (item) {
      if (isMobile) {
        item.images.mobile = ref
      } else {
        item.images.desktop = ref
      }
    } else {
      itemData.label = path
      if (isMobile) {
        itemData.images.mobile = ref
      } else {
        itemData.images.desktop = ref
      }
      result.push(itemData)
    }
  })

  return result
})

function toggleModal(label?: string, image?: string) {
  fullSizeReference.label = label || ''
  fullSizeReference.image = image || ''
  modalOpen.value = true
}
</script>

<template>
  <UiDashboardContent class="pb-24 h-full">
    <UPageGrid id="project-references" class="h-full sm:grid-cols-1 lg:grid-cols-1 gap-4">
      <UPageList class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <template v-for="reference in refs" :key="reference.label">
          <UPageCard :title="reference.label" class="w-full">
            <div class="flex gap-2">
              <template v-for="(value, key) in reference.images" :key="key">
                <NuxtImg
                  :src="`${apiUrl}/${value}`"
                  class="h-48 w-1/2 object-scale-down"
                  :alt="value"
                  @click="toggleModal(`${reference.label} ${key}`, `${apiUrl}/${value}`)"
                />
              </template>
            </div>
          </UPageCard>
        </template>
      </UPageList>
    </UPageGrid>
    <UModal v-model:open="modalOpen" :title="fullSizeReference.label" class="max-w-[1440px] h-auto">
      <template #body>
        <NuxtImg class="mx-auto" :src="fullSizeReference.image" loading="lazy" />
      </template>
    </UModal>
  </UiDashboardContent>
</template>
