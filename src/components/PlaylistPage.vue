<script setup>
import SongRow from './SongRow.vue';
import { Icon } from '@iconify/vue';
import { useSongStore } from "@/stores/song";
import { useViewStore } from '@/stores/view';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from "pinia";
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import defaultImgage from '@/assets/default.jpg'
import { useActivityStore } from '@/stores/activity';

const authStore = useAuthStore();
const useSong = useSongStore();
const useView = useViewStore();
const useActivity = useActivityStore();


const { followAlbumList } = storeToRefs(useActivity)
const { playlistData } = storeToRefs(useView)
const playlistSong = ref([])
const reloadKey = ref(0);
const isFollowed = ref(false) 

async function FetchPlaylistData() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/playlist/show/${playlistData.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        playlistSong.value = res.data.data
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
}

async function addToLibrary() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/home/store/${playlistData.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        useActivity.onUserAction();
        isFollowed.value = !isFollowed.value
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
}
async function removeFromLibrary() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/library/destroy-playlist/${playlistData.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        useActivity.onUserAction();
        isFollowed.value = !isFollowed.value
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
}

function onSongDel(trackId) {
    playlistSong.value = playlistData.value.songs
    playlistSong.value = playlistSong.value.filter(t => t.id !== trackId);
    reloadKey.value++;
    useSong.loadSong(playlistSong.value, useSong.currentTrack)
}

watch(() => playlistData.value, () => {
    if (!playlistData.value.isFav) {
        FetchPlaylistData();
        followAlbumList.value.forEach(album => {
        if (album.playlist_id === playlistData.value.id) {
            isFollowed.value = true
        }
    })
    console.log('playlist data thay đổi');
    } else {
        playlistSong.value = playlistData.value.songs
    }
}
)


onMounted(() => {
    if (!playlistData.value.isFav) {
        FetchPlaylistData();
        followAlbumList.value.forEach(album => {
        if (album.playlist_id === playlistData.value.id) {
            isFollowed.value = true
        }
    })
    console.log(followAlbumList.value);
    console.log(playlistData.value)
    } else {
        playlistSong.value = playlistData.value.songs
    }
})
</script>
<template>
    <div class="p-8">
        <div class="py-15"></div>

        <div class="flex items-center w-full relative h-full">
            <div class="w-48 h-48 rounded-xl bg-gray-500 aspect-square">
                <img class="w-48 h-48 rounded-xl aspect-square object-cover" :src="playlistData.thumbnail_path"
                    @error="event => event.target.src = defaultImgage">
            </div>
            <div class="w-[100% - 192px] ml-5">
                <div class="text-white text-lg font-semibold"> {{ playlistData.type == 1 ? 'Album' : 'Danh sách phát' }}</div>
                <div class="text-white text-8xl font-bold text-nowrap">
                    {{ playlistData.name }}
                </div>

                <div class="text-gray-300 mt-[28px] flex">
                    <Icon v-if="playlistData.type == 1 && !isFollowed" icon="material-symbols:add-circle-outline-rounded" class="flex ml-2 mr-2 pb-2 text-6xl cursor-pointer" 
                        @click="addToLibrary" />
                    <Icon v-else-if="playlistData.type == 1" icon="material-symbols:check-circle" class="flex ml-2 mr-2 pb-2 text-6xl cursor-pointer" 
                        @click="removeFromLibrary" />
                    <div class="flex text-[13px] mt-5">{{ playlistData.author?.name }}</div>
                    <Icon v-if="!playlistData.isFav" icon="ci:dot-03-m" class="flex ml-2 mr-2 text-lg mt-5" />
                    <div class="flex text-[13px] mt-5">{{ !playlistData.isFav ? new Date(playlistData.created_at).getFullYear() : "" }}</div>
                    <Icon icon="ci:dot-03-m" class="flex ml-2 mr-2 text-lg mt-5" />
                    <span class="flex text-[13px] mt-5">{{ playlistData.total_song }} bài hát</span>
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
        <ul class="w-full" :key="reloadKey">
            <SongRow v-for="track, index in playlistSong" :key="track.id" :playlist="playlistSong" :track="track" :index="++index" :isFav="!playlistData.isFav"
                @delete-fav-song="onSongDel" />
        </ul>
    </div>
</template>