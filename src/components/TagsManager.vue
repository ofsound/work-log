<script setup lang="ts">
import { ref } from 'vue'

import { useCollection } from 'vuefire'

import { addDoc } from 'firebase/firestore'

import { tagsCollection } from '@/firebase'

import TagsManagerTag from './TagsManagerTag.vue'

const allTags = useCollection(tagsCollection)

const newTagName = ref('')

const createTagDocument = async () => {
  try {
    const docRef = await addDoc(tagsCollection, {
      name: newTagName.value,
    })
    newTagName.value = ''
    console.log('Document added with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}
</script>

<template>
  <div class="my-2 bg-purple-200 p-4">
    <div class="mb-2 text-center text-xl font-bold uppercase">Tags</div>
    <TagsManagerTag v-for="item in allTags" :key="item.id" :name="item.name" :id="item.id" />
    <div class="mt-8 flex">
      <input type="text" v-model="newTagName" class="mr-4 flex-1 bg-white pl-2 font-bold" />
      <div @click="createTagDocument" class="w-max rounded-sm border px-1 font-bold">+ Add New</div>
    </div>
  </div>
</template>
