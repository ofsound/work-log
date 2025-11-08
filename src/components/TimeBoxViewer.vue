<script setup lang="ts">
import { computed } from 'vue'

import { db, projectsCollection, tagsCollection } from '@/firebase'

import { doc, deleteDoc } from 'firebase/firestore'

import { useCollection, useDocument } from 'vuefire'

const props = defineProps({
  id: { type: String, required: true },
})

const emit = defineEmits(['toggleEditor'])

const allProjects = useCollection(projectsCollection)
const allTags = useCollection(tagsCollection)

const timeBox = useDocument(doc(db, 'timeBoxes', props.id))

const projectName = computed(() => {
  let computedProjectName = ''

  allProjects.value.forEach((thisProject) => {
    if (thisProject.id === timeBox.value?.project) {
      computedProjectName = thisProject.name
    }
  })
  return computedProjectName
})

const tagNames = computed(() => {
  const computedTagNames: string[] = []

  allTags.value.forEach((thisTag) => {
    timeBox.value?.tags?.forEach((thisPropsTag: string) => {
      if (thisTag.id === thisPropsTag) {
        computedTagNames.push(thisTag.name)
      }
    })
  })

  return computedTagNames
})

const timeBoxDuration = computed(() => {
  let durationString = 0

  if (timeBox.value?.endTime && timeBox.value?.startTime) {
    durationString =
      (timeBox.value?.endTime.toDate().valueOf() - timeBox.value?.startTime.toDate().valueOf()) /
      60000
  }
  return durationString + 'm'
})

const startDayFormatted = computed(() => {
  return timeBox.value?.startTime.toDate().toLocaleDateString([], {
    weekday: 'short',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  })
})

const startTimeFormatted = computed(() => {
  return timeBox.data.value?.startTime.toDate().toLocaleTimeString([], {
    hourCycle: 'h12',
    hour: 'numeric',
    minute: '2-digit',
  })
})

const endTimeFormatted = computed(() => {
  return timeBox.value?.endTime.toDate().toLocaleTimeString([], {
    hourCycle: 'h12',
    hour: 'numeric',
    minute: '2-digit',
  })
})

const deleteTimeBoxDocument = async () => {
  const confirmed = window.confirm(`Are you sure you want to delete this Session?`)

  if (confirmed) {
    try {
      const docRef = doc(db, 'timeBoxes', props.id)
      await deleteDoc(docRef)
      console.log('Document deleted with ID: ', docRef.id)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  } else {
    console.log('Deletion cancelled.')
  }
}
</script>

<template>
  <div class="relative my-4 rounded-sm bg-gray-200 px-6 py-4 shadow-md">
    <button @click="emit('toggleEditor')" class="absolute right-4 bottom-3 cursor-pointer px-1">
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="currentColor"
          d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z"
        />
      </svg>
    </button>
    <button @click="deleteTimeBoxDocument" class="absolute right-4 cursor-pointer px-1">
      <svg
        class="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        ></path>
      </svg>
    </button>
    <div class="flex items-baseline gap-2 border-b-1 pb-2">
      <div class="w-max rounded-sm text-2xl font-bold">
        {{ timeBoxDuration }}
      </div>
      <div class="relative -top-0.5 font-bold">–</div>
      <div class="relative -top-px text-xl font-bold">{{ projectName }}</div>
    </div>
    <div class="mt-4">{{ startDayFormatted }}</div>
    <div class="mt-1">{{ startTimeFormatted }} – {{ endTimeFormatted }}</div>
    <div class="my-5">{{ timeBox?.notes }}</div>
    <div class="flex gap-2">
      <div
        v-for="thisTag in tagNames"
        :key="thisTag"
        class="rounded-xl bg-gray-300 px-3 py-0.5 text-sm"
      >
        {{ thisTag }}
      </div>
    </div>
  </div>
</template>
