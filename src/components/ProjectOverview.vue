<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCollection, useDocument } from 'vuefire'
import { db, timeBoxesCollection } from '@/firebase'
import { doc, type DocumentData } from 'firebase/firestore'

import ProjectOverviewDay from './ProjectOverviewDay.vue'

const props = defineProps({
  id: { type: String, required: true },
})

const project = useDocument(doc(db, 'projects', props.id))

const timeBoxes = useCollection(timeBoxesCollection)

const sortDirection = ref('asc')

const projectOverviewDayObjects = ref<DocumentData[][]>([[]])

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

watch(
  () => sortedProjectTimeBoxes.value,
  (newValue) => {
    projectOverviewDayObjects.value[0] = <DocumentData[]>[]
    let projectOverviewDayObjectsIndex = -1
    let prevDateString = ''
    newValue.forEach((timeBox) => {
      const timeBoxDateString = timeBox.startTime.toDate().toDateString()

      if (timeBoxDateString !== prevDateString) {
        projectOverviewDayObjectsIndex++
        projectOverviewDayObjects.value[projectOverviewDayObjectsIndex] = []
      }

      prevDateString = timeBoxDateString

      const innerArray = projectOverviewDayObjects.value[projectOverviewDayObjectsIndex]
      innerArray?.push(timeBox)
    })
  },
)
</script>

<template>
  <div class="mb-10 text-center text-4xl font-bold">{{ project?.name }}</div>
  <ProjectOverviewDay
    v-for="(item, index) in projectOverviewDayObjects"
    :key="index"
    :projectOverviewDayData="item"
  />
</template>
