<script setup>
import { onMounted, ref, watch, toRefs, computed } from "vue";
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import axios from 'axios';
import { storeToRefs } from "pinia";
import { useAuthStore } from '@/stores/auth';
import { useViewStore } from "@/stores/view";
import { useSongStore } from "@/stores/song";
import { useModalStore } from "@/stores/modal";
import { useActivityStore } from "@/stores/activity";
import defaultImgage from '@/assets/default.jpg'

const useView = useViewStore();
const authStore = useAuthStore();
const useSong = useSongStore();
const useModal = useModalStore();
const useActivity = useActivityStore();


const { artistData } = storeToRefs(useView);
const { followArtistList } = storeToRefs(useActivity)

const isFollowed = ref(false) 


async function followThisArtist() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/artist/follow/${artistData.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });

        if(res.data.code == 200){
            useActivity.onUserAction();
            isFollowed.value = !isFollowed.value
        }
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
}
async function unfollowThisArtist() {
    try {
        const res = await axios.get(`http://spotify_clone_api.test/api/library/destroy-favorite-artist/${artistData.value.id}`, {
            'headers': {
                'Authorization': 'Bearer ' + authStore.user.token,
            }
        });
        if(res.data.code == 200) {
            useActivity.onUserAction();
            isFollowed.value = !isFollowed.value
        }
    } catch (e) {
        console.log(e);
        alert('Call API thất bại');
    }
}


onMounted(() => {
    followArtistList.value.forEach(artist => {
        if (artist.artist_id === artistData.value.id) {
            isFollowed.value = true
        }
    })
})
</script>
<template>
    <div
        class="text-[#FFE5D6] space-y-6 rounded-[24px] bg-[#1D1512] w-full h-[calc(100vh-12rem)] overflow-y-auto scrollbar-style">

        <div class="relative items-center h-96">
            <img 
                :src="artistData.avatar_path"
                alt="" 
                class="absolute z-0 object-cover w-full h-full"
            />

            <div class="relative z-10 flex flex-col justify-end p-16 space-y-2">             
                <p class="text-lg font-semibold ">
                    <i class="text-2xl text-blue-500 fas fa-check-circle"></i> 
                    Nghệ sĩ
                </p>
                <h1 class="font-black text-8xl">{{ artistData.name }}</h1>
                <p class="mt-1 text-lg font-semibold ">{{ artistData.followers }} người theo dõi</p>
            </div>
        </div>

        <div class="px-12">
            <div class="">
                <div class="flex items-center mb-5 space-x-6">
                    <button
                        class="flex items-center justify-center w-14 h-14 rounded-full bg-[#BC4D15] hover:bg-black transition group">
                        <i class="fas fa-play text-black ml-0.5 text-3xl group-hover:text-[#BC4D15]"></i>
                    </button>

                    <button v-if="!isFollowed" @click="followThisArtist" class="border border-[#BC4D15] text-[#BC4D15] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#BC4D15] hover:text-black transition">
                        Theo dõi
                    </button>
                    <button v-else @click="unfollowThisArtist" class="border border-[#BC4D15] text-[#BC4D15] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#BC4D15] hover:text-black transition">
                        Hủy theo dõi
                    </button>

                    <button class="text-[#BC4D15] text-2xl hover:text-white transition">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>


                <div class="w-full">
                    <h2 class="text-2xl font-semibold pl-14 ">Phổ biến</h2>
                    <div class="px-12 ">
                        <div v-for="i in 8" :key="i"
                            class="flex items-center justify-between hover:bg-[#2a1d18] py-2 pr-4 rounded-lg transition cursor-pointer ">
                            <div class="flex items-center space-x-4">
                                <span class="w-5 text-right text-white">{{ i }}</span>
                                <div class="w-16 h-16 rounded-md bg-zinc-700"></div>
                                <span class="font-medium text-white">Bài hát {{ i }}</span>
                            </div>
                            <div class="flex items-center space-x-8 text-sm text-white">
                                <span>{{ i }}.000.000</span>
                                <span>3:0{{ i }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8 ">
                <h2 class="mb-3 text-2xl font-semibold pl-14">Giới thiệu về nghệ sĩ</h2>
                <div class="">
                    <div class="w-full mb-3 rounded-3xl h-[30rem] flex flex-col justify-end p-12 bg-zinc-700">

                        <p class="text-2xl font-semibold">60.345.760 người nghe hằng tháng</p>
                        <p class="text-xl font-semibold">
                            Sabrina Carpenter là một ca sĩ, nhạc sĩ và diễn viên người Mỹ,
                            sinh ngày 11 tháng 5 năm 1999 tại Quakertown, Pennsylvania.
                            Cô bắt đầu sự nghiệp diễn xuất với vai Maya Hart trong loạt phim "Girl Meets World"
                            của Disney Channel (2014 - 2017), trước khi chuyển hướng sang âm nhạc và nhanh chóng
                            khẳng định tên tuổi trong làng nhạc pop.
                        </p>
                    </div>

                </div>
            </div>

            <div class="mt-8 ">
                <div class="mb-2 space-y-2 font-semibold pl-14">
                    <h2 class="text-2xl ">Danh sách đĩa nhạc</h2>
                    <div class="flex items-center space-x-3 text-sm ">
                        <button
                            class="border border-[#BC4D15] text-[#BC4D15] px-6 py-2 rounded-full hover:bg-[#BC4D15] hover:text-black transition">
                            Đĩa đơn
                        </button>

                        <button
                            class="border border-[#BC4D15] text-[#BC4D15] px-6 py-2 rounded-full hover:bg-[#BC4D15] hover:text-black transition">
                            Album
                        </button>
                    </div>
                </div>

                <div class="w-full overflow-x-auto">
                    <div class="flex px-1 py-2 space-x-4 w-max scrollbar-style">
                        <div v-for="i in 8" :key="i"
                            class="flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105 ">
                            <div class="w-48 h-48 mb-2 rounded-xl bg-zinc-700">

                            </div>
                            <p class="text-xl font-semibold">Tên số {{ i }}</p>
                            <p class="text-sm ">Năm {{ i * 1 }} • Album </p>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<style>
.scrollbar-style {
    scrollbar-width: medium;
    scrollbar-color: #BC4D15 transparent;
}
</style>
