<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@iconify/vue';
import axios from 'axios';
import { useViewStore } from "@/stores/view";

let openMenu = ref(false);

const useView = useViewStore()
const authStore = useAuthStore();
const router = useRouter();

async function logout() {
	try {
		const res = await axios.get('http://spotify_clone_api.test/api/logout', {
			'headers': {
				'Authorization': 'Bearer ' + this.authStore.user.token,
			},
		});

		if (res.data.code === 200) {
			authStore.$reset();
			router.push('/login');
		}
	} catch (e) {
		console.log(e);
		alert('Call API thất bại');
	}
}
</script>


<template>
	<div class="w-[100%] h-[64px] fixed right-0 z-20 bg-[#BC4D15] flex items-center justify-between">
		<div class="flex items-center gap-4 ml-8" @click="useView.setComponent('HomePage'); useView.selectItem(this)">
			<Icon icon="tabler:poo-filled"
				class="text-white transition duration-200 cursor-pointer size-10 hover:text-black text-[64px]" />
		</div>

		<!-- Home & Search -->
		<div class="flex self-center items-center gap-2">
			<button class="bg-[#1D1512] p-2 rounded-full hover:bg-neutral-700"
				@click="useView.setComponent('HomePage'); useView.selectItem(this)">
				<Icon icon="material-symbols:home" class="transition duration-200 cursor-pointer size-7" 
					:class="useView.currentComponent === 'HomePage' ? 'text-[#FFE5D6]' : 'text-[#FFE5D6]/30'"/>
			</button>

			<!-- Search Box -->
			<div class="flex items-center bg-[#1D1512] text-sm text-[#FFE5D6]/20 rounded-full px-3 py-1 w-80 h-11">
				<Icon icon="material-symbols:search-rounded"
						class="transition duration-200 cursor-pointer size-8 mr-1" 
						:class="useView.currentComponent === 'SearchPage' ? 'text-[#FFE5D6]' : 'text-[#FFE5D6]/30'"/>
				<input type="text" placeholder="Bạn muốn phát nội dung gì?"
					@click="useView.setComponent('SearchPage'); useView.selectItem(this)"
					style="font-family: 'Montserrat', sans-serif;"
					class="text-[#FFE5D6]/20 bg-transparent focus:outline-none w-full" />
				<button class="ml-2">

				</button>
			</div>
		</div>


		<!-- Right Controls -->
		<div class="flex items-center gap-4">
			<div class="text-white">
				XIN CHÀO
			</div>
			<div class="w-8 h-8 mr-[10px] rounded-full flex items-center justify-center text-white font-bold">
				<button @click="openMenu = !openMenu" type="button" class=" cursor-pointer">
					<div class="flex items-center">
						<img class="rounded-full" width="30"
							src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-1/327906584_1623414034763055_2313595742443607128_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=110&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeHU7kPK7H2yzZUnTlh8ZMxVOMNfpq35Qsw4w1-mrflCzMYLokSXxT9J2NllOm6moxIp2TS6fKMX1p8w3b7z9m_q&_nc_ohc=nRmSn2BIUxwQ7kNvwGlh4B8&_nc_oc=AdmeH6EkPvPHiDDMzv4fs5mYVufKYGAt-P-PW8-hxM6Qy6ipvVZoJnbJ0lMczr6MdDKbxbXhT1Bsy8lvwrKEGdAY&_nc_zt=24&_nc_ht=scontent.fhan2-4.fna&_nc_gid=lCIC4Bx56CiH104oBXlJ1Q&oh=00_AfJEry-lRiRTpncqdE8Ipt728bj62-uIybneG90y_Zv5NA&oe=682F775F"
							alt="">
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
