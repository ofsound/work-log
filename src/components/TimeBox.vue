<script setup lang="ts">
import { ref } from 'vue'

import TimeBoxViewer from '@/components/TimeBoxViewer.vue'
import TimeBoxEditor from '@/components/TimeBoxEditor.vue'

defineProps({
  id: { type: String, required: true },
})

const showEditor = ref(false)

const toggleEditor = () => {
  showEditor.value = !showEditor.value
}
</script>

<template>
  <TimeBoxViewer v-if="!showEditor" @toggleEditor="toggleEditor" :id />
  <TimeBoxEditor v-if="showEditor" @toggleEditor="toggleEditor" :id />
</template>
