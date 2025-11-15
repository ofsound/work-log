<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'

import { useCollection } from 'vuefire'

import slugify from 'slugify'

import { addDoc } from 'firebase/firestore'

import { projectsCollection } from '@/firebase'

import ProjectsManagerProject from './ProjectsManagerProject.vue'

const myInput: Ref<HTMLInputElement | null> = ref(null)

const allProjects = useCollection(projectsCollection)

const sortedAllProjects = computed(() => {
  return allProjects.value.slice().sort((a, b) => {
    const aValue = a['name']
    const bValue = b['name']

    if (typeof aValue === 'string') {
      return aValue.localeCompare(bValue)
    }
    return aValue - bValue
  })
})

const newProjectName = ref('')

const createProjectDocument = async () => {
  if (newProjectName.value) {
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
  } else {
    console.error('Name field empty!')
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
  <div class="my-4 rounded-sm border border-gray-400/30 bg-blue-200 px-6 py-4 shadow-md">
    <div class="mb-2 text-center text-xl font-bold uppercase">Projects</div>
    <ProjectsManagerProject
      v-for="item in sortedAllProjects"
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
      <button
        class="pointer-cursor ml-auto block w-max rounded-md bg-slate-600 px-3 py-1 tracking-wide text-white"
        @click="createProjectDocument"
      >
        + Create Project
      </button>
    </div>
  </div>
</template>
