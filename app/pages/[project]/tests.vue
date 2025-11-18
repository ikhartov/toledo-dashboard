<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div>
    Tests list page
    <pre>{{ $route.params }}</pre>
  </div>
</template>
