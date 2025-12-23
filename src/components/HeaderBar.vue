<script setup lang="ts">
import { ref } from 'vue'

import { useStore } from '@/stores/store'

import SortAscending from '@/icons/SortAscending.vue'
import SortDescending from '@/icons/SortDescending.vue'

const store = useStore()

const currentTime = ref('')

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString([], { timeStyle: 'short' })
}

updateTime()
setInterval(updateTime, 1000)
</script>

<template>
  <div
    class="fixed z-100 flex w-full max-w-250 gap-3 bg-gray-900 px-4 py-1 tracking-wide text-white"
  >
    <RouterLink to="/" class="font-bold hover:underline">WORK LOG</RouterLink>
    <div>/</div>
    <RouterLink to="/new" class="">&nbsp;✚&nbsp;</RouterLink>
    <div>/</div>
    <RouterLink to="/projects" class="hover:underline">Projects</RouterLink>
    <div>/</div>
    <RouterLink to="/tags" class="hover:underline">Tags</RouterLink>
    <div>/</div>
    <RouterLink to="/sessions" class="hover:underline">Sessions</RouterLink>
    <button
      @click="store.sortOrderReversed = !store.sortOrderReversed"
      class="mr-2 ml-auto cursor-pointer"
    >
      <SortAscending v-if="!store.sortOrderReversed" />
      <SortDescending v-if="store.sortOrderReversed" />
    </button>
    <div>{{ currentTime }}</div>
  </div>
</template>
