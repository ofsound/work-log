<script setup lang="ts">
import { useCollection } from 'vuefire'

import { projectsCollection } from '@/firebase'
import ProjectsManagerProject from './ProjectsManagerProject.vue'

const allProjects = useCollection(projectsCollection)
</script>

<template>
  <div class="my-2 bg-blue-200 p-4">
    <div class="mb-2 text-center text-xl font-bold uppercase">Projects</div>
    <ProjectsManagerProject v-for="item in allProjects" :key="item.id" :name="item.name" />
    <div class="mt-4 w-max rounded-sm border px-1 font-bold">+ Add New</div>
  </div>
</template>
