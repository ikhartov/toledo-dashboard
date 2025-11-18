<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const { t } = useI18n()
const { ui } = useAppConfig()

const providers = [
  {
    label: t('login.providers.google'),
    icon: ui.icons.google,
    to: '/auth/google',
    external: true
  },
  {
    label: t('login.providers.github'),
    icon: ui.icons.github,
    to: '/auth/github',
    external: true
  }
]
</script>

<template>
  <UAuthForm
    :providers="providers"
    :title="t('login.title')"
    :icon="ui.icons.userLock"
    :ui="{ header: 'flex-row gap-4 items-center', leading: 'm-0', title: 'm-0' }"
  />
</template>
