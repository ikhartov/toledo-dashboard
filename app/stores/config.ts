import type { ProjectConfig } from '~~/shared/types'

export const useConfigStore = defineStore('config', () => {
  const route = useRoute()
  const { showErrorMessage } = useNotifications()

  const { data: projectsList, error: projectsError } = useFetch<ProjectConfig[]>(`/api/config/projects`, {
    default: () => []
  })

  const apiUrl = computed(() => {
    return projectsList.value.find((project) => project.id === route.params.project)?.apiUrl
  })

  const mockUrl = computed(() => {
    return projectsList.value.find((project) => project.id === route.params.project)?.mockUrl
  })

  onMounted(() => {
    if (projectsError.value) {
      showErrorMessage(projectsError.value)
    }
  })

  return {
    apiUrl,
    mockUrl,
    projectsList
  }
})
