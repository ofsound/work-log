<script setup lang="ts">
import { useCollection } from 'vuefire'

import { collection, query, where, limit } from 'firebase/firestore'

import { db } from '@/firebase'

import ProjectOverview from '@/components/ProjectOverview.vue'

const props = defineProps({
  slug: String,
})

const postQuery = query(collection(db, 'projects'), where('slug', '==', props.slug), limit(1))

const project = useCollection(postQuery, { ssrKey: 'slugCompare' })
</script>

<template>
  <ProjectOverview v-if="project[0]" :id="project[0].id" :key="project[0].id" />
</template>
