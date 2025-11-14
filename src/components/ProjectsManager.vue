<script setup lang="ts">
import { ref, type Ref } from 'vue'

import { useCollection } from 'vuefire'

import slugify from 'slugify'

import { addDoc } from 'firebase/firestore'

import { projectsCollection } from '@/firebase'

import ProjectsManagerProject from './ProjectsManagerProject.vue'

const myInput: Ref<HTMLInputElement | null> = ref(null)

const allProjects = useCollection(projectsCollection)

const newProjectName = ref('')

const createProjectDocument = async () => {
  try {
    const docRef = await addDoc(projectsCollection, {
      name: newProjectName.value,
      slug: slugify(newProjectName.value, { lower: true, strict: true }),
    })
    newProjectName.value = ''
    console.log('Document added with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

const cancelCreateAndLoseFocus = () => {
  newProjectName.value = ''
  if (myInput.value) {
    myInput.value.blur()
  }
}
</script>

<template>
  <div class="my-4 rounded-sm bg-blue-200 px-6 py-4 shadow-md">
    <div class="mb-2 text-center text-xl font-bold uppercase">Projects</div>
    <ProjectsManagerProject
      v-for="item in allProjects"
      :key="item.id"
      :name="item.name"
      :id="item.id"
    />
    <div class="mt-8 flex">
      <input
        ref="myInput"
        class="mr-4 flex-1 bg-white pl-2 font-bold"
        type="text"
        v-model="newProjectName"
        @keyup.enter="createProjectDocument"
        @keyup.esc="cancelCreateAndLoseFocus"
      />
      <button class="w-max rounded-sm border px-2 font-bold" @click="createProjectDocument">
        + New Project
      </button>
    </div>
  </div>
</template>
