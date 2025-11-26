<script setup lang="ts">
import { useCollection } from 'vuefire'

import { collection, query, where, limit } from 'firebase/firestore'

import { db } from '@/firebase'

import TagOverview from '@/components/TagOverview.vue'

const props = defineProps({
  slug: String,
})

const postQuery = query(collection(db, 'tags'), where('slug', '==', props.slug), limit(1))

const tag = useCollection(postQuery, { ssrKey: 'slugCompare' })
</script>

<template>
  <TagOverview v-if="tag[0]" :id="tag[0].id" :key="tag[0].id" />
</template>
