<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCollection, useDocument } from 'vuefire'
import { db, timeBoxesCollection } from '@/firebase'
import { doc, type DocumentData } from 'firebase/firestore'

import TagOverviewDay from './TagOverviewDay.vue'

import { formatMinutesToHoursAndMinutes } from '@/utils/formatters.ts'

const props = defineProps({
  id: { type: String, required: true },
})

const tag = useDocument(doc(db, 'tags', props.id))

const timeBoxes = useCollection(timeBoxesCollection)

const sortDirection = ref('asc')

const tagOverviewDayObjects = ref<DocumentData[][]>([[]])

const sortedTagTimeBoxes = computed(() => {
  const tagTimeBoxes = timeBoxes.value.filter((timeBox) => {
    return timeBox.tags.some((item: string) => item === props.id)
  })

  return tagTimeBoxes.slice().sort((a, b) => {
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

const tagTimeBoxesTotalDuration = () => {
  let tagTotalDuration = 0

  const tagTimeBoxes = timeBoxes.value.filter((timeBox) => {
    return timeBox.tags.some((item: string) => item === props.id)
  })

  tagTimeBoxes.forEach((timeBox: DocumentData) => {
    if (timeBox.endTime && timeBox.startTime) {
      const timeBoxDuration =
        (timeBox.endTime.toDate().valueOf() - timeBox.startTime.toDate().valueOf()) / 60000
      tagTotalDuration += timeBoxDuration
    }
  })

  const { hours, minutes } = formatMinutesToHoursAndMinutes(tagTotalDuration)

  if (hours > 0) {
    return hours + minutes
  } else {
    return minutes
  }
}

watch(
  () => sortedTagTimeBoxes.value,
  (newValue) => {
    tagOverviewDayObjects.value[0] = <DocumentData[]>[]
    let tagOverviewDayObjectsIndex = -1
    let prevDateString = ''
    newValue.forEach((timeBox) => {
      const timeBoxDateString = timeBox.startTime.toDate().toDateString()

      if (timeBoxDateString !== prevDateString) {
        tagOverviewDayObjectsIndex++
        tagOverviewDayObjects.value[tagOverviewDayObjectsIndex] = []
      }

      prevDateString = timeBoxDateString

      const innerArray = tagOverviewDayObjects.value[tagOverviewDayObjectsIndex]
      innerArray?.push(timeBox)
    })
  },
)
</script>

<template>
  <div class="flex justify-center">
    <div class="mb-10 text-center text-4xl font-bold">{{ tag?.name }}</div>
    <div
      class="font-data relative top-1 mt-1.5 mb-3 ml-4 w-max self-start rounded-md border bg-emerald-800 px-1.5 py-0.5 pt-px text-sm tracking-wide text-white"
    >
      {{ tagTimeBoxesTotalDuration() }} hrs
    </div>
    <div></div>
  </div>
  <TagOverviewDay
    v-for="(item, index) in tagOverviewDayObjects"
    :key="index"
    :tagOverviewDayData="item"
  />
</template>
