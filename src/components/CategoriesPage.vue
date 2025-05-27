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


onMounted(() => {

})
</script>
<template>
    <div class="py-14 space-y-10 text-[#FFFF]">
        <div class="  px-6 w-full h-[calc(100vh-230px)] overflow-y-auto scrollbar-style ">
            <h2 class="mb-5 text-2xl font-semibold ">Thể loại</h2>
            <div class="flex flex-wrap gap-3 ">
                <div v-for="item in allCategories" :key="item.id"
                    class="px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105"             
                    style="width: 21.25rem;"
                    @click="useView.selectItem(item); useView.setComponent('CategoriesSongPage'); useView.setCategoriesData(item);">

                    <div class="relative w-full h-48 p-5 mb-2 rounded-xl bg-zinc-700">
                        <p class="text-xl font-semibold">{{ item.name }}</p>
                        <img :src="item.thumbnail_path"
                            class="absolute w-20 h-20 right-2 bottom-2 rotate-12" />

                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>