import type { ServerError } from '~~/shared/types'
import { DEFAULT_TOAST_TIMEOUT } from '~~/shared/constants'

export function useNotifications() {
  const { ui } = useAppConfig()
  const toast = useToast()

  function showErrorMessage(error: unknown) {
    const result: Record<string, string> = {}
    if (typeof error === 'string') {
      result.description = error
    } else {
      result.title = String((error as ServerError).statusCode)
      result.description = (error as ServerError).statusMessage ?? (error as Error).message
    }

    const { description, title } = result

    toast.add({
      title,
      description,
      color: 'error',
      icon: ui.icons.warning,
      duration: DEFAULT_TOAST_TIMEOUT
    })
  }

  function showSuccessMessage(title: string, description?: string) {
    toast.add({ title, description, icon: ui.icons.success, duration: DEFAULT_TOAST_TIMEOUT })
  }

  return { showErrorMessage, showSuccessMessage }
}
