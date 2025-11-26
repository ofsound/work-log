<script setup lang="ts">
import { ref } from 'vue'

const currentTime = ref('')

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString([], { timeStyle: 'short' })
}

updateTime()
setInterval(updateTime, 1000)
</script>

<template>
  <div class="fixed z-100 flex w-full gap-3 bg-gray-900 px-4 py-1 tracking-wide text-white">
    <RouterLink to="/" class="font-bold hover:underline">WORK LOG</RouterLink>
    <div>/</div>
    <RouterLink to="/" class="font-bold">&nbsp;✚&nbsp;</RouterLink>
    <div>/</div>
    <RouterLink to="/projects" class="hover:underline">Projects</RouterLink>
    <div>/</div>
    <RouterLink to="/tags" class="hover:underline">Tags</RouterLink>
    <div>/</div>
    <RouterLink to="/sessions" class="hover:underline">Sessions</RouterLink>
    <div class="ml-auto">{{ currentTime }}</div>
  </div>
</template>
