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
import PlayerFunc from "./PlayerFunc.vue";
import PlaylistOptionRow from "./PlaylistOptionRow.vue";

const useView = useViewStore();
const authStore = useAuthStore();
const useSong = useSongStore();
const useModal = useModalStore();
const useActivity = useActivityStore();
const { isFullscreen } = storeToRefs(useView)
const { isPlaying, audio, currentPlaylist, currentTrack, isShuffle } = storeToRefs(useSong)
const { favSongList, myPlaylistList } = storeToRefs(useActivity)

let isHover = ref(false)
let isTrackTimeCurrent = ref(null)
let isTrackTimeTotal = ref(null)
let seeker = ref(null)
let seekerContainer = ref(null)
let range = ref(0)

const isLoved = ref(false)

const openMenu = ref(false)

async function loveThisSong() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/song/store/${currentTrack.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });

        if (res.data.code == 200) {
            useActivity.fetchData();
            isLoved.value = !isLoved.value
        }
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
}
async function unloveThisSong() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/library/destroy-favorite-song/${currentTrack.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });

        if (res.data.code == 200) {
            useActivity.fetchData();
            isLoved.value = !isLoved.value
        }
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
}

onMounted(() => {
    isPlaying.value = false
    if (!currentTrack.value) return;

    if (audio.value) {
        setTimeout(() => {
            timeupdate()
            loadmetadata()
        }, 300)
    }
    if (currentTrack.value) {
        seeker.value.addEventListener('change', function () {
            const time = audio.value.duration * (seeker.value.value / 100)
            audio.value.currentTime = time
        })

        seeker.value.addEventListener('mousedown', function () {
            audio.value.pause()
            isPlaying.value = false
        })

        seeker.value.addEventListener('mouseup', function () {
            audio.value.play()
            isPlaying.value = true
        })

        seekerContainer.value.addEventListener('click', function (e) {
            const clickPosition = (e.pageX - seekerContainer.value.offsetLeft) / seekerContainer.value.offsetWidth;
            const time = audio.value.duration * clickPosition;
            audio.value.currentTime = time;
            seeker.value.value = (100 / audio.value.duration) * audio.value.currentTime;
        })
    }
})

function onUserPress() {
    openMenu.value = false
}

const timeupdate = () => {
    if (!audio.value) return
    audio.value.addEventListener('timeupdate', function () {
        var minutes = Math.floor(audio.value.currentTime / 60)
        var seconds = Math.floor(audio.value.currentTime - minutes * 60)
        isTrackTimeCurrent.value = minutes + ':' + seconds.toString().padStart(2, '0')
        const value = (100 / audio.value.duration) * audio.value.currentTime
        range.value = value
        seeker.value.value = value
    })
}

const loadmetadata = () => {
    audio.value.addEventListener('loadedmetadata', function () {
        const duration = audio.value.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        isTrackTimeTotal.value = minutes + ':' + seconds.toString().padStart(2, '0');
    })
}

watch(() => favSongList.value.songs, () => {
    isLoved.value = false
    favSongList.value.songs.forEach(song => {
        if (song.id === currentTrack.value.id) {
            isLoved.value = true
        }
    })
}
)
watch(() => currentTrack.value, () => {
    openMenu.value = false
    isLoved.value = false
    favSongList.value.songs.forEach(song => {
        if (song.id === currentTrack.value.id) {
            isLoved.value = true
        }
    })
}
)

watch(() => audio.value, () => {
    if (!currentTrack.value) return;
    timeupdate()
    loadmetadata()
})

watch(() => isTrackTimeCurrent.value, (time) => {
    if (!currentTrack.value) return;
    if (time && time == isTrackTimeTotal.value) {
        useSong.nextSongs();
    }
})

</script>

<template>
    <div id="MusicPlayer"
        class="fixed bottom-0 flex items-center justify-between w-full z-50 h-[90px] bg-[#181413] border-t border-t-[#272727]">
        <div class=" flex items-center w-1/4 ">
            <div class="flex items-center ml-4">
                <img class="rounded-sm shadow-2xl object-cover" width="55" :src="currentTrack['thumbnail_path']"
                    @error="event => event.target.src = defaultImgage" />
                <div class="ml-4">
                    <div style="font-family: 'Montserrat', sans-serif;"
                        class="text-[17px] text-[#FFE5D6] font-bold hover:underline cursor-pointer">
                        {{ currentTrack ? currentTrack['name'] : 'Bài hát' }}
                    </div>
                    <div style="font-family: 'Montserrat', sans-serif;"
                        class="text-[13px] text-[#FFE5D6]/30 font-medium hover:text-white hover:underline cursor-pointer">
                        {{ currentTrack ? currentTrack.author.name : 'Tác giả' }}
                    </div>
                </div>
            </div>
            <div class="flex items-center ml-8">
                <Icon v-if="!isLoved" @click="loveThisSong" icon="solar:heart-linear"
                    class="text-[#FFE5D6] text-[23px] cursor-pointer" />
                <Icon v-else @click="unloveThisSong" icon="solar:heart-bold"
                    class="text-[#FFE5D6] text-[23px] cursor-pointer" />
                <Icon @click="openMenu = !openMenu" icon="material-symbols:add-circle-outline"
                    class="text-[#FFE5D6] text-[23px] ml-5 cursor-pointer" />
                <a href="/paysuccess">
                    <Icon icon="material-symbols:arrow-circle-down-outline-rounded"
                        class="text-[#FFE5D6] text-[23px] ml-5 cursor-pointer" />
                </a>
            </div>
            <span v-if="openMenu" class="absolute bg-[#282828] z-20 left-[250px] bottom-[68px]  p-1">
                <div class="text-gray-200 font-semibold">
                    <PlaylistOptionRow v-for="item in myPlaylistList" :key="item.id" :item="item"
                        @user-press="onUserPress" />
                </div>
            </span>
        </div>

        <div class="max-w-[35%] mx-auto w-2/4">
            <div class=" flex-col items-center justify-center">
                <div class="flex items-center justify-center h-[30px]">
                    <button v-if="isShuffle" class="mx-2" @click="isShuffle = false">
                        <Icon icon="mdi:shuffle" class=" text-[#FFE5D6] size-5" />
                    </button>
                    <button v-else class="mx-2" @click="isShuffle = true">
                        <Icon icon="mdi:shuffle-disabled" class=" text-[#FFE5D6] size-5" />
                    </button>


                    <button class="mx-2" @click="useSong.prevSongs">
                        <Icon icon="fa6-solid:backward-step" class=" text-[#FFE5D6] size-7" />
                    </button>
                    <button class="p-1 rounded-full mx-3" @click="useSong.playOrPauseThisSong(currentTrack)">
                        <Icon icon="material-symbols:play-circle-rounded" v-if="!isPlaying"
                            class="size-12 text-white" />
                        <Icon icon="material-symbols:pause-circle" v-else class="size-12 text-white" />
                    </button>
                    <button class="mx-2" @click="useSong.nextSongs();">
                        <Icon icon="fa6-solid:forward-step" class=" text-[#FFE5D6] size-7" />
                    </button>

                    <button class="mx-2" @click="useView.setComponent('HomePage'); useView.selectItem(this)">
                        <Icon icon="tabler:poo-filled" 
                            class="text-[#FFE5D6]  transition duration-200 cursor-pointer size-5 hover:text-white" 
                            :class="{'animate-bounce' : isPlaying}"/>
                    </button>
                </div>
            </div>

            <div class="flex items-center h-[25px]">
                <div class="text-white text-[12px] pr-2 pt-[11px]">
                    {{ isTrackTimeCurrent ? isTrackTimeCurrent : '00' }}
                </div>
                <div ref="seekerContainer" class="w-full relative mt-2 mb-3" @mouseenter="isHover = true"
                    @mouseleave="isHover = false">
                    <input v-model="range" ref="seeker" type="range"
                        class="absolute rounded-full my-2 w-full h-0 z-40 appearance-none bg-opacity-100 focus:outline-none accent-white  cursor-pointer">
                    <div class=" pointer-events-none mt-[6px] absolute h-[4px] z-10 inset-y-0 left-0 w-3 "
                        :style="`width: ${range}%;`" :class="isHover ? 'bg-[#BC4D15]' : 'bg-white'"></div>
                    <div class="absolute h-[4px] z-[-0] mt-[6px] inset-y-0 left-0 w-full bg-gray-500 rounded-full">
                    </div>
                </div>
                <div class="text-white text-[12px] pl-2 pt-[11px]">
                    {{ isTrackTimeTotal ? isTrackTimeTotal : '00' }}
                </div>
            </div>
        </div>

        <div class="flex items-center w-1/4 justify-end pr-10">
            <PlayerFunc />
        </div>
    </div>
</template>