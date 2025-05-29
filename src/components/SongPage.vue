<script setup>
import { useSongStore } from "@/stores/song";
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@iconify/vue';
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import axios from 'axios';
import defaultImgage from '@/assets/default.jpg'

const authStore = useAuthStore();
const { user } = storeToRefs(authStore)

const useSong = useSongStore();
const { currentTrack, isPlaying } = storeToRefs(useSong);


const lyric = ref(null);

const scrollArea = ref(null)

function autoScroll() {
  const el = scrollArea.value
  const speed = 0.1
  const interval = setInterval(() => {
    if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
      clearInterval(interval)
    } else {
      el.scrollTop += speed
    }
  }, 10)
}
watch(() => currentTrack.value, () => {
    autoScroll()
  }
)

onMounted(() => {
    autoScroll();
})
</script>

<template>
    <img :src="currentTrack['thumbnail_path']" class="absolute inset-0 w-full h-full object-cover blur-lg opacity-40"
        @error="event => event.target.src = defaultImgage" />
    <div class="flex relative z-10 h-screen">
        <div class="w-1/2 flex items-center justify-end mb-[90px]">
            <img :src="currentTrack['thumbnail_path']" alt="Album" class="w-[500px] h-[500px] rounded-xl object-cover"
                @error="event => event.target.src = defaultImgage" />
        </div>

        <div class="w-1/2 flex pl-8 items-center justify-start mb-[90px]">
            <div ref="scrollArea" class="space-y-4 text-gray-300 leading-relaxed w-full h-[500px] overflow-y-auto scrollbar-none">
                <div v-for="lyricLine, index in currentTrack.list_lyric" :key="index">
                    <h1 class="text-white text-3xl">{{ lyricLine }}</h1>
                </div>
            </div>
        </div>
    </div>
</template>