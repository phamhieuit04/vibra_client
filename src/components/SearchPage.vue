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

const { searchKey } = storeToRefs(useActivity)

const listAlbumSearch = ref([])
const listSongSearch = ref([])
const listArtistSearch = ref([])

function checkNull() {
    if (listSongSearch.value.length > 0) {
        useSong.playThisSong(listSongSearch.value[0]);
    }
}

async function FetchSearchData() {
    if (!searchKey.value) return
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/home/search?search-key=${searchKey.value}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        if (res.data.code == 200) {
            listAlbumSearch.value = res.data.data.albums;
            listArtistSearch.value = res.data.data.artists;
            listSongSearch.value = res.data.data.songs
        }
    } catch (e) {
        console.log(e);
    }
}
watch(() => searchKey.value, () => {
    FetchSearchData();
})


onMounted(() => {
    FetchSearchData();
})
</script>
<template>
    <div class="py-8 space-y-10 text-[#FFFF]">
        <div class="px-8 overflow-y-auto scrollbar-style h-[calc(100vh-220px)]">

            <div class="text-[#FFE5D6] mb-20 ">
                <div class="flex flex-row gap-6 ">

                    <div class="relative flex-1 max-w-md">
                        <h2 class="mb-1 text-2xl font-semibold">Top tìm kiếm</h2>
                        <div class="bg-[#2a2a2a] hover:bg-[#333] transition rounded-lg p-4 cursor-pointer relative group"
                            @click="checkNull">
                            <button
                                class="absolute flex items-center justify-center w-16 h-16 transition-all transform translate-y-2 rounded-full opacity-0 bottom-6 right-6 hover:bg-black group-hover:opacity-100 group-hover:translate-y-0"
                                :style="{ backgroundColor: useView.currentColor }">
                                <span class="text-black ml-0.5 text-4xl">▶</span>
                            </button>
                            <div class="items-start space-y-3 mb-9">
                                <div class="relative w-24 h-24 overflow-hidden rounded-md bg-zinc-700">
                                    <img class="object-cover w-full h-full rounded-xl"
                                        :src="listSongSearch[0] ? listSongSearch[0]?.thumbnail_path : defaultImgage"
                                        @error="event => event.target.src = defaultImgage" alt="">
                                </div>
                                <div class="">
                                    <h3 class="text-2xl font-bold">{{ listSongSearch[0]?.name }}</h3>
                                    <p class="mt-1 text-sm text-gray-400">
                                        Bài hát • <span class="font-semibold">{{ listSongSearch[0]?.author.name
                                            }}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex-1 " v-if="listSongSearch.length > 0">
                        <h2 class="mb-1 text-2xl font-semibold ">Bài hát</h2>
                        <div class="h-56 pr-8 mt-3 overflow-y-auto scrollbar-style">
                            <div v-for="item, index in listSongSearch" :key="item.id"
                                class="flex items-center justify-between hover:bg-[#2a1d18] p-2 rounded-lg transition cursor-pointer "
                                @click="useSong.playThisSong(item)">
                                <div class="flex items-center space-x-4">
                                    <div class="w-10 h-10 rounded-md bg-zinc-700">
                                        <img class="object-cover w-full h-full rounded-xl" :src="item?.thumbnail_path"
                                            @error="event => event.target.src = defaultImgage">
                                    </div>
                                    <span class="font-medium ">{{ item.name }}</span>
                                </div>
                                <div class="flex items-center space-x-8 text-sm">
                                    <span>{{ item.total_played }} lượt nghe</span>
                                    <button @click.stop="useSong.addSongToWaitlist(item);"
                                        class=" hover:bg-white/5 p-1 rounded text-[#FFE5D6]/50 mr-4">
                                        <Icon icon="material-symbols:home-storage-outline" class="text-2xl " />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


            <div class="text-[#FFE5D6] mb-8" v-if="listArtistSearch.length > 0">
                <h2 class="mb-1 text-2xl font-semibold">Nghệ sĩ</h2>
                <div class="flex space-x-4 overflow-x-auto scrollbar-style">
                    <div class="flex px-1 py-2 space-x-4 w-max">
                        <div v-for="item in listArtistSearch" :key="item.id"
                            class="flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105 "
                            @click="useView.selectItem(item); useView.setComponent('ArtistPage'); useView.setArtistData(item);">
                            <div class="w-48 h-48 mb-2 rounded-full bg-zinc-700">
                                <img class="object-cover w-48 h-48 rounded-full" :src="item.avatar_path"
                                    @error="event => event.target.src = defaultImgage">
                            </div>
                            <p class="font-medium ">{{ item.name }}</p>
                            <p class="text-sm ">{{ item.followers }} người theo dõi</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-[#FFE5D6] mb-8" v-if="listAlbumSearch.length > 0">
                <h2 class="mb-1 text-2xl font-semibold">Albums</h2>
                <div class="w-full overflow-x-auto overflow-y-hidden scrollbar-style">
                    <div class="flex px-1 py-2 space-x-4 w-max scrollbar-none">
                        <div v-for="item in listAlbumSearch" :key="item.id"
                            class="flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105 "
                            @click="useView.selectItem(item); useView.setComponent('PlaylistPage'); useView.setPlaylistData(item);">
                            <div class="w-48 h-48 mb-2 rounded-xl bg-zinc-700">
                                <img class="object-cover w-48 h-48 rounded-xl" :src="item.thumbnail_path"
                                    @error="event => event.target.src = defaultImgage">
                            </div>
                            <p class="font-medium ">{{ item.name }}</p>
                            <p class="text-sm ">{{ item.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>