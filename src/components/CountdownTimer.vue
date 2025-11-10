<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { formatSecondsToMinutesSeconds } from '@/utils/formatters.ts'

const emit = defineEmits(['setStartTime', 'setEndTime'])

const timerProgress = ref('')
const timerLength = ref(1800)

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

  const secondsElapsed = Math.round(timeElapsedSinceStart / 1000)

  if (timerLength.value - secondsElapsed <= 0) {
    endTimer()
  }

  timerProgress.value = formatSecondsToMinutesSeconds(timerLength.value - secondsElapsed)
}

const route = useRoute()

onMounted(() => {
  if (route.path === '/pomodoro') {
    startTimer()
  }
})
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
