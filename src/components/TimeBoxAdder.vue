<script setup lang="ts">
import { ref } from 'vue'

import { addDoc, Timestamp } from 'firebase/firestore'
import { allProjects, allTags, timeBoxesCollection } from '@/firebase'

const startTime = ref()
const endTime = ref()
const notes = ref()
const project = ref()
const tags = ref([])

const clickHandler = () => {
  createDocument()
  // console.log('create a new timeBox in Firestore')
}

async function createDocument() {
  try {
    // Get a reference to the collection
    // const colRef = collection(db, 'your_collection_name')
    // Use addDoc to create a new document with an auto-generated ID

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
  <div class="my-2 bg-gray-200 p-8">
    <div>startTime: <input type="date" v-model="startTime" placeholder="start" /></div>
    <div>endTime: <input type="date" v-model="endTime" placeholder="start" /></div>
    <div>notes: <textarea v-model="notes" class="w-full"></textarea></div>
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
      <div v-for="thisTag in allTags" :key="thisTag.id">
        {{ thisTag.name }}
        <input type="checkbox" :value="thisTag.id" v-model="tags" />
      </div>
    </div>
    <button @click="clickHandler" class="mt-2 border border-black bg-green-300 p-2">Submit</button>
  </div>
</template>
