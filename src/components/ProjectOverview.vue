<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCollection, useDocument } from 'vuefire'
import { db, timeBoxesCollection } from '@/firebase'
import { doc, type DocumentData } from 'firebase/firestore'

import ProjectOverviewDay from './ProjectOverviewDay.vue'

import { useStore } from '@/stores/store'

import { formatMinutesToHoursAndMinutes } from '@/utils/formatters.ts'

const props = defineProps({
  id: { type: String, required: true },
})

const project = useDocument(doc(db, 'projects', props.id))

const timeBoxes = useCollection(timeBoxesCollection)

const store = useStore()

const projectOverviewDayObjects = ref<DocumentData[][]>([[]])

const sortedProjectTimeBoxes = computed(() => {
  const projectTimeBoxes = timeBoxes.value.filter((timeBox) => timeBox.project === props.id)

  return projectTimeBoxes.slice().sort((a, b) => {
    const aValue = a['startTime']
    const bValue = b['startTime']

    if (!store.sortOrderReversed) {
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
      class="flex h-22 w-full max-w-250 items-center justify-center bg-radial-[at_50%_50%] from-neutral-200 to-slate-300 to-85%"
    >
      <div class="text-center text-3xl font-bold">{{ project?.name }}</div>
      <div
        class="font-data relative top-px ml-4 w-max rounded-md bg-emerald-800 px-1.5 py-0.5 pt-px text-sm tracking-wide text-white"
      >
        {{ projectTimeBoxesTotalDuration() }} hrs
      </div>
    </div>
    <div class="flex-1 overflow-auto px-11 pt-8">
      <ProjectOverviewDay
        v-for="(item, index) in projectOverviewDayObjects"
        :key="index"
        :projectOverviewDayData="item"
      />
    </div>
  </div>
</template>
