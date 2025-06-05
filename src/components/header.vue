<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import axios from 'axios';
import defaultImgage from '@/assets/default.jpg'
import LogoText from '@/assets/LogoText.svg'
import { useAuthStore } from '@/stores/auth';
import { useSongStore } from "@/stores/song";
import { useViewStore } from "@/stores/view";
import { useModalStore } from "@/stores/modal";
import { useActivityStore } from "@/stores/activity";

const useSong = useSongStore();

let openColorMenu = ref(false);

const useActivity = useActivityStore()
const useModal = useModalStore();
const useView = useViewStore()
const authStore = useAuthStore();
const router = useRouter();

const searchValue = ref('')
const colorList = ref([
	'#BC4D15', '#645283',
	'#a8bfc9',
	'#CD5C5C',
	'#a3b18a',
	'#9e9fa5',
	'#926F4F',
	'#FEA7A0',
	'#c3a995',
	'#44B78B',
])

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
		useActivity.addNotify(true, "Call Api thất bại!")
	}
}

async function logout() {
	try {
		const res = await axios.get('http://spotify_clone_api.test/api/logout', {
			'headers': {
				'Authorization': 'Bearer ' + this.authStore.user.token,
			},
		});

		if (useSong.isPlaying) {
			useSong.audio?.pause();
		}
		useSong.$reset();
		useView.$reset();
		useModal.loading = true;
		setTimeout(() => {
			if (res.data.code === 200) {
				router.push('/login');
				authStore.$reset();
			}
		}, 2000)
		setTimeout(() => {
			useModal.loading = false
		}, 3000)
	} catch (e) {
		console.log(e);
		useActivity.addNotify(true, "Call Api thất bại!")
	}
}

onMounted(() => {
	getAllCategories();
	useView.setComponent('HomePage')
	if (useView.currentColor == null) {
		useView.currentColor = '#BC4D15';
	}
})
</script>


<template>
	<div class="w-[100%] h-[64px] fixed right-0 z-20 bg-[#BC4D15] flex items-center justify-between"
		:style="{ backgroundColor: useView.currentColor }">
		<div class="flex items-center gap-3 ml-8 relative">
			<img class="text-white transition duration-200 cursor-pointer size-20 hover:text-black text-[64px]" 
				:src="LogoText" @click="useView.setComponent('HomePage'); useView.selectItem(this)">
			<!-- <Icon icon="tabler:poo-filled" @click="useView.setComponent('HomePage'); useView.selectItem(this)"
				class="text-white transition duration-200 cursor-pointer size-10 hover:text-black text-[64px]" /> -->
			<div class="rounded-full bg-black w-8 h-8 ml-0 relative shadow-2xl hover:scale-105 cursor-pointer">
				<div @click="openColorMenu = !openColorMenu"
					class=" bg-gray-400 rounded-full w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
					:style="{ backgroundColor: useView.currentColor }">
				</div>
			</div>
			<div v-if="openColorMenu"
				class="absolute rounded-xl h-10 bg-black left-[140px] flex items-center transition duration-500">
				<div class="w-6 h-6 rounded-full mx-2 cursor-pointer hover:scale-110" v-for="color in colorList"
					:style="{ backgroundColor: color }" @click="useView.setCurrentColor(color)">

				</div>
			</div>
		</div>

		<!-- Home & Search -->
		<div class="flex self-center items-center gap-2">
			<div class="flex items-center gap-3">
				<div @click="useView.setComponent('HomePage'); useView.selectItem(this); searchValue = ''"
					class="flex items-center justify-center bg-[#1f1f1f] rounded-full size-12 hover:bg-[#2a2a2a] transition duration-200">
					<Icon icon="material-symbols:home" class="transition duration-200 cursor-pointer size-8"
						:class="useView.currentComponent === 'HomePage' ? 'text-[#FFE5D6]' : 'text-[#FFE5D6]/30'" />
				</div>
				<div
					class="py-2 px-3 bg-[#212121] w-96 rounded-3xl justify-between flex items-center gap-3 outline outline-2 focus-within:outline-white hover:bg-[#2a2a2a] focus-within:bg-[#2a2a2a] transition-all duration-200">
					<div class="flex items-center w-full gap-2 border-r-2 border-[#7c7c7c]">
						<Icon icon="material-symbols:search-rounded"
							class="transition duration-200 cursor-pointer size-8"
							:class="useView.currentComponent === 'SearchPage' ? 'text-[#FFE5D6]' : 'text-[#FFE5D6]/30'" />
						<input v-model="searchValue" @input="useActivity.changeSearchKey(searchValue)" type="text"
							class="w-full text-white bg-transparent border-none outline-[#BC4D15] focus:outline-none"
							@click="useView.setComponent('SearchPage'); useView.selectItem(this)"
							placeholder="Bạn muốn phát nội dung gì?">
					</div>
					<Icon icon="fluent:collections-empty-16-filled"
						class="text-3xl transition duration-200 cursor-pointer hover:scale-110"
						@click="useView.setComponent('CategoriesPage'); useView.selectItem(this)"
						:class="useView.currentComponent === 'CategoriesPage' ? 'text-[#FFE5D6]' : 'text-[#FFE5D6]/30'" />
				</div>
			</div>
		</div>


		<!-- Right Controls -->
		<div class="flex items-center gap-3">
			<div class=" h-[44px] rounded-full flex items-center justify-center text-white font-bold">
				<button @click="useView.setComponent('UserPage'); useView.selectItem(this)" type="button" class=" cursor-pointer hover:scale-105">
					<div class="flex items-center bg-gray-500 p-[2px] rounded-full h-[43px]"  width="44">
						<img class="object-cover rounded-full aspect-square" width="42"
							:src="authStore.user.avatar_path ? authStore.user.avatar_path : defaultImgage"
							@error="event => event.target.src = defaultImgage" alt="">
					</div>
				</button>
			</div>
			<button @click="logout();" type="button" class=" cursor-pointer w-28 bg-[#1D1512] mr-[10px] rounded-full h-9 hover:brightness-125 hover:scale-105">
				<div class=" brightness-125" :style="{color: useView.currentColor}">
					Đăng xuất
				</div>
			</button>
		</div>
	</div>
</template>
