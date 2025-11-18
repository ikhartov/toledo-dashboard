<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { selectedProject } = storeToRefs(useConfigStore())
</script>

<template>
  <div>
    Envs page
    <pre>{{ selectedProject }}</pre>
  </div>
</template>
