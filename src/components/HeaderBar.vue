```
<script setup lang="ts">
import { Search, Film, ShieldCheck } from 'lucide-vue-next'
</script>

<template>
  <header 
    v-motion
    :initial="{ y: -100, opacity: 0 }"
    :enter="{ y: 0, opacity: 1, transition: { duration: 800, type: 'spring', stiffness: 100 } }"
    class="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl"
  >
    <div class="container max-w-screen-2xl mx-auto">
      <div class="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-8">
        <!-- Logo & Status -->
        <div class="flex items-center gap-3 sm:gap-4">
          <div class="p-2 sm:p-2.5 rounded-xl bg-primary/10 border border-primary/20 backdrop-blur-md shadow-inner">
            <Film class="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div class="flex flex-col">
            <span class="text-sm sm:text-base font-bold tracking-tight text-white/90">Movie Night</span>
            <div class="flex items-center gap-2">
              <span class="text-[10px] sm:text-[11px] font-semibold text-primary leading-none">Smart Curator</span>
              <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span class="relative flex h-1 w-1 sm:h-1.5 sm:w-1.5">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-1 w-1 sm:h-1.5 sm:w-1.5 bg-emerald-500"></span>
                  </span>
                  <span class="text-[8px] sm:text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Live</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation - Hidden on Mobile -->
        <nav class="hidden md:flex items-center gap-8">
            <a href="#" class="text-[11px] font-bold text-white/40 hover:text-primary transition-all uppercase tracking-widest">Discover</a>
            <a href="#" class="text-[11px] font-bold text-white/40 hover:text-primary transition-all uppercase tracking-widest">Community</a>
            <a href="#" class="text-[11px] font-bold text-white/40 hover:text-primary transition-all uppercase tracking-widest">Support</a>
        </nav>

        <!-- Right Side - Optimized for Mobile -->
        <div class="flex items-center gap-4">
           <div class="hidden sm:flex h-4 w-px bg-white/10"></div>
           <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 opacity-60">
              <ShieldCheck class="h-3 w-3 text-primary" />
              <span class="text-[9px] font-bold text-white/80 uppercase tracking-widest">Secured</span>
           </div>
           <div class="p-2 sm:p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <Search class="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/60" />
           </div>
        </div>
      </div>
    </div>
  </header>
</template>
```
