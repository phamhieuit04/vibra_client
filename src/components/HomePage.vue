<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '@/stores/auth';
import { useViewStore } from "@/stores/view";
import axios from 'axios';
import { useSongStore } from "@/stores/song";
import defaultImgage from '@/assets/default.jpg'

const useView = useViewStore()
const authStore = useAuthStore();
const useSong = useSongStore();
const router = useRouter();

const popularAlbum = ref([]);
const topArtist = ref([]);
const topSong = ref([]);


async function FetchAlbumData() {
    try {
        const res = await axios.get('http://spotify_clone_api.test/api/home/list-album', {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            },
        });
        popularAlbum.value = res.data.data;
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
}
async function FetchArtistData() {
    try {
        const res = await axios.get('http://spotify_clone_api.test/api/home/list-artist', {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            },
        });
        topArtist.value = res.data.data;
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
}
async function FetchSongData() {
    try {
        const res = await axios.get('http://spotify_clone_api.test/api/home/list-song', {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            },
        });
        topSong.value = res.data.data;
        console.log(topSong.value)
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
}

onMounted(() => {
    FetchAlbumData();
    FetchArtistData();
    FetchSongData();
})

</script>
<template>
    <div class="py-8 space-y-10 text-white ">
        <div class="px-8 overflow-auto scrollbar-style h-[calc(100vh-180px)]">

            <div class="text-[#FFE5D6] mb-8">
                <h2 class="mb-1 text-2xl font-semibold">Album phổ biến</h2>
                <div class="flex space-x-4 overflow-x-auto scrollbar-style">
                    <div class="flex px-1 py-2 space-x-4 w-max">
                        <div v-for="item in popularAlbum" :key="popularAlbum.id" class="cursor-pointer flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg hover:scale-105 ">
                            <div @click="useView.selectItem(item); useView.setComponent('PlaylistPage'); useView.setPlaylistData(item);">
                                <div class="w-48 h-48 mb-2 rounded-xl bg-zinc-700">
                                    <img class="object-cover rounded-xl w-48 h-48" :src="item.thumbnail_path" alt="" @error="event => event.target.src = defaultImgage">
                                </div>
                                <p class="font-medium ">{{ item.name }}</p>
                                <p class="text-sm ">{{ item.total_song }} bài hát</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-[#FFE5D6] mb-8">
                <h2 class="mb-1 text-2xl font-semibold">Nghệ sĩ với nhiều người theo dõi</h2>
                <div class="flex space-x-4 overflow-x-auto scrollbar-style">
                    <div class="flex px-1 py-2 space-x-4 w-max">
                        <div v-for="item in topArtist" :key="item.id" class="cursor-pointer flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg hover:scale-105 ">
                            <div @click="useView.selectItem(item); useView.setComponent('ArtistPage');">
                                <div class="w-48 h-48 mb-2 rounded-full bg-zinc-700">
                                    <img class="rounded-full w-48 h-48 object-cover" :src="item.avatar_path" alt="" @error="event => event.target.src = defaultImgage">
                                </div>
                                <p class="font-medium ">{{ item.name }}</p>
                                <p class="text-sm ">{{ item.followers }} người theo dõi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="text-[#FFE5D6] mb-8">
                <h2 class="mb-1 text-2xl font-semibold">Bài hát có nhiều lượt nghe</h2>
                <div class="flex space-x-4 overflow-x-auto scrollbar-style">
                    <div class="flex px-1 py-2 space-x-4 w-max">
                        <div v-for="item in topSong" :key="item.id" class="cursor-pointer flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg hover:scale-105" 
                            @click="useSong.playOrPauseThisSong(topSong, item);">
                            <div class="w-40 h-40 mb-2 rounded-full bg-zinc-700">
                                <img class="object-cover rounded-full w-40 h-40" :src="item.thumbnail_path" alt="" @error="event => event.target.src = defaultImgage">
                            </div>
                            <p class="font-medium ">{{ item.name }}</p>
                            <p class="text-sm ">{{ item.total_played }} lượt nghe</p>
                        </div>
                    </div>
                </div>
            </div>


            <!-- <div class="mt-7 text-[#FFE5D6]">
                <div class="flex items-center mb-3 space-x-3 ">
                    <img class="rounded-full" width="80"
                        src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-1/327906584_1623414034763055_2313595742443607128_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=110&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeHU7kPK7H2yzZUnTlh8ZMxVOMNfpq35Qsw4w1-mrflCzMYLokSXxT9J2NllOm6moxIp2TS6fKMX1p8w3b7z9m_q&_nc_ohc=nRmSn2BIUxwQ7kNvwGlh4B8&_nc_oc=AdmeH6EkPvPHiDDMzv4fs5mYVufKYGAt-P-PW8-hxM6Qy6ipvVZoJnbJ0lMczr6MdDKbxbXhT1Bsy8lvwrKEGdAY&_nc_zt=24&_nc_ht=scontent.fhan2-4.fna&_nc_gid=lCIC4Bx56CiH104oBXlJ1Q&oh=00_AfJEry-lRiRTpncqdE8Ipt728bj62-uIybneG90y_Zv5NA&oe=682F775F"
                        alt="">
                    <div class="space-y-1 ">
                        <p class="text-lg ">Dành cho fan của</p>
                        <h2 class="mb-4 text-3xl font-semibold ">XXXTentacion</h2>
                    </div>
                </div>
                <div class="flex space-x-4 overflow-x-auto scrollbar-style ">
                    <div v-for="i in 30" :key="i" class="flex-shrink-0 w-48 ">
                        <div class="w-48 h-48 mb-2 rounded-xl bg-zinc-700">
                        </div>
                        <p class="font-medium">???{{ i }}</p>
                        <p class="text-sm ">{{ i * 100 }} ???</p>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>