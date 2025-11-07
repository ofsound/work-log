<script setup lang="ts">
import { useCollection } from 'vuefire'
import TimeBox from '@/components/TimeBox.vue'
import { timeBoxesCollection } from '@/firebase'

const timeBoxes = useCollection(timeBoxesCollection)
</script>

<template>
  <TimeBox
    v-for="item in timeBoxes"
    :key="item.id"
    :startTime="item.startTime.toDate()"
    :endTime="item.endTime.toDate()"
    :notes="item.notes"
    :project="item.project"
    :tags="item.tags"
    :id="item.id"
  />
</template>
