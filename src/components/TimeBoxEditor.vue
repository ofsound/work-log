<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
})

import { db, projectsCollection, tagsCollection } from '@/firebase'

import { doc } from 'firebase/firestore'

import { useCollection, useDocument } from 'vuefire'

const allProjects = useCollection(projectsCollection)
const allTags = useCollection(tagsCollection)

const { data: timeBox, promise } = useDocument(doc(db, 'timeBoxes', props.id))

const dynamicStartTime = ref('')
const dynamicEndTime = ref('')
const dynamicNotes = ref('')
const dynamicProject = ref('')
const dynamicTags = ref([])

const formatToDatetimeLocal = (date: Date) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

promise.value
  .then(() => {
    if (timeBox.value) {
      dynamicNotes.value = timeBox.value.notes
      dynamicStartTime.value = formatToDatetimeLocal(timeBox.value.startTime.toDate())
      dynamicEndTime.value = formatToDatetimeLocal(timeBox.value.endTime.toDate())
      dynamicProject.value = timeBox.value.project
      dynamicTags.value = timeBox.value.tags

      console.log(dynamicTags.value)
    }
  })
  .catch((error) => {
    console.error('Error loading document:', error)
  })
</script>

<template>
  <div class="my-4 rounded-sm border border-gray-100 bg-amber-100 px-6 py-4 shadow-md [&>*]:my-2">
    <div class="flex">
      <div class="w-16">Start:</div>
      <input type="datetime-local" placeholder="start" v-model="dynamicStartTime" />
    </div>
    <div class="flex">
      <div class="w-16">End:</div>
      <input type="datetime-local" placeholder="start" v-model="dynamicEndTime" />
    </div>
    <div class="flex border-b-1 border-gray-400 py-4">
      <textarea
        class="w-full rounded-sm border-1 border-gray-800 p-2"
        rows="5"
        placeholder="Enter notes here..."
        v-model="dynamicNotes"
      ></textarea>
    </div>
    <div class="flex border-b-1 border-gray-400 py-4">
      <div class="w-16">Project:</div>
      <select v-model="dynamicProject">
        <option v-for="thisProject in allProjects" :key="thisProject.id" :value="thisProject.id">
          {{ thisProject.name }}
        </option>
      </select>
    </div>
    <div class="flex border-b-1 border-gray-400 py-4">
      <div class="w-16">Tags:</div>

      <span v-for="thisTag in allTags" :key="thisTag.id">
        <label>
          <input class="ml-4" type="checkbox" :value="thisTag.id" v-model="dynamicTags" />
          {{ thisTag.name }}
        </label>
      </span>
    </div>
  </div>
</template>
