<script setup lang="ts">
import { ref } from 'vue'

import type { Ref } from 'vue'

import { doc, deleteDoc, updateDoc } from 'firebase/firestore'

import { db } from '@/firebase'

import DeleteIcon from '@/icons/DeleteIcon.vue'

const myInput: Ref<HTMLInputElement | null> = ref(null)

const props = defineProps({
  name: String,
  id: { type: String, required: true },
})

const dynamicName = ref(props.name)

const deleteTagDocument = async () => {
  const confirmed = window.confirm(`Are you sure you want to delete the tag: ${props.name}?`)

  if (confirmed) {
    try {
      const docRef = doc(db, 'tags', props.id)
      await deleteDoc(docRef)
      console.log('Document deleted with ID: ', docRef.id)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  } else {
    console.log('Deletion cancelled.')
  }
}

const renameTagDocument = async () => {
  try {
    const docRef = doc(db, 'tags', props.id)
    await updateDoc(docRef, { name: dynamicName.value })
    if (myInput.value) {
      myInput.value.blur()
    }
    console.log('Document deleted with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

const cancelRenameAndLoseFocus = () => {
  if (myInput.value) {
    myInput.value.blur()
  }
}

const resetNameToSaved = () => {
  dynamicName.value = props.name
}
</script>

<template>
  <div class="flex gap-2 border-b-1 border-black/20 py-1">
    <input
      ref="myInput"
      type="text"
      v-model="dynamicName"
      class="flex-1 p-1 font-bold hover:underline focus:bg-white focus:!no-underline"
      @keyup.enter="renameTagDocument"
      @keyup.esc="cancelRenameAndLoseFocus"
      @blur="resetNameToSaved"
    />
    <button class="cursor-pointer px-1" @click="deleteTagDocument">
      <DeleteIcon />
    </button>
  </div>
</template>
