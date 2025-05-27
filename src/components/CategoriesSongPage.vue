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




</script>
<template>
    <div class="py-14 space-y-4 text-[#FFFF]">
        <h2 class="px-6 text-2xl font-semibold">Danh sách nhạc thể loại...</h2>
        <div class="px-6 w-full h-[calc(100vh-270px)] overflow-y-auto scrollbar-style pt-4">         
            <div class="flex flex-wrap justify-center gap-12">
                <div v-for="i in 20" :key="i"
                    class="px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105"
                    style="width: 14.75rem;">
                    <div class="w-48 h-48 mb-2 rounded-full bg-zinc-700">
                        <img class="object-cover w-full h-full rounded-full">
                    </div>
                    <div class="pr-8 mt-4 text-center">
                        <p class="font-medium">Album#{{ i }}</p>
                        <p class="text-sm text-zinc-400">{{ i * 100 }} người theo dõi</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>