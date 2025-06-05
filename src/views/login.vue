<script setup>
import SigninMethods from '@/components/signinMethods.vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const login = async () => {
	if(email.value == '' || password == ''){
		alert('Vui lòng nhập đầy đủ thông tin!')
		return
	}
	try {
		const res = await axios.post('http://spotify_clone_api.test/api/login', {
			'email': email.value,
			'password': password.value
		});
		isLoading.value = true;
		if (res.data.code == 200) {
			authStore.setIsLoggedIn(true);
			authStore.setUser(res.data.data);
			router.push('/');
			isLoading.value = false;
		}
		if(res.data.code == 204){
			alert('Saiii!!!!!!!!');
			isLoading.value = false
		}
	} catch (e) {
		console.log(e);
		alert('Call API thất bại');
	}
}

</script>
<template>
	<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60" v-if="isLoading">
        <Icon icon="svg-spinners:180-ring" class="text-[200px] text-[#BC4D15]" />
    </div>
	<div class="h-screen bg-gradient-to-b from-[#292929] to-black from-10% to-80% flex items-center justify-center">
		<div class="w-[734px] h-[740px] bg-[#121212] rounded-2xl flex items-center py-8 px-24 flex-col">
			<!-- Start Spotify logo -->
			<RouterLink to="/">
				<Icon icon="mdi:spotify" class="text-white transition cursor-pointer size-14 hover:text-green-500 " />
			</RouterLink>
			<!-- End Sportfy logo -->

			<!-- Start login header -->
			<h1 class="pt-2 text-4xl font-bold text-white">Đăng nhập vào Website</h1>
			<!-- End login header -->

			<!-- Start login methods -->
			<SigninMethods />
			<!-- End login methods -->

			<hr class="w-full text-gray-500 opacity-15">

			<!-- Start login form -->
			<form @submit.prevent="login" class="flex flex-col w-[350px] py-8">
				<label class="pb-1 text-lg font-bold text-white">Địa chỉ Email</label>
				<input type="email" placeholder="Email" v-model="email"
					class="p-3 text-white bg-transparent border border-gray-500 rounded-md placeholder:text-sm">
				<label class="pb-1 text-lg font-bold text-white mt-2">Mật khẩu</label>
				<input type="password" placeholder="Password" v-model="password"
					class="p-3 text-white bg-transparent border border-gray-500 rounded-md placeholder:text-sm">
				<button type="submit"
					class="p-4 mt-6 font-bold text-black bg-green-500 rounded-full hover:scale-105 transition ease-in  hover:bg-[#3be477]">Continue</button>
			</form>
			<!-- End login form -->

			<!-- Start sign up link -->
			<div class="flex flex-row items-center">
				<p class="text-[#aeaeae]">Bạn chưa có tài khoản?</p>
				<RouterLink to="/signup"
					class="pl-4 font-semibold text-white underline transition underline-offset-2 hover:text-green-500">
					Đăng ký</RouterLink>
			</div>
			<!-- End sign up link -->
		</div>
	</div>
</template>
