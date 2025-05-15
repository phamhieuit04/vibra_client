<template>
	<div class="fixed top-0 left-0 right-0 flex items-center justify-between w-full p-2 bg-black">
		<!-- Start Spotify logo -->
		<RouterLink to="/" class="px-4">
			<Icon icon="mdi:spotify"
				class="text-4xl text-white transition duration-200 cursor-pointer hover:text-green-500" />
		</RouterLink>
		<!-- End Spotify logo -->

		<!-- Start search bar -->
		<div class="flex items-center gap-3">
			<RouterLink to="/"
				class="flex items-center justify-center bg-[#1f1f1f] rounded-full size-12 hover:bg-[#2a2a2a] transition duration-200">
				<Icon icon="material-symbols:home" class="text-3xl text-white transition duration-200 cursor-pointer" />
			</RouterLink>
			<div
				class="py-2 px-3 bg-[#212121] w-[500px] rounded-3xl justify-between flex items-center gap-3 outline outline-2 focus-within:outline-white hover:bg-[#2a2a2a] focus-within:bg-[#2a2a2a] transition-all duration-200">
				<div class="flex items-center w-full gap-2 border-r-2 border-[#7c7c7c]">
					<Icon icon="material-symbols:search-rounded"
						class="text-4xl text-white transition duration-200 cursor-pointer" />
					<input type="text" class="w-full pr-4 text-white bg-transparent border-none focus:outline-none"
						placeholder="What do you want to play?">
				</div>
				<Icon icon="fluent:collections-empty-16-filled"
					class="text-3xl text-white transition duration-200 cursor-pointer hover:scale-110" />
			</div>
		</div>
		<!-- End search bar -->

		<!-- Start login/signup -->
		<div>
			<div v-if="authStore.isLoggedIn == false" class="flex items-center gap-4">
				<RouterLink to="/signup" class="font-bold text-white transition duration-200 hover:scale-105">
					Sign up
				</RouterLink>
				<RouterLink to="/login"
					class="py-3 font-bold text-center text-black transition duration-200 bg-white w-28 rounded-3xl hover:scale-105">
					Login
				</RouterLink>
			</div>
			<div v-else class="flex items-center gap-4">
				<h1 class="font-semibold text-white text-1xl">Xin chào {{ authStore.user.name }}!</h1>
				<button v-on:click="logout()"
					class="py-3 font-bold text-center text-black transition duration-200 bg-white w-28 rounded-3xl hover:scale-105">
					Logout
				</button>
			</div>
		</div>
		<!-- End login/singup -->
	</div>
</template>

<script>
	import { useAuthStore } from '@/stores/auth';
	import { Icon } from '@iconify/vue';
	import axios from 'axios';

	export default {
		setup() {
			const authStore = useAuthStore();
			return { authStore };
		},
		components: {
			Icon
		},
		methods: {
			async logout() {
				await axios.get('http://spotify_clone_api.test/api/logout', {
					'headers': {
						'Authorization': 'Bearer ' + this.authStore.user.token
					}
				}).then((res) => {
					if (res.data.code == 200) {
						this.authStore.$reset();
						this.$router.push('/login');
					}
				}).catch((e) => {
					console.log(e);
					alert("Call API thất bại");
				})
			}
		}
	}
</script>