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
const useView = useViewStore();

const previewImg = ref(null)
const fileInput = ref(null)
const profileName = ref(user.value.name);
const profileDescrip = ref(user.value.description)
const profileGender = ref(user.value.gender ? user.value.gender : 'Giới tính khác');
const profileBirth = ref(user.value.birth ? user.value.birth : '2000/10/10')
const avatar = ref(null)


function onImgChoosed(event) {
  const file = event.target.files[0]
  if (file) {
    avatar.value = file
    previewImg.value = URL.createObjectURL(file)
  }
}
function chooseImg() {
  fileInput.value?.click()
}


const saveProfile = async () => {
  if (!profileName.value || !profileDescrip.value || !profileGender.value) {
    useActivity.addNotify(true, "Vui lòng điền đủ thông tin!")
    return;
  }
  const formData = new FormData()
  formData.append('name', profileName.value)
  formData.append('description', profileDescrip.value)
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
    useActivity.addNotify(false, "Chỉnh sửa thông tin thành công!")
    useActivity.syncGdrive('avatars', user.value.id)
  } catch (e) {
    console.log(e);
    useActivity.addNotify(true, "Call Api thất bại!")
  }
  openEditProfile.value = false
};

onMounted(() => {
  // console.log(user.value)
})
</script>
<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#1D1512] text-white rounded-lg w-[550px] p-6 relative">
      <button class="absolute text-white top-4 right-4 hover:text-red-500" @click="openEditProfile = false">
        ✕
      </button>

      <h2 class="mb-6 text-2xl font-bold" :style="{color: useView.currentColor}">Chi tiết hồ sơ</h2>

      <div class="flex gap-1 mb-3 r">
        <div
          class="relative flex items-center justify-center w-56 h-56 cursor-pointer rounded-xl bg-zinc-700 shrink-0 group">
          <img class="object-cover w-full h-full rounded-xl " :src="previewImg ? previewImg : user.avatar_path"
            @error="event => event.target.src = defaultImgage" alt="">
          <div
            class="absolute inset-0 flex items-center justify-center transition bg-black bg-opacity-50 opacity-0 rounded-xl group-hover:opacity-100"
            @click="chooseImg">
            <Icon icon="material-symbols:edit-rounded text-black " />
            <input type="file" accept="image/*" ref="fileInput" style="display: none" @change="onImgChoosed" />
          </div>
        </div>
        <div class="flex-1 ml-2">
          <input v-model="profileName" class="px-4 py-3 mb-3 text-white rounded-lg bg-[#25211F] w-full float-end"
            placeholder="Tên hồ sơ" />
          <input v-model="profileDescrip" class="px-4 py-3 mb-3 text-white rounded-lg bg-[#25211F] w-full float-end"
            placeholder="Mô tả bản thân" />
          <select class="px-4 py-3 mb-3 text-white rounded-lg bg-[#25211F] w-full float-end" v-model="profileGender">
            <option disabled value="-- Chọn giới tính --">-- Chọn giới tính --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Giới tính khác">Khác</option>
          </select>
          <input type="date" v-model="profileBirth" class="px-4 py-3 mb-3 text-white rounded-lg bg-[#25211F] w-full float-end"
            placeholder="Ngày sinh" />
        </div>
      </div>

      <div class=" float-end">
        <button class="py-2 font-semibold text-white transition bg-gray-600 rounded-3xl px-7 hover:bg-gray-500"
          @click="openEditProfile = false">
          Hủy
        </button>
        <button class="py-2 ml-4 text-white transition rounded-3xl px-7 hover:brightness-125 font-semibold" :style="{backgroundColor: useView.currentColor}" @click="saveProfile">
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
