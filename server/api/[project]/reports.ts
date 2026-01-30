import type { Report } from '~~/shared/types'
import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event): Promise<Report[]> => {
  try {
    const projectId = getRouterParam(event, 'project')

    if (!projectId) {
      throwError('projectId is not defined', 'GET_PROJECT_ERROR')
      return []
    }

    const response = await $fetch<Report[]>(`/_${projectId}/api/test-list`)

    return response.map((report) => ({
      name: report.name,
      status: report.result.failed ? 'failed' : report.result.passed ? 'passed' : 'pending',
      result: { passed: report.result.passed, failed: report.result.failed }
    }))
  } catch (error) {
    throwError(error, 'GET_PROJECT_REPORTS_ERROR')
    return []
  }
})
