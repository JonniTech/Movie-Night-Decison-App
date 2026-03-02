<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export interface Mood {
  id: string
  label: string
  emoji: string
}

const moods: Mood[] = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'excited', label: 'Excited', emoji: '😱' },
  { id: 'romantic', label: 'Romantic', emoji: '💖' },
  { id: 'thoughtful', label: 'Thoughtful', emoji: '🧠' },
]

defineProps<{
  modelValue: string | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()
</script>

<template>
  <section class="space-y-8 flex flex-col items-center w-full">
    <div class="space-y-1 text-center">
      <h2 class="text-2xl font-extrabold tracking-tight sm:text-3xl">How's the vibe?</h2>
      <p class="text-muted-foreground text-sm font-medium opacity-70">Step 1: Set the emotional context</p>
    </div>
    
    <ToggleGroup 
      type="single" 
      :model-value="modelValue" 
      @update:model-value="(val) => emit('update:modelValue', Array.isArray(val) ? String(val[0]) : (val ? String(val) : undefined))"
      class="flex flex-wrap justify-center gap-3 sm:gap-4 w-full"
    >
      <ToggleGroupItem 
        v-for="mood in moods" 
        :key="mood.id" 
        :value="mood.id"
        class="group relative h-28 w-28 sm:h-32 sm:w-32 flex flex-col gap-3 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-accent/50 data-[state=on]:bg-primary/5 data-[state=on]:border-primary data-[state=on]:ring-1 data-[state=on]:ring-primary/20"
        variant="outline"
      >
        <span class="text-3xl sm:text-4xl transition-transform duration-500 group-hover:scale-125 group-data-[state=on]:scale-110">
          {{ mood.emoji }}
        </span>
        <span class="text-[11px] font-bold group-data-[state=on]:text-primary">
          {{ mood.label }}
        </span>
        
        <!-- Selection Glow -->
        <div v-if="modelValue === mood.id" class="absolute inset-0 rounded-2xl bg-primary/5 shadow-inner"></div>
      </ToggleGroupItem>
    </ToggleGroup>
  </section>
</template>
