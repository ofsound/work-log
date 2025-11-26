<script setup lang="ts">
import { type DocumentData } from 'firebase/firestore'

import { formatMinutesToHoursAndMinutes } from '@/utils/formatters.ts'

import TimeBox from '@/components/TimeBox.vue'

const props = defineProps<{
  tagOverviewDayData: DocumentData[]
}>()

const dayDuration = () => {
  let dayDuration = 0

  props.tagOverviewDayData.forEach((timeBox) => {
    if (timeBox.endTime && timeBox.startTime) {
      const timeBoxDuration =
        (timeBox.endTime.toDate().valueOf() - timeBox.startTime.toDate().valueOf()) / 60000
      dayDuration += timeBoxDuration
    }
  })

  const { hours, minutes } = formatMinutesToHoursAndMinutes(dayDuration)

  if (hours > 0) {
    return hours + minutes
  } else {
    return minutes
  }
}
</script>

<template>
  <div class="mb-12">
    <div class="font-script px-2 text-4xl font-bold">
      {{
        tagOverviewDayData[0]?.startTime.toDate().toLocaleDateString([], {
          weekday: 'long',
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
        })
      }}
    </div>
    <div
      class="font-data mt-1.5 mr-2 mb-3 ml-2.5 w-max rounded-md border bg-emerald-800 px-1.5 py-0.5 pt-px text-sm tracking-wide text-white"
    >
      {{ dayDuration() }} hrs
    </div>
    <div
      class="relative my-4 rounded-sm border border-gray-400/20 bg-gray-100 px-6 pt-6 pb-3.5 shadow-md"
    >
      <TimeBox v-for="item in tagOverviewDayData" :key="item.id" :id="item.id" variant="tag" />
    </div>
  </div>
</template>
