import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event) => {
  try {
    const projectId = getRouterParam(event, 'project')

    if (!projectId) {
      throwError('projectId is not defined', 'GET_PROJECT_ERROR')
      return { data: null, error: 'projectId is not defined' }
    }

    const data = await $fetch(`/_${projectId}/api/app-list`)

    return { data, error: null }
  } catch (error) {
    throwError(error, 'GET_PROJECT_ENVS_ERROR')
    return { data: null, error }
  }
})
