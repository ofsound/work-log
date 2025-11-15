<script setup lang="ts">
import { type DocumentData } from 'firebase/firestore'

import { formatMinutesToHoursAndMinutes } from '@/utils/formatters.ts'

import TimeBox from '@/components/TimeBox.vue'

const props = defineProps<{
  projectOverviewDayData: DocumentData[]
}>()

const dayDuration = () => {
  let dayDuration = 0

  props.projectOverviewDayData.forEach((timeBox) => {
    if (timeBox.endTime && timeBox.startTime) {
      console.log(timeBox.endTime)

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
        projectOverviewDayData[0]?.startTime.toDate().toLocaleDateString([], {
          weekday: 'long',
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
        })
      }}
    </div>
    <div
      class="font-data mx-2 mt-2 mb-3 w-max rounded-md border bg-neutral-800 px-1.5 py-0.5 text-sm tracking-wide text-white"
    >
      {{ dayDuration() }} hrs
    </div>
    <div
      class="relative my-4 rounded-sm border border-gray-400/20 bg-gray-100 px-4 py-2.5 pt-4 pb-0 shadow-md"
    >
      <TimeBox
        v-for="item in projectOverviewDayData"
        :key="item.id"
        :id="item.id"
        variant="project"
      />
    </div>
  </div>
</template>
