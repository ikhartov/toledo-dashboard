import type { ProjectConfig } from '~~/shared/types'
import { getProjectList } from '~~/config'

export default defineEventHandler(async (): Promise<ProjectConfig[]> => {
  return getProjectList()
})
