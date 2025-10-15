<script setup lang="ts">
import { useCollection } from 'vuefire'
import { timeBoxesRef } from '@/firebase'

import TimeBox from '@/components/TimeBox.vue'
const timeBoxes = useCollection(timeBoxesRef)
</script>

<template>
  <h1 class="text-4xl">Work Log</h1>
  <TimeBox
    v-for="item in timeBoxes"
    :key="item.id"
    :startTime="item.startTime.toDate()"
    :endTime="item.endTime.toDate()"
    :notes="item.notes"
  />
</template>
