<script setup lang="ts">
defineProps({
  startTime: Date,
  endTime: Date,
  notes: String,
})
</script>

<template>
  <div class="my-2 bg-gray-200 p-8">
    <h1 class="text-4xl">TimeBox</h1>
    <div class="mt-2">{{ startTime }}</div>
    <div class="mt-2">{{ endTime }}</div>
    <div class="mt-2">{{ notes }}</div>
  </div>
</template>
