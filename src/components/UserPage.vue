<script setup>
import { ref, computed, onMounted } from "vue";
import { Icon } from '@iconify/vue';
import { useViewStore } from "@/stores/view";
import { storeToRefs } from "pinia";
import { useSongStore } from "@/stores/song";
import { useAuthStore } from '@/stores/auth';
import { useModalStore } from "@/stores/modal";
import { useActivityStore } from "@/stores/activity";
import axios from 'axios';
import defaultImgage from '@/assets/default.jpg'

let openMenu = ref(false);
let openUploadAlbum = ref(false);

const useActivity = useActivityStore();
const useView = useViewStore();
const authStore = useAuthStore();
const useSong = useSongStore();
const useModal = useModalStore();
const { currentComponent, isFullscreen } = storeToRefs(useView)
const { openEditProfile, openUploadSong } = storeToRefs(useModal)
const { myPlaylistList, followArtistList} = storeToRefs(useActivity)



onMounted(() => {
    console.log(followArtistList.value)
})
</script>

<template>
    <div class="text-white space-y-10 rounded-[24px] bg-[#1D1512] w-full h-[76%]">
        <div class="px-10 py-6 h-52 flex items-center bg-gradient-to-b from-[#1D1512]/20 to-[#312825]/100 space-x-7 ">
            <div class="rounded-full bg-gray-600 w-[160px] h-[160px] aspect-square">
                <img class="rounded-full w-[160px] h-[160px] aspect-square object-cover" :src="authStore.user.avatar_path" alt="" @error="event => event.target.src = defaultImgage">
            </div>
            <div class="space-y-2">
                <p class="text-lg text-zinc-400">Hồ sơ</p>
                <h1 class="text-6xl font-bold">{{ authStore.user.name }}</h1>
                <p class="mt-1 text-lg text-zinc-400">{{ myPlaylistList.length }} Playlist • {{ followArtistList.length }} nghệ sĩ đang theo dõi</p>
            </div>
        </div>

        <div class="relative px-10 overflow-auto scrollbar-style h-[calc(100vh-450px)]">
            <button class="text-zinc-400 text-3xl mb-5 p-2 rounded-full hover:bg-zinc-600 hover:text-white"
                @click="openMenu = !openMenu">
                <Icon icon="ph:dots-three-outline-fill" />
            </button>
            <span v-if="openMenu" class="absolute bg-[#282828] w-[200px] z-20 left-10 top-14 p-1">
                <ul class="text-gray-200 font-semibold text-[14px]">
                    <li class="px-3 py-2 hover:bg-[#3E3D3D] cursor-pointer" @click="openEditProfile = true">Chỉnh sửa hồ sơ</li>
                    <li class="px-3 py-2 hover:bg-[#3E3D3D] cursor-pointer" @click="openUploadSong = true">Đăng tải bài hát</li>
                    <li class="px-3 py-2 hover:bg-[#3E3D3D] cursor-pointer">Tạo một album</li>
                </ul>
            </span>
            <div>
                <h2 class="mb-4 text-lg font-semibold">Playlist của tôi</h2>
                <div class="flex overflow-x-auto space-x-7 scrollbar-style">
                    <div v-for="item in myPlaylistList" :key="item.id" class="flex-shrink-0 w-32 cursor-pointer">
                        <div class="w-full h-32 mb-2 rounded bg-zinc-700">
                        </div>
                        <p class="font-medium">{{ item.playlist.name }}</p>
                    </div>
                </div>
            </div>

            <div class="mt-8">
                <h2 class="mb-4 text-lg font-semibold">Đang theo dõi</h2>
                <div class="flex overflow-x-auto space-x-7 scrollbar-style">
                    <div v-for="item in followArtistList" :key="item.id" class="flex-shrink-0">
                        <div class="w-32 h-32 mb-5 rounded-full bg-zinc-700">
                        </div>
                        <p class="text-sm text-zinc-400">{{ item.artist.name }}</p>

                    </div>

                </div>
            </div>

            <div class="mt-8">
                <h2 class="mb-4 text-lg font-semibold">Album của tôi</h2>
                <div class="flex overflow-x-auto space-x-7 scrollbar-style">
                    <div v-for="i in 3" :key="i" class="flex-shrink-0 w-32 ">
                        <div class="w-full h-32 mb-2 rounded bg-zinc-700">
                        </div>
                        <p class="font-medium">Album#{{ i }}</p>
                        <p class="text-sm text-zinc-400">{{ i * 100 }} người theo dõi</p>
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