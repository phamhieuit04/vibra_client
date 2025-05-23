<script setup>
import { ref, onMounted } from "vue";
import Header from '@/components/Header.vue'
import Sidebar from '@/components/Sidebar.vue'
import Player from "@/components/Player.vue";
import HomePage from "@/components/HomePage.vue"
import PlaylistPage from '@/components/PlaylistPage.vue'
import UserPage from "@/components/UserPage.vue";
import SearchPage from "@/components/SearchPage.vue"
import SongPage from "@/components/SongPage.vue";

import { useViewStore } from "@/stores/view";
import { useSongStore } from "@/stores/song";
import { storeToRefs } from "pinia";

const useSong = useSongStore()
const { currentTrack } = storeToRefs(useSong)

const useView = useViewStore()
const { currentComponent, isFullscreen } = storeToRefs(useView)

const player = ref(null)

const components = {
  HomePage,
  PlaylistPage,
  UserPage,
  SearchPage,
};

onMounted(() => {
  useView.setFullscreenPage(player.value);
})

</script>
<template>
  <div class="bg-black">
    <Header />
    <Sidebar />
    <div
      class="fixed right-1.5 top-[64px] left-[432px] w-[100%-420px] overflow-auto h-full bg-[#1D1512] rounded-[24px]">
      <component :is="components[currentComponent]"></component>
    </div>
    <div ref="player">
      <SongPage v-if="isFullscreen"/>
      <Player v-if="currentTrack" />
    </div>
  </div>
</template>
