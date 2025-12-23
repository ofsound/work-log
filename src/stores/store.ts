import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('store', () => {
  const sortOrderReversed = ref(false)

  return { sortOrderReversed }
})
