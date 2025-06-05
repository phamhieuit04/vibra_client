<script setup>
import { onMounted, ref } from "vue";
import { useViewStore } from "@/stores/view";
import { useAuthStore } from '@/stores/auth';
import { useModalStore } from "@/stores/modal";
import { useActivityStore } from "@/stores/activity";
import { Icon } from '@iconify/vue';
import { storeToRefs } from "pinia";
import axios from 'axios';
import defaultImgage from '@/assets/default.jpg'


const authStore = useAuthStore();
const { user } = storeToRefs(authStore)
const useModal = useModalStore()
const { openUploadSong } = storeToRefs(useModal)
const useActivity = useActivityStore();
const { allCategories, myAlbumList } = storeToRefs(useActivity);
const useView = useViewStore();

const previewImg = ref(null)
const fileInput = ref(null)
const songDescrip = ref(null);
const songPrice = ref(null)
const songAvt = ref(null)


const showCateDropdown = ref(false)
const selectedCategoryId = ref(null)
const selectedCategoryName = ref('')

const showAlbumDropdown = ref(false)
const selectedAlbumId = ref(null)
const selectedAlbumName = ref('')


const txtInput = ref(null)
const selectedTxtFile = ref(null)

const songInput = ref(null)
const selectedSongFile = ref(null)

function chooseSong() {
    songInput.value?.click()
}

function onSongChoosed(event) {
    const file = event.target.files[0]
    if (file) {
        selectedSongFile.value = file
    }
}

function chooseTxt() {
    txtInput.value?.click()
}

function onTxtChoosed(event) {
    const file = event.target.files[0]
    if (file) {
        selectedTxtFile.value = file
    }
}

function toggleCateDropdown() {
    showCateDropdown.value = !showCateDropdown.value
}
function toggleAlbumDropdown() {
    showAlbumDropdown.value = !showAlbumDropdown.value
}

function selectCategory(cate) {
    selectedCategoryId.value = cate.id
    selectedCategoryName.value = cate.name
    showCateDropdown.value = false
}
function selectAlbum(album) {
    selectedAlbumId.value = album.id
    selectedAlbumName.value = album.name
    showAlbumDropdown.value = false
}

function onImgChoosed(event) {
    const file = event.target.files[0]
    if (file) {
        songAvt.value = file
        previewImg.value = URL.createObjectURL(file)
    }
}
function chooseImg() {
    fileInput.value?.click()
}

async function songNotify(artistId, songId) {
	try {
		const res = await axios.get(`http://spotify_clone_api.test/api/firebase/notify-new-song?artist_id=${artistId}&song_id=${songId}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
	} catch (e) {
		console.log(e);
	}
}

const uploadSong = async () => {
    if (!songAvt.value || !selectedTxtFile.value || !selectedSongFile.value || !selectedAlbumId.value || !songPrice.value) {
        useActivity.addNotify(true, "Vui lòng điền đủ thông tin!")
        return;
    }
    if(songPrice.value < 2000){
        useActivity.addNotify(true, "Giá bài hát tối thiểu là 2000đ!")
        return;
    }
    const formData = new FormData()
    formData.append('category-id', selectedCategoryId.value)
    formData.append('description', songDescrip.value)
    formData.append('playlist-id', selectedAlbumId.value)
    formData.append('price', songPrice.value)
    if (songAvt.value && selectedTxtFile.value && selectedSongFile.value) {
        formData.append('song', selectedSongFile.value)
        formData.append('lyric', selectedTxtFile.value)
        formData.append('thumbnail', songAvt.value)
    }

    try {
        const res = await axios.post('http://spotify_clone_api.test/api/profile/upload-song', formData, {
            'headers': {
                'Authorization': 'Bearer ' + user.value.token,
            },
        });
        console.log(res.data.data);
        if (res.data.code == 200) {
            useActivity.fetchUserData();
            useActivity.addNotify(false, "Đăng tải bài hát thành công!")
            useActivity.syncGdrive('songs', res.data.data.id);
            songNotify(user.value.id, res.data.data.id);
        }
    } catch (e) {
        console.log(e);
        useActivity.addNotify(true, "Call Api thất bại!")
    }
    openUploadSong.value = false
};

onMounted(() => {
    console.log('UpLoadddddddddddddd')
})
</script>
<template>
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60">
        <div class="bg-[#1D1512] text-white rounded-lg w-[900px] p-6 relative">
            <button class="absolute text-white top-4 right-4 hover:text-red-500" @click="openUploadSong = false">
                ✕
            </button>

            <h2 class="mb-6 text-2xl font-bold" :style="{color: useView.currentColor}">Đăng tải bài hát</h2>

            <div class="flex gap-1 mb-3">
                <div
                    class="relative flex items-center justify-center cursor-pointer w-80 h-80 rounded-xl bg-zinc-700 shrink-0 group">
                    <img class="object-cover w-full h-full rounded-xl " :src="previewImg ? previewImg : defaultImgage"
                        @error="event => event.target.src = defaultImgage" alt="">
                    <div class="absolute inset-0 flex items-center justify-center transition bg-black bg-opacity-50 opacity-0 rounded-xl group-hover:opacity-100"
                        @click="chooseImg">
                        <Icon icon="material-symbols:edit-rounded text-black " />
                        <input type="file" accept="image/*" ref="fileInput" style="display: none"
                            @change="onImgChoosed" />
                    </div>
                </div>
                <div class="flex-1 ml-2">
                    <button @click="chooseSong"
                        class="px-4 py-3 mb-3  text-white rounded-lg bg-[#25211F] w-full">{{ selectedSongFile ?
                            selectedSongFile.name : 'Chọn file Nhạc' }}</button>
                    <input type="file" ref="songInput" accept="audio/*" @change="onSongChoosed" class="hidden" />

                    <textarea v-model="songDescrip" rows="5" class="px-4 py-3 mb-3  text-white rounded-lg bg-[#25211F] w-full"
                        placeholder="Mô tả bài hát..."></textarea>
                    <input v-model="songPrice" type="number" class="px-4 py-3 mb-3  text-white rounded-lg bg-[#25211F] w-full"
                        placeholder="Giá bài hát" />



 
                    <div class="grid grid-cols-3 gap-4 mb-3">
                        <div class="relative">
                            <button @click="toggleCateDropdown"
                                class="px-4 py-3 mb-3 text-white rounded-lg bg-[#25211F] w-full">
                                {{ selectedCategoryName || 'Chọn thể loại' }}
                            </button>
                            <ul v-if="showCateDropdown"
                                class="absolute z-10 w-full mt-1 ml-5 rounded-lg shadow-md bg-[#25211F] border border-gray-400 overflow-auto scrollbar-style max-h-72">
                                <li v-for="cate in allCategories" :key="cate.id" @click="selectCategory(cate)"
                                    class="px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-500">
                                    {{ cate.name }}
                                </li>
                            </ul>
                        </div>


                        <div class="relative">
                            <button @click="toggleAlbumDropdown"
                                class="px-4 py-3 mb-3 text-white rounded-lg bg-[#25211F] w-full">
                                {{ selectedAlbumName || 'Chọn album' }}
                            </button>
                            <ul v-if="showAlbumDropdown"
                                class="absolute z-10 w-full mt-1 ml-5 rounded-lg shadow-md  bg-[#25211F] border border-gray-400 overflow-auto scrollbar-style max-h-72">
                                <li v-for="album in myAlbumList" :key="album.id" @click="selectAlbum(album)"
                                    class="px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-500">
                                    {{ album.name }}
                                </li>
                            </ul>
                        </div>

                        <button @click="chooseTxt"
                            class="px-4 py-3 mb-3  text-white rounded-lg bg-[#25211F] w-full">{{ selectedTxtFile ?
                                selectedTxtFile.name : 'Chọn file Lyric' }}</button>
                        <input type="file" ref="txtInput" accept=".txt" @change="onTxtChoosed" class="hidden" />

                    </div>
                    

                    <div class="flex justify-end mt-4 space-x-4 ">
                        <button class="py-2 font-semibold text-white transition bg-gray-600 rounded-3xl px-7 hover:bg-gray-500"
                            @click="openUploadSong = false">
                            Hủy
                        </button>
                        <button class="py-2 ml-4 font-semibold text-white transition rounded-3xl px-7 hover:brightness-125"
                            :style="{backgroundColor: useView.currentColor}"
                            @click="uploadSong">
                            Lưu
                        </button>
                    </div>
                    
                </div>
            </div>

            
            <p class="mt-4 text-xs text-gray-400">
                Bằng cách tiếp tục, bạn đồng ý cho phép TÔI truy cập vào hình ảnh
                bạn đã chọn để tải lên. Vui lòng đảm bảo bạn có quyền tải lên hình ảnh.
            </p>
        </div>
    </div>
</template>
