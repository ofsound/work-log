<script setup lang="ts">
import { ref } from 'vue'

import { formatSecondsToMinutesSeconds } from '@/utils/formatters.ts'

const emit = defineEmits(['setStartTime', 'setEndTime'])

const timerProgress = ref('00:00')
let nowWhenStarted: Date

let timerInterval: number = 0

const startTimer = () => {
  nowWhenStarted = new Date()
  updateTime()
  timerInterval = setInterval(updateTime, 1000)
  emit('setStartTime', new Date())
}

const endTimer = () => {
  clearInterval(timerInterval)
  emit('setEndTime', new Date())
}

const updateTime = () => {
  const now = new Date()

  const timeElapsedSinceStart = now.valueOf() - nowWhenStarted.valueOf()

  timerProgress.value = formatSecondsToMinutesSeconds(Math.round(timeElapsedSinceStart / 1000))
}
</script>

<template>
  <div class="my-4 rounded-sm border border-gray-100 bg-green-200 px-6 py-4 shadow-md">
    <button v-if="timerInterval === 0" class="border px-2" @click="startTimer">Start Timer</button>
    <div class="mt-2">{{ timerProgress }}</div>
    <button v-if="timerInterval !== 0" class="mt-2 border px-2" @click="endTimer">End Timer</button>
  </div>
</template>
