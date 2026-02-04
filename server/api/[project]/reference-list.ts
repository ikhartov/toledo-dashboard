import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async () => {
  throwError('Not implemented yet', 'REFERENCE_LIST_ERROR')
  return []
})
