<script setup>
import { ref, watch, onMounted } from "vue";
import { Icon } from '@iconify/vue';
import { RouterLink, RouterView } from 'vue-router'
import { useSongStore } from "@/stores/song";
import { storeToRefs } from "pinia";
import PlayerFunc from "./PlayerFunc.vue";

const useSong = useSongStore()
const { isPlaying, audio, currentPlaylist, currentTrack } = storeToRefs(useSong)

let isHover = ref(false)
let isTrackTimeCurrent = ref(null)
let isTrackTimeTotal = ref(null)
let seeker = ref(null)
let seekerContainer = ref(null)
let range = ref(0)

onMounted(() => {
    isPlaying.value = false
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

const timeupdate = () => {
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

watch(() => audio.value, () => {
    timeupdate()
    loadmetadata()
})

watch(() => isTrackTimeCurrent.value, (time) => {
    if (time && time == isTrackTimeTotal.value) {
        console.log("Song over")
        useSong.nextSong(currentTrack.value, currentPlaylist.value)
    }
})

</script>

<template>
    <div id="MusicPlayer"
        class="fixed bottom-0 flex items-center justify-between w-full z-50 h-[90px] bg-[#181413] border-t border-t-[#272727]">
        <div class=" flex items-center w-1/4 ">
            <div class="flex items-center ml-4">
                <img class="rounded-sm shadow-2xl" width="55" :src="currentTrack['thumbnail']" />
                <div class="ml-4">
                    <div style="font-family: 'Montserrat', sans-serif;" class="text-[17px] text-[#FFE5D6] font-bold hover:underline cursor-pointer">
                        {{ currentTrack.name }}
                    </div>
                    <div style="font-family: 'Montserrat', sans-serif;" class="text-[13px] text-[#FFE5D6]/30 font-medium hover:text-white hover:underline cursor-pointer">
                        {{ currentTrack.artist }}
                    </div>
                </div>
            </div>
            <div class="flex items-center ml-8">
                <i class="fa-regular fa-square-plus text-[#FFE5D6] text-[23px]" color="#FFE5D6"></i>
            </div>
        </div>

        <div class="max-w-[35%] mx-auto w-2/4 mb-3">
            <div class=" flex-col items-center justify-center">
                <div class="flex items-center justify-center h-[30px]">
                    <button class="mx-2" @click="useSong.prevSong(currentTrack, currentPlaylist)">
                        <Icon icon="fa6-solid:backward-step" class=" text-[#FFE5D6] size-7"/>
                    </button>
                    <button class="p-1 rounded-full mx-3"
                        @click="useSong.playOrPauseThisSong(currentPlaylist, currentTrack)">
                        <Icon icon="material-symbols:play-circle-rounded" v-if="!isPlaying" class="size-12 text-white"/>
                        <Icon icon="material-symbols:pause-circle" v-else class="size-12 text-white"/>
                    </button>
                    <button class="mx-2" @click="useSong.nextSong(currentTrack, currentPlaylist)">
                        <Icon icon="fa6-solid:forward-step" class=" text-[#FFE5D6] size-7"/>
                    </button>
                </div>
            </div>

            <div class="flex items-center h-[25px]">
                <div class="text-white text-[12px] pr-2 pt-[11px]">
                    {{ isTrackTimeCurrent }}
                </div>
                <div ref="seekerContainer" class="w-full relative mt-2 mb-3" @mouseenter="isHover = true"
                    @mouseleave="isHover = false">
                    <input v-model="range" ref="seeker" type="range"
                        class="absolute rounded-full my-2 w-full h-0 z-40 appearance-none bg-opacity-100 focus:outline-none accent-white">
                    <div class=" pointer-events-none mt-[6px] absolute h-[4px] z-10 inset-y-0 left-0 w-0"
                        :style="'width: ${range}%;'" :class="isHover ? 'bg-green-500' : 'bg-white'"></div>
                    <div class="absolute h-[4px] z-[-0] mt-[6px] inset-y-0 left-0 w-full bg-gray-500 rounded-full">
                    </div>
                </div>
                <div class="text-white text-[12px] pl-2 pt-[11px]">
                    {{ isTrackTimeTotal }}
                </div>
            </div>
        </div>

        <div class="flex items-center w-1/4 justify-end pr-10">
            <PlayerFunc />
        </div>
    </div>
</template>