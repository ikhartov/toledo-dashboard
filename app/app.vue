<script setup lang="ts">
const appConfig = useAppConfig()
const { t, locale } = useI18n()

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'robots', content: 'noindex' },
    {
      key: 'theme-color',
      name: 'theme-color',
      content: appConfig.theme?.lightColor,
      media: '(prefers-color-scheme: light)'
    },
    {
      key: 'theme-color',
      name: 'theme-color',
      content: appConfig.theme?.darkColor,
      media: '(prefers-color-scheme: dark)'
    },
    { name: 'apple-mobile-web-app-title', content: t('global.appName') }
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: { lang: locale.value }
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
