<script setup lang="ts">
import { computed } from 'vue'

import { useCollection } from 'vuefire'

import { projectsCollection, tagsCollection } from '@/firebase'

const allProjects = useCollection(projectsCollection)
const allTags = useCollection(tagsCollection)

const props = defineProps({
  startTime: Date,
  endTime: Date,
  notes: String,
  project: String,
  tags: Array,
})

const projectName = computed(() => {
  let computedProjectName = ''

  allProjects.value.forEach((thisProject) => {
    if (thisProject.id === props.project) {
      computedProjectName = thisProject.name
    }
  })

  return computedProjectName
})

const tagNames = computed(() => {
  const computedTagNames: string[] = []

  allTags.value.forEach((thisTag) => {
    props.tags?.forEach((thisPropsTag) => {
      if (thisTag.id === thisPropsTag) {
        computedTagNames.push(thisTag.name)
      }
    })
  })

  return computedTagNames
})

const timeBoxDuration = computed(() => {
  let durationString = 0

  if (props.endTime && props.startTime) {
    durationString = (props.endTime.valueOf() - props.startTime.valueOf()) / 60000
  }

  return durationString
})

const startDayFormatted = computed(() => {
  return props.startTime?.toLocaleDateString([], {
    weekday: 'short',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  })
})

const startTimeFormatted = computed(() => {
  return props.startTime?.toLocaleTimeString([], {
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const endTimeFormatted = computed(() => {
  return props.endTime?.toLocaleTimeString([], {
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
  })
})
</script>

<template>
  <div class="my-2 bg-gray-200 p-4">
    <div class="mt-2">{{ timeBoxDuration }}</div>
    <div class="mt-2">{{ startDayFormatted }}</div>
    <div class="mt-2">{{ startTimeFormatted }} – {{ endTimeFormatted }}</div>
    <div class="mt-2">{{ notes }}</div>
    <div class="mt-2">{{ projectName }}</div>
    <div class="mt-2">
      <div v-for="thisTag in tagNames" :key="thisTag">{{ thisTag }}</div>
    </div>
  </div>
</template>
