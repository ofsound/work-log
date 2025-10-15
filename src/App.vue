<script setup lang="ts">
// import TimeBox from '@/components/TimeBox.vue'

import { useFirestore, useDocument } from 'vuefire'
import { doc } from 'firebase/firestore'
import { computed } from 'vue'
const db = useFirestore()

const documentRef = doc(db, 'timeBoxes', 'VAf71LyyajX9g3Ga4jB8')

const documentData = useDocument(documentRef)

const testData = computed(() => documentData.value?.notes)
</script>

<template>
  <h1 class="text-4xl">Work Log</h1>
  <p class="mt-4">Show TimeBoxes from Firestore:</p>
  <p>
    {{ testData }}
  </p>

  <!-- <TimeBox v-for="n in 5" :key="n" /> -->
</template>
