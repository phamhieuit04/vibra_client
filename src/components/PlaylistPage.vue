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
    if (playlistData.value.type == 1) {
        try {
            const res = await axios.get(`http://spotify_clone_api.test/api/playlist/show/${playlistData.value.id}`, {
                'headers': {
                    'Authorization': 'Bearer ' + authStore.user.token,
                }
            });
            playlistSong.value = res.data.data
        } catch (e) {
            console.log(e);
            useActivity.addNotify(true, "Call Api thất bại!")
        }
    } else {
        try {
            const res = await axios.get(`http://spotify_clone_api.test/api/library/list-playlist-song/${playlistData.value.id}`, {
                'headers': {
                    'Authorization': 'Bearer ' + authStore.user.token,
                }
            });
            const rawList = res.data.data;
            const onlySongs = rawList.map((item) => item.song);
            playlistSong.total_song = onlySongs.value
            playlistSong.value = onlySongs
        } catch (e) {
            console.log(e);
            useActivity.addNotify(true, "Call Api thất bại!")
        }
    }
}

async function addToLibrary() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/home/store/${playlistData.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        useActivity.fetchData();
        isFollowed.value = !isFollowed.value
        useActivity.addNotify(false, "Đã thêm vào thư viện!")
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, "Call Api thất bại!")
    }
}
async function removeFromLibrary() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/library/destroy-playlist/${playlistData.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        useActivity.fetchData();
        isFollowed.value = !isFollowed.value
        useActivity.addNotify(false, "Đã xóa khỏi thư viện!")
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, "Call Api thất bại!")
    }
}

async function downloadThisPlaylist() {
    if (!playlistData.value.id) return
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/payment/create-bill?playlist_id=${playlistData.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        if (res.data) {
            window.location.href = res.data.data;
        } else {
            useActivity.addNotify(true, "Không lấy được link thanh toán!")
        }
    } catch (err) {
        console.error(err);
        useActivity.addNotify(true, "Không lấy được link thanh toán!")
    }
}

function onSongDel(trackId) {
    playlistSong.value = playlistData.value.songs
    playlistSong.value = playlistSong.value.filter(t => t.id !== trackId);
    playlistData.value.songs = playlistSong.value
    reloadKey.value++;
}

function onPlaylistSongDel(trackId) {
    FetchPlaylistData();
}

watch(() => playlistData.value, () => {
    console.log(playlistData.value)
    if (!playlistData.value.isFav) {
        FetchPlaylistData();
        followAlbumList.value.forEach(album => {
            if (album.id === playlistData.value.id) {
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
    console.log(playlistData.value)
    if (!playlistData.value.isFav) {
        FetchPlaylistData();
        followAlbumList.value.forEach(album => {
            if (album.id === playlistData.value.id) {
                isFollowed.value = true
            }
        })
    } else {
        playlistSong.value = playlistData.value.songs
    }
})
</script>
<template>
    <div class="p-8 overflow-y-auto h-[calc(100vh-12rem)] scrollbar-none">

        <div class="relative flex items-center w-full">
            <div class="w-48 h-48 bg-gray-500 rounded-xl aspect-square">
                <img class="object-cover max-w-48 max-h-48 rounded-xl aspect-square" :src="playlistData.thumbnail_path"
                    @error="event => event.target.src = defaultImgage">
            </div>
            <div class="w-[100% - 192px] ml-5">
                <div class="text-lg font-semibold text-white"> {{ playlistData.type == 1 ? 'Album' : 'Danh sách phát' }}
                </div>
                <div
                    class="flex-1 font-bold text-white break-normal whitespace-pre text-7xl wrap-normal md:break-all md:whitespace-normal">
                    {{ playlistData.name }}
                </div>

                <div class="text-gray-300 mt-[28px] flex">
                    <Icon v-if="playlistData.type == 1 && !isFollowed"
                        icon="material-symbols:add-circle-outline-rounded"
                        class="flex pb-2 ml-2 mr-2 text-6xl cursor-pointer" @click="addToLibrary" />
                    <Icon v-else-if="playlistData.type == 1" icon="material-symbols:check-circle"
                        class="flex pb-2 ml-2 mr-2 text-6xl cursor-pointer" @click="removeFromLibrary" />

                    <button @click.stop="useSong.addPlaylistToWaitlist(playlistSong)"
                        class=" hover:bg-white/5 p-1 rounded text-[#FFE5D6]/50 mr-4">
                        <Icon icon="material-symbols:home-storage-outline" class=" text-5xl" />
                    </button>
                    <button v-if="playlistData.type == 1" @click.stop="useSong.setDownload('playlist'); useSong.setPlaylist(playlistSong); downloadThisPlaylist()"
                        class=" hover:bg-white/5 p-1 rounded text-[#FFE5D6]/50 mr-4">
                        <Icon icon="material-symbols:arrow-circle-down-outline-rounded" class=" text-5xl" />
                    </button>
                    <div class="flex text-[13px] mt-5">{{ playlistData.author?.name }}</div>
                    <Icon v-if="!playlistData.isFav" icon="ci:dot-03-m" class="flex mt-5 ml-2 mr-2 text-lg" />
                    <div class="flex text-[13px] mt-5">{{ !playlistData.isFav ? new
                        Date(playlistData.created_at).getFullYear() : "" }}</div>
                    <Icon icon="ci:dot-03-m" class="flex mt-5 ml-2 mr-2 text-lg" />
                    <span class="flex text-[13px] mt-5">{{ playlistData.total_song }} bài hát</span>
                    <Icon v-if="playlistData.type == 1" icon="ci:dot-03-m" class="flex mt-5 ml-2 mr-2 text-lg" />
                    <span v-if="playlistData.type == 1" class="flex text-[13px] mt-5">{{ playlistData.price }}
                        vnd</span>
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
            <SongRow v-for="track, index in playlistSong" :key="track.id" :playlist="playlistData" :track="track"
                :index="++index" :isFav="!playlistData.isFav" @delete-fav-song="onSongDel"
                @deletePlaylistSong="onPlaylistSongDel" />
        </ul>
    </div>
</template>