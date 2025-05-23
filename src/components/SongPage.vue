<script setup>
import { useSongStore } from "@/stores/song";
import { Icon } from '@iconify/vue';
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const useSong = useSongStore();
const { currentTrack } = storeToRefs(useSong);


// const lyric = ref(null);

</script>

<template>
    <img :src="currentTrack['thumbnail']" class="absolute inset-0 w-full h-full object-cover blur-lg opacity-40"/>
    <div class="flex relative z-10 h-screen">
        <!-- Bên trái: ảnh -->
        <div class="w-1/2 flex items-center justify-end mb-[90px]">
            <img :src="currentTrack['thumbnail']" alt="Album" class=" w-[500px] h-[500px] rounded-xl" />
        </div>

        <!-- Bên phải: lời bài hát -->
        <div class="w-1/2 flex pl-8 items-center justify-start overflow-y-auto mb-[90px]">
            <div class="space-y-4 text-gray-300 leading-relaxed w-[500px] h-[500px]">
                <!-- <div v-if="!lyric"> -->
                    <h1 class="text-white text-3xl">Có vẻ bạn sẽ phải tự đoán lời bài hát này rồi</h1>
                <!-- </div>
                <div v-else>
                    <h1>{{ lyric }}</h1>
                </div> -->
            </div>
        </div>
    </div>
</template>