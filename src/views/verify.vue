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
const hash = ref('')
const isLoading = ref(true);

async function sendVerify() {
	try {
		hash.value = ''
		isLoading.value = true
		const res = await axios.get(`http://spotify_clone_api.test/api/email/verify?id=${authStore.user.id}`);
		console.log(res)
		if (res.data.code === 200) {
			state.value = 'verify';
		}
		isLoading.value = false
	} catch (e) {
		console.log(e);
		isLoading.value = false
	}
}

// async function verifyHandle() {
// 	try {
// 		isLoading.value = true
// 		const res = await axios.get(`http://spotify_clone_api.test/api/email/verify/${authStore.user.id}/${hash.value}`);

// 		console.log(res)
// 		if (res.data.data) {
// 			state.value = 'success';
// 		}else{
// 			state.value = 'fail';
// 		}
// 		isLoading.value = false
// 	} catch (e) {
// 		console.log(e);
// 		isLoading.value = false
// 	}
// }

onMounted(() => {
	sendVerify();
})
</script>
<template>
	<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60" v-if="isLoading">
		<Icon icon="svg-spinners:180-ring" class="text-[200px] text-[#BC4D15]" />
	</div>
	<div class="container flex flex-col items-center justify-center h-screen gap-6 mx-auto text-white"
		v-if="state == 'verify'">
		<h1 class="text-5xl text-center">Chúng tôi vừa gửi tới email của bạn một mã xác thực, vui lòng kiểm tra email để xác thực tài khoản hiện tại!</h1>
		<!-- <input type="text" class="text-4xl text-black" v-model="hash"> -->
		<RouterLink to="/login" class="text-3xl text-[#BC4D15] underline hover:opacity-75">
			Xác nhận
		</RouterLink>
	</div>
	<div class="container flex flex-col items-center justify-center h-screen gap-6 mx-auto text-white"
		v-if="state == 'success'">
		<h1 class="text-8xl">Xác thực thành công!</h1>
		<RouterLink to="/login" class="text-3xl text-[#BC4D15] underline hover:opacity-75">
			Nhấn vào đây để tiến hành đăng nhập
		</RouterLink>
	</div>
	<!-- <div class="container flex flex-col items-center justify-center h-screen gap-6 mx-auto text-white"
		v-if="state == 'fail'">
		<h1 class="text-8xl">Xác thực thất bại!</h1>
		<button @click="state = 'verify'; sendVerify();" class="text-3xl text-[#BC4D15] underline hover:opacity-75">
			Nhấn vào đây để xác thực lại
		</button>
		<h1 class="text-4xl">hoặc</h1>
		<RouterLink to="/signup" class="text-3xl text-[#BC4D15] underline hover:opacity-75">
			Tạo tài khoản mới
		</RouterLink>
	</div> -->
</template>
