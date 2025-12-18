import type { Report } from '~~/shared/types'
import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event) => {
  try {
    const projectId = getRouterParam(event, 'project')

    if (!projectId) {
      throwError('projectId is not defined', 'GET_PROJECT_ERROR')
      return []
    }

    return await $fetch<Report[]>(`/_${projectId}/api/test-list`)
  } catch (error) {
    throwError(error, 'GET_PROJECT_REPORTS_ERROR')
    return []
  }
})
