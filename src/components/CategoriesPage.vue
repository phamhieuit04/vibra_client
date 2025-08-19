<script setup>
import { onMounted, ref, watch, toRefs, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useViewStore } from '@/stores/view';
import { useActivityStore } from '@/stores/activity';

const useView = useViewStore();
const useActivity = useActivityStore();
const { allCategories } = storeToRefs(useActivity);

const x = ref(0);
const y = ref(0);
const listWrapper = ref(null);

function updateMouse(e) {
    const rect = listWrapper.value.getBoundingClientRect();
    x.value = e.clientX - rect.left;
    y.value = e.clientY - rect.top;
}
</script>

<template>
    <div class="space-y-10 py-14 text-[#FFFF]">
        <div
            class="scrollbar-style h-[calc(100vh-230px)] w-full overflow-y-auto px-6"
        >
            <h2 class="mb-5 text-2xl font-semibold">Thể loại</h2>
            <div
                class="relative flex flex-wrap gap-3 p-2 px-3"
                @mousemove="updateMouse"
                ref="listWrapper"
            >
                <div
                    class="pointer-events-none absolute inset-0 z-0 rounded-xl"
                    :style="{
                        background: `radial-gradient(1000px circle at ${x}px ${y}px, ${useView.currentColor}, transparent)`,
                    }"
                ></div>
                <div
                    v-for="item in allCategories"
                    :key="item.id"
                    class="relative z-10 m-1 h-48 w-[320px] cursor-pointer rounded-xl bg-zinc-700 p-8 duration-200 ease-in-out hover:scale-105"
                    @click="
                        useView.selectItem(item);
                        useView.setComponent('CategoriesSongPage');
                        useView.setCategoriesData(item);
                    "
                >
                    <p class="text-xl font-semibold">{{ item.name }}</p>
                    <img
                        :src="item.thumbnail_path"
                        class="absolute bottom-6 right-6 h-32 w-32 rotate-12"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
