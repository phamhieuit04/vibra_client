<script setup>
import { onMounted, ref } from "vue";
import { useViewStore } from "@/stores/view";
import { useAuthStore } from '@/stores/auth';
import { useModalStore } from "@/stores/modal";
import { Icon } from '@iconify/vue';
import { storeToRefs } from "pinia";
import axios from 'axios';
import defaultImgage from '@/assets/default.jpg'
import { useActivityStore } from "@/stores/activity";


const authStore = useAuthStore();
const { user } = storeToRefs(authStore)
const useModal = useModalStore()
const { openEditProfile } = storeToRefs(useModal)
const useActivity = useActivityStore();
const { allCategories } = storeToRefs(useActivity);

const previewImg = ref(null)
const fileInput = ref(null)
const profileName = ref(user.value.name);
const profileGender = ref(user.value.gender ? user.value.gender : 'Giới tính khác');
const profileBirth = ref(user.value.birth ? user.value.birth : '2000/10/10')
const avatar = ref(null)


function onImgChoosed(event) {
  const file = event.target.files[0]
  if (file) {
    avatar.value = file
    previewImg.value = URL.createObjectURL(file)
    console.log(avatar.value)
  }
}
function chooseImg() {
  fileInput.value?.click()
}


const saveProfile = async () => {
  const formData = new FormData()
  formData.append('name', profileName.value)
  formData.append('gender', profileGender.value)
  formData.append('birth', profileBirth.value)
  if (avatar.value) {
    formData.append('avatar', avatar.value)
  }

  try {
    const res = await axios.post('http://spotify_clone_api.test/api/profile/update', formData, {
      'headers': {
        'Authorization': 'Bearer ' + user.value.token,
      },
    });
    const fetchUser = await axios.get('http://spotify_clone_api.test/api/profile/show', {
      'headers': {
        'Authorization': 'Bearer ' + user.value.token,
      },
    });
    fetchUser.data.data.token = user.value.token;
    authStore.setUser(fetchUser.data.data);
    console.log(res)
    alert('Chỉnh sửa thành công');
  } catch (e) {
    console.log(e);
    alert('Call API thất bại');
  }
  openEditProfile.value = false
};

onMounted(() => {
  console.log(user.value)
})
</script>
<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-zinc-900 text-white rounded-lg w-[400px] p-6 relative">
      <button class="absolute top-4 right-4 text-white hover:text-red-500" @click="openEditProfile = false">
        ✕
      </button>

      <h2 class="text-xl font-bold mb-6">Chi tiết hồ sơ</h2>

      <div class="flex items-center mb-3">
        <div
          class="bg-zinc-700 relative rounded-full w-24 h-24 flex items-center justify-center shrink-0 group cursor-pointer">
          <img class="rounded-full w-full h-full object-cover " :src="previewImg ? previewImg : user.avatar_path"
            @error="event => event.target.src = defaultImgage" alt="">
          <div
            class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition"
            @click="chooseImg">
            <Icon icon="material-symbols:edit-rounded text-black " />
            <input type="file" accept="image/*" ref="fileInput" style="display: none" @change="onImgChoosed" />
          </div>
        </div>
        <div class="">
          <input v-model="profileName" class=" bg-zinc-800 float-end text-white rounded mb-3 px-4 py-2"
            placeholder="Tên hồ sơ" />
          <select class=" bg-zinc-800 float-end text-white rounded mb-3 px-4 py-2" v-model="profileGender">
            <option disabled value="-- Chọn giới tính --">-- Chọn giới tính --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Giới tính khác">Khác</option>
          </select>
          <input type="date" v-model="profileBirth" class=" bg-zinc-800  float-end text-white rounded mb-3 px-4 py-2"
            placeholder="Ngày sinh" />
        </div>
      </div>

      <div class=" float-end">
        <button class="bg-gray-500 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
          @click="openEditProfile = false">
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
