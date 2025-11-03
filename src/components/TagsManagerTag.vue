<script setup lang="ts">
defineProps({
  name: String,
})
</script>

<template>
  <div class="flex gap-2">
    <div class="font-bold">{{ name }}</div>
    <div>rename</div>
    <div>delete, are you very sure</div>
  </div>
</template>
