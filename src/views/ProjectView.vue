<script setup lang="ts">
import ProjectOverview from '@/components/ProjectOverview.vue'

defineProps({
  slug: String,
})
</script>

<template>
  <ProjectOverview v-if="slug" :id="slug" />
</template>
