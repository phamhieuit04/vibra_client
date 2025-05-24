<script setup>
import SigninMethods from '@/components/signinMethods.vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
const router = useRouter();

const email = ref('')
const password = ref('')
const rePassword = ref('')

const signup = async () => {
	if ((rePassword.value !== '' && password.value !== rePassword.value)) {
		alert('Mật khẩu không khớp!')
		return
	}
	try {
		const res = await axios.post('http://spotify_clone_api.test/api/signup', {
			'email': email.value,
			'password': password.value
		});
		if (res.data.code == 200) {
			alert('Đăng Kí Thành Công!!!');
			router.push('/login');
		}
		if (res.data.code == 500) {
			alert('Địa chỉ Email tồn tại');
		}
	} catch (e) {
		console.log(e);
		alert('Call API thất bại');
	}
}

</script>
<template>
	<div class="bg-[#121212] h-screen flex items-center justify-center">
		<div class="flex flex-col items-center w-96">
			<!-- Start signup header -->
			<RouterLink to="/">
				<Icon icon="mdi:spotify" class="text-white transition cursor-pointer size-14 hover:text-green-500 " />
			</RouterLink>
			<h1 class="text-5xl font-bold text-center text-white">Đăng ký</h1>
			<!-- End signup header -->

			<!-- Start signup form -->
			<form @submit.prevent="signup" class="flex flex-col w-[350px] py-8">
				<label class="pb-1 text-lg font-medium text-white">Địa chỉ Email</label>
				<input type="email" placeholder="name@domain.com" v-model="email"
					class="p-3 text-white bg-transparent border border-gray-500 rounded-md placeholder:text-sm">
				<label class="pb-1 text-lg font-medium text-white mt-2">Mật khẩu</label>
				<input type="password" placeholder="Mật khẩu" v-model="password"
					class="p-3 text-white bg-transparent border border-gray-500 rounded-md placeholder:text-sm">
				<label class="pb-1 text-lg font-medium text-white mt-2">Nhập lại mật khẩu</label>
				<input type="password" placeholder="Nhập lại mật khẩu" v-model="rePassword"
					class="p-3 text-white bg-transparent border border-gray-500 rounded-md placeholder:text-sm">
				<button type="submit"
					class="p-4 mt-6 font-bold text-black bg-green-500 rounded-full hover:scale-105 transition ease-in  hover:bg-[#3be477]">Đăng Ký</button>
			</form>
			<!-- End signup form -->

			<div class="flex items-center justify-center gap-4">
				<hr class="text-gray-500 w-[150px] opacity-15">
				<span class="text-white">hoặc</span>
				<hr class="text-gray-500 w-[150px] opacity-15">
			</div>

			<!-- Start signup methods -->
			<SigninMethods />
			<!-- End signup methods -->

			<div class="w-full px-[18px] pb-8">
				<hr class="text-gray-500 opacity-15">
			</div>

			<!-- Start login link -->
			<div class="flex flex-row items-center">
				<p class="text-[#aeaeae]">Bạn đã có tài khoản?</p>
				<RouterLink to="/login"
					class="pl-4 font-semibold text-white underline transition underline-offset-2 hover:text-green-500"
					href="#">Đăng nhập</RouterLink>
			</div>
			<!-- End login link -->
		</div>
	</div>
</template>
