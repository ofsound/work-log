<script setup lang="ts">
import { useCollection } from 'vuefire'

import { tagsCollection } from '@/firebase'

import TagsManagerTag from './TagsManagerTag.vue'

const allTags = useCollection(tagsCollection)
</script>

<template>
  <div class="bg-purple-200 p-4">
    <div class="mb-2 text-center text-xl font-bold uppercase">Tags</div>
    <TagsManagerTag v-for="item in allTags" :key="item.id" :name="item.name" />
  </div>
</template>
