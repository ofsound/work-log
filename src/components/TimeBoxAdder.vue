<script setup lang="ts">
import { ref } from 'vue'

import { allProjects, allTags } from '@/firebase'

const startTime = ref()
const endTime = ref()
const notes = ref()
const projectName = ref()
const tagNames = ref([])

const clickHandler = () => {
  console.log('create a new timeBox in Firestore')
}
</script>

<template>
  <div class="my-2 bg-gray-200 p-8">
    <div>startTime: <input type="date" v-model="startTime" placeholder="start" /></div>
    <div>endTime: <input type="date" v-model="endTime" placeholder="start" /></div>
    <div>notes: <textarea v-model="notes" class="w-full"></textarea></div>
    <div>
      projectName:
      <select v-model="projectName">
        <option v-for="thisProject in allProjects" :key="thisProject.id" :value="thisProject.id">
          {{ thisProject.name }}
        </option>
      </select>
    </div>
    <div>
      tagNames:
      <div v-for="thisTag in allTags" :key="thisTag.id">
        {{ thisTag.name }}
        <input type="checkbox" :value="thisTag.id" v-model="tagNames" />
      </div>
    </div>
    <button @click="clickHandler" class="mt-2 border border-black bg-green-300 p-2">Submit</button>
  </div>
</template>
