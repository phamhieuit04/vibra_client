<script setup>
import { onMounted, ref, watch, toRefs, computed } from "vue";
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import axios from 'axios';
import { storeToRefs } from "pinia";
import { useAuthStore } from '@/stores/auth';
import { useViewStore } from "@/stores/view";
import { useSongStore } from "@/stores/song";
import { useModalStore } from "@/stores/modal";
import { useActivityStore } from "@/stores/activity";
import defaultImgage from '@/assets/default.jpg'

const useView = useViewStore();
const authStore = useAuthStore();
const useSong = useSongStore();
const useModal = useModalStore();
const useActivity = useActivityStore();
const router = useRouter();


const { currentTrack, isPlaying } = storeToRefs(useSong)


const popularAlbum = ref([]);
const topArtist = ref([]);
const topSong = ref([]);
const isLoading = ref(true)


async function FetchAlbumData() {
    try {
        const res = await axios.get('http://spotify_clone_api.test/api/home/list-album', {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            },
        });
        popularAlbum.value = res.data.data;
    } catch (e) {
        console.log(e);
    }
}
async function FetchArtistData() {
    try {
        const res = await axios.get('http://spotify_clone_api.test/api/home/list-artist', {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            },
        });
        topArtist.value = res.data.data;
    } catch (e) {
        console.log(e);
    }
}
async function FetchSongData() {
    try {
        const res = await axios.get('http://spotify_clone_api.test/api/home/list-song', {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            },
        });
        topSong.value = res.data.data;
    } catch (e) {
        console.log(e);
    }
}

async function playThisAlbum(id) {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/playlist/show/${id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        useSong.addAndPlayThisPlaylist(res.data.data)
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, "Call Api thất bại!")
    }
}

async function handleLoading() {
    await FetchAlbumData();
    await FetchArtistData();
    await FetchSongData();
    isLoading.value = false
}

onMounted(() => {
    handleLoading();
})

</script>
<template>
    <div class="text-[#FFFF] space-y-6 rounded-[24px] bg-[#1D1512] w-full h-full ">
        <div class="px-8 py-8 overflow-auto scrollbar-style h-[calc(100vh-12rem)]">
            <div class="text-[#FFE5D6] mb-8">
                <h2 class="mb-1 text-2xl font-semibold">Album phổ biến</h2>
                <div class="flex space-x-4 overflow-x-auto scrollbar-style">
                    <div class="flex px-1 py-2 space-x-4 w-max">
                        <div v-for="item in popularAlbum" :key="popularAlbum.id"
                            class="relative flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105 group hover:brightness-105">
                            <div
                                @click="useView.selectItem(item); useView.setComponent('PlaylistPage'); useView.setPlaylistData(item);">
                                <div class="w-48 h-48 mb-2 rounded-xl bg-zinc-700 ">
                                    <img class="object-cover w-48 h-48 rounded-xl" :src="item.thumbnail_path" alt=""
                                        @error="event => event.target.src = defaultImgage">
                                </div>
                                <button
                                    class="absolute flex items-center justify-center transition-all duration-300 transform translate-y-2 rounded-full opacity-0 bottom-16 right-1 hover:scale-105 hover:brightness-110 w-14 h-14 hover:bg-black group-hover:opacity-100 group-hover:translate-y-0"
                                    :style="{ backgroundColor: useView.currentColor }"
                                    @click.stop="playThisAlbum(item.id)">
                                    <span class="text-black ml-0.5 text-3xl">▶</span>
                                </button>
                                <p class="font-medium ">{{ item.name }}</p>
                                <p class="text-sm ">{{ item.total_song }} bài hát</p>
                            </div>
                        </div>

                        <div v-if="isLoading"
                            class="relative flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105 group hover:brightness-105">
                            <div>
                                <div class="w-48 h-48 mb-2 rounded-xl bg-zinc-700 "></div>
                                <div class="h-5 my-2 rounded w-28 bg-zinc-700"></div>
                                <div class="w-24 h-5 my-2 rounded bg-zinc-700"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-[#FFE5D6] mb-8">
                <h2 class="mb-1 text-2xl font-semibold">Nghệ sĩ với nhiều người theo dõi</h2>
                <div class="flex space-x-4 overflow-x-auto scrollbar-style">
                    <div class="flex px-1 py-2 space-x-4 w-max">
                        <div v-for="item in topArtist" :key="item.id"
                            class="flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105 hover:brightness-105">
                            <div
                                @click="useView.selectItem(item); useView.setComponent('ArtistPage'); useView.setArtistData(item);">
                                <div class="w-48 h-48 mb-2 rounded-full bg-zinc-700">
                                    <img class="object-cover w-48 h-48 rounded-full" :src="item.avatar_path" alt=""
                                        @error="event => event.target.src = defaultImgage">
                                </div>
                                <p class="font-medium ">{{ item.name }}</p>
                                <p class="text-sm ">{{ item.followers }} người theo dõi</p>
                            </div>
                        </div>

                        <div v-if="isLoading"
                            class="flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105 hover:brightness-105">
                            <div>
                                <div class="w-48 h-48 mb-2 rounded-full bg-zinc-700"></div>
                                <div class="w-24 h-5 my-2 rounded bg-zinc-700"></div>
                                <div class="h-5 my-2 rounded w-28 bg-zinc-700"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="text-[#FFE5D6] mb-8">
                <h2 class="mb-1 text-2xl font-semibold">Bài hát có nhiều lượt nghe</h2>
                <div class="flex space-x-4 overflow-x-auto scrollbar-style">
                    <div class="flex px-1 py-2 space-x-4 w-max">
                        <div v-for="item in topSong" :key="item.id"
                            class="flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105 hover:brightness-105"
                            @click="useSong.playOrPauseThisSong(item);">
                            <div class="w-40 h-40 mb-2 rounded-full bg-zinc-700">
                                <img class="object-cover w-40 h-40 rounded-full" :src="item.thumbnail_path" alt=""
                                    :class="{ 'animate-spin': currentTrack.id == item.id && isPlaying }"
                                    style="animation-duration: 5s;" @error="event => event.target.src = defaultImgage">
                            </div>
                            <div class="flex justify-between">
                                <div>
                                    <p class="font-medium ">{{ item.name }}</p>
                                    <p class="text-sm ">{{ item.total_played }} lượt nghe</p>
                                </div>
                                <button @click.stop="useSong.addSongToWaitlist(item);"
                                    class=" hover:bg-white/5 p-1 rounded text-[#FFE5D6]/50 mr-4">
                                    <Icon icon="material-symbols:home-storage-outline" class="text-2xl " />
                                </button>
                            </div>
                        </div>

                        <div v-if="isLoading" class="flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105 hover:brightness-105" >
                            <div class="w-40 h-40 mb-2 rounded-full bg-zinc-700"></div>
                            <div class="flex justify-between">
                                <div>
                                    <div class="w-24 h-5 my-2 rounded bg-zinc-700"></div>
                                    <div class="h-5 my-2 rounded w-28 bg-zinc-700"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
