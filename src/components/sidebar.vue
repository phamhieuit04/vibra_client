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

const { followArtistList, followAlbumList, favSongList, myPlaylistList } = storeToRefs(useActivity)
const { openEditPlaylist } = storeToRefs(useModal)

const filter = ref('all');
const search = ref('');
const filteredPlaylist = computed(() => {
	return myPlaylistList.value.filter(item =>
		item.name.toLowerCase().includes(search.value.toLowerCase()));
})
const filteredAlbum = computed(() => {
	return followAlbumList.value.filter(item =>
		item.name.toLowerCase().includes(search.value.toLowerCase()));
})
const filteredArtist = computed(() => {
	return followArtistList.value.filter(item =>
		item.artist.name.toLowerCase().includes(search.value.toLowerCase()));
})

const createPlaylist = async () => {
	try {
		const res = await axios.post(
			'http://spotify_clone_api.test/api/library/store-playlist',
			{},
			{
				headers: {
					Authorization: 'Bearer ' + authStore.user.token,
				},
			}
		);
		alert('Tạo playlist thành công!');
		useActivity.fetchData();
	} catch (error) {
		console.error('Lỗi khi tạo playlist:', error);
		alert('Tạo playlist thất bại!');
	}
};

const deletePlaylist = async (id) => {
	try {
		const res = await axios.get(
			`http://spotify_clone_api.test/api/library/destroy-playlist/${id}`,
			{
				headers: {
					Authorization: 'Bearer ' + authStore.user.token,
				},
			}
		);
		alert('Xóa playlist thành công!');
		useActivity.fetchData();
		useView.setComponent('HomePage');
	} catch (error) {
		console.error('Lỗi khi xóa playlist:', error);
		alert('Xóa playlist thất bại!');
	}
}

const editPlaylist = async (playlist) => {
	useModal.setPlaylistEditData(playlist);
	openEditPlaylist.value = true;
}


onMounted(() => {
	useActivity.fetchData();
})
</script>

<template>
	<div class="fixed top-0 bottom-0 left-0 w-full bg-[#BC4D15] z-0"></div>
	<div class="w-[22.4%] h-[100%] fixed bottom-0 top-[64px] left-1.5 z-50 p-6 bg-[#1D1512] rounded-[24px]">
		<div class="flex items-center justify-between mb-4 mx-1">
			<h2 class="text-[#FFE5D6] text-xl font-semibold">Thư viện</h2>
			<div class="flex items-center gap-2">
				<button @click="createPlaylist"
					class="flex items-center gap-2 px-3 py-1 rounded-full bg-[#47342D] text-sm text-[#FFE5D6] hover:bg-transparent transition-all duration-200">
					<span class="text-base font-semibold">+</span>
					<span class="font-semibold">Tạo</span>
				</button>
			</div>
		</div>

		<div class="flex gap-2 mb-4">
			<button
				class="font-semibold bg-[#47342D] px-3 py-1 text-sm rounded-full hover:bg-[#47342D]/20 transition-all duration-200"
				:class="filter === 'all' ? 'bg-[#FFE5D6] text-[#47342D] hover:bg-[#FFE5D6]' : 'bg-[#47342D] text-[#FFE5D6]'"
				@click="filter = 'all'">
				Tất cả
			</button>
			<button
				class="font-semibold bg-[#47342D] px-3 py-1 text-sm rounded-full hover:bg-[#47342D]/20 transition-all duration-200"
				:class="filter === 'playlist' ? 'bg-[#FFE5D6] text-[#47342D] hover:bg-[#FFE5D6]' : 'bg-[#47342D] text-[#FFE5D6]'"
				@click="filter = 'playlist'">
				Danh sách phát
			</button>
			<button
				class="font-semibold bg-[#47342D] px-3 py-1 text-sm rounded-full hover:bg-[#47342D]/20 transition-all duration-200"
				:class="filter === 'artist' ? 'bg-[#FFE5D6] text-[#47342D] hover:bg-[#FFE5D6]' : 'bg-[#47342D] text-[#FFE5D6]'"
				@click="filter = 'artist'">
				Nghệ sĩ
			</button>
		</div>

		<input type="text" v-model="search" placeholder="Tìm kiếm"
			class="w-full py-2 px-5 rounded-full  bg-[#1D1512] text-[#FFE5D6] my-2 transition-all duration-200 outline outline-2 outline-[#BC4D15] focus:outline-white" />

		<div class="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">

			<TransitionGroup tag="div" enter-active-class="transform-gpu" enter-class="opacity-0 -translate-x-full"
				enter-to-class="opacity-100 translate-x-0" leave-active-class="absolute transform-gpu"
				leave-class="opacity-100 translate-x-0" leave-to-class="opacity-0 translate-y-full"
				class="overflow-hidden flex flex-col gap-2">
				<div v-if="filter == 'all' || filter == 'playlist'"
					class="flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-white/10 transition-all duration-200 mt-2"
					@click="useView.selectItem(favSongList); useView.setComponent('PlaylistPage'); useView.setPlaylistData(favSongList);"
					:class="{ 'bg-white/10': useView.selected === favSongList }">
					<div class="flex items-center justify-center w-10 h-10 rounded bg-white/10">
						<img class="flex-shrink-0 object-cover rounded max-h-10 max-w-10 w-fixed"
							:src="favSongList.thumbnail_path" @error="event => event.target.src = defaultImgage" />
					</div>

					<div class="flex-1 min-w-0">
						<div class="text-[#FFE5D6] font-semibold leading-4 whitespace-nowrap">
							Bài hát yêu thích</div>
						<div class="text-[#FFE5D6]/50 text-s font-medium">{{ favSongList.total_song }} bài hát</div>
					</div>
				</div>

				<div v-for="(item, index) in filteredPlaylist" :key="index"
					v-if="filter == 'all' || filter == 'playlist'"
					class="flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-white/10 transition-all duration-200"
					@click="useView.selectItem(item); useView.setComponent('PlaylistPage'); useView.setPlaylistData(item);"
					:class="{ 'bg-white/10': useView.selected === item }">
					<div class="flex items-center justify-center w-10 h-10 rounded bg-white/10">
						<img :src="item.thumbnail_path" class="flex-shrink-0 rounded max-h-10 max-w-10 object-coverw-10"
							@error="event => event.target.src = defaultImgage" />
					</div>

					<div>
						<div class="text-[#FFE5D6] font-semibold leading-4 flex-1 break-normal md:break-all white">{{
							item.name }}</div>
						<div class="text-[#FFE5D6]/50 text-s font-medium">
							{{ item.type === 2 ? 'Danh sách phát • ' + item.total_song + " bài hát" :
								'Album của nghệ sĩ • ' + item.total_song + " bài hát" }}
						</div>
					</div>
					<div class="ml-auto">
						<button class=" hover:bg-white/5 p-2 rounded text-[#FFE5D6]/50 transition-all duration-200"
							@click.stop="editPlaylist(item); console.log(item);">
							<Icon icon="material-symbols:edit-square-rounded" class="text-xl " />
						</button>
						<button class=" hover:bg-white/5 p-1.5 rounded text-[#FFE5D6]/50 transition-all duration-200"
							@click.stop="deletePlaylist(item.playlist_id)">
							<Icon icon="material-symbols:delete-rounded" class="text-2xl " />
						</button>
					</div>
				</div>
				<div v-for="(item, index) in filteredAlbum" :key="index" v-if="filter == 'all' || filter == 'playlist'"
					class="flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-white/10 transition-all duration-200"
					@click="useView.selectItem(item); useView.setComponent('PlaylistPage'); useView.setPlaylistData(item);"
					:class="{ 'bg-white/10': useView.selected === item }">
					<div class="flex items-center justify-center w-10 h-10 rounded bg-white/10">
						<img :src="item.thumbnail_path" class="flex-shrink-0 object-cover w-10 h-10 rounded"
							@error="event => event.target.src = defaultImgage" />
					</div>

					<div>
						<div class="text-[#FFE5D6] font-semibold leading-4">{{ item.name }}</div>
						<div class="text-[#FFE5D6]/50 text-s font-medium">
							{{ item.type === 2 ? 'Danh sách phát • ' + item.total_song + " bài hát" :
								'Album của nghệ sĩ • ' + item.total_song + " bài hát" }}
						</div>
					</div>
					<div class="ml-auto">
						<button class=" hover:bg-white/5 p-1 rounded text-[#FFE5D6]/50"
							@click.stop="deletePlaylist(item.playlist_id)">
							<Icon icon="material-symbols:delete-rounded" class="text-2xl" />
						</button>
					</div>
				</div>

				<div v-for="(item, index) in filteredArtist" :key="index" v-if="filter == 'all' || filter == 'artist'"
					class="flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-white/10 transition-all duration-200"
					@click="useView.selectItem(item.artist); useView.setComponent('ArtistPage'); useView.setArtistData(item.artist);"
					:class="{ 'bg-white/10': useView.selected?.email == item.artist.email }">
					<div class="flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
						<img :src="item.artist.avatar_path" class="flex-shrink-0 object-cover w-10 h-10 rounded-full"
							@error="event => event.target.src = defaultImgage" />
					</div>

					<div>
						<div class="text-[#FFE5D6] font-semibold leading-4">{{ item.artist.name }}</div>
						<div class="text-[#FFE5D6]/50 text-s font-medium">
							{{ ' Nghệ sĩ ' }}
						</div>
					</div>
				</div>
			</TransitionGroup>

		</div>
	</div>
</template>