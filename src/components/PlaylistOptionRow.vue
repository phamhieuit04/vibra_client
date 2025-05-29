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

const props = defineProps({
    item: Object,
})

const { item } = toRefs(props)
const { currentTrack } = storeToRefs(useSong)
const listSong = ref([])


async function getListSong() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/playlist/show/${item.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        listSong.value = res.data.data
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
}

async function addSong() {
    // console.log(currentTrack.value)
    // console.log(item.value)
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/song/add-song-to-playlist?song_id=${currentTrack.value.id}&playlist_id=${item.value.playlist.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            },
        });
        if(res.data.code == 200) {
            useActivity.fetchData();
        }
        console.log(res)
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
}







</script>
<template>
    <div v-if="true" class="flex hover:bg-[#3E3D3D] my-1 cursor-pointer" @click="addSong">
        <div class="px-3 py-2">
            {{ item.playlist.name }}
        </div>
    </div>
</template>