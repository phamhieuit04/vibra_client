<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { Icon } from '@iconify/vue';
import FujiiKazeAlbum from "@/assets/FujiiKazeAlbum.json"
import FavPlaylist from "@/assets/FavPlaylist"
import { useViewStore } from "@/stores/view";
import { storeToRefs } from "pinia";
import { useSongStore } from "@/stores/song";
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import defaultImgage from '@/assets/default.jpg'
import { useModalStore } from "@/stores/modal";

const useView = useViewStore();
const authStore = useAuthStore();
const useSong = useSongStore();
const useModal = useModalStore();

const { openEditPlaylist } = storeToRefs(useModal)

const artistList = ref([]);
const myPlaylistList = ref([]);
const albumList = ref([]);

const filter = ref('all');
const search = ref('');

const filteredPlaylist = computed(() => {
    return myPlaylistList.value.filter(item =>
        item.playlist.name.toLowerCase().includes(search.value.toLowerCase()));
})
const filteredAlbum = computed(() => {
    return albumList.value.filter(item =>
        item.playlist.name.toLowerCase().includes(search.value.toLowerCase()));
})
const filteredArtist = computed(() => {
    return artistList.value.filter(item =>
        item.artist.name.toLowerCase().includes(search.value.toLowerCase()));
})

async function FetchData() {
    try {
        const albumRes = await axios.get('http://spotify_clone_api.test/api/library/list-playlist?type=1', {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            },
            'type': 1
        });
        const myPlaylistRes = await axios.get('http://spotify_clone_api.test/api/library/list-playlist?type=2', {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            },
            'type': 2
        });
        const artistRes = await axios.get('http://spotify_clone_api.test/api/library/list-artist', {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        const songRes = await axios.get('http://spotify_clone_api.test/api/library/list-song', {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        artistList.value = artistRes.data.data
        myPlaylistList.value = myPlaylistRes.data.data
        albumList.value = albumRes.data.data
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
}

const createPlaylist = async () => {
    try {
        const res = await axios.post(
            'http://spotify_clone_api.test/api/library/store-playlist',
            {},
            {
                headers: {
                    Authorization: 'Bearer ' + authStore.user.token,
                },
            }
        );
        console.log(res.data);
        alert('Tạo playlist thành công!');
        FetchData();
    } catch (error) {
        console.error('Lỗi khi tạo playlist:', error);
        alert('Tạo playlist thất bại!');
    }
};

const deletePlaylist = async (id) => {
    try {
        const res = await axios.get(
            `http://spotify_clone_api.test/api/library/destroy-playlist/${id}`,
            {
                headers: {
                    Authorization: 'Bearer ' + authStore.user.token,
                },
            }
        );
        alert('Xóa playlist thành công!');
        FetchData();
        useView.setComponent('HomePage');
    } catch (error) {
        console.error('Lỗi khi xóa playlist:', error);
        alert('Xóa playlist thất bại!');
    }
}
const editPlaylist = async (playlist) => {
    useModal.setPlaylistEditData(playlist);
     openEditPlaylist.value = true;
}

watch(() => openEditPlaylist.value, (newVal, oldVal) => {
    if (oldVal === true && newVal === false) {
      console.log('Modal vừa đóng!!!!!!!!!!!!!!!!!!!!!!!!!!');
      FetchData();
    }
  }
)

onMounted(() => {
    FetchData();
})
</script>
<template>
    <div class="fixed top-0 bottom-0 left-0 w-full bg-[#BC4D15] z-0"></div>
    <div class="w-[420px] h-[100%] fixed bottom-0 top-[64px] left-1.5 z-50 p-6 bg-[#1D1512] rounded-[24px]">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-[#FFE5D6] text-xl font-semibold">Thư viện</h2>
            <div class="flex items-center gap-2">
                <button @click="createPlaylist"
                    class="flex items-center gap-2 px-3 py-1 rounded-full bg-[#47342D] text-sm text-[#FFE5D6] hover:bg-transparent">
                    <span class="text-base font-semibold">+</span>
                    <span class="font-semibold">Tạo</span>
                </button>
            </div>
        </div>

        <div class="flex gap-2 mb-4">
            <button class="font-semibold bg-[#47342D] px-3 py-1 text-sm rounded-full hover:bg-[#47342D]/20"
                :class="filter === 'all' ? 'bg-[#FFE5D6] text-[#47342D]' : 'bg-[#47342D] text-[#FFE5D6]'"
                @click="filter = 'all'">
                Tất cả
            </button>
            <button class="font-semibold bg-[#47342D] px-3 py-1 text-sm rounded-full hover:bg-[#47342D]/20"
                :class="filter === 'playlist' ? 'bg-[#FFE5D6] text-[#47342D]' : 'bg-[#47342D] text-[#FFE5D6]'"
                @click="filter = 'playlist'">
                Danh sách phát
            </button>
            <button class="font-semibold bg-[#47342D] px-3 py-1 text-sm rounded-full hover:bg-[#47342D]/20"
                :class="filter === 'artist' ? 'bg-[#FFE5D6] text-[#47342D]' : 'bg-[#47342D] text-[#FFE5D6]'"
                @click="filter = 'artist'">
                Nghệ sĩ
            </button>
        </div>

        <input type="text" v-model="search" placeholder="Tìm kiếm"
            class="w-full px-3 py-1.5 rounded-full border border-[#BC4D15] bg-[#1D1512] text-[#FFE5D6] text-sm mb-4 focus:ring-11 focus:ring-[#BC4D15] focus:outline-none" />

        <div class="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">

            <div v-for="(item, index) in filteredPlaylist" :key="index" v-if="filter == 'all' || filter == 'playlist'"
                class="flex items-center gap-3 p-2 rounded hover:bg-white/10 cursor-pointer"
                @click="useView.selectItem(item); useView.setComponent('PlaylistPage'); useView.setPlaylistData(item.playlist);"
                :class="{ 'bg-white/10': useView.selected === item }">
                <div class="w-10 h-10 bg-white/10 flex items-center justify-center rounded">
                    <img :src="item.playlist.thumbnail_path" class="object-cover rounded w-10 h-10" @error="event => event.target.src = defaultImgage"/>
                </div>

                <div>
                    <div class="text-[#FFE5D6] font-semibold leading-4">{{ item.playlist.name }}</div>
                    <div class="text-[#FFE5D6]/50 text-s font-medium">
                        {{ item.playlist.type === 2 ? 'Danh sách phát • ' + item.playlist.total_song + " bài hát" :
                            'Album của nghệ sĩ • ' + item.playlist.total_song + " bài hát" }}
                    </div>
                </div>
                <div class="ml-auto">
                    <button class=" hover:bg-white/5 p-2 rounded text-[#FFE5D6]/50"
                        @click.stop="editPlaylist(item.playlist); console.log(item.playlist);">
                        <Icon icon="material-symbols:edit-square-rounded" class=" text-xl" />
                    </button>
                    <button class=" hover:bg-white/5 p-1 rounded text-[#FFE5D6]/50"
                        @click.stop="deletePlaylist(item.playlist_id)">
                        <Icon icon="material-symbols:delete-rounded" class=" text-2xl" />
                    </button>
                </div>
            </div>

            <div v-for="(item, index) in filteredAlbum" :key="index" v-if="filter == 'all' || filter == 'playlist'"
                class="flex items-center gap-3 p-2 rounded hover:bg-white/10 cursor-pointer"
                @click="useView.selectItem(item); useView.setComponent('PlaylistPage'); useView.setPlaylistData(item.playlist);"
                :class="{ 'bg-white/10': useView.selected === item }">
                <div class="w-10 h-10 bg-white/10 flex items-center justify-center rounded">
                    <img :src="item.playlist.thumbnail_path" class="object-cover rounded w-10 h-10" @error="event => event.target.src = defaultImgage"/>
                </div>

                <div>
                    <div class="text-[#FFE5D6] font-semibold leading-4">{{ item.playlist.name }}</div>
                    <div class="text-[#FFE5D6]/50 text-s font-medium">
                        {{ item.playlist.type === 2 ? 'Danh sách phát • ' + item.playlist.total_song + " bài hát" :
                            'Album của nghệ sĩ • ' + item.playlist.total_song + " bài hát" }}
                    </div>
                </div>
                <div class="ml-auto">
                    <button class=" hover:bg-white/5 p-1 rounded text-[#FFE5D6]/50"
                        @click.stop="deletePlaylist(item.playlist_id)">
                        <Icon icon="material-symbols:delete-rounded" class="text-2xl" />
                    </button>
                </div>
            </div>

            <div v-for="(item, index) in filteredArtist" :key="index" v-if="filter == 'all' || filter == 'artist'"
                class="flex items-center gap-3 p-2 rounded hover:bg-white/10 cursor-pointer"
                @click="useView.selectItem(item.artist); console.log(useView.selected.email); useView.setComponent('ArtistPage'); useView.setArtistData(item.artist);"
                :class="{ 'bg-white/10': useView.selected?.email == item.artist.email }">
                <div class="w-10 h-10 bg-white/10 flex items-center justify-center rounded-full">
                    <img :src="item.artist.avatar_path" class="object-cover rounded-full w-10 h-10" @error="event => event.target.src = defaultImgage"/>
                </div>

                <div>
                    <div class="text-[#FFE5D6] font-semibold leading-4">{{ item.artist.name }}</div>
                    <div class="text-[#FFE5D6]/50 text-s font-medium">
                        {{ ' Nghệ sĩ ' }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>