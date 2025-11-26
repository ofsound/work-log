<script setup lang="ts">
import { ref } from 'vue'

import { formatSecondsToMinutesSeconds } from '@/utils/formatters.ts'

const emit = defineEmits(['setStartTime', 'setEndTime', 'resetStartAndEndTimes'])

const timerProgress = ref('00:00')
let nowWhenStarted: Date

let timerInterval: number = 0

const startTimer = () => {
  nowWhenStarted = new Date()
  updateTime()
  timerInterval = setInterval(updateTime, 1000)
  emit('setStartTime', new Date())
}

const cancelTimer = () => {
  clearInterval(timerInterval)
  timerProgress.value = '00:00'
  emit('resetStartAndEndTimes')
}

const stopTimer = () => {
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
    class="my-4 flex max-w-90 items-center justify-between rounded-sm border border-gray-400/30 bg-green-400 px-6 py-4 shadow-md"
  >
    <div
      class="font-data relative h-max rounded-sm border border-gray-300 bg-white px-2.5 py-1 text-5xl font-bold tabular-nums"
    >
      <button
        class="absolute -top-3 -left-3 cursor-pointer rounded-full border-2 border-gray-300 bg-white p-1 shadow-sm"
        @click="cancelTimer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 100 100">
          <line x1="10" y1="10" x2="90" y2="90" stroke="black" stroke-width="20" />
          <line x1="10" y1="90" x2="90" y2="10" stroke="black" stroke-width="20" />
        </svg>
      </button>

      {{ timerProgress }}
    </div>
    <button
      v-if="timerInterval === 0"
      class="h-10 cursor-pointer rounded-xl border border-gray-300 bg-white px-3 font-bold tracking-wide"
      @click="startTimer"
    >
      Start Timer
    </button>
    <button
      v-if="timerInterval !== 0"
      class="h-10 cursor-pointer rounded-xl border border-gray-300 bg-white px-3 font-bold tracking-wide"
      @click="stopTimer"
    >
      Stop Timer
    </button>
  </div>
</template>
