<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCollection, useDocument } from 'vuefire'
import { db, timeBoxesCollection } from '@/firebase'
import { doc, type DocumentData } from 'firebase/firestore'

import ProjectOverviewDay from './ProjectOverviewDay.vue'

import { formatMinutesToHoursAndMinutes } from '@/utils/formatters.ts'

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

const projectTimeBoxesTotalDuration = () => {
  let projectTotalDuration = 0

  const projectTimeBoxes = timeBoxes.value.filter((timeBox) => timeBox.project === props.id)

  projectTimeBoxes.forEach((timeBox: DocumentData) => {
    if (timeBox.endTime && timeBox.startTime) {
      const timeBoxDuration =
        (timeBox.endTime.toDate().valueOf() - timeBox.startTime.toDate().valueOf()) / 60000
      projectTotalDuration += timeBoxDuration
    }
  })

  const { hours, minutes } = formatMinutesToHoursAndMinutes(projectTotalDuration)

  if (hours > 0) {
    return hours + minutes
  } else {
    return minutes
  }
}

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
  <div class="flex h-full min-h-0 flex-col">
    <div
      class="flex h-30 w-full max-w-250 justify-center bg-radial-[at_45%_25%] from-neutral-200 to-slate-400 to-75%"
    >
      <div class="mb-10 text-center text-4xl font-bold">{{ project?.name }}</div>
      <div
        class="font-data relative top-1 mt-1.5 mb-3 ml-4 w-max self-start rounded-md border bg-emerald-800 px-1.5 py-0.5 pt-px text-sm tracking-wide text-white"
      >
        {{ projectTimeBoxesTotalDuration() }} hrs
      </div>
    </div>
    <div class="flex-1 overflow-auto px-11">
      <ProjectOverviewDay
        v-for="(item, index) in projectOverviewDayObjects"
        :key="index"
        :projectOverviewDayData="item"
      />
    </div>
  </div>
</template>
