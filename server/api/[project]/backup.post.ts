import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async () => {
  throwError('Not implemented yet', 'BACKUP_TEST_ERROR')
})
