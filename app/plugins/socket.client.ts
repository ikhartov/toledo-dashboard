// import type { Emitter } from 'mitt'
import type { JobStatusMessage } from '~~/shared/types'
// import { getProjectList } from '~~/config'

export default defineNuxtPlugin((nuxtApp) => {
  // const $bus = nuxtApp.$bus as Emitter<ApplicationEvents>
  const { $bus, $pinia } = nuxtApp
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const { userId } = useCurrentUser()
  const configStore = useConfigStore($pinia)
  const projectsList = configStore.projectsList

  // if (process.env.NODE_ENV !== 'development') {
  //   projectsList = getProjectList()
  // }

  const reconnectBaseDelay = 1000
  const reconnectMaxDelay = 30000

  projectsList.forEach((project) => {
    let socket: WebSocket | null = null
    let reconnectAttempt = 0
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null

    const connect = () => {
      socket = new WebSocket(`${protocol}//${project.socketUrl}`)

      socket.addEventListener('open', () => {
        reconnectAttempt = 0

        socket?.send(JSON.stringify({ type: 'subscribe', userId: userId.value }))

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

      socket.addEventListener('close', () => {
        console.log(`${project.label} WebSocket closed`)

        const reconnectDelay = Math.min(reconnectBaseDelay * 2 ** reconnectAttempt, reconnectMaxDelay)

        reconnectAttempt += 1

        reconnectTimeout = setTimeout(() => {
          connect()
        }, reconnectDelay)

        console.log(`${project.label} WebSocket reconnecting in ${reconnectDelay}ms`)
      })

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
})
