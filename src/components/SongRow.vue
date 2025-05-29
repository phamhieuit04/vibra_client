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


const useView = useViewStore();
const authStore = useAuthStore();
const useModal = useModalStore();
const useActivity = useActivityStore();
const { favSongList } = storeToRefs(useActivity)
const useSong = useSongStore()
const { isPlaying, currentTrack } = storeToRefs(useSong)

let isHover = ref(false);
let isTrackTime = ref(null);

const props = defineProps({
    track: Object,
    playlist: Object,
    index: Number,
    isFav: Boolean,
})

const { track, playlist, index, isFav } = toRefs(props);
const emit = defineEmits(['deleteFavSong', 'deletePlaylistSong'])

async function unloveThisSong() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/library/destroy-favorite-song/${track.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });

        if (res.data.code == 200) {
            useActivity.fetchData();
            emit('deleteFavSong', track.value.id)
        }
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
}

async function removeFromPlaylist() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/song/destroy?song_id=${track.value.id}&playlist_id=${playlist.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            },
        });
        if (res.data.code == 200) {
            useActivity.fetchData();
            emit('deletePlaylistSong', track.value.id)
        }
        console.log(res)
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
}

onMounted(() => {
    const audio = new Audio(track.value.song_path);
    audio.addEventListener('loadedmetadata', function () {
        const duration = audio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        isTrackTime.value = minutes + ':' + seconds.toString().padStart(2, '0');
    })
})

</script>
<template>
    <li class="flex items-center justify-between rounded-md hover:bg-[#2A2929] cursor-pointer"
        @mouseenter="isHover = true" @mouseleave="isHover = false" @click="useSong.playOrPauseThisSong(track)">
        <div class="flex items-center w-full py-1.5">
            <div v-if="isHover" class="w-[40px] ml-[14px] mr-[6px] cursor-pointer">
                <Icon icon="material-symbols:play-arrow-rounded" v-if="!isPlaying" class="size-7 text-white" />
                <Icon icon="material-symbols:play-arrow-rounded"
                    v-else-if="isPlaying && currentTrack.name !== track.name" class="size-7 text-white" />
                <Icon icon="material-symbols:pause-rounded" v-else class="size-7 text-white" />
            </div>
            <div v-else class="text-white font-semibold w-[40px] ml-5 p-1">
                <span :class="{ 'text-green-500': currentTrack && currentTrack.name == track.name }">
                    {{ index }}
                </span>
            </div>
            <div>
                <div :class="{ 'text-green-500': currentTrack && currentTrack.name == track.name }"
                    class="text-white font-semibold ">
                    {{ track.name }}
                </div>
                <span class="text-sm font-semibold text-gray-400">{{ track.author.name }}</span>
            </div>
        </div>
        <div class="flex items-center">
            <div v-if="isTrackTime" class="text-xs mx-5 text-gray-400">
                {{ isTrackTime }}
            </div>
            <button @click.stop="useSong.addSongToWaitlist(track);"
                class=" hover:bg-white/5 p-1 rounded text-[#FFE5D6]/50 mr-4">
                <Icon icon="material-symbols:home-storage-outline" class=" text-2xl" />
            </button>
            <button v-if="!isFav" @click.stop="unloveThisSong"
                class=" hover:bg-white/5 p-1 rounded text-[#FFE5D6]/50 mr-4">
                <Icon icon="material-symbols:delete-rounded" class=" text-2xl" />
            </button>
            <button v-if="playlist.type === 2" @click.stop="removeFromPlaylist"
                class=" hover:bg-white/5 p-1 rounded text-[#FFE5D6]/50 mr-4">
                <Icon icon="material-symbols:delete-rounded" class=" text-2xl" />
            </button>
        </div>
    </li>
</template>