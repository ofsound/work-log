<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { formatSecondsToMinutesSeconds } from '@/utils/formatters.ts'

const emit = defineEmits(['setStartTime', 'setEndTime'])

const timerIsRunning = ref(false)
const timerIsPaused = ref(false)
const timerProgress = ref('')
const timerLength = ref(1800)

let nowWhenStarted: Date

let timerInterval: number = 0

const startTimer = () => {
  nowWhenStarted = new Date()
  updateTime()
  timerInterval = setInterval(updateTime, 1000)
  emit('setStartTime', new Date())
  timerIsRunning.value = true
}

const pauseTimer = () => {
  timerIsPaused.value = true
}

const resumeTimer = () => {
  timerIsPaused.value = false
}

const cancelTimer = () => {
  timerIsRunning.value = false
}

const endTimer = () => {
  clearInterval(timerInterval)
  emit('setEndTime', new Date())
  timerIsRunning.value = false
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

onMounted(() => {
  const route = useRoute()

  if (route.path === '/pomodoro') {
    startTimer()
  }
})
</script>

<template>
  <div
    class="my-4 flex max-w-90 items-center justify-between rounded-sm border border-gray-400/50 bg-green-400 px-6 py-4 shadow-md"
  >
    <div
      class="font-data relative h-max rounded-sm border border-gray-300 bg-white px-2 py-1 text-5xl font-bold tabular-nums"
    >
      <button
        class="absolute -top-3 -left-3 rounded-full border-2 border-gray-300 bg-white p-1 shadow-sm"
        @click="cancelTimer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 100 100">
          <line x1="10" y1="10" x2="90" y2="90" stroke="black" stroke-width="20" />
          <line x1="10" y1="90" x2="90" y2="10" stroke="black" stroke-width="20" />
        </svg>
      </button>
      <div v-if="!timerIsRunning">
        {{ formatSecondsToMinutesSeconds(timerLength) }}
      </div>
      <div v-else class="">
        {{ timerProgress }}
      </div>
    </div>
    <button
      v-if="!timerIsRunning"
      class="h-10 rounded-xl border border-gray-300 bg-white px-3 font-bold"
      @click="startTimer"
    >
      Start Timer
    </button>
    <button
      v-if="timerIsRunning && !timerIsPaused"
      class="h-10 rounded-xl border border-gray-300 bg-white px-3 font-bold"
      @click="pauseTimer"
    >
      Pause Timer
    </button>
    <button
      v-if="timerIsPaused"
      class="h-10 rounded-xl border border-gray-300 bg-white px-3 font-bold"
      @click="resumeTimer"
    >
      Resume Timer
    </button>
  </div>
</template>
