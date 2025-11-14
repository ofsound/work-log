<script setup lang="ts">
import { ref } from 'vue'

import TimeBoxViewer from '@/components/TimeBoxViewer.vue'
import TimeBoxEditor from '@/components/TimeBoxEditor.vue'

defineProps({
  id: { type: String, required: true },
  variant: String,
})

const showEditor = ref(false)

const toggleEditor = () => {
  showEditor.value = !showEditor.value
}
</script>

<template>
  <TimeBoxViewer v-if="!showEditor" @toggleEditor="toggleEditor" :id :variant />
  <TimeBoxEditor v-if="showEditor" @toggleEditor="toggleEditor" :id :variant />
</template>
