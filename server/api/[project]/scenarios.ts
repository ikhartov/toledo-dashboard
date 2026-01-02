import type { Scenario } from '~~/shared/types'
import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event) => {
  try {
    const projectId = getRouterParam(event, 'project')

    if (!projectId) {
      throwError('projectId is not defined', 'GET_PROJECT_ERROR')
      return { data: null, error: 'projectId is not defined' }
    }

    return await $fetch<Scenario[]>(`/_${projectId}/api/test-scenarios`)
  } catch (error) {
    throwError(error, 'GET_PROJECT_SCENARIOS_ERROR')
    return []
  }
})
