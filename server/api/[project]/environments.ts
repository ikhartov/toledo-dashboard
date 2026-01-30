import type { Environment } from '~~/shared/types'
import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event): Promise<Environment[]> => {
  try {
    const projectId = getRouterParam(event, 'project')

    if (!projectId) {
      throwError('projectId is not defined', 'GET_PROJECT_ERROR')
      return []
    }

    // TODO: refactor server response. should be type of Environment
    const response = await $fetch<string[]>(`/_${projectId}/api/app-list`)

    return response.map((env) => ({
      id: env,
      name: env.replace(/-mock$/g, ''),
      url: undefined
    }))
  } catch (error) {
    throwError(error, 'GET_PROJECT_ENVS_ERROR')
    return []
  }
})
