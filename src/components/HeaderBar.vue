<script setup lang="ts">
import { ref } from 'vue'

const currentTime = ref('')

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString([], { timeStyle: 'short' })
}

updateTime()
setInterval(updateTime, 1000)
</script>

<template>
  <div class="mb-4 flex bg-gray-900 py-1 pr-4 font-bold">
    <div class="ml-4 text-white">{{ currentTime }}</div>
    <h1 class="ml-auto tracking-wide text-white">WORK LOG</h1>
  </div>
</template>
