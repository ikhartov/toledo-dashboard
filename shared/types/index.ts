import type { H3Error } from 'h3'
import type { RouteLocationRaw } from 'vue-router'

export type ServerError = Partial<H3Error>

// ui
export type Locale = 'en'

export type Observer<T> = {
  [key: number | string]: T
}

export interface ObservableObj {
  listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void
  mqList: MediaQueryList
  clients?: number
}

export interface ProjectsConfig {
  id: string
  label?: string
  icon?: string
  to?: RouteLocationRaw
}
