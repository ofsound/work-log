<script setup lang="ts">
import TimeBox from '@/components/TimeBox.vue'
</script>

<template>
  <h1 class="text-4xl">Work Log</h1>
  <p class="mt-4">Lock in</p>
  <TimeBox v-for="n in 10" :key="n" />
</template>

<style scoped></style>
