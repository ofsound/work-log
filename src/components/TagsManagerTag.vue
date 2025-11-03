<script setup lang="ts">
defineProps({
  name: String,
})
</script>

<template>
  <div class="flex gap-2 border-b-1 py-1">
    <div class="mr-auto font-bold">{{ name }}</div>
    <div>rename</div>
    <div>delete</div>
  </div>
</template>
