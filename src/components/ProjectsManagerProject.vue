<script setup lang="ts">
import { ref } from 'vue'

import type { Ref } from 'vue'

import { doc, deleteDoc, updateDoc } from 'firebase/firestore'

import { db } from '@/firebase'

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
  <div class="flex gap-2 border-b-1 border-black/20 py-1">
    <input
      ref="myInput"
      type="text"
      v-model="dynamicName"
      class="hover: flex-1 p-1 font-bold hover:underline focus:bg-white focus:!no-underline"
      @keyup.enter="renameProjectDocument"
      @keyup.esc="cancelRenameAndLoseFocus"
      @blur="handleBlur"
    />
    <!-- <button @click="renameProjectDocument">rename</button> -->
    <button class="cursor-pointer px-1" @click="deleteProjectDocument">
      <svg
        class="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        ></path>
      </svg>
    </button>
  </div>
</template>
