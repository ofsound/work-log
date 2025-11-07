<script setup lang="ts">
import { ref } from 'vue'

import CountdownTimer from '@/components/CountdownTimer.vue'
import CountupTimer from '@/components/CountupTimer.vue'
import TimeBoxEditor from '@/components/TimeBoxEditor.vue'

const formatToDatetimeLocal = (date: Date) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const startTimeFromTimer = ref()
const endTimeFromTimer = ref()

const setStartTime = (timeFromTimer: Date) => {
  startTimeFromTimer.value = formatToDatetimeLocal(timeFromTimer)
}

const setEndTime = (timeFromTimer: Date) => {
  endTimeFromTimer.value = formatToDatetimeLocal(timeFromTimer)
}
</script>

<template>
  <div class="flex gap-2 [&>*]:flex-1">
    <CountupTimer @setStartTime="setStartTime" @setEndTime="setEndTime" />
    <CountdownTimer @setStartTime="setStartTime" @setEndTime="setEndTime" />
  </div>
  <TimeBoxEditor :id="'maybethisshouldnotbehere'" :startTimeFromTimer :endTimeFromTimer />
</template>
