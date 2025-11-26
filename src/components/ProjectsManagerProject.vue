<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'

import { useRouter } from 'vue-router'

import { doc, deleteDoc, updateDoc } from 'firebase/firestore'

import { db } from '@/firebase'

import DeleteIcon from '@/icons/DeleteIcon.vue'
import EditIcon from '@/icons/EditIcon.vue'

const props = defineProps({
  name: String,
  slug: String,
  id: { type: String, required: true },
})

const router = useRouter()
const myInput: Ref<HTMLInputElement | null> = ref(null)
const dynamicName = ref(props.name)

const isNameEditMode = ref(false)

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
      isNameEditMode.value = false
    }
    console.log('Document deleted with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

const cancelRenameAndLoseFocus = () => {
  if (myInput.value) {
    isNameEditMode.value = false
    myInput.value.blur()
  }
}

const handleBlur = () => {
  dynamicName.value = props.name
}

watch(
  () => isNameEditMode.value,
  (newValue) => {
    if (newValue && myInput.value) {
      myInput.value.focus()
    }
  },
  { flush: 'post' },
)
</script>

<template>
  <div class="flex gap-2 border-b border-black/20 py-1">
    <input
      v-if="isNameEditMode"
      ref="myInput"
      type="text"
      v-model="dynamicName"
      class="flex-1 p-1 font-bold hover:underline focus:bg-white focus:no-underline!"
      @keyup.enter="renameProjectDocument"
      @keyup.esc="cancelRenameAndLoseFocus"
      @blur="handleBlur"
    />
    <button
      v-if="!isNameEditMode"
      @click="router.push(`/project/${slug}`)"
      class="flex-1 cursor-pointer p-1 text-left font-bold"
    >
      {{ dynamicName }}
    </button>
    <button class="cursor-pointer px-1" @click="isNameEditMode = !isNameEditMode">
      <EditIcon />
    </button>
    <button class="cursor-pointer px-1" @click="deleteProjectDocument">
      <DeleteIcon />
    </button>
  </div>
</template>
