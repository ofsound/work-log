<script setup lang="ts">
import { computed } from 'vue'

import { db, projectsCollection, tagsCollection } from '@/firebase'

import { doc, deleteDoc } from 'firebase/firestore'

import { useCollection, useDocument } from 'vuefire'

import DeleteIcon from '@/icons/DeleteIcon.vue'

import EditIcon from '@/icons/EditIcon.vue'

const props = defineProps({
  id: { type: String, required: true },
  variant: String,
  isMinimized: Boolean,
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
  <div
    v-if="!isMinimized"
    class="relative my-4 rounded-sm border border-gray-400/20 bg-slate-100 px-6 py-4 shadow-md"
  >
    <button @click="emit('toggleEditor')" class="absolute right-4 bottom-3 cursor-pointer px-1">
      <EditIcon />
    </button>
    <button @click="deleteTimeBoxDocument" class="absolute right-4 cursor-pointer px-1">
      <DeleteIcon />
    </button>
    <div class="flex items-baseline gap-2 border-b pb-2">
      <div class="w-max rounded-sm text-2xl font-bold">
        {{ timeBoxDuration }}
      </div>
      <div v-if="variant !== 'project'" class="flex items-baseline gap-2">
        <div class="relative -top-0.5 font-bold">–</div>
        <div class="relative -top-px text-xl font-bold">{{ projectName }}</div>
      </div>
    </div>
    <div class="font-data mt-3">{{ startDayFormatted }}</div>
    <div class="font-data mt-px text-sm italic">
      {{ startTimeFormatted }} &mdash; {{ endTimeFormatted }}
    </div>
    <div class="font-data my-5">{{ timeBox?.notes }}</div>
    <div class="flex gap-2">
      <div
        v-for="thisTag in tagNames"
        :key="thisTag"
        class="font-data rounded-xl bg-gray-300 px-3 py-0.5 text-sm"
      >
        <div class="relative -top-px">{{ thisTag }}</div>
      </div>
    </div>
  </div>
  <div
    v-if="isMinimized"
    class="mb-2.5 items-baseline gap-2 border-b border-gray-200 last:border-0"
  >
    <div v-if="variant !== 'project'" class="font-bold">{{ projectName }}</div>
    <div class="font-data pb-2">
      {{ timeBox?.notes }}
      <span class="ml-2 text-xs font-bold italic"
        ><span class="text-gray-400">[</span> {{ timeBoxDuration }}
        <span class="text-gray-400">]</span></span
      >
    </div>
  </div>
</template>
