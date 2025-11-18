<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div>
    Project page
    <pre>{{ $route.params }}</pre>
  </div>
</template>
