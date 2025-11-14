<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCollection, useDocument } from 'vuefire'
import TimeBox from '@/components/TimeBox.vue'
import { db, timeBoxesCollection } from '@/firebase'
import { doc } from 'firebase/firestore'

const props = defineProps({
  id: { type: String, required: true },
})

const project = useDocument(doc(db, 'projects', props.id))

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
  <div class="mb-10 text-center text-4xl font-bold">{{ project?.name }}</div>
  <TimeBox v-for="item in sortedProjectTimeBoxes" :key="item.id" :id="item.id" variant="project" />
</template>
