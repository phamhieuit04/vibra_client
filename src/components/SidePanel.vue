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
import defaultImgage from '@/assets/default.jpg'
import { useActivityStore } from "@/stores/activity";

const useView = useViewStore();
const authStore = useAuthStore();
const useSong = useSongStore();
const useModal = useModalStore();
const useActivity = useActivityStore();
const { allCategories } = storeToRefs(useActivity)
const { currentTrack } = storeToRefs(useSong)
const { followArtistList } = storeToRefs(useActivity)

const isFollowed = ref(false) 


async function followThisArtist() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/artist/follow/${currentTrack.value.author.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        useActivity.fetchData();
        isFollowed.value = !isFollowed.value
        useActivity.addNotify(false, "Đã theo dõi nghệ sĩ!")
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, "Call Api thất bại!")
    }
}
async function unfollowThisArtist() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/library/destroy-favorite-artist/${currentTrack.value.author.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        useActivity.fetchData();
        isFollowed.value = !isFollowed.value
        useActivity.addNotify(false, "Đã bỏ theo dõi nghệ sĩ!")
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, "Call Api thất bại!")
    }
}

watch(() => currentTrack.value, () => {
    isFollowed.value = false
    followArtistList.value.forEach(artist => {
        if (artist.artist_id === currentTrack.value.author.id) {
            isFollowed.value = true
        }
    })
  }
)

onMounted(() => {
    isFollowed.value = false
    followArtistList.value.forEach(artist => {
        if (artist.artist_id === currentTrack.value.author.id) {
            isFollowed.value = true
        }
    })
})
</script>
<template>
    <div class="relative w-full  h-[calc(100vh-155px)] text-white bg-slate-400">
        <div class="h-full">
            <img class="object-cover w-full h-full opacity-50" :src="currentTrack.thumbnail_path" >
        </div>

        <div class="absolute w-11/12 p-4 transform -translate-x-1/2  bottom-5 left-1/2 bg-[#1D1512] rounded-2xl">
            <h2 class="mb-3 text-sm font-semibold ">Giới thiệu về nghệ sĩ </h2>
            <div class="flex items-center justify-between mb-4">
                <div class="w-16 h-16 bg-gray-600 rounded-full">
                    <img class="object-cover w-full h-full rounded-full" :src="currentTrack.author.avatar_path" >
                </div>
                <div v-if="currentTrack.author.id !== authStore.user.id">
                    <button v-if="!isFollowed" @click="followThisArtist" class="border border-[#BC4D15] text-[#BC4D15] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#BC4D15] hover:text-black transition">
                        Theo dõi
                    </button>
                    <button v-else @click="unfollowThisArtist" class="border border-[#BC4D15] text-[#BC4D15] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#BC4D15] hover:text-black transition">
                        Hủy theo dõi
                    </button>
                </div>
            </div>

            <div>
                <h3 class="text-2xl font-semibold">{{ currentTrack.name }}</h3>
                <p class="text-sm text-zinc-400">{{ currentTrack.author.followers }} người theo dõi</p>
                <h2 class="mt-2 mb-1 text-sm font-semibold ">Album {{ currentTrack.playlist.name }} </h2>
                <div class=" overflow-y-auto max-h-24 scrollbar-none">
                    <p class="mt-1 text-sm">{{ currentTrack.playlist.description }}</p>
                </div>
                <h2 class="mt-5 mb-2 text-sm font-semibold ">Về bài hát bạn đang nghe </h2>
                <div class=" overflow-y-auto max-h-24 scrollbar-none">
                    <p class="mt-2 text-sm">{{ currentTrack.description }}</p>
                </div>
            </div>
        </div>
    </div>
    
</template>