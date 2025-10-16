<script setup lang="ts">
import { useCollection } from 'vuefire'

import TimeBox from '@/components/TimeBox.vue'
import TimeBoxAdder from '@/components/TimeBoxAdder.vue'

import { timeBoxesCollection } from '@/firebase'

const timeBoxes = useCollection(timeBoxesCollection)
</script>

<template>
  <h1 class="text-4xl">Work Log</h1>
  <TimeBox
    v-for="item in timeBoxes"
    :key="item.id"
    :startTime="item.startTime.toDate()"
    :endTime="item.endTime.toDate()"
    :notes="item.notes"
    :project="item.project"
    :tags="item.tags"
  />
  <TimeBoxAdder />
</template>
