import type { ProjectConfig } from '~~/shared/types'

export const useConfigStore = defineStore('config', () => {
  const { showErrorMessage } = useNotifications()

  const { data: projectsList, error: projectsError } = useFetch<ProjectConfig[]>(`/api/config/projects`, {
    default: () => []
  })

  onMounted(() => {
    if (projectsError.value) {
      showErrorMessage(projectsError.value)
    }
  })

  return {
    projectsList
  }
})
