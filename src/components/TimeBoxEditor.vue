<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  id: String,
  startTimeFromTimer: String,
  endTimeFromTimer: String,
})

const emit = defineEmits(['toggleEditor'])

import { doc, updateDoc, addDoc, Timestamp, type DocumentReference } from 'firebase/firestore'

import { useCollection, useDocument } from 'vuefire'

import { db, timeBoxesCollection, projectsCollection, tagsCollection } from '@/firebase'

import { formatToDatetimeLocal } from '@/utils/formatters.ts'

const allProjects = useCollection(projectsCollection)
const allTags = useCollection(tagsCollection)

const dynamicStartTime = ref('')
const dynamicEndTime = ref('')
const dynamicNotes = ref('')
const dynamicProject = ref('')
const dynamicTags = ref([])

const dynamicDuration = ref()

let timeBoxRef: DocumentReference

if (props.id) {
  timeBoxRef = doc(db, 'timeBoxes', props.id)
  const docBinding = useDocument(timeBoxRef)

  const timeBox = docBinding.data

  docBinding.promise.value
    .then(() => {
      if (timeBox.value) {
        dynamicNotes.value = timeBox.value.notes
        dynamicStartTime.value = formatToDatetimeLocal(timeBox.value.startTime.toDate())
        dynamicEndTime.value = formatToDatetimeLocal(timeBox.value.endTime.toDate())
        dynamicProject.value = timeBox.value.project
        dynamicTags.value = timeBox.value.tags
      }
    })
    .catch((error) => {
      console.error('Error loading document:', error)
    })
}

const updateTimeBoxDocument = async () => {
  const confirmed = window.confirm(`Are you sure you want to update this Time Box?`)

  if (confirmed) {
    try {
      await updateDoc(timeBoxRef, {
        startTime: Timestamp.fromDate(new Date(dynamicStartTime.value)),
        endTime: Timestamp.fromDate(new Date(dynamicEndTime.value)),
        notes: dynamicNotes.value,
        project: dynamicProject.value,
        tags: dynamicTags.value,
      })
      emit('toggleEditor')
      console.log('Document updated with ID: ', timeBoxRef.id)
    } catch (e) {
      console.error('Error updating document: ', e)
    }
  } else {
    emit('toggleEditor')
    console.log('Update cancelled.')
  }
}

const createTimeBoxDocument = async () => {
  if (
    dynamicStartTime.value &&
    dynamicEndTime.value &&
    dynamicNotes.value &&
    dynamicProject.value &&
    dynamicTags.value
  ) {
    try {
      const docRef = await addDoc(timeBoxesCollection, {
        startTime: Timestamp.fromDate(new Date(dynamicStartTime.value)),
        endTime: Timestamp.fromDate(new Date(dynamicEndTime.value)),
        notes: dynamicNotes.value,
        project: dynamicProject.value,
        tags: dynamicTags.value,
      })
      console.log('Document added with ID: ', docRef.id)
      resetTimeBoxEditor()
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  } else {
    console.error("A field in the TimeBox isn't filled out.")
  }
}

const resetTimeBoxEditor = () => {
  dynamicStartTime.value = ''
  dynamicEndTime.value = ''
  dynamicDuration.value = ''
  dynamicProject.value = ''
  dynamicNotes.value = ''
  dynamicTags.value = []
}

const timeBoxDuration = () => {
  const date1 = new Date(dynamicStartTime.value)
  const date2 = new Date(dynamicEndTime.value)

  const differenceInMilliseconds = date2.getTime() - date1.getTime()
  const differenceInMinutes = differenceInMilliseconds / (1000 * 60)

  return differenceInMinutes
}

watch(
  () => props.startTimeFromTimer,
  (newValue) => {
    if (newValue) {
      dynamicStartTime.value = newValue
    } else {
      dynamicStartTime.value = ''
    }
  },
)

watch(
  () => props.endTimeFromTimer,
  (newValue) => {
    if (newValue) {
      dynamicEndTime.value = newValue
    } else {
      dynamicEndTime.value = ''
    }
  },
)

watch(
  () => [dynamicStartTime.value, dynamicEndTime.value],
  () => {
    if (dynamicStartTime.value && dynamicEndTime.value) {
      dynamicDuration.value = timeBoxDuration()
    }
  },
)

watch(
  () => dynamicDuration.value,
  () => {
    const tempDate = new Date(dynamicStartTime.value)
    tempDate.setMinutes(tempDate.getMinutes() + Number(dynamicDuration.value))
    dynamicEndTime.value = formatToDatetimeLocal(tempDate)
  },
)

const handleEscape = (event: { key: string }) => {
  if (event.key === 'Escape') {
    emit('toggleEditor')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <div
    class="font-data my-4 rounded-sm border border-gray-400/20 bg-amber-100 px-6 py-4 shadow-md grayscale-10 *:my-2"
  >
    <div class="flex gap-15">
      <input
        class="font-data relative h-max w-21.5 rounded-sm border border-gray-400 bg-white px-2.5 py-1 text-right text-4xl font-bold tabular-nums"
        v-model="dynamicDuration"
      />
      <div class="flex flex-col gap-1">
        <div class="flex">
          <div class="w-18 font-bold">Start:</div>
          <input type="datetime-local" v-model="dynamicStartTime" class="font-data" />
        </div>
        <div class="flex">
          <div class="w-18 font-bold">End:</div>
          <input type="datetime-local" v-model="dynamicEndTime" />
        </div>
      </div>
    </div>
    <div class="flex py-4">
      <textarea
        class="w-full rounded-sm border border-gray-400 bg-white p-2"
        rows="5"
        placeholder="Enter notes here..."
        v-model="dynamicNotes"
      ></textarea>
    </div>
    <div class="flex border-b border-gray-200 py-4">
      <div class="w-18 font-bold">Project:</div>
      <div class="project-radio-group">
        <label v-for="thisProject in allProjects" :key="thisProject.id" class="mb-1 block">
          <input
            type="radio"
            v-model="dynamicProject"
            :value="thisProject.id"
            name="projectSelection"
            class="mr-1.5"
          />
          {{ thisProject.name }}
        </label>
      </div>
    </div>
    <div class="flex py-4 pb-1">
      <div class="w-18 font-bold">Tags:</div>
      <div class="flex gap-4">
        <label v-for="thisTag in allTags" :key="thisTag.id" class="flex gap-2">
          <input type="checkbox" :value="thisTag.id" v-model="dynamicTags" />
          {{ thisTag.name }}
        </label>
      </div>
    </div>
    <div v-if="props.id" class="mt-6! flex gap-3">
      <button
        @click="emit('toggleEditor')"
        class="pointer-cursor ml-auto block rounded-md bg-slate-600 px-3 py-1 text-white"
      >
        Cancel
      </button>
      <button
        @click="updateTimeBoxDocument"
        class="pointer-cursor block rounded-md bg-slate-600 px-3 py-1 text-white"
      >
        Update
      </button>
    </div>
  </div>
  <button
    v-if="!props.id"
    @click="createTimeBoxDocument"
    class="w-full cursor-pointer rounded-sm bg-slate-600 p-3 font-bold tracking-wider text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(20,20,20,0.1),0_3px_4px_rgba(80,80,80,0.37)]"
  >
    Log Session
  </button>
</template>
