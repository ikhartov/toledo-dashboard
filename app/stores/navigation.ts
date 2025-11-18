import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

export const useNavigationStore = defineStore('navigation', () => {
  const { t } = useI18n()
  const { ui } = useAppConfig()
  const localePath = useLocalePath()
  const { user, logout } = useCurrentUser()
  const { projectsList, selectedProject } = storeToRefs(useConfigStore())
  const { setSelectedProject } = useConfigStore()
  const colorMode = useColorMode()

  const colors = [
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose'
  ]
  const neutrals = ['slate', 'gray', 'zinc', 'neutral', 'stone']

  const onSelect = (project) => {
    setSelectedProject(project)
  }

  const userNavigation = computed<DropdownMenuItem[][]>(() => [
    [
      {
        type: 'label',
        label: user.value?.name,
        avatar: {
          src: user.value?.avatar,
          alt: user.value?.name || '',
        }
      }
    ],
    [
      {
        label: t('menu.theme'),
        icon: ui.icons.palette,
        children: [
          {
            label: t('menu.primary'),
            slot: 'chip',
            chip: ui.colors.primary,
            content: {
              align: 'center',
              collisionPadding: 16
            },
            children: colors.map((color) => ({
              label: color,
              chip: color,
              slot: 'chip',
              checked: ui.colors.primary === color,
              type: 'checkbox',
              onSelect: (e) => {
                e.preventDefault()

                ui.colors.primary = color
                window.localStorage.setItem('nuxt-ui-primary', color)
              }
            }))
          },
          {
            label: t('menu.neutral'),
            slot: 'chip',
            chip: ui.colors.neutral === 'neutral' ? 'old-neutral' : ui.colors.neutral,
            content: {
              align: 'end',
              collisionPadding: 16
            },
            children: neutrals.map((color) => ({
              label: color,
              chip: color === 'neutral' ? 'old-neutral' : color,
              slot: 'chip',
              type: 'checkbox',
              checked: ui.colors.neutral === color,
              onSelect: (e) => {
                e.preventDefault()

                ui.colors.neutral = color
                window.localStorage.setItem('nuxt-ui-neutral', color)
              }
            }))
          }
        ]
      },
      {
        label: t('menu.appearance'),
        icon: ui.icons.sunMoon,
        children: [
          {
            label: t('mode.light'),
            icon: ui.icons.light,
            type: 'checkbox',
            checked: colorMode.value === 'light',
            onSelect(e: Event) {
              e.preventDefault()

              colorMode.preference = 'light'
            }
          },
          {
            label: t('mode.dark'),
            icon: ui.icons.dark,
            type: 'checkbox',
            checked: colorMode.value === 'dark',
            onUpdateChecked(checked: boolean) {
              if (checked) {
                colorMode.preference = 'dark'
              }
            },
            onSelect(e: Event) {
              e.preventDefault()
            }
          }
        ]
      }
    ],
    [
      {
        label: t('menu.github'),
        icon: ui.icons.github,
        to: 'https://github.com/upstars-global',
        target: '_blank'
      },
      {
        label: t('user.logout'),
        icon: ui.icons.logout,
        onSelect: logout
      }
    ]
  ])

  const taxonomy = computed<NavigationMenuItem[] | null>(() => {
    if (!projectsList.value) {
      return null
    }

    return projectsList.value.map((project) => ({
      ...project,
      to: localePath(`/${project.id}`),
      collapsible: true,
      defaultOpen: selectedProject.value?.id === project.id,
      children: [
        { label: t('navigation.general'), icon: ui.icons.dashboard, to: localePath(`/${project.id}`), exact: true, onSelect: () => setSelectedProject(project) },
        { label: t('navigation.envs'), icon: ui.icons.appWindow, to: localePath(`/${project.id}/envs`), onSelect: () => setSelectedProject(project) },
        { label: t('navigation.tests'), icon: ui.icons.list, to: localePath(`/${project.id}/tests`), onSelect: () => setSelectedProject(project) }
      ],
      onSelect: () => setSelectedProject(project)
    }))
  })

  return {
    taxonomy,
    userNavigation
  }
})
