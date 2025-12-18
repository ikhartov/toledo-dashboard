import type { ProjectConfig } from '~~/shared/types'
import { PROJECTS_LIST } from '~~/config'

export default defineEventHandler(async (): Promise<ProjectConfig[]> => {
  return PROJECTS_LIST
})
