import type { ProjectConfig, Settings } from '~~/shared/types'

export const useConfigStore = defineStore('config', () => {
  const route = useRoute()
  const { showErrorMessage } = useNotifications()

  const { data: projectsList, error: projectsError } = useFetch<ProjectConfig[]>(`/api/config/projects`, {
    default: () => []
  })

  const { data: settingsData, error: settingsError } = useFetch<Settings | null>(
    `/api/${route.params.project}/settings`
  )

  const apiUrl = computed(() => {
    return projectsList.value.find((project) => project.id === route.params.project)?.apiUrl
  })

  const mockUrl = computed(() => {
    return projectsList.value.find((project) => project.id === route.params.project)?.mockUrl
  })

  const globalMismatchThreshold = computed(() => {
    return settingsData.value?.misMatchThreshold ?? 0
  })

  onMounted(() => {
    if (projectsError.value) {
      showErrorMessage(projectsError.value)
    }

    if (settingsError.value) {
      showErrorMessage(settingsError.value)
    }
  })

  return {
    apiUrl,
    mockUrl,
    globalMismatchThreshold,
    projectsList
  }
})
