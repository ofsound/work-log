<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  startTimeFromTimer: String,
  endTimeFromTimer: String,
})

// how to handle id or no ID smarter

import { doc, updateDoc, addDoc, Timestamp } from 'firebase/firestore'

import { useCollection, useDocument } from 'vuefire'

import { db, timeBoxesCollection, projectsCollection, tagsCollection } from '@/firebase'

const allProjects = useCollection(projectsCollection)
const allTags = useCollection(tagsCollection)

const timeBoxRef = doc(db, 'timeBoxes', props.id)

const { data: timeBox, promise } = useDocument(timeBoxRef)

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
    }
  })
  .catch((error) => {
    console.error('Error loading document:', error)
  })

const updateTimeBoxDocument = async () => {
  try {
    await updateDoc(timeBoxRef, {
      startTime: Timestamp.fromDate(new Date(dynamicStartTime.value)),
      endTime: Timestamp.fromDate(new Date(dynamicEndTime.value)),
      notes: dynamicNotes.value,
      project: dynamicProject.value,
      tags: dynamicTags.value,
    })
    console.log('Document updated with ID: ', timeBoxRef.id)
  } catch (e) {
    console.error('Error updating document: ', e)
  }
}

const createTimeBoxDocument = async () => {
  try {
    const docRef = await addDoc(timeBoxesCollection, {
      startTime: Timestamp.fromDate(new Date(dynamicStartTime.value)),
      endTime: Timestamp.fromDate(new Date(dynamicEndTime.value)),
      notes: dynamicNotes.value,
      project: dynamicProject.value,
      tags: dynamicTags.value,
    })
    console.log('Document added with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

watch(
  () => props.startTimeFromTimer,
  (newValue) => {
    if (newValue) dynamicStartTime.value = newValue
  },
)

watch(
  () => props.endTimeFromTimer,
  (newValue) => {
    if (newValue) dynamicEndTime.value = newValue
  },
)
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
    <div class="mt-12">
      <button @click="updateTimeBoxDocument">update</button>
    </div>
  </div>
  <button
    @click="createTimeBoxDocument"
    class="w-full rounded-sm bg-gray-400 p-2 font-bold tracking-wide text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(20,20,20,0.1),0_4px_6px_rgba(0,0,0,0.1)]"
  >
    Log Session
  </button>
</template>
