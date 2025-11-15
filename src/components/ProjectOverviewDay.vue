<script setup lang="ts">
import { type DocumentData } from 'firebase/firestore'
import TimeBox from '@/components/TimeBox.vue'

defineProps<{
  projectOverviewDayData: DocumentData[]
}>()
</script>

<template>
  {{
    projectOverviewDayData[0]?.startTime.toDate().toLocaleDateString([], {
      weekday: 'short',
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    })
  }}
  <div class="relative my-4 rounded-sm border border-gray-400/20 bg-gray-200 px-6 py-2.5 shadow-md">
    <TimeBox
      v-for="item in projectOverviewDayData"
      :key="item.id"
      :id="item.id"
      variant="project"
    />
  </div>
</template>
