<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import HeaderBar from '@/components/HeaderBar.vue'
import MoodSelector from '@/components/MoodSelector.vue'
import WatchContextToggle from '@/components/WatchContextToggle.vue'
import DecisionButton from '@/components/DecisionButton.vue'
import RecommendationGrid from '@/components/RecommendationGrid.vue'
import { fetchRecommendations, type Movie } from '@/lib/api'

// State
const selectedMood = ref<string | undefined>()
const selectedContext = ref<string | undefined>()
const isLoading = ref(false)
const recommendations = ref<Movie[]>([])
const hasDecided = ref(false)

// Pagination State
const currentPage = ref(1)
const isLoadingMore = ref(false)
const hasMore = ref(true)

// Modal State
const isModalOpen = ref(false)
const modalStep = ref<'mood' | 'context'>('mood')

const openModal = () => {
    selectedMood.value = undefined
    selectedContext.value = undefined
    modalStep.value = 'mood'
    isModalOpen.value = true
}

const nextStep = () => {
    if (modalStep.value === 'mood' && selectedMood.value) {
        modalStep.value = 'context'
    }
}

const handleDecision = async () => {
  if (!selectedMood.value || !selectedContext.value) return
  
  isLoading.value = true
  currentPage.value = 1
  hasMore.value = true
  
  try {
    const response = await fetchRecommendations(selectedMood.value, selectedContext.value, currentPage.value)
    recommendations.value = response.movies
    // TMDB results are max 20 per page generally
    hasMore.value = response.movies.length >= 20
    hasDecided.value = true
    isModalOpen.value = false // Close modal on success
    
    // Smooth scroll down
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  } catch (error) {
    console.error("Failed to fetch matches", error)
  } finally {
    isLoading.value = false
  }
}

const loadMoreRecommendations = async () => {
  if (!selectedMood.value || !selectedContext.value || isLoadingMore.value || !hasMore.value) return
  
  isLoadingMore.value = true
  currentPage.value++
  
  try {
    const response = await fetchRecommendations(selectedMood.value, selectedContext.value, currentPage.value)
    if (response.movies.length > 0) {
      recommendations.value.push(...response.movies)
      hasMore.value = response.movies.length >= 20
    } else {
      hasMore.value = false
    }
  } catch (error) {
    console.error("Failed to fetch more matches", error)
    hasMore.value = false
  } finally {
    isLoadingMore.value = false
  }
}

const handleReset = () => {
  hasDecided.value = false
  recommendations.value = []
  selectedMood.value = undefined
  selectedContext.value = undefined
  currentPage.value = 1
  hasMore.value = true
  
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans transition-colors duration-700 bg-background text-foreground selection:bg-primary/20 overflow-x-hidden">
    <!-- Navbar / Header -->
    <HeaderBar />
    
    <main :class="[
      'flex-grow container mx-auto pt-6 sm:pt-10 pb-20 sm:pb-32 transition-all duration-1000 ease-in-out relative',
      hasDecided ? 'max-w-[1920px] px-4 sm:px-12 lg:px-24' : 'max-w-screen-md px-4 sm:px-6'
    ]">
      <!-- Background Glows -->
      <div v-if="!hasDecided" class="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
          <div class="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full animate-pulse delay-700"></div>
      </div>

      <div class="space-y-12 sm:space-y-16">
        <!-- Hero Section -->
        <div v-if="!hasDecided" class="text-center space-y-8 sm:space-y-12 mt-8 sm:mt-12">
          <div 
            v-motion
            :initial="{ opacity: 0, scale: 0.9 }"
            :enter="{ opacity: 1, scale: 1, transition: { duration: 800, delay: 200 } }"
          >
            <Badge variant="outline" class="rounded-full px-4 sm:px-5 py-1 text-[10px] sm:text-[11px] font-bold border-primary/30 text-primary bg-primary/5 backdrop-blur-sm">
                Next-Gen Smart Selection
            </Badge>
          </div>

          <div class="space-y-4 sm:space-y-6">
            <h1 
                v-motion
                :initial="{ opacity: 0, y: 40 }"
                :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 400 } }"
                class="text-3xl sm:text-6xl font-black tracking-tight leading-none text-white lg:text-7xl"
            >
                Movie night, <br/>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-muted-foreground/40 via-muted-foreground/60 to-muted-foreground/20 italic font-serif">reimagined.</span>
            </h1>
            
            <p 
                v-motion
                :initial="{ opacity: 0 }"
                :enter="{ opacity: 1, transition: { duration: 1000, delay: 800 } }"
                class="text-muted-foreground text-xs sm:text-base font-medium max-w-[280px] sm:max-w-sm mx-auto leading-relaxed opacity-60"
            >
                Eliminate indecision with our high-fidelity cinematic intelligence engine.
            </p>
          </div>

          <div 
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 1000 } }"
            class="pt-6 sm:pt-10 relative inline-block"
          >
             <!-- Pulse Effect -->
             <div class="absolute inset-0 rounded-full bg-primary/40 animate-ping opacity-20 scale-110 sm:scale-125"></div>
             
             <Button 
                size="lg" 
                @click="openModal" 
                class="relative rounded-full px-10 sm:px-12 h-12 sm:h-14 text-sm sm:text-base font-semibold rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 bg-primary text-white border-0"
             >
                 Start Curation
             </Button>
          </div>
        </div>

        <!-- Pop-up Modal for Selection Flow -->
        <Dialog v-model:open="isModalOpen">
          <DialogContent class="w-[95%] sm:max-w-2xl bg-background/95 backdrop-blur-xl border-border/50 p-0 overflow-hidden rounded-3xl sm:rounded-none">
             
             <!-- Step Indicator -->
             <div class="flex items-center gap-2 p-4 sm:p-6 pb-0 opacity-50">
                <div class="h-1.5 sm:h-2 flex-1 rounded-full bg-muted overflow-hidden">
                    <div class="h-full bg-primary transition-all duration-500" :style="{ width: modalStep === 'mood' ? '50%' : '100%' }"></div>
                </div>
                <span class="text-[10px] sm:text-[11px] font-semibold text-muted-foreground whitespace-nowrap">{{ modalStep === 'mood' ? 'Step 1 of 2' : 'Step 2 of 2' }}</span>
             </div>

             <div class="p-6 sm:p-8 pt-4 sm:pt-6 min-h-[350px] sm:min-h-[400px] flex flex-col justify-center relative">
                 <Transition mode="out-in" 
                    enter-active-class="transition duration-500 ease-out"
                    enter-from-class="opacity-0 translate-y-8 blur-sm"
                    enter-to-class="opacity-100 translate-y-0 blur-0"
                    leave-active-class="transition duration-300 ease-in"
                    leave-from-class="opacity-100 translate-y-0 blur-0"
                    leave-to-class="opacity-0 -translate-y-8 blur-sm"
                 >
                    <div v-if="modalStep === 'mood'" key="mood" class="w-full">
                        <MoodSelector v-model="selectedMood" />
                        <div class="mt-12 flex justify-end">
                            <Button @click="nextStep" :disabled="!selectedMood" class="rounded-full px-8 h-11 font-semibold group">
                                Next
                                <span class="group-hover:translate-x-1 transition-transform">→</span>
                            </Button>
                        </div>
                    </div>

                    <div v-else-if="modalStep === 'context'" key="context" class="w-full">
                        <WatchContextToggle v-model="selectedContext" />
                        <div class="mt-12 flex justify-between items-center">
                            <Button variant="ghost" @click="modalStep = 'mood'" class="rounded-full px-6 h-11 font-semibold opacity-70 hover:opacity-100">
                                ← Back
                            </Button>
                            <DecisionButton 
                                :disabled="!selectedContext"
                                :loading="isLoading"
                                @click="handleDecision"
                            />
                        </div>
                    </div>
                 </Transition>
             </div>
          </DialogContent>
        </Dialog>

        <!-- Results Section -->
        <div id="results-section" v-if="hasDecided" class="space-y-12">
          <RecommendationGrid 
            :movies="recommendations" 
          />
          
          <div class="flex justify-center gap-6 py-12 border-t border-border/50 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700 fill-mode-both">
            <Button 
              v-if="hasMore"
              variant="outline" 
              size="lg" 
              :disabled="isLoadingMore"
              @click="loadMoreRecommendations" 
              class="rounded-full px-8 h-14 font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 active:scale-95 border-border shadow-sm"
            >
              {{ isLoadingMore ? 'Loading...' : 'Load More' }}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              @click="handleReset" 
              class="rounded-full px-8 h-14 font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 active:scale-95 border-border shadow-sm"
            >
              Back to Customize
            </Button>
          </div>
        </div>
      </div>
    </main>
    
    <footer class="mt-auto border-t border-border/40 py-8 bg-muted/20">
      <div class="container mx-auto max-w-screen-md px-6 text-center space-y-4">
        <div class="flex justify-center gap-8 opacity-40">
           <span class="text-[11px] font-semibold cursor-pointer hover:text-white transition-colors">Privacy</span>
           <span class="text-[11px] font-semibold cursor-pointer hover:text-white transition-colors">Terms</span>
           <span class="text-[11px] font-semibold cursor-pointer hover:text-white transition-colors">API Docs</span>
        </div>
        <div class="space-y-2">
          <p class="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Movie Night Curator</p>
          <p class="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em]">Programmed by NYAGANYA</p>
          <p class="text-[10px] text-muted-foreground/30 font-medium tracking-tight">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
