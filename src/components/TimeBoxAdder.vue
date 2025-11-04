<script setup lang="ts">
import { ref } from 'vue'

import { addDoc, Timestamp } from 'firebase/firestore'
import { useCollection } from 'vuefire'

import { projectsCollection, tagsCollection, timeBoxesCollection } from '@/firebase'

import CountdownTimer from '@/components/CountdownTimer.vue'
import CountupTimer from '@/components/CountupTimer.vue'

const allProjects = useCollection(projectsCollection)
const allTags = useCollection(tagsCollection)

const startTime = ref()
const endTime = ref()
const notes = ref()
const project = ref()
const tags = ref([])

const createTimeBoxDocument = async () => {
  try {
    const docRef = await addDoc(timeBoxesCollection, {
      startTime: Timestamp.fromDate(new Date(startTime.value)),
      endTime: Timestamp.fromDate(new Date(endTime.value)),
      notes: notes.value,
      project: project.value,
      tags: tags.value,
    })
    console.log('Document added with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

const setStartTime = (timeFromTimer: Date) => {
  startTime.value = formatToDatetimeLocal(timeFromTimer)
}

const setEndTime = (timeFromTimer: Date) => {
  endTime.value = formatToDatetimeLocal(timeFromTimer)
}

function formatToDatetimeLocal(date: Date) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}
</script>

<template>
  <div class="flex [&>*]:flex-1">
    <CountupTimer @setStartTime="setStartTime" @setEndTime="setEndTime" />
    <CountdownTimer />
  </div>
  <div class="my-4 rounded-sm border border-gray-100 bg-amber-100 px-6 py-4 shadow-md [&>*]:my-2">
    <div>startTime: <input type="datetime-local" v-model="startTime" placeholder="start" /></div>
    <div>endTime: <input type="datetime-local" v-model="endTime" placeholder="start" /></div>
    <div>notes: <textarea class="w-full border-1 border-black p-2" v-model="notes"></textarea></div>
    <div>
      project:
      <select v-model="project">
        <option v-for="thisProject in allProjects" :key="thisProject.id" :value="thisProject.id">
          {{ thisProject.name }}
        </option>
      </select>
    </div>
    <div>
      tags:
      <span v-for="thisTag in allTags" :key="thisTag.id">
        <label>
          <input class="ml-4" type="checkbox" :value="thisTag.id" v-model="tags" />
          {{ thisTag.name }}
        </label>
      </span>
    </div>
    <button @click="createTimeBoxDocument" class="mt-6 bg-black p-2 text-white">Submit</button>
  </div>
</template>
