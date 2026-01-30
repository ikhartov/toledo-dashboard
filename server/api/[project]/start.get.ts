import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event): Promise<void> => {
  try {
    const projectId = getRouterParam(event, 'project')
    if (!projectId) {
      throwError('projectId is not defined', 'GET_PROJECT_ERROR')
      return
    }

    const { service } = getQuery<{ service?: string }>(event)

    if (service) {
      return await $fetch(`/_${projectId}/api/start?service=${service}&folder=${service.replace(/-mock$/g, '')}`)
    }

    return await $fetch(`/_${projectId}/api/start`)
  } catch (error) {
    throwError(error, 'START_TEST_ERROR')
    return
  }
})
