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
  let computedProjectName: string = ''

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
</script>

<template>
  <div class="my-2 bg-gray-200 p-8">
    <div class="mt-2">{{ startTime }}</div>
    <div class="mt-2">{{ endTime }}</div>
    <div class="mt-2">{{ notes }}</div>
    <div class="mt-2">{{ projectName }}</div>
    <div class="mt-2">{{ tagNames }}</div>
  </div>
</template>
