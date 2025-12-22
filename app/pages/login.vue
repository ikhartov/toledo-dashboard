<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

const { t } = useI18n()
const { ui } = useAppConfig()
const config = useRuntimeConfig()
const { isDev } = config.public

const providers: ButtonProps[] = []

if (!isDev) {
  providers.push({
    label: t('login.providers.google'),
    icon: ui.icons.google,
    to: '/auth/google',
    external: true
  })
  providers.push({
    label: t('login.providers.github'),
    icon: ui.icons.github,
    to: '/auth/github',
    external: true
  })
} else {
  providers.push({
    label: t('login.providers.dev'),
    icon: ui.icons.userRoundCog,
    to: '/auth/dev',
    external: true
  })
}
</script>

<template>
  <UAuthForm
    :providers="providers"
    :title="t('login.title')"
    :icon="ui.icons.userLock"
    :ui="{ header: 'flex-row gap-4 items-center', leading: 'm-0', title: 'm-0' }"
  />
</template>
