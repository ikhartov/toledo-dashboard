import type { ProjectsConfig } from '~~/shared/types'

export const useConfigStore = defineStore('config', () => {
  const route = useRoute()
  const { showErrorMessage } = useNotifications()

  const { data: projects, error: projectsError } = useFetch<ProjectsConfig[]>(`/api/config/projects`)

  const selectedProject = ref<ProjectsConfig | undefined>(projects.value?.find((project) => project.id === route.params.project))

  function setSelectedProject(project?: DropdownMenuItem) {
    if (!project) {
      selectedProject.value = undefined
      return
    }

    selectedProject.value = {
      id: project.id,
      label: project.label,
      icon: project.icon as string,
      to: project.to
    }
  }

  const projectsList = computed<ProjectsConfig[] | null>(() => {
    if (!projects.value) {
      return null
    }

    return projects.value.map((project) => ({
      ...project,
      to: `/${project.id}`
    }))
  })

  onMounted(() => {
    if (projectsError.value) {
      showErrorMessage(projectsError.value)
    }

    selectedProject.value = projects.value?.find((project) => project.id === route.params.project)
  })

  return {
    projectsList,
    selectedProject: computed(() => selectedProject.value),
    setSelectedProject
  }
})
