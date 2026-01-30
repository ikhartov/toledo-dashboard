import type { H3Error } from 'h3'

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

export interface ProjectConfig {
  id: string
  apiUrl: string
  label: string
  icon?: string
  mockUrl?: string
}

export interface Report {
  name: string
  result: {
    passed: number
    failed: number
  }
}

// TODO: refactor server response. should be type of DiskSpace
export interface DiskSpaceUsage {
  testFolderSize: number
  referenceFolderSize: number
}

export interface DiskSpace {
  capacity: number
  folders: {
    backups: number
    references: number
    reports: number
  }
  used: number
}

export interface Scenario {
  label?: string
  url?: string
}
