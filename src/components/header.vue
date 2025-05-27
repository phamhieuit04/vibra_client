<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import axios from 'axios';
import defaultImgage from '@/assets/default.jpg'
import { useAuthStore } from '@/stores/auth';
import { useSongStore } from "@/stores/song";
import { useViewStore } from "@/stores/view";
import { useActivityStore } from "@/stores/activity";

const useSong = useSongStore();

let openMenu = ref(false);

const useActivity = useActivityStore()
const useView = useViewStore()
const authStore = useAuthStore();
const router = useRouter();

const searchValue = ref('')

async function getAllCategories() {
	try {
		const res = await axios.get('http://spotify_clone_api.test/api/category/index', {
			'headers': {
				'Authorization': 'Bearer ' + authStore.user.token,
			},
		});

		if (res.data.code === 200) {
			useActivity.setCategories(res.data.data)
		}
	} catch (e) {
		console.log(e);
		alert('Call API thất bại');
	}
}

async function logout() {
	try {
		const res = await axios.get('http://spotify_clone_api.test/api/logout', {
			'headers': {
				'Authorization': 'Bearer ' + this.authStore.user.token,
			},
		});

		if (res.data.code === 200) {
			authStore.$reset();
			useSong.$reset();
			useView.$reset();
			router.push('/login');
		}
	} catch (e) {
		console.log(e);
		alert('Call API thất bại');
	}
}

onMounted(() => {
	getAllCategories();
})
</script>


<template>
	<div class="w-[100%] h-[64px] fixed right-0 z-20 bg-[#BC4D15] flex items-center justify-between">
		<div class="flex items-center gap-4 ml-8" @click="useView.setComponent('HomePage'); useView.selectItem(this)">
			<Icon icon="tabler:poo-filled"
				class="text-white transition duration-200 cursor-pointer size-10 hover:text-black text-[64px]" />
		</div>

		<!-- Home & Search -->
		<div class="flex self-center items-center gap-2">
			<div class="flex items-center gap-3">
				<div @click="useView.setComponent('HomePage'); useView.selectItem(this)"
					class="flex items-center justify-center bg-[#1f1f1f] rounded-full size-12 hover:bg-[#2a2a2a] transition duration-200">
					<Icon icon="material-symbols:home"
						class="transition duration-200 cursor-pointer size-8" 
						:class="useView.currentComponent === 'HomePage' ? 'text-[#FFE5D6]' : 'text-[#FFE5D6]/30'"/>
				</div>
				<div
					class="py-2 px-3 bg-[#212121] w-96 rounded-3xl justify-between flex items-center gap-3 outline outline-2 focus-within:outline-white hover:bg-[#2a2a2a] focus-within:bg-[#2a2a2a] transition-all duration-200">
					<div class="flex items-center w-full gap-2 border-r-2 border-[#7c7c7c]">
						<Icon icon="material-symbols:search-rounded"
							class="transition duration-200 cursor-pointer size-8"
							:class="useView.currentComponent === 'SearchPage' ? 'text-[#FFE5D6]' : 'text-[#FFE5D6]/30'" />
						<input v-model="searchValue" @input="useActivity.changeSearchKey(searchValue)" type="text" class="w-full text-white bg-transparent border-none outline-[#BC4D15] focus:outline-none"
							@click="useView.setComponent('SearchPage'); useView.selectItem(this)"
							placeholder="Bạn muốn phát nội dung gì?">
					</div>
					<Icon icon="fluent:collections-empty-16-filled"
						class="text-3xl transition duration-200 cursor-pointer hover:scale-110" 
						@click="useView.setComponent('CategoriesPage'); useView.selectItem(this)"
						:class="useView.currentComponent === 'CategoriesPage' ? 'text-[#FFE5D6]' : 'text-[#FFE5D6]/30'"/>
				</div>
			</div>
		</div>


		<!-- Right Controls -->
		<div class="flex items-center gap-4">
			<div class="text-white">
				EM CHÀO ĐẠI CA
			</div>
			<div class="w-8 h-8 mr-[10px] rounded-full flex items-center justify-center text-white font-bold">
				<button @click="openMenu = !openMenu" type="button" class=" cursor-pointer">
					<div class="flex items-center">
						<img class="object-cover rounded-full aspect-square" width="30" :src="authStore.user.avatar_path ? authStore.user.avatar_path : defaultImgage" @error="event => event.target.src = defaultImgage" alt="">
					</div>
				</button>
				<span v-if="openMenu" class="fixed bg-[#282828] w-[200px] z-50 top-[64px] right-1 p-1">
					<ul class="text-gray-200 font-semibold text-[14px]">
						<li class="px-3 py-2 hover:bg-[#3E3D3D] cursor-pointer"
							@click="useView.setComponent('UserPage'); useView.selectItem(this)">Hồ sơ</li>
						<li class="px-3 py-2 hover:bg-[#3E3D3D] cursor-pointer" @click="logout();">Đăng xuất</li>
					</ul>
				</span>
			</div>
		</div>
	</div>
</template>
