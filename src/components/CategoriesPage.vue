<script setup>
import { onMounted, ref, watch, toRefs, computed } from "vue";
import { storeToRefs } from "pinia";
import { useViewStore } from "@/stores/view";
import { useActivityStore } from "@/stores/activity";
import { vAutoAnimate } from "@formkit/auto-animate/vue";

const useView = useViewStore();
const useActivity = useActivityStore();
const { allCategories } = storeToRefs(useActivity)

const x = ref(0)
const y = ref(0)
const listWrapper = ref(null)

function updateMouse(e) {
    const rect = listWrapper.value.getBoundingClientRect()
    x.value = e.clientX - rect.left
    y.value = e.clientY - rect.top
}
</script>

<template>
    <div class="py-14 space-y-10 text-[#FFFF]">
        <div class="px-6 w-full h-[calc(100vh-230px)] overflow-y-auto scrollbar-style">
            <h2 class="mb-5 text-2xl font-semibold">Thể loại</h2>
            <div class="relative flex flex-wrap gap-3 p-2 px-3" @mousemove="updateMouse" ref="listWrapper">
                <div class="absolute inset-0 z-0 pointer-events-none rounded-xl" :style="{
                    background: `radial-gradient(200px circle at ${x}px ${y}px, #15ca82, transparent)`
                }"></div>
                <div v-for="item in allCategories" :key="item.id"
                    class="relative hover:scale-105  z-10 p-8 m-1 duration-200 ease-in-out rounded-xl cursor-pointer w-[320px] h-48 bg-zinc-700"
                    @click="useView.selectItem(item); useView.setComponent('CategoriesSongPage'); useView.setCategoriesData(item);">
                    <p class="text-xl font-semibold">{{ item.name }}</p>
                    <img :src="item.thumbnail_path" class="absolute w-32 h-32 right-6 bottom-6 rotate-12" />
                </div>
            </div>
        </div>
    </div>
</template>