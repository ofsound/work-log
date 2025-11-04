<script setup lang="ts">
import { ref } from 'vue'

const timerProgress = ref('')
const timerLength = ref(1800)

let nowWhenStarted: Date

let timerInterval: number = 0

const startTimer = () => {
  nowWhenStarted = new Date()
  updateTime()
  timerInterval = setInterval(updateTime, 1000)
}

const endTimer = () => {
  clearInterval(timerInterval)
  console.log('what to do, ask if you want to submit, skip focus')
}

const updateTime = () => {
  const now = new Date()

  const timeElapsedSinceStart = now.valueOf() - nowWhenStarted.valueOf()

  const secondsElapsed = Math.round(timeElapsedSinceStart / 1000)

  if (timerLength.value - secondsElapsed <= 0) {
    endTimer()
  }

  timerProgress.value = formatSecondsToMinutesSeconds(timerLength.value - secondsElapsed)
}

const formatSecondsToMinutesSeconds = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(seconds).padStart(2, '0')

  return `${formattedMinutes}:${formattedSeconds}`
}
</script>

<template>
  <div class="my-4 rounded-sm border border-gray-100 bg-green-200 px-6 py-4 shadow-md">
    <div class="mb-4">
      {{ formatSecondsToMinutesSeconds(timerLength) }}
    </div>
    <button class="border px-2" @click="startTimer">Start Timer</button>
    <div class="mt-2">{{ timerProgress }}</div>
  </div>
</template>
