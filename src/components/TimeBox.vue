<script setup lang="ts">
import TimeBoxViewer from '@/components/TimeBoxViewer.vue'
import TimeBoxEditor from '@/components/TimeBoxEditor.vue'

defineProps({
  id: { type: String, required: true },
})
</script>

<template>
  <TimeBoxViewer :id />
  <TimeBoxEditor :id />
</template>
