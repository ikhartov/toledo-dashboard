<script setup lang="ts">
import type { NuxtError } from '#app'

interface ErrorPageProps {
  error: NuxtError
}

defineProps<ErrorPageProps>()
</script>

<template>
  <UApp>
    <UError :error="error" />
  </UApp>
</template>
