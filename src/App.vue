<script setup lang="ts">
import { useCollection } from 'vuefire'

import HeaderBar from '@/components/HeaderBar.vue'
import TimeBox from '@/components/TimeBox.vue'
import TimeBoxAdder from '@/components/TimeBoxAdder.vue'

import { timeBoxesCollection } from '@/firebase'
import ProjectsManager from './components/ProjectsManager.vue'
import TagsManager from './components/TagsManager.vue'

const timeBoxes = useCollection(timeBoxesCollection)
</script>

<template>
  <HeaderBar />
  <div class="px-10 py-4">
    <ProjectsManager />
    <TagsManager />
    <TimeBoxAdder />
    <TimeBox
      v-for="item in timeBoxes"
      :key="item.id"
      :startTime="item.startTime.toDate()"
      :endTime="item.endTime.toDate()"
      :notes="item.notes"
      :project="item.project"
      :tags="item.tags"
    />
  </div>
</template>
