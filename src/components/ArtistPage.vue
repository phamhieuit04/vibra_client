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
const thisArtistListSong = ref([])
const thisArtistListAlbum = ref([])

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
        alert('Call API thất bại');
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
        alert('Call API thất bại');
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
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
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
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
}


onMounted(() => {
    getArtistSong();
    getArtistAlbum();
    followArtistList.value.forEach(artist => {
        if (artist.artist_id === artistData.value.id) {
            isFollowed.value = true
        }
    })
})
</script>
<template>
    <div
        class="text-[#FFFF] space-y-6 rounded-[24px] bg-[#1D1512] w-full h-[calc(100vh-12rem)] overflow-y-auto scrollbar-style" >

        <div class="relative items-center h-96">
            <img 
                :src="artistData.avatar_path"
                alt="" 
                class="absolute z-0 object-cover w-full h-full"
            />

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
                <div class="flex items-center mb-5 space-x-6">
                    <button
                        class="flex items-center justify-center w-14 h-14 rounded-full bg-[#BC4D15] hover:bg-black transition group">
                        <Icon 
                            icon="mdi:play" 
                            class="text-black ml-0.5 text-5xl group-hover:text-[#BC4D15]" 
                            @click="useSong.playFromFirst(thisArtistListSong)"
                        />
                    </button>

                    <button v-if="!isFollowed" @click="followThisArtist" class="border border-[#BC4D15] text-[#BC4D15] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#BC4D15] hover:text-black transition">
                        Theo dõi
                    </button>
                    <button v-else @click="unfollowThisArtist" class="border border-[#BC4D15] text-[#BC4D15] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#BC4D15] hover:text-black transition">
                        Hủy theo dõi
                    </button>

                    <button class="text-[#BC4D15] text-2xl hover:text-white transition">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>


                <div class="w-full">
                    <h2 class="text-2xl font-semibold pl-14 ">Phổ biến</h2>
                    <div class="px-12 ">
                        <div v-for="item, index in thisArtistListSong" :key="item.id" @click="useSong.playOrPauseThisSong(thisArtistListSong, item)"
                            class="flex items-center justify-between hover:bg-[#2a1d18] py-2 pr-4 rounded-lg transition cursor-pointer ">
                            <div class="flex items-center space-x-4">
                                <span class="w-5 text-right text-white">{{ ++index }}</span>
                                    <img  class="object-cover w-16 h-16 rounded-md" :src="item.thumbnail_path" >
                                <span class="font-medium text-white">{{ item.name }}</span>
                            </div>
                            <div class="flex items-center space-x-8 text-sm text-white">
                                <span>{{ item.total_played }} lượt nghe</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

          <div class="mt-8 ">
            <h2 class="mb-3 text-2xl font-semibold pl-14">Giới thiệu về nghệ sĩ</h2>
            <div class="">
                <div class="w-full mb-3 rounded-3xl h-[30rem] flex flex-col justify-end p-12 relative overflow-hidden hover:scale-[102%] duration-200 ease-in-out cursor-pointer">
                    <img class="absolute inset-0 object-cover w-full h-full rounded-3xl" :src="artistData.avatar_path" >
                    <div class="relative z-10">
                        <p class="text-2xl font-semibold text-white">{{ artistData.followers }} người theo dõi trên nền tảng</p>
                        <p class="text-xl font-semibold text-white">{{ artistData.description }}</p>
                    </div>
                </div>
            </div>
        </div>

            <div class="mt-8 ">
                <div class="mb-2 space-y-2 font-semibold pl-14">
                    <h2 class="text-2xl ">Danh sách Album</h2>
                </div>

                <div class="w-full overflow-x-auto scrollbar-style">
                    <div class="flex px-1 py-2 space-x-4 w-max ">
                        <div v-for="item in thisArtistListAlbum" :key="item.id"
                            class="flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105 "
                            @click="useView.selectItem(item); useView.setComponent('PlaylistPage'); useView.setPlaylistData(item);">
                            <div class="w-48 h-48 mb-2 rounded-xl bg-zinc-700">
                                <img class="object-cover w-full h-full rounded-xl" :src="item.thumbnail_path" >
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
    scrollbar-color: #BC4D15 transparent;
}
</style>
