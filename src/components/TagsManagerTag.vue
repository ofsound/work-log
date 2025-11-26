<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'

import { useRouter } from 'vue-router'

import { doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { useCollection } from 'vuefire'
import { timeBoxesCollection } from '@/firebase'

import { type DocumentData } from 'firebase/firestore'

import { db } from '@/firebase'

import DeleteIcon from '@/icons/DeleteIcon.vue'
import EditIcon from '@/icons/EditIcon.vue'

import { formatMinutesToHoursAndMinutes } from '@/utils/formatters.ts'

const props = defineProps({
  name: String,
  slug: String,
  id: { type: String, required: true },
})

const timeBoxes = useCollection(timeBoxesCollection)

const router = useRouter()
const myInput: Ref<HTMLInputElement | null> = ref(null)
const dynamicName = ref(props.name)

const isNameEditMode = ref(false)

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

const tagTimeBoxesTotalDuration = () => {
  let tagTotalDuration = 0

  const tagTimeBoxes = timeBoxes.value.filter((timeBox) => {
    return timeBox.tags.some((tagID: string) => tagID === props.id)
  })

  tagTimeBoxes.forEach((timeBox: DocumentData) => {
    if (timeBox.endTime && timeBox.startTime) {
      const timeBoxDuration =
        (timeBox.endTime.toDate().valueOf() - timeBox.startTime.toDate().valueOf()) / 60000
      tagTotalDuration += timeBoxDuration
    }
  })

  const { hours, minutes } = formatMinutesToHoursAndMinutes(tagTotalDuration)

  if (hours > 0) {
    return hours + minutes
  } else {
    return minutes
  }
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
      @keyup.enter="renameTagDocument"
      @keyup.esc="cancelRenameAndLoseFocus"
      @blur="resetNameToSaved"
    />
    <button
      v-if="!isNameEditMode"
      @click="router.push(`/tag/${slug}`)"
      class="flex-1 cursor-pointer p-1 text-left font-bold hover:underline"
    >
      {{ dynamicName }}
    </button>
    <button
      class="font-data relative top-1 mt-1.5 mb-3 ml-4 w-max cursor-pointer self-start rounded-md bg-zinc-100 px-1.5 py-0.5 pt-px text-xs tracking-wide text-black"
    >
      {{ tagTimeBoxesTotalDuration() }} hrs total
    </button>
    <button class="cursor-pointer px-1" @click="isNameEditMode = !isNameEditMode">
      <EditIcon />
    </button>
    <button class="cursor-pointer px-1" @click="deleteTagDocument">
      <DeleteIcon />
    </button>
  </div>
</template>
