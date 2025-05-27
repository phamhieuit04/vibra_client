<script setup>
import { useSongStore } from "@/stores/song";
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@iconify/vue';
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import axios from 'axios';
import defaultImgage from '@/assets/default.jpg'

const authStore = useAuthStore();
const { user } = storeToRefs(authStore)

const useSong = useSongStore();
const { currentTrack } = storeToRefs(useSong);


const lyric = ref(null);

async function fetchLyricsText(url) {
    // try {
    //     const res = await axios.get('http://spotify_clone_api.test/uploads/billie/lyrics/Lost cause lyrics.txt', {
    //         'headers': {
    //             'Authorization': 'Bearer ' + user.value.token,
    //         },
    //     })
    //     lyric.value = res.data
    //     console.log(lyric.value)
    // } catch (error) {
    //     console.error('Lỗi khi load lyrics:', error)
    // }
    // try {
    //     const res = await fetch('http://spotify_clone_api.test/uploads/billie/lyrics/Lost cause lyrics.txt')
    //     lyric.value = await res.text()
    // } catch (err) {
    //     console.error('Không thể tải lời bài hát:', err)
    // }
}

onMounted(() => {
    // fetchLyricsText(currentTrack.value.lyrics_path)
    // console.log(currentTrack.value.lyrics_path)

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

        <div class="w-1/2 flex pl-8 items-center justify-start overflow-y-auto mb-[90px]">
            <div class="space-y-4 text-gray-300 leading-relaxed w-[500px] h-[500px]">
                <!-- <div v-if="!lyric"> -->
                <!-- <h1 class="text-white text-3xl">{{ currentTrack.lyrics_path }} Có vẻ bạn sẽ phải tự đoán lời bài hát này rồi</h1> -->
                <iframe :src="currentTrack.lyrics_path"
                    class="w-full h-[500px] text-white text-3xl" style="color: white; border: none;"></iframe>
                <!-- </div>
                <div v-else>
                    <h1>{{ lyric }}</h1>
                </div> -->
            </div>
        </div>
    </div>
</template>