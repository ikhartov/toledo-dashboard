import type { PageCardProps } from '@nuxt/ui'

interface UiPresets {
  pageCard: {
    dashboard: PageCardProps
  }
}

const icons = {
  // auth providers
  google: 'i-custom-google',
  github: 'i-custom-github',
  // login
  userLock: 'i-lucide-user-lock',
  // custom
  appWindow: 'i-lucide-app-window',
  bookImage: 'i-lucide-book-image',
  chevronsUpDown: 'i-lucide-chevrons-up-down',
  controlPanel: 'i-lucide-sliders-vertical',
  image: 'i-lucide-image',
  logout: 'i-lucide-log-out',
  palette: 'i-lucide-palette',
  sunMoon: 'i-lucide-sun-moon',
  arrowNarrowUp: 'i-lucide-arrow-up-narrow-wide',
  arrowNarrowDown: 'i-lucide-arrow-down-wide-narrow',
  arrowUpDown: 'i-lucide-arrow-up-down',
  // default
  arrowDown: 'i-lucide-arrow-down',
  arrowLeft: 'i-lucide-arrow-left',
  arrowRight: 'i-lucide-arrow-right',
  arrowUp: 'i-lucide-arrow-up',
  caution: 'i-lucide-circle-alert',
  check: 'i-lucide-check',
  chevronDoubleLeft: 'i-lucide-chevrons-left',
  chevronDoubleRight: 'i-lucide-chevrons-right',
  chevronDown: 'i-lucide-chevron-down',
  chevronLeft: 'i-lucide-chevron-left',
  chevronRight: 'i-lucide-chevron-right',
  chevronUp: 'i-lucide-chevron-up',
  close: 'i-lucide-x',
  copy: 'i-lucide-copy',
  copyCheck: 'i-lucide-copy-check',
  dark: 'i-lucide-moon',
  ellipsis: 'i-lucide-ellipsis',
  error: 'i-lucide-circle-x',
  external: 'i-lucide-arrow-up-right',
  eye: 'i-lucide-eye',
  eyeOff: 'i-lucide-eye-off',
  file: 'i-lucide-file',
  folder: 'i-lucide-folder',
  folderOpen: 'i-lucide-folder-open',
  hash: 'i-lucide-hash',
  info: 'i-lucide-info',
  light: 'i-lucide-sun',
  loading: 'i-lucide-loader-circle',
  menu: 'i-lucide-menu',
  minus: 'i-lucide-minus',
  panelClose: 'i-lucide-panel-left-close',
  panelOpen: 'i-lucide-panel-left-open',
  plus: 'i-lucide-plus',
  reload: 'i-lucide-rotate-ccw',
  search: 'i-lucide-search',
  stop: 'i-lucide-square',
  success: 'i-lucide-circle-check',
  system: 'i-lucide-monitor',
  tip: 'i-lucide-lightbulb',
  upload: 'i-lucide-upload',
  warning: 'i-lucide-triangle-alert'
}

const presets: UiPresets = {
  pageCard: {
    dashboard: {
      variant: 'subtle',
      ui: {
        container: 'gap-y-1.5 cont',
        wrapper: 'flex-row gap-4 items-center',
        leading: 'm-0 p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
        title: 'font-normal text-muted text-xs uppercase',
        description: 'mt-2 text-lg font-semibold text-default leading-none'
      }
    }
  }
}

export default defineAppConfig({
  theme: { darkColor: '', lightColor: '' },
  ui: {
    colors: { primary: 'yellow', neutral: 'gray', secondary: 'amber' },
    icons,
    presets
  }
})
