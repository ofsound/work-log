<script setup lang="ts">
import { ref } from 'vue'

import CountdownTimer from '@/components/CountdownTimer.vue'
import CountupTimer from '@/components/CountupTimer.vue'
import TimeBoxEditor from '@/components/TimeBoxEditor.vue'

import { formatToDatetimeLocal } from '@/utils/formatters.ts'

const countUpIsActive = ref(false)
const countDownIsActive = ref(false)

const startTimeFromTimer = ref()
const endTimeFromTimer = ref()

const setStartTime = (timeFromTimer: Date, source: string) => {
  startTimeFromTimer.value = formatToDatetimeLocal(timeFromTimer)
  if (source === 'countup') {
    countUpIsActive.value = true
  } else if (source === 'countdown') {
    countDownIsActive.value = true
  }
}

const setEndTime = (timeFromTimer: Date) => {
  endTimeFromTimer.value = formatToDatetimeLocal(timeFromTimer)
}

const resetStartAndEndTimes = () => {
  startTimeFromTimer.value = ''
  endTimeFromTimer.value = ''
  countUpIsActive.value = false
  countDownIsActive.value = false
}
</script>

<template>
  <div class="flex gap-2 *:flex-1">
    <CountdownTimer
      :class="{ 'blur-[2px] grayscale-100': countUpIsActive }"
      @setStartTime="setStartTime"
      @setEndTime="setEndTime"
      @resetStartAndEndTimes="resetStartAndEndTimes"
    />
    <CountupTimer
      :class="{ 'blur-[2px] grayscale-100': countDownIsActive }"
      @setStartTime="setStartTime"
      @setEndTime="setEndTime"
      @resetStartAndEndTimes="resetStartAndEndTimes"
    />
  </div>
  <TimeBoxEditor :startTimeFromTimer :endTimeFromTimer />
</template>
