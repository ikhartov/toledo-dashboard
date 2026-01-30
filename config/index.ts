import type { ProjectConfig } from '~~/shared/types'
import type { NitroRouteConfig } from 'nitropack/types'

const ENDPOINTS = ['api/**']
export const PROJECTS_LIST: ProjectConfig[] = [
  {
    id: 'bond',
    apiUrl: 'https://toledo-staging-bond-frontera.wlabel.site',
    label: 'Bond',
    icon: 'i-lucide-bold',
    mockUrl: 'https://mock-bond.staging.wlabel.site'
  },
  {
    id: 'thor',
    apiUrl: 'https://toledo-staging-thor-frontera.wlabel.site',
    label: 'Thor',
    icon: 'i-lucide-command',
    mockUrl: 'https://mock-thor.staging.wlabel.site'
  },
  {
    id: 'vegas',
    apiUrl: 'https://toledo-staging-vegas-frontera.wlabel.site',
    label: 'Vegas',
    icon: 'i-lucide-sunset',
    mockUrl: 'https://mock-vegas.staging.wlabel.site'
  }
]

export const NITRO_ROUTE_RULES: Record<string, NitroRouteConfig> = PROJECTS_LIST.reduce(
  (acc, project) => {
    ENDPOINTS.forEach((endpoint) => {
      const path = `/_${project.id}/${endpoint}`
      acc[path] = {
        proxy: {
          to: `${project.apiUrl}/${endpoint}`
        }
      }
    })

    return acc
  },
  {} as Record<string, NitroRouteConfig>
)
