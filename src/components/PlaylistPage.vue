<script setup>
import SongRow from './SongRow.vue';
import { Icon } from '@iconify/vue';
import { useSongStore } from "@/stores/song";
import { useViewStore } from '@/stores/view';
import { storeToRefs } from "pinia";

const useView = useViewStore()
const { playlistData } = storeToRefs(useView)

</script>
<template>
    <div class="p-8">
        <div class="py-15"></div>

        <div class="flex items-center w-full relative h-full">
            <img :src="playlistData.albumCover" class="w-[240px]">
            <div class="w-full ml-5">

                <div class="text-white text-lg font-semibold">Album</div>
                <div class="text-white text-8xl font-bold text-nowrap">
                    {{ playlistData.name }}
                </div>

                <div class="text-gray-300 text-[13px] mt-[20px] flex">
                    <div class="flex">{{ playlistData.artist }}</div>
                    <i class="fa-solid fa-circle flex mt-[9px] ml-2 mr-2 text-[5px]"></i>
                    <div class="flex">{{ playlistData.releaseYear }}</div>
                    <i class="fa-solid fa-circle flex mt-[9px] ml-2 mr-2 text-[5px]"></i>
                    <span class="flex">{{ playlistData.tracks.length }} songs</span>
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
        <ul class="w-full" v-for="track, index in playlistData.tracks" :key="track">
            <SongRow :playlist="playlistData" :track="track" :index="++index" />
        </ul>

    </div>
</template>