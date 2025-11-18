export function useBreadcrumbs() {
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const localePath = useLocalePath()
  const { setSelectedProject } = useConfigStore()

  const breadcrumbs = computed(() => {
    let currentPath = ''
    const crumbs = route.fullPath
      .substring(1)
      .split('/')
      .filter(Boolean)
      .map((segment) => {
        currentPath = `${currentPath}/${segment}`
        const resolvedRoute = router.resolve(currentPath)
        const metaBreadcrumb = resolvedRoute.meta?.breadcrumb
          ? t(`navigation.${resolvedRoute.meta?.breadcrumb}`)
          : segment.charAt(0).toUpperCase() + segment.slice(1)

        return {
          label: metaBreadcrumb,
          to: resolvedRoute.path
        }
      })

    return [{ label: t('breadcrumbs.home'), to: localePath('/'), onClick: () => setSelectedProject() }, ...crumbs]
  })

  return { breadcrumbs }
}
