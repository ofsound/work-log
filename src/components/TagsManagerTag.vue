<script setup lang="ts">
import { doc, deleteDoc } from 'firebase/firestore'

import { db } from '@/firebase'

const props = defineProps({
  name: String,
  id: { type: String, required: true },
})

const deleteTagDocument = async () => {
  try {
    const docRef = doc(db, 'tags', props.id)
    await deleteDoc(docRef)
    console.log('Document deleted with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}
</script>

<template>
  <div class="flex gap-2 border-b-1 py-1">
    <div class="mr-auto font-bold">{{ name }}</div>
    <div>rename</div>
    <div @click="deleteTagDocument">delete</div>
  </div>
</template>
