<script setup>
import { onMounted, ref, watch, toRefs, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useViewStore } from '@/stores/view';
import { useSongStore } from '@/stores/song';
import { useModalStore } from '@/stores/modal';
import { useActivityStore } from '@/stores/activity';
import defaultImgage from '@/assets/default.jpg';

const useView = useViewStore();
const authStore = useAuthStore();
const useSong = useSongStore();
const useModal = useModalStore();
const useActivity = useActivityStore();
const { currentTrack, currentWaitlist, isPlaying } = storeToRefs(useSong);

let isHover = ref(false);
let isTrackTime = ref(null);

onMounted(() => {
    const audio = new Audio(currentTrack.value.song_path);
    audio.addEventListener('loadedmetadata', function () {
        const duration = audio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        isTrackTime.value = minutes + ':' + seconds.toString().padStart(2, '0');
    });
});
</script>
<template>
    <div class="relative h-[600px] w-full bg-[#1D1512] text-[#FFE5D6]">
        <div class="mx-4 my-4">
            <h2 class="mb-1 text-2xl font-semibold">Bài hát đang phát</h2>
            <div
                class="flex cursor-pointer items-center justify-between rounded-md p-3 hover:bg-[#2A2929]"
            >
                <div class="flex w-full items-center justify-between py-1.5">
                    <div class="flex">
                        <div
                            class="relative ml-0 h-12 w-12 rounded-full bg-zinc-700 shadow-2xl hover:scale-105"
                            @click="useSong.playOrPauseSong"
                        >
                            <img
                                class="aspect-square rounded-full object-cover"
                                :src="currentTrack.thumbnail_path"
                                alt=""
                                :class="{ 'animate-spin': isPlaying }"
                                style="animation-duration: 5s"
                                @error="
                                    (event) =>
                                        (event.target.src = defaultImgage)
                                "
                            />
                            <!-- <div class="bg-[#2A2929] rounded-full w-3 h-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">

                            </div> -->
                        </div>
                        <div class="ml-5">
                            <div class="font-semibold text-white">
                                {{ currentTrack.name }}
                            </div>
                            <span class="text-sm font-semibold text-gray-400">{{
                                currentTrack.author.name
                            }}</span>
                        </div>
                    </div>

                    <Icon
                        v-if="isPlaying"
                        icon="svg-spinners:bars-scale-middle"
                    />
                    <Icon v-else icon="majesticons:barcode-2-line" />
                </div>
            </div>
        </div>
        <div class="mx-4 my-4 h-full overflow-y-auto scrollbar-none">
            <div class="flex justify-between">
                <h2 class="mb-1 text-2xl font-semibold">Bài hát tiếp theo</h2>
                <button @click="currentWaitlist = []">Xóa tất cả</button>
            </div>
            <div
                class="flex cursor-pointer items-center justify-between rounded-md p-3 hover:bg-[#2A2929]"
                v-for="(track, index) in currentWaitlist"
                :key="track?.id"
                @click="useSong.playThisSongInWaitlist(track)"
            >
                <div class="flex w-full items-center py-1.5">
                    <div>
                        <div class="font-semibold text-white">
                            {{ track?.name }}
                        </div>
                        <span class="text-sm font-semibold text-gray-400">{{
                            track?.author.name
                        }}</span>
                    </div>
                </div>
                <div class="flex items-center">
                    <button
                        @click.stop="useSong.deleteSongFromWaitlist(track)"
                        class="mr-4 rounded p-1 text-[#FFE5D6]/50 hover:bg-white/5"
                    >
                        <Icon
                            icon="material-symbols:delete-rounded"
                            class="text-2xl"
                        />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
