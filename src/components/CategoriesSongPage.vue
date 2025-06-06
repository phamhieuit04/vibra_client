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

const { categoriesData } = storeToRefs(useView)

const songByCateList = ref([])

async function getCategoriesSong() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/category/show/${categoriesData.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        songByCateList.value = res.data.data
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, "Call Api thất bại!")
    }
}


onMounted(() => {
    getCategoriesSong();
})

</script>
<template>
    <div class=" text-[#FFFF] ">
        <div class="px-16 w-full h-[calc(100vh-190px)] overflow-y-auto scrollbar-style pt-4">
            <h2 class="mb-4 text-2xl font-semibold mt-7">Danh sách nhạc {{ categoriesData.name }} nổi bật</h2>
            <div class="flex flex-wrap justify-start gap-12 ">

                <div v-if="songByCateList.length > 4" class="flex">
                    <div v-for="item in 4" :key="item.id"
                        class="px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105"
                        @click="useSong.playOrPauseThisSong(songByCateList[item])" style="width: 14.75rem;">
                        <div class="w-48 h-48 mb-2 rounded-full bg-zinc-700">
                            <img class="object-cover w-full h-full rounded-full"
                                :src="songByCateList[item].thumbnail_path">
                        </div>
                        <div class="pr-8 mt-4 text-center ">
                            <p class="font-medium">{{ songByCateList[item].name }}</p>

                            <div class="flex items-center justify-center gap-2 mt-1 text-sm text-zinc-400">
                                <p>{{ songByCateList[item].total_played }} lượt nghe</p>
                                <button @click.stop="useSong.addSongToWaitlist(songByCateList[item]);"
                                    class=" hover:bg-white/5 p-1 rounded text-[#FFE5D6]/50 ">
                                    <Icon icon="material-symbols:home-storage-outline" class="text-2xl " />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="flex">
                    <div v-for="item in songByCateList" :key="item.id"
                        class="px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105"
                        @click="useSong.playOrPauseThisSong(item)" style="width: 14.75rem;">
                        <div class="w-48 h-48 mb-2 rounded-full bg-zinc-700">
                            <img class="object-cover w-full h-full rounded-full" :src="item.thumbnail_path">
                        </div>
                        <div class="pr-8 mt-4 text-center ">
                            <p class="font-medium">{{ item.name }}</p>

                            <div class="flex items-center justify-center gap-2 mt-1 text-sm text-zinc-400">
                                <p>{{ item.total_played }} lượt nghe</p>
                                <button @click.stop="useSong.addSongToWaitlist(item);"
                                    class=" hover:bg-white/5 p-1 rounded text-[#FFE5D6]/50 ">
                                    <Icon icon="material-symbols:home-storage-outline" class="text-2xl " />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <h2 class="mt-12 mb-4 text-2xl font-semibold ">Bài hát</h2>
            <div class="pr-8 mt-3 overflow-y-auto h-[21.3rem] scrollbar-style ">
                <div v-for="item in songByCateList" :key="item.id"
                    class="flex items-center justify-between hover:bg-[#2a1d18] p-2 rounded-lg transition cursor-pointer "
                    @click="useSong.playOrPauseThisSong(item)">
                    <div class="flex items-center space-x-4">
                        <div class="w-10 h-10 rounded-md bg-zinc-700">
                            <img class="object-cover w-full h-full rounded-xl" :src="item.thumbnail_path">
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

</template>