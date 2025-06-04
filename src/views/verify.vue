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

const state = ref('verify');

async function sendVerify() {
	try {
		const res = await axios.get('http://spotify_clone_api.test/api/email/verify', {
			'id': 10
		});

		console.log(res)
		if (res.data.code === 200) {
			state.value = 'verify';

		}
	} catch (e) {
		console.log(e);
	}
}





onMounted(() => {
	sendVerify();
})
</script>
<template>
	<div class="container flex flex-col items-center justify-center h-screen gap-6 mx-auto text-white"
		v-if="state == 'verify'">
		<h1 class="text-8xl">Xác thực thành công!</h1>
		<RouterLink to="/login" class="text-3xl text-green-500 underline hover:opacity-75">
			Nhấn vào đây để tiến hành đăng nhập
		</RouterLink>
	</div>
	<div class="container flex flex-col items-center justify-center h-screen gap-6 mx-auto text-white"
		v-if="state == 'success'">
		<h1 class="text-8xl">Xác thực thành công!</h1>
		<RouterLink to="/login" class="text-3xl text-green-500 underline hover:opacity-75">
			Nhấn vào đây để tiến hành đăng nhập
		</RouterLink>
	</div>
	<div class="container flex flex-col items-center justify-center h-screen gap-6 mx-auto text-white"
		v-if="state == 'fail'">
		<h1 class="text-8xl">Xác thực thất bại!</h1>
		<RouterLink to="/verify" class="text-3xl text-green-500 underline hover:opacity-75">
			Nhấn vào đây để xác thực lại
		</RouterLink>
	</div>
</template>
