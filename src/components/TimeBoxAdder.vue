<script setup lang="ts">
import { ref } from 'vue'

import { addDoc, Timestamp } from 'firebase/firestore'
import { useCollection } from 'vuefire'

import { projectsCollection, tagsCollection, timeBoxesCollection } from '@/firebase'

const allProjects = useCollection(projectsCollection)
const allTags = useCollection(tagsCollection)

const startTime = ref()
const endTime = ref()
const notes = ref()
const project = ref()
const tags = ref([])

const clickHandler = () => {
  createDocument()
}

async function createDocument() {
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
</script>

<template>
  <div class="my-2 bg-amber-100 p-8 [&>*]:my-2">
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
    <button @click="clickHandler" class="mt-6 bg-black p-2 text-white">Submit</button>
  </div>
</template>
