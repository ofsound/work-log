<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { formatSecondsToMinutesSeconds } from '@/utils/formatters.ts'

const emit = defineEmits(['setStartTime', 'setEndTime'])

const timerIsRunning = ref(false)
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
    class="my-4 flex max-w-90 items-center justify-between rounded-sm border border-gray-100 bg-green-400 px-6 py-4 shadow-md"
  >
    <div
      class="font-data h-max rounded-sm border border-gray-300 bg-white px-2 py-1 text-5xl font-bold tabular-nums"
    >
      <div v-if="!timerIsRunning">
        {{ formatSecondsToMinutesSeconds(timerLength) }}
      </div>
      <div v-else class="">
        {{ timerProgress }}
      </div>
    </div>
    <button
      class="h-10 rounded-xl border border-gray-300 bg-white px-3 font-bold"
      @click="startTimer"
    >
      Start Timer
    </button>
  </div>
</template>
