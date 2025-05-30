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
        console.log('File nhạc đã chọn:', file)
    }
}

function chooseTxt() {
    txtInput.value?.click()
}

function onTxtChoosed(event) {
    const file = event.target.files[0]
    if (file) {
        selectedTxtFile.value = file
        console.log('File đã chọn:', file)
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
    console.log(selectedCategoryId.value)
}
function selectAlbum(album) {
    selectedAlbumId.value = album.id
    selectedAlbumName.value = album.name
    showAlbumDropdown.value = false
    console.log(album)
    console.log(selectedAlbumId.value)
}

function onImgChoosed(event) {
    const file = event.target.files[0]
    if (file) {
        songAvt.value = file
        previewImg.value = URL.createObjectURL(file)
        console.log(songAvt.value)
    }
}
function chooseImg() {
    fileInput.value?.click()
}


const uploadSong = async () => {
    if (!songAvt.value || !selectedTxtFile.value || !selectedSongFile.value || !selectedAlbumId.value || !songPrice.value) {
        alert('Vui lòng điền đủ thông tin');
        return;
    }
    if(songPrice.value < 500){
        alert('Giá bài hát ít nhất là 500đ')
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
        if (res.data.code == 200) {
            useActivity.fetchUserData();
            alert('Chỉnh sửa thành công');
        }
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
    openUploadSong.value = false
};

onMounted(() => {
    console.log('UpLoadddddddddddddd')
})
</script>
<template>
    <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60">
        <div class="bg-zinc-900 text-white rounded-lg w-[400px] p-6 relative">
            <button class="absolute top-4 right-4 text-white hover:text-red-500" @click="openUploadSong = false">
                ✕
            </button>

            <h2 class="text-xl font-bold mb-6">Đăng tải bài hát</h2>

            <div class="flex items-center mb-3">
                <div
                    class="bg-zinc-700 relative rounded-full w-24 h-24 flex items-center justify-center shrink-0 group cursor-pointer">
                    <img class="rounded-full w-full h-full object-cover " :src="previewImg ? previewImg : defaultImgage"
                        @error="event => event.target.src = defaultImgage" alt="">
                    <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition"
                        @click="chooseImg">
                        <Icon icon="material-symbols:edit-rounded text-black " />
                        <input type="file" accept="image/*" ref="fileInput" style="display: none"
                            @change="onImgChoosed" />
                    </div>
                </div>
                <div class="">
                    <button @click="chooseSong"
                        class="bg-zinc-800 float-end w-52 text-white rounded ml-4 mb-3 px-4 py-2">{{ selectedSongFile ?
                            selectedSongFile.name : 'Chọn file Nhạc' }}</button>
                    <input type="file" ref="songInput" accept="audio/*" @change="onSongChoosed" class="hidden" />

                    <input v-model="songDescrip" class=" bg-zinc-800 float-end text-white rounded ml-6 mb-3 px-4 py-2"
                        placeholder="Mô tả bài hát" />
                    <input v-model="songPrice" type="number" class=" bg-zinc-800 float-end text-white rounded ml-6 mb-3 px-4 py-2"
                        placeholder="Giá bài hát" />





                    <div class="relative">
                        <button @click="toggleCateDropdown"
                            class="px-4 py-2 mb-3 w-52 float-end bg-gray-700 text-white rounded">
                            {{ selectedCategoryName || 'Chọn thể loại' }}
                        </button>
                        <ul v-if="showCateDropdown"
                            class="absolute z-10 mt-2 ml-5 bg-zinc-800 shadow-md rounded w-full">
                            <li v-for="cate in allCategories" :key="cate.id" @click="selectCategory(cate)"
                                class="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                {{ cate.name }}
                            </li>
                        </ul>
                    </div>


                    <div class="relative">
                        <button @click="toggleAlbumDropdown"
                            class="px-4 py-2 mb-3 w-52 float-end bg-gray-700 text-white rounded">
                            {{ selectedAlbumName || 'Chọn album' }}
                        </button>
                        <ul v-if="showAlbumDropdown"
                            class="absolute z-10 mt-2 ml-5 top-20 bg-zinc-800 shadow-md rounded w-full">
                            <li v-for="album in myAlbumList" :key="album.id" @click="selectAlbum(album)"
                                class="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                {{ album.name }}
                            </li>
                        </ul>
                    </div>






                    <button @click="chooseTxt"
                        class="bg-zinc-800 float-end w-52 text-white rounded ml-4 mb-3 px-4 py-2">{{ selectedTxtFile ?
                            selectedTxtFile.name : 'Chọn file Lyric' }}</button>
                    <input type="file" ref="txtInput" accept=".txt" @change="onTxtChoosed" class="hidden" />
                </div>
            </div>

            <div class=" float-end">
                <button class="bg-gray-500 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
                    @click="openUploadSong = false">
                    Hủy
                </button>
                <button class="ml-4 bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
                    @click="uploadSong">
                    Lưu
                </button>
            </div>
            <p class="text-xs text-gray-400 mt-16">
                Bằng cách tiếp tục, bạn đồng ý cho phép TÔI truy cập vào hình ảnh
                bạn đã chọn để tải lên. Vui lòng đảm bảo bạn có quyền tải lên hình ảnh.
            </p>
        </div>
    </div>
</template>
