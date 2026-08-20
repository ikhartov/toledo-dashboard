import type { BackupRequestBody, DeleteRequestBody, ReferenceRequestBody, StartTestRequestBody } from '~~/shared/types'
import { DEFAULT_TIMEOUT } from '~~/shared/constants'

export const useActions = () => {
  const { t } = useI18n()
  const { currentRoute } = useRouter()
  const { showErrorMessage, showSuccessMessage } = useNotifications()
  const { refreshJobsStatus } = useJobsStore()
  const { refreshReports } = useReportsStore()

  const isActionBackup = ref(false)
  const isActionCreate = ref(false)
  const isActionDelete = ref(false)
  const isActionStart = ref(false)

  async function backupReports(body: BackupRequestBody) {
    try {
      isActionBackup.value = true
      await $fetch(`/api/${currentRoute.value.params.project}/action/backup`, { method: 'post', body })

      setTimeout(() => {
        if (body.folders.length > 1) {
          showSuccessMessage(t('notifications.report.backup', 2))
        } else {
          showSuccessMessage(t('notifications.report.backup', 1), body.folders[0])
        }
      }, DEFAULT_TIMEOUT)
      isActionBackup.value = false
    } catch (error) {
      showErrorMessage(error)
      isActionBackup.value = false
    }
  }

  async function createReferences(body: ReferenceRequestBody) {
    try {
      isActionCreate.value = true
      await $fetch(`/api/${currentRoute.value.params.project}/action/reference`, { method: 'post', body })

      await refreshJobsStatus()
      await refreshReports()
      isActionCreate.value = false
    } catch (error) {
      showErrorMessage(error)

      await refreshJobsStatus()
      await refreshReports()
      isActionCreate.value = false
    }
  }

  async function deleteReports(body: DeleteRequestBody) {
    try {
      isActionDelete.value = true
      await $fetch(`/api/${currentRoute.value.params.project}/action/delete`, { method: 'post', body })

      setTimeout(() => {
        if (body.folders.length > 1) {
          showSuccessMessage(t('notifications.report.delete', 2))
        } else {
          showSuccessMessage(t('notifications.report.delete', 1), body.folders[0])
        }
      }, DEFAULT_TIMEOUT)
      isActionDelete.value = false
    } catch (error) {
      showErrorMessage(error)
      isActionDelete.value = false
    }
  }

  async function startTest(body: StartTestRequestBody) {
    try {
      isActionStart.value = true
      await $fetch(`/api/${currentRoute.value.params.project}/action/start`, { method: 'post', body })

      await refreshJobsStatus()
      await refreshReports()
      isActionStart.value = false
    } catch (error) {
      showErrorMessage(error)

      await refreshJobsStatus()
      await refreshReports()
      isActionStart.value = false
    }
  }

  return {
    isActionBackup,
    isActionCreate,
    isActionDelete,
    isActionStart,
    backupReports,
    createReferences,
    deleteReports,
    startTest
  }
}
