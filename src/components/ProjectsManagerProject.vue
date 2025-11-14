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

const deleteProjectDocument = async () => {
  const confirmed = window.confirm(`Are you sure you want to delete the project: ${props.name}?`)

  if (confirmed) {
    try {
      const docRef = doc(db, 'projects', props.id)
      await deleteDoc(docRef)
      console.log('Document deleted with ID: ', docRef.id)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  } else {
    console.log('Deletion cancelled.')
  }
}

const renameProjectDocument = async () => {
  try {
    const docRef = doc(db, 'projects', props.id)
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

const handleBlur = () => {
  dynamicName.value = props.name
}
</script>

<template>
  <div class="flex gap-2 border-b border-black/20 py-1">
    <input
      ref="myInput"
      type="text"
      v-model="dynamicName"
      class="hover: flex-1 p-1 font-bold hover:underline focus:bg-white focus:no-underline!"
      @keyup.enter="renameProjectDocument"
      @keyup.esc="cancelRenameAndLoseFocus"
      @blur="handleBlur"
    />
    <button class="cursor-pointer px-1" @click="deleteProjectDocument">
      <DeleteIcon />
    </button>
  </div>
</template>
