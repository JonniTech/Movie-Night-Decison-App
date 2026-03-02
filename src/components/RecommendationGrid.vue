<script setup lang="ts">
import MovieCardComponent, { type Movie } from './MovieCard.vue'

const props = defineProps<{
  movies: Movie[]
  isLoadingMore?: boolean
}>()

const emit = defineEmits<{
  'loadMore': []
}>()
</script>

<template>
  <section class="w-full mt-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
    <div class="space-y-1 sm:space-y-2 mb-8 sm:mb-12 text-center">
      <h2 class="text-2xl font-extrabold tracking-tight sm:text-4xl text-white/90">Your Curated Picks</h2>
      <p class="text-muted-foreground text-xs sm:text-sm font-medium opacity-60">Hand-selected based on your unique vibe</p>
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12">
      <MovieCardComponent 
        v-for="(movie, index) in movies" 
        :key="`${movie.id}-${index}`" 
        :movie="movie" 
        class="animate-in fade-in zoom-in-95 duration-700 fill-mode-both"
      />
    </div>
  </section>
</template>
