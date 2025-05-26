<script setup>
import { onMounted, ref } from "vue";
import { useModalStore } from "@/stores/modal";
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@iconify/vue';
import { storeToRefs } from "pinia";
import axios from 'axios';
import defaultImgage from '@/assets/default.jpg'


const authStore = useAuthStore();
const useModal = useModalStore()
const { openEditPlaylist, playlistEditData } = storeToRefs(useModal)

const previewImg = ref(null)
const fileInput = ref(null)
const playlistName = ref(playlistEditData.value.name);
const playlistDescrip = ref(playlistEditData.value.description);
const thumbnail = ref(null)


function onImgChoosed(event) {
  const file = event.target.files[0]
  if (file) {
    thumbnail.value = file
    previewImg.value = URL.createObjectURL(file)
  }
}
function chooseImg() {
  fileInput.value?.click()
}


const saveProfile = async () => {
    if(!playlistDescrip.value) {
        playlistDescrip.value = 'Mô tả';
    }
  const formData = new FormData()
  formData.append('name', playlistName.value)
  formData.append('description', playlistDescrip.value)
  if (thumbnail.value) {
    formData.append('thumbnail', thumbnail.value)
  }

  try {
    const res = await axios.post(`http://spotify_clone_api.test/api/library/update-playlist/${playlistEditData.value.id}`, formData, {
      'headers': {
        'Authorization': 'Bearer ' + authStore.user.token,
      },
    });
    alert('Chỉnh sửa thành công');
  } catch (e) {
    console.log(e);
    alert('Call API thất bại');
  }
  openEditPlaylist.value = false
};

onMounted(() => {
  console.log(playlistEditData.value)
})
</script>
<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-zinc-900 text-white rounded-lg w-[400px] p-6 relative">
      <button class="absolute top-4 right-4 text-white hover:text-red-500" @click="openEditPlaylist = false">
        ✕
      </button>

      <h2 class="text-xl font-bold mb-6">Chỉnh sửa Playlist</h2>

      <div class="flex items-center mb-3">
        <div
          class="bg-zinc-700 relative rounded-full w-24 h-24 flex items-center justify-center shrink-0 group cursor-pointer">
          <img class="rounded-full w-full h-full object-cover " :src="previewImg ? previewImg : playlistEditData.thumbnail_path"
            @error="event => event.target.src = defaultImgage" alt="">
          <div
            class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition"
            @click="chooseImg">
            <Icon icon="material-symbols:edit-rounded text-black " />
            <input type="file" accept="image/*" ref="fileInput" style="display: none" @change="onImgChoosed" />
          </div>
        </div>
        <div class="">
          <input v-model="playlistName" class=" bg-zinc-800 float-end text-white rounded mb-3 px-4 py-2"
            placeholder="Tên Playlist" />
          <input v-model="playlistDescrip" class=" bg-zinc-800  float-end text-white rounded mb-3 px-4 py-2"
            placeholder="Mô tả Playlist" />
        </div>
      </div>

      <div class=" float-end">
        <button class="bg-gray-500 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
          @click="openEditPlaylist = false">
          Hủy
        </button>
        <button class="ml-4 bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition" @click="saveProfile">
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
