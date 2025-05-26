<script setup>
import SongRow from './SongRow.vue';
import { Icon } from '@iconify/vue';
import { useSongStore } from "@/stores/song";
import { useViewStore } from '@/stores/view';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from "pinia";
import axios from 'axios';
import { onMounted, ref } from 'vue';
import defaultImgage from '@/assets/default.jpg'

const authStore = useAuthStore();

const useView = useViewStore()
const playlistSong = ref([])
const { playlistData } = storeToRefs(useView)

async function FetchPlaylistData() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/playlist/show/${playlistData.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        playlistSong.value = res.data.data
        console.log(playlistSong.value)
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
}

onMounted(() => {
    FetchPlaylistData();
    console.log(playlistData.value)
})
</script>
<template>
    <div class="p-8">
        <div class="py-15"></div>

        <div class="flex items-center w-full relative h-full">
            <div class="w-48 h-48 rounded-xl bg-gray-500 aspect-square">
                <img class="w-48 h-48 rounded-xl aspect-square object-cover" :src="playlistData.thumbnail_path" @error="event => event.target.src = defaultImgage">
            </div>
            <div class="w-[100% - 192px] ml-5">
                <div class="text-white text-lg font-semibold">Album</div>
                <div class="text-white text-8xl font-bold text-nowrap">
                    {{ playlistData.name }}
                </div>

                <div class="text-gray-300 text-[13px] mt-[20px] flex">
                    <div class="flex">{{ playlistData.author.name }}</div>
                    <Icon icon="ci:dot-03-m" class="flex ml-2 mr-2 text-lg"/>
                    <div class="flex">{{ new Date(playlistData.created_at).getFullYear() }}</div>
                    <Icon icon="ci:dot-03-m" class="flex ml-2 mr-2 text-lg"/>
                    <span class="flex">{{ playlistData.total_song }} bài hát</span>
                </div>
            </div>
        </div>

        <div class="mt-6"></div>
        <div class="flex items-center justify-between px-5 pt-2">
            <div class="flex items-center justify-between text-gray-400">
                <div class="mr-7">#</div>
                <div class="text-base">Tiêu đề</div>
            </div>
        </div>

        <div class="border-b border-b-[#A2A2A2] mt-2"></div>
        <div class="mb-4"></div>
        <ul class="w-full" v-for="track, index in playlistSong" :key="track">
            <SongRow :playlist="playlistSong" :track="track" :index="++index" />
        </ul>

    </div>
</template>