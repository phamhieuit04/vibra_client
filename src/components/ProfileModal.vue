<script setup>
import { ref } from "vue";
import { useViewStore } from "@/stores/view";
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from "pinia";


const authStore = useAuthStore();
const useView = useViewStore()
const { openEditProfile } = storeToRefs(useView)
const { user } = storeToRefs(authStore)


const profileName = ref("Kise");


const saveProfile = () => {
  alert(`Lưu hồ sơ: ${profileName.value}`);
  emit("close");
};
</script>
<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-zinc-900 text-white rounded-lg w-[400px] p-6 relative">
      <button class="absolute top-4 right-4 text-white hover:text-red-500" @click="openEditProfile = false">
        ✕
      </button>

      <h2 class="text-xl font-bold mb-6">Chi tiết hồ sơ</h2>

      <div class="flex items-center gap-6 mb-4">
        <div class="bg-zinc-700 rounded-full w-48 h-24 flex items-center justify-center">

        </div>
        <div>
          <input v-model="profileName" class="flex-1 bg-zinc-800 text-white rounded mb-3 px-4 py-2 outline-none" placeholder="Tên hồ sơ" />
          <input v-model="profileName" class="flex-1 bg-zinc-800 text-white rounded mb-3 px-4 py-2 outline-none" placeholder="Tên hồ sơ" />
          <input v-model="profileName" class="flex-1 bg-zinc-800 text-white rounded mb-3 px-4 py-2 outline-none" placeholder="Tên hồ sơ" />
        </div>
      </div>

      <div class=" float-end">
        <button class="bg-gray-500 text-black px-4 py-2 rounded hover:bg-gray-400 transition" @click="openEditProfile = false">
          Hủy
        </button>
        <button class="ml-4 bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition" @click="saveProfile">
          Lưu
        </button>
      </div>
      <p class="text-xs text-gray-400 mt-16">
        Bằng cách tiếp tục, bạn đồng ý cho phép Spotify truy cập vào hình ảnh
        bạn đã chọn để tải lên. Vui lòng đảm bảo bạn có quyền tải lên hình ảnh.
      </p>
    </div>
  </div>
</template>
