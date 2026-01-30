import type { H3Error } from 'h3'

export type ServerError = Partial<H3Error>

export type Locale = 'en'

export type Observer<T> = {
  [key: number | string]: T
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

export interface DiskSpaceUsage {
  testFolderSize: number
  referenceFolderSize: number
}

export interface Environment {
  name: string
  url?: string
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
  status: string
  result: {
    passed: number
    failed: number
  }
}

export interface Scenario {
  label?: string
  url?: string
}
