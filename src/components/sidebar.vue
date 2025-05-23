<script setup>
import { ref, computed } from "vue";
import { Icon } from '@iconify/vue';
import FujiiKazeAlbum from "@/assets/FujiiKazeAlbum.json"
import FavPlaylist from "@/assets/FavPlaylist"
import { useViewStore } from "@/stores/view";
import { storeToRefs } from "pinia";
import { useSongStore } from "@/stores/song";

const useView = useViewStore();
const useSong = useSongStore();

const filter = ref('all');
const search = ref('');

const items = ref([
    FavPlaylist,
    FujiiKazeAlbum
]);

const filteredItems = computed(() => {
    if (filter.value === 'all') {
        return items.value.filter(item =>
            item.name.toLowerCase().includes(search.value.toLowerCase()));
    }
    else if (filter.value === 'playlist') {
        return items.value.filter(
            (item) =>
                (item.type === 1 || item.type === 2) && item.name.toLowerCase().includes(search.value.toLowerCase()));
    }
    else {
        // Nghệ sĩ
    }
});
</script>
<template>
	<div class="fixed top-0 bottom-0 left-0 w-full bg-[#BC4D15] z-0"></div>
    <div class="w-[420px] h-[100%] fixed bottom-0 top-[64px] left-1.5 z-50 p-6 bg-[#1D1512] rounded-[24px]">
        <div class="flex justify-between items-center mb-4">
            <h2  class= "text-[#FFE5D6] text-xl font-semibold">Thư viện</h2>
            <div class="flex items-center gap-2">
                <button 
                class="flex items-center gap-2 px-3 py-1 rounded-full bg-[#47342D] text-sm" 
                :class="filter === 'add' ? 'bg-[#FFE5D6] text-[#47342D]' : 'bg-[#47342D] text-[#FFE5D6]'" @click="filter = 'add'" >
                <span class="text-base font-semibold">+</span>
                <span class="font-semibold">Tạo</span>
                </button>
            </div>
        </div>

        <div class="flex gap-2 mb-4">
            <button  class="font-semibold bg-[#47342D] px-3 py-1 text-sm rounded-full hover:bg-[#47342D]/20"
                :class="filter === 'all' ? 'bg-[#FFE5D6] text-[#47342D]' : 'bg-[#47342D] text-[#FFE5D6]'" @click="filter = 'all'">
                Tất cả
            </button>
            <button   class="font-semibold bg-[#47342D] px-3 py-1 text-sm rounded-full hover:bg-[#47342D]/20"
                :class="filter === 'playlist' ? 'bg-[#FFE5D6] text-[#47342D]' : 'bg-[#47342D] text-[#FFE5D6]'" @click="filter = 'playlist'">
                Danh sách phát
            </button>
            <button   class="font-semibold bg-[#47342D] px-3 py-1 text-sm rounded-full hover:bg-[#47342D]/20" 
                :class="filter === 'artist' ? 'bg-[#FFE5D6] text-[#47342D]' : 'bg-[#47342D] text-[#FFE5D6]'" @click="filter = 'artist'">
                Nghệ sĩ
            </button>
        </div>
        
        <input type="text" v-model="search" placeholder="Tìm kiếm"  
            class="w-full px-3 py-1.5 rounded-full border border-[#BC4D15] bg-[#1D1512] text-[#FFE5D6] text-sm mb-4 focus:ring-11 focus:ring-[#BC4D15] focus:outline-none" />

        <div class="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div v-for="(item, index) in filteredItems":key="index"
                class="flex items-center gap-3 p-2 rounded hover:bg-white/10 cursor-pointer"
                @click="useView.selectItem(item); useView.setComponent('PlaylistPage'); useView.setPlaylistData(item);"
                :class="{ 'bg-white/10': useView.selected === item }">
                <img :src="item.albumCover" class="w-10 h-10 rounded object-cover" v-if="item.albumCover" />
                <div v-else class="w-10 h-10 bg-white/10 flex items-center justify-center rounded">
                    🎵
                </div>

                <div>
                    <div  class="text-[#FFE5D6] font-semibold leading-4">{{ item.name }}</div>
                    <div  class="text-[#FFE5D6]/50 text-s font-medium">
                        {{ item.type === 2 ? 'Danh sách phát • ' + item.tracks.length + " bài hát" : 'Album của nghệ sĩ • ' + item.tracks.length + " bài hát"}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>