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
    index: Number,
    isError: Boolean,
    message: String,
})
const { index, isError, message } = toRefs(props);

onMounted(() => {
    console.log(useActivity.notifyList);
    setTimeout(() => {
        useActivity.removeNotify(0);
    }, 3000)
})
</script>
<template>
    <div class="h-16 w-auto m-2">
        <div class="text-[#FFE5D6] bg-[#1D1512] rounded-xl p-4 shadow-[0_0_8px_#FFE5D6] flex items-center" v-if="!isError">
            <Icon icon="teenyicons:tick-circle-solid" class=" text-green-400 text-xl mr-3" />
            <h1>{{ message }}</h1>
        </div>
        <div class="text-[#FFE5D6] bg-[#1D1512] rounded-2xl p-4 shadow-[0_0_8px_#FFE5D6] flex items-center" v-else>
            <Icon icon="material-symbols:error" class=" text-red-600 text-2xl mr-3" />
            <h1>{{ message }}</h1>
        </div>
    </div>
</template>