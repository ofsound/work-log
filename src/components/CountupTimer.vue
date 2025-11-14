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
  <div
    class="my-4 flex max-w-90 items-center justify-between rounded-sm border border-gray-400/50 bg-green-400 px-6 py-4 shadow-md"
  >
    <div
      class="font-data h-max rounded-sm border border-gray-300 bg-white px-2 py-1 text-5xl font-bold tabular-nums"
    >
      {{ timerProgress }}
    </div>
    <button
      v-if="timerInterval === 0"
      class="h-10 rounded-xl border bg-white px-3 font-bold"
      @click="startTimer"
    >
      Start Timer
    </button>
    <button
      v-if="timerInterval !== 0"
      class="h-10 rounded-xl border bg-white px-3 font-bold"
      @click="endTimer"
    >
      End Timer
    </button>
  </div>
</template>
