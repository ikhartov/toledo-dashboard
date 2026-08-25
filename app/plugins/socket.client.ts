import type { Emitter } from 'mitt'
import type { Pinia } from 'pinia'
import type { ApplicationEvents, JobStatusMessage, ProjectConfig } from '~~/shared/types'

function connectSocket(projectsList: ProjectConfig[], $bus: Emitter<ApplicationEvents>, userId?: string) {
  const reconnectBaseDelay = 1000
  const reconnectMaxDelay = 30000
  const protocol = window.location.protocol === 'https:' || process.env.NODE_ENV !== 'development' ? 'wss:' : 'ws:'

  projectsList.forEach((project) => {
    let socket: WebSocket | null = null
    let reconnectAttempt = 0
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null

    const close = () => {
      console.log(`${project.label} WebSocket closed`)

      const reconnectDelay = Math.min(reconnectBaseDelay * 2 ** reconnectAttempt, reconnectMaxDelay)

      reconnectAttempt += 1

      reconnectTimeout = setTimeout(() => {
        connect()
      }, reconnectDelay)

      console.log(`${project.label} WebSocket reconnecting in ${reconnectDelay}ms`)
    }

    const stop = () => {
      if (socket) {
        socket.close()
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout)
        }
        socket.removeEventListener('close', close)
      }
    }

    const connect = () => {
      stop()

      socket = new WebSocket(`${protocol}//${project.socketUrl}`)

      socket.addEventListener('open', () => {
        reconnectAttempt = 0

        socket?.send(JSON.stringify({ type: 'subscribe', userId }))

        console.log(`${project.label} WebSocket connected`)
      })

      socket.addEventListener('message', async (event) => {
        const message: JobStatusMessage = JSON.parse(event.data)

        if (message.type === 'job-status') {
          if (message.command === 'reference') {
            $bus.emit(`${project.id}:job:reference`, { label: project.label, message })
          }

          if (message.command === 'test') {
            $bus.emit(`${project.id}:job:test`, { label: project.label, message })
          }
        }
      })

      socket.addEventListener('close', close)

      socket.addEventListener('error', () => {
        socket?.close()
      })
    }

    connect()

    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout)
        }

        socket?.close()
      })
    }
  })
}

export default defineNuxtPlugin({
  name: 'socket',
  enforce: 'post',
  setup(nuxtApp) {
    const $bus = nuxtApp.$bus as Emitter<ApplicationEvents>
    const $pinia = nuxtApp.$pinia as Pinia
    const configStore = useConfigStore($pinia as Pinia)
    const projectsList = configStore.projectsList
    const { userId } = useCurrentUser()

    connectSocket(projectsList, $bus, userId.value)

    watch(
      () => configStore.projectsList,
      (newValue, oldValue) => {
        if (oldValue && newValue.length !== oldValue?.length) {
          connectSocket(newValue, $bus, userId.value)
        }
      },
      { immediate: true }
    )
  }
})
