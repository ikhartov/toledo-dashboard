import type { DiskSpace, DiskSpaceUsage } from '~~/shared/types'
import { DEFAULT_DISK_CAPACITY } from '~~/shared/constants'
import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event): Promise<DiskSpace | null> => {
  try {
    const projectId = getRouterParam(event, 'project')

    if (!projectId) {
      throwError('projectId is not defined', 'GET_PROJECT_ERROR')
      return null
    }

    // TODO: refactor server response. should be type of DiskSpace
    const { testFolderSize, referenceFolderSize } = await $fetch<DiskSpaceUsage>(`/_${projectId}/api/spase-usage`)

    return {
      capacity: DEFAULT_DISK_CAPACITY,
      folders: {
        backups: 0,
        references: parseFloat((referenceFolderSize ?? 0).toFixed(2)),
        reports: parseFloat((testFolderSize ?? 0).toFixed(2))
      },
      used: parseFloat((referenceFolderSize + testFolderSize).toFixed(2))
    }
  } catch (error) {
    throwError(error, 'GET_PROJECT_DISK_SPACE_ERROR')
    return null
  }
})
