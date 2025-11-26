<script setup lang="ts">
import { ref } from 'vue'

import TimeBoxViewer from '@/components/TimeBoxViewer.vue'
import TimeBoxEditor from '@/components/TimeBoxEditor.vue'

const props = defineProps({
  id: { type: String, required: true },
  variant: String,
})

const showEditor = ref(false)

const isMinimized = ref(false)

if (props.variant === 'project' || props.variant === 'tag') {
  isMinimized.value = true
}

const toggleEditor = () => {
  showEditor.value = !showEditor.value
}
</script>

<template>
  <TimeBoxViewer v-if="!showEditor" @toggleEditor="toggleEditor" :id :variant :isMinimized />
  <TimeBoxEditor v-if="showEditor" @toggleEditor="toggleEditor" :id />
</template>
