<script setup lang="ts">
import { ref, type Ref } from 'vue'

import { useCollection } from 'vuefire'

import { addDoc } from 'firebase/firestore'

import { tagsCollection } from '@/firebase'

import TagsManagerTag from './TagsManagerTag.vue'

const myInput: Ref<HTMLInputElement | null> = ref(null)

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

const cancelCreateAndLoseFocus = () => {
  newTagName.value = ''
  if (myInput.value) {
    myInput.value.blur()
  }
}
</script>

<template>
  <div class="my-4 rounded-sm bg-purple-200 px-6 py-4 shadow-md">
    <div class="mb-2 text-center text-xl font-bold uppercase">Tags</div>
    <TagsManagerTag v-for="item in allTags" :key="item.id" :name="item.name" :id="item.id" />
    <div class="mt-8 flex">
      <input
        ref="myInput"
        class="mr-4 flex-1 bg-white pl-2 font-bold"
        type="text"
        v-model="newTagName"
        @keyup.enter="createTagDocument"
        @keyup.esc="cancelCreateAndLoseFocus"
      />
      <button class="w-max rounded-sm border px-2 font-bold" @click="createTagDocument">
        + New Tag
      </button>
    </div>
  </div>
</template>
