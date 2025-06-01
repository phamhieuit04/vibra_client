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


const { artistData } = storeToRefs(useView);
const { followArtistList } = storeToRefs(useActivity)

const isFollowed = ref(false)
const isMe = ref(false);
const thisArtistListSong = ref([])
const thisArtistListAlbum = ref([])

const bgColor = ref('#FFFFFF')

function checkMe(){
    isMe.value = false;
    if(artistData.value.id === authStore.user.id){
        isMe.value = true;
    }
}

async function getArtistSong() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/artist/get-artist-songs/${artistData.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        thisArtistListSong.value = res.data.data
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, "Call Api thất bại!")
    }
}
async function getArtistAlbum() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/artist/get-artist-albums/${artistData.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        thisArtistListAlbum.value = res.data.data
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, "Call Api thất bại!")
    }
}

async function followThisArtist() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/artist/follow/${artistData.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        useActivity.fetchData();
        isFollowed.value = !isFollowed.value
        useActivity.addNotify(false, "Bạn đã theo dõi nghệ sĩ!")
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, "Call Api thất bại!")
    }
}
async function unfollowThisArtist() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/library/destroy-favorite-artist/${artistData.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        useActivity.fetchData();
        isFollowed.value = !isFollowed.value
        useActivity.addNotify(false, "Bạn đã hủy theo dõi nghệ sĩ!")
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, "Call Api thất bại!")
    }
}

async function blockThisArtist() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/artist/block/${artistData.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        unfollowThisArtist();
        useActivity.fetchData();
        useView.setComponent('HomePage');
        useActivity.addNotify(false, "Bạn đã hạn chế nghệ sĩ!")
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, "Call Api thất bại!")
    }
}

watch(() => artistData.value, () => {
    getArtistSong();
    getArtistAlbum();
    checkMe();
    isFollowed.value = false
    followArtistList.value.forEach(artist => {
        if (artist.artist_id === artistData.value.id) {
            isFollowed.value = true
        }
    })
}
)

onMounted(() => {
    getArtistSong();
    getArtistAlbum();
    checkMe();
    followArtistList.value.forEach(artist => {
        if (artist.artist_id === artistData.value.id) {
            isFollowed.value = true
        }
    })
})
</script>
<template>
    <div
        class="text-[#FFFF] space-y-6 rounded-[24px] bg-[#1D1512] w-full h-[calc(100vh-12rem)] overflow-y-auto scrollbar-style">

        <div class="relative items-center h-96">
            <img :src="artistData.avatar_path" alt="" class="absolute z-0 object-cover w-full h-full" />

            <div class="relative z-10 flex flex-col justify-end h-full p-16 space-y-2">
                <p class="flex text-lg font-semibold ">
                    <Icon icon="mdi:check-decagram" class="mr-2 text-2xl text-blue-500" />
                    Nghệ sĩ được xác minh
                </p>
                <h1 class="font-black text-8xl">{{ artistData.name }}</h1>
                <p class="mt-1 text-lg font-semibold ">{{ artistData.followers }} người theo dõi</p>
            </div>
        </div>

        <div class="px-12">
            <div class="">
                <div class="flex justify-between">
                    <div class="flex items-center mb-5 space-x-6">
                        <button
                            class="flex items-center justify-center w-14 h-14 rounded-full  hover:bg-black transition group"
                            :style="{ backgroundColor: useView.currentColor }">
                            <Icon icon="mdi:play" class="text-black ml-0.5 text-5xl group-hover:text-white"
                                @click="useSong.addAndPlayThisPlaylist(thisArtistListSong)" />
                        </button>
                        <button @click.stop="useSong.addPlaylistToWaitlist(thisArtistListSong)"
                            class=" hover:bg-white/5 p-1 rounded text-[#FFE5D6]/50 mr-4">
                            <Icon icon="material-symbols:home-storage-outline" class=" text-5xl" />
                        </button>

                        <div v-if="!isMe">
                            <button v-if="!isFollowed" @click="followThisArtist"
                                class="border px-4 py-2 rounded-full text-sm font-semibold  hover:text-black transition hover:scale-110"
                                :style="{borderColor: useView.currentColor, color: useView.currentColor, '--scroll-color': useView.currentColor }">
                                Theo dõi
                            </button>
                            <button v-else @click="unfollowThisArtist"
                                class="border  px-4 py-2 rounded-full text-sm font-semibold hover:scale-110"
                                :style="{borderColor: useView.currentColor, color: useView.currentColor }">
                                Hủy theo dõi
                            </button>
                        </div>
                    </div>
                    <div>
                        <button v-if="!isMe" @click="blockThisArtist"
                            class="border border-red-500 text-red-500 px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-500 hover:text-black transition">
                            Hạn chế nghệ sĩ
                        </button>
                    </div>
                </div>


                <div class="w-full" v-if="thisArtistListSong.length > 0">
                    <h2 class="text-2xl font-semibold pl-14 ">Phổ biến</h2>
                    <div class="px-12 ">
                        <div v-for="item, index in thisArtistListSong" :key="item.id"
                            @click="useSong.playThisSong(item)"
                            class="flex items-center justify-between hover:bg-[#2a1d18] py-2 pr-4 rounded-lg transition cursor-pointer ">
                            <div class="flex items-center space-x-4">
                                <span class="w-5 text-right text-white">{{ ++index }}</span>
                                <img class="object-cover w-16 h-16 rounded-md" :src="item.thumbnail_path">
                                <span class="font-medium text-white">{{ item.name }}</span>
                            </div>
                            <div class="flex items-center space-x-8 text-sm text-white">
                                <span>{{ item.total_played }} lượt nghe</span>
                                <button @click.stop="useSong.addSongToWaitlist(item)"
                                    class=" hover:bg-white/5 p-1 rounded text-[#FFE5D6]/50 mr-4">
                                    <Icon icon="material-symbols:home-storage-outline" class=" text-2xl" />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8 ">
                <h2 class="mb-3 text-2xl font-semibold pl-14">Giới thiệu về nghệ sĩ</h2>
                <div class="">
                    <div
                        class="w-full mb-3 rounded-3xl h-[30rem] flex flex-col justify-end p-12 relative overflow-hidden hover:scale-[102%] duration-200 ease-in-out cursor-pointer">
                        <img class="absolute inset-0 object-cover w-full h-full rounded-3xl"
                            :src="artistData.avatar_path">
                        <div class="relative z-10">
                            <p class="text-2xl font-semibold text-white">{{ artistData.followers }} người theo dõi trên
                                nền tảng</p>
                            <p class="text-xl font-semibold text-white">{{ artistData.description }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8 " v-if="thisArtistListAlbum.length > 0">
                <div class="mb-2 space-y-2 font-semibold pl-14">
                    <h2 class="text-2xl ">Danh sách Album</h2>
                </div>

                <div class="w-full overflow-x-auto scrollbar-style">
                    <div class="flex px-1 py-2 space-x-4 w-max ">
                        <div v-for="item in thisArtistListAlbum" :key="item.id"
                            class="flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105 "
                            @click="useView.selectItem(item); useView.setComponent('PlaylistPage'); useView.setPlaylistData(item);">
                            <div class="w-48 h-48 mb-2 rounded-xl bg-zinc-700">
                                <img class="object-cover w-full h-full rounded-xl" :src="item.thumbnail_path">
                            </div>
                            <p class="text-xl font-semibold">{{ item.name }}</p>
                            <p class="text-sm ">Năm {{ new Date(item.created_at).getFullYear() }}</p>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<style>
.scrollbar-style {
    scrollbar-width: medium;
    scrollbar-color: #D3D3D3 transparent;
}
</style>
