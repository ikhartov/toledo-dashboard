import type { Observer, ObservableObj } from '~~/shared/types'

interface MediaObservableObj extends ObservableObj {
  isMediaMatch: Ref<boolean>
}

export enum MediaMaxBreakpoints {
  'SM' = 640,
  'MD' = 767,
  'LG' = 1023,
  'XL' = 1279,
  '2XL' = 1535
}

const observer: Observer<MediaObservableObj> = {}

const mapMediaObserver = (mediaMax = MediaMaxBreakpoints.LG) => {
  if (import.meta.server) {
    return {
      isMediaMatch: () => MediaMaxBreakpoints.SM >= mediaMax,
      dispose() {}
    }
  }
  function onMediaMatch(e: MediaQueryListEvent) {
    const observerRecord = observer[mediaMax]

    if (observerRecord) {
      observerRecord.isMediaMatch.value = e.matches
    }
  }
  const isMediaMatch = ref<boolean>(MediaMaxBreakpoints.SM >= mediaMax)
  let unwatch: () => void
  const timer = setTimeout(() => {
    if (!observer[mediaMax]) {
      const mqList = window.matchMedia(`(max-width: ${mediaMax}px)`)

      observer[mediaMax] = {
        listener: onMediaMatch,
        mqList,
        clients: 0,
        isMediaMatch: ref(mqList.matches)
      } as MediaObservableObj

      mqList.addEventListener('change', onMediaMatch)
    }
    const observerRecord = observer[mediaMax]

    if (observerRecord) {
      observerRecord.clients = (observerRecord.clients || 0) + 1

      isMediaMatch.value = observerRecord.isMediaMatch.value
      unwatch = watch(observerRecord.isMediaMatch, () => {
        isMediaMatch.value = observerRecord.isMediaMatch.value
      })
    }
  })

  return {
    isMediaMatch: () => isMediaMatch.value,
    dispose() {
      if (unwatch) {
        unwatch()
        const observerRecord = observer[mediaMax]
        if (observerRecord) {
          observerRecord.clients = (observerRecord.clients || 0) - 1
          if (observerRecord.clients === 0) {
            observerRecord.mqList.removeEventListener('change', observerRecord.listener)
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete observer[mediaMax]
          }
        }
      } else {
        clearTimeout(timer)
      }
    }
  }
}

export const useMediaQuery = (mediaMax = MediaMaxBreakpoints.LG) => ({
  isMediaMatch: computed(mapMediaObserver(mediaMax).isMediaMatch)
})
