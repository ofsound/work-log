<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCollection } from 'vuefire'
import TimeBox from '@/components/TimeBox.vue'
import { timeBoxesCollection } from '@/firebase'

const props = defineProps({
  id: { type: String, required: true },
})

const timeBoxes = useCollection(timeBoxesCollection)

const sortDirection = ref('asc')

const sortedProjectTimeBoxes = computed(() => {
  const projectTimeBoxes = timeBoxes.value.filter((timeBox) => timeBox.project === props.id)

  return projectTimeBoxes.slice().sort((a, b) => {
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
  <TimeBox v-for="item in sortedProjectTimeBoxes" :key="item.id" :id="item.id" />
</template>
