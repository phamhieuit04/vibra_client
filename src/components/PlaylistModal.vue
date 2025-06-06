<script setup>
import { onMounted, ref } from "vue";
import { useModalStore } from "@/stores/modal";
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@iconify/vue';
import { storeToRefs } from "pinia";
import axios from 'axios';
import defaultImgage from '@/assets/default.jpg'
import { useActivityStore } from "@/stores/activity";
import { useViewStore } from "@/stores/view";


const authStore = useAuthStore();
const useModal = useModalStore()
const { openEditPlaylist, playlistEditData } = storeToRefs(useModal)
const useActivity = useActivityStore();
const useView = useViewStore();

const previewImg = ref(null)
const fileInput = ref(null)
const playlistName = ref(playlistEditData.value.name);
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
  if(!playlistName.value) {
    useActivity.addNotify(true, "Vui lòng điền đủ thông tin!")
    return
  }
  const formData = new FormData()
  formData.append('name', playlistName.value)
  if (thumbnail.value) {
    formData.append('thumbnail', thumbnail.value)
  }

  try {
    const res = await axios.post(`http://spotify_clone_api.test/api/library/update-playlist/${playlistEditData.value.id}`, formData, {
      'headers': {
        'Authorization': 'Bearer ' + authStore.user.token,
      },
    });
    if(res.data.code == 200){
      useActivity.fetchData();
      useActivity.addNotify(false, "Chỉnh sửa thành công!")
    }
  } catch (e) {
    console.log(e);
    useActivity.addNotify(true, "Call Api thất bại!")
  }
  openEditPlaylist.value = false
};

onMounted(() => {
  console.log(playlistEditData.value)
})
</script>
<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#1D1512] text-white rounded-lg w-[550px] p-6 relative">
      <button class="absolute text-white top-4 right-4 hover:text-red-500" @click="openEditPlaylist = false">
        ✕
      </button>

      <h2 class="mb-6 text-2xl font-bold" :style="{color: useView.currentColor}">Chỉnh sửa Playlist</h2>

      <div class="flex gap-1 mb-3">
        <div
          class="relative flex items-center justify-center w-48 cursor-pointer h-44 rounded-xl bg-zinc-700 shrink-0 group">
          <img class="object-cover w-full h-full rounded-xl " :src="previewImg ? previewImg : playlistEditData.thumbnail_path"
            @error="event => event.target.src = defaultImgage" alt="">
          <div
            class="absolute inset-0 flex items-center justify-center transition bg-black bg-opacity-50 opacity-0 rounded-xl group-hover:opacity-100"
            @click="chooseImg">
            <Icon icon="material-symbols:edit-rounded text-black " />
            <input type="file" accept="image/*" ref="fileInput" style="display: none" @change="onImgChoosed" />
          </div>
        </div>
        <div class="flex-1 ml-2">
          <input v-model="playlistName" class="px-4 py-3 mb-3 text-white rounded-lg bg-[#25211F] w-full "
            placeholder="Tên Playlist" />
        </div>
        
      </div>

      <div class=" float-end">
        <button class="py-2 font-semibold text-white transition bg-gray-600 px-7 rounded-3xl hover:bg-gray-500"
          @click="openEditPlaylist = false">
          Hủy
        </button>
        <button class="py-2 ml-4 text-white transition rounded-3xl px-7 hover:brightness-125 font-semibold" 
          :style="{backgroundColor: useView.currentColor}"
          @click="saveProfile">
          Lưu
        </button>
      </div>
      <p class="mt-16 text-xs text-gray-400">
        Bằng cách tiếp tục, bạn đồng ý cho phép TÔI truy cập vào hình ảnh
        bạn đã chọn để tải lên. Vui lòng đảm bảo bạn có quyền tải lên hình ảnh.
      </p>
    </div>
  </div>
</template>

