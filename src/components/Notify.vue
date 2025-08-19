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

const props = defineProps({
    index: Number,
    isError: Boolean,
    message: String,
});
const { index, isError, message } = toRefs(props);

onMounted(() => {
    setTimeout(() => {
        useActivity.removeNotify(0);
    }, 3000);
});
</script>
<template>
    <div class="m-2 h-16 w-auto">
        <div
            class="flex items-center rounded-xl bg-[#1D1512] p-4 text-[#FFE5D6] shadow-[0_0_8px_#FFE5D6]"
            v-if="!isError"
        >
            <Icon
                icon="teenyicons:tick-circle-solid"
                class="mr-3 text-xl text-green-400"
            />
            <h1>{{ message }}</h1>
        </div>
        <div
            class="flex items-center rounded-2xl bg-[#1D1512] p-4 text-[#FFE5D6] shadow-[0_0_8px_#FFE5D6]"
            v-else
        >
            <Icon
                icon="material-symbols:error"
                class="mr-3 text-2xl text-red-600"
            />
            <h1>{{ message }}</h1>
        </div>
    </div>
</template>
