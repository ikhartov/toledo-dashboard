import type { ProjectsConfig } from '~~/shared/types'

export const useConfigStore = defineStore('config', () => {
  const route = useRoute()
  const { showErrorMessage } = useNotifications()

  const { data: projectsList, error: projectsError } = useFetch<ProjectsConfig[]>(`/api/config/projects`, {
    default: () => []
  })

  const selectedProject = ref<ProjectsConfig | null>(
    projectsList.value.find((project) => project.id === route.params.project) || null
  )

  function setSelectedProject(project?: ProjectsConfig) {
    if (!project) {
      selectedProject.value = null
      return
    }

    selectedProject.value = project
  }

  onMounted(() => {
    if (projectsError.value) {
      showErrorMessage(projectsError.value)
    }

    selectedProject.value = projectsList.value.find((project) => project.id === route.params.project) || null
  })

  return {
    projectsList,
    selectedProject: computed(() => selectedProject.value),
    setSelectedProject
  }
})
