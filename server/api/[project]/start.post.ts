import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event): Promise<void> => {
  try {
    const projectId = getRouterParam(event, 'project')
    if (!projectId) {
      throwError('projectId is not defined', 'GET_PROJECT_ERROR')
      return
    }

    const body = await readBody(event)

    return await $fetch(`/_${projectId}/api/start-test-select-scenarios`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(body)
    })
  } catch (error) {
    throwError(error, 'START_TEST_ERROR')
    return
  }
})
