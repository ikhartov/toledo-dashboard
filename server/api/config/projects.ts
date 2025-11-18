import type { ProjectsConfig } from '~~/shared/types'

export default defineEventHandler(async (): Promise<ProjectsConfig[]> => {
  return [
    {
      id: 'thor',
      label: 'Thor',
      icon: 'i-lucide-command'
    },
    {
      id: 'vegas',
      label: 'Vegas',
      icon: 'i-lucide-sunset'
    },
    {
      id: 'bond',
      label: 'Bond',
      icon: 'i-lucide-bold'
    }
  ]
})
