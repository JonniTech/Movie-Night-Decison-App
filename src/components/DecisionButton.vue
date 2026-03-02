<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-vue-next'

defineProps<{
  disabled: boolean
  loading: boolean
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <div class="flex justify-center w-full mt-8">
    <Button 
      size="lg" 
      :disabled="disabled || loading" 
      @click="emit('click')"
      class="w-full sm:w-auto min-w-[240px] h-14 text-base font-semibold rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 bg-primary text-white border-0"
    >
      <Loader2 v-if="loading" class="mr-2 h-5 w-5 animate-spin" />
      <Sparkles v-else class="mr-2 h-5 w-5" />
      {{ loading ? 'Finding the perfect movies...' : 'Decide Movie Night' }}
    </Button>
  </div>
</template>
