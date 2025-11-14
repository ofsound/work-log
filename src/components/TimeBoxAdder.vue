<script setup lang="ts">
import { ref } from 'vue'

import CountdownTimer from '@/components/CountdownTimer.vue'
import CountupTimer from '@/components/CountupTimer.vue'
import TimeBoxEditor from '@/components/TimeBoxEditor.vue'

import { formatToDatetimeLocal } from '@/utils/formatters.ts'

const startTimeFromTimer = ref()
const endTimeFromTimer = ref()

const setStartTime = (timeFromTimer: Date) => {
  startTimeFromTimer.value = formatToDatetimeLocal(timeFromTimer)
}

const setEndTime = (timeFromTimer: Date) => {
  endTimeFromTimer.value = formatToDatetimeLocal(timeFromTimer)
}

const resetStartAndEndTimes = () => {
  startTimeFromTimer.value = ''
  endTimeFromTimer.value = ''
}
</script>

<template>
  <div class="flex gap-2 *:flex-1">
    <CountdownTimer
      @setStartTime="setStartTime"
      @setEndTime="setEndTime"
      @resetStartAndEndTimes="resetStartAndEndTimes"
    />
    <CountupTimer
      @setStartTime="setStartTime"
      @setEndTime="setEndTime"
      @resetStartAndEndTimes="resetStartAndEndTimes"
    />
  </div>
  <TimeBoxEditor :startTimeFromTimer :endTimeFromTimer />
</template>
