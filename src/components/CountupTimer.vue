<script setup lang="ts">
import { ref } from 'vue'

import TimerButton from '@/components/TimerButton.vue'
import TimerCancelButton from '@/components/TimerCancelButton.vue'

import { formatSecondsToMinutesSeconds } from '@/utils/formatters.ts'

const emit = defineEmits(['setStartTime', 'setEndTime', 'resetStartAndEndTimes'])

const timerProgress = ref('00:00')
let nowWhenStarted: Date

let timerInterval: number = 0

const startTimer = () => {
  nowWhenStarted = new Date()
  updateTime()
  timerInterval = setInterval(updateTime, 1000)
  emit('setStartTime', new Date(), 'countup')
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
      <TimerCancelButton @click="cancelTimer" />
      {{ timerProgress }}
    </div>

    <TimerButton v-if="timerInterval === 0" @click="startTimer">Start Timer</TimerButton>
    <TimerButton v-if="timerInterval !== 0" @click="stopTimer">Stop Timer</TimerButton>
  </div>
</template>
