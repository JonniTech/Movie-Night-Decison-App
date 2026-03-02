<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { User, Users, Heart } from 'lucide-vue-next'

const contexts = [
  { id: 'alone', label: 'Solo', icon: User },
  { id: 'friends', label: 'Friends', icon: Users },
  { id: 'partner', label: 'Partner', icon: Heart },
]

defineProps<{
  modelValue: string | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()
</script>

<template>
  <section class="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 flex flex-col items-center w-full">
    <div class="space-y-1 text-center">
      <h2 class="text-2xl font-extrabold tracking-tight sm:text-3xl">Who's joining?</h2>
      <p class="text-muted-foreground text-sm font-medium opacity-70">Step 2: Define the social context</p>
    </div>
    
    <ToggleGroup 
      type="single" 
      :model-value="modelValue" 
      @update:model-value="(val) => emit('update:modelValue', Array.isArray(val) ? String(val[0]) : (val ? String(val) : undefined))"
      class="flex flex-row justify-center items-center gap-3 sm:gap-4 flex-wrap w-full"
    >
      <ToggleGroupItem 
        v-for="ctx in contexts" 
        :key="ctx.id" 
        :value="ctx.id"
        class="group relative h-14 min-w-[120px] sm:min-w-[140px] px-6 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-accent/50 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary data-[state=on]:shadow-lg data-[state=on]:shadow-primary/20 flex items-center justify-center gap-3"
        variant="outline"
      >
        <component :is="ctx.icon" class="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
        <span class="text-sm font-bold tracking-tight">{{ ctx.label }}</span>
      </ToggleGroupItem>
    </ToggleGroup>
  </section>
</template>
