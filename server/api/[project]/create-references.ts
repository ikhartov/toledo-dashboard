import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async () => {
  throwError('Not implemented yet', 'CREATE_REFERENCE_ERROR')
  return null
})
