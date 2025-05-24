<script setup>
  import { ref } from "vue";

  defineProps(["isOpen"]);
  const emit = defineEmits(["close"]);

  const profileName = ref("Kise");

  const closeModal = () => {
    emit("close");
  };

  const saveProfile = () => {
    alert(`Lưu hồ sơ: ${profileName.value}`);
    emit("close");
  };
</script>
<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    v-if="isOpen"
  >
    <div class="bg-zinc-900 text-white rounded-lg w-[400px] p-6 relative">
      <button
        class="absolute top-4 right-4 text-white hover:text-red-500"
        @click="closeModal"
      >
        ✕
      </button>

      <h2 class="text-xl font-bold mb-6">Chi tiết hồ sơ</h2>

      <div class="flex items-center gap-4 mb-4">
        <div
          class="bg-zinc-700 rounded-full w-16 h-16 flex items-center justify-center"
        >
          <svg
            class="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5.121 17.804A13.937 13.937 0 0112 15c2.21 0 4.29.535 6.121 1.482M15 10a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        <input
          v-model="profileName"
          class="flex-1 bg-zinc-800 text-white rounded px-4 py-2 outline-none"
          placeholder="Tên hồ sơ"
        />
      </div>

      <button
        class="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
        @click="saveProfile"
      >
        Lưu
      </button>

      <p class="text-xs text-gray-400 mt-4">
        Bằng cách tiếp tục, bạn đồng ý cho phép Spotify truy cập vào hình ảnh
        bạn đã chọn để tải lên. Vui lòng đảm bảo bạn có quyền tải lên hình ảnh.
      </p>
    </div>
  </div>
</template>
