<script setup lang="ts">
import { ref } from 'vue'

import { useCollection } from 'vuefire'

import { addDoc } from 'firebase/firestore'

import { projectsCollection } from '@/firebase'

import ProjectsManagerProject from './ProjectsManagerProject.vue'

const allProjects = useCollection(projectsCollection)

const newProjectName = ref('')

const createProjectDocument = async () => {
  try {
    const docRef = await addDoc(projectsCollection, {
      name: newProjectName.value,
    })
    newProjectName.value = ''
    console.log('Document added with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}
</script>

<template>
  <div class="my-2 bg-blue-200 p-4">
    <div class="mb-2 text-center text-xl font-bold uppercase">Projects</div>
    <ProjectsManagerProject
      v-for="item in allProjects"
      :key="item.id"
      :name="item.name"
      :id="item.id"
    />
    <div class="mt-8 flex">
      <input type="text" v-model="newProjectName" class="mr-4 flex-1 bg-white pl-2 font-bold" />
      <div @click="createProjectDocument" class="w-max rounded-sm border px-1 font-bold">
        + Add New
      </div>
    </div>
  </div>
</template>
