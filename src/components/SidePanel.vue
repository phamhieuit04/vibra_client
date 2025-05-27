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
    <h1 class="text-white">Side Panel nè</h1>
</template>