<script setup lang="ts">
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Film, Calendar, Quote } from 'lucide-vue-next'

export interface Movie {
  id: number
  title: string
  year: string
  rating: number
  posterUrl: string
  reason: string
}

defineProps<{
  movie: Movie
}>()
</script>

<template>
  <Card class="group overflow-hidden border-none bg-transparent shadow-none hover:shadow-none transition-all duration-500">
    <div class="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-muted ring-1 ring-border/50 transition-all duration-500 group-hover:ring-primary/20 group-hover:shadow-2xl group-hover:shadow-primary/10 group-hover:-translate-y-2">
      <img 
        v-if="movie.posterUrl" 
        :src="movie.posterUrl" 
        :alt="movie.title"
        class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        @error="(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500&auto=format&fit=crop'"
      />
      <div v-else class="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground/20">
        <Film class="h-12 w-12" />
        <span class="text-[10px] font-black uppercase tracking-[0.2em]">No Media</span>
      </div>
      
      <!-- Overlay Gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col justify-end p-6">
        <div class="space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
           <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
             <Calendar class="h-3 w-3" />
             {{ movie.year }}
           </div>
           <div class="flex items-center gap-2">
             <Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
             <span class="text-sm font-black text-white">{{ movie.rating.toFixed(1) }}</span>
           </div>
        </div>
      </div>

      <!-- Static Rating Badge -->
      <Badge class="absolute top-3 right-3 bg-background/80 backdrop-blur-md text-foreground border-none font-black shadow-sm z-20 group-hover:opacity-0 transition-opacity">
        {{ movie.rating.toFixed(1) }}
      </Badge>
    </div>
    
    <div class="mt-4 space-y-3 px-1">
      <h3 class="text-base font-bold leading-tight line-clamp-1 transition-colors group-hover:text-primary">
        {{ movie.title }}
      </h3>
      
      <div class="relative">
        <Quote class="absolute -top-1 -left-1 h-3 w-3 text-primary/20" />
        <p class="text-xs text-muted-foreground leading-relaxed pl-4 border-l border-primary/20 group-hover:border-primary/50 transition-colors line-clamp-2">
          {{ movie.reason }}
        </p>
      </div>
    </div>
  </Card>
</template>
