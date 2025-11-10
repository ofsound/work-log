<script setup lang="ts">
import { computed, ref } from 'vue'

import { useCollection } from 'vuefire'
import TimeBox from '@/components/TimeBox.vue'
import { timeBoxesCollection } from '@/firebase'

const timeBoxes = useCollection(timeBoxesCollection)

const sortDirection = ref('desc')

const sortedTimeBoxes = computed(() => {
  return timeBoxes.value.slice().sort((a, b) => {
    const aValue = a['startTime']
    const bValue = b['startTime']

    if (sortDirection.value === 'asc') {
      if (typeof aValue === 'string') {
        return aValue.localeCompare(bValue)
      }
      return aValue - bValue
    } else {
      if (typeof aValue === 'string') {
        return bValue.localeCompare(aValue)
      }
      return bValue - aValue
    }
  })
})
</script>

<template>
  <TimeBox v-for="item in sortedTimeBoxes" :key="item.id" :id="item.id" />
</template>
