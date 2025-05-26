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
import ArtistPage from "@/components/ArtistPage.vue";
import ProfileModal from "@/components/ProfileModal.vue";
import PlaylistModal from "@/components/PlaylistModal.vue";

import { useSongStore } from "@/stores/song";
import { useViewStore } from "@/stores/view";
import { storeToRefs } from "pinia";
import CategoriesPage from "@/components/CategoriesPage.vue";
import { useModalStore } from "@/stores/modal";

const useSong = useSongStore()
const { currentTrack } = storeToRefs(useSong)

const useView = useViewStore()
const { currentComponent, isFullscreen } = storeToRefs(useView)

const useModal = useModalStore()
const { openEditProfile, openEditPlaylist } = storeToRefs(useModal)

const player = ref(null)

const components = {
  HomePage,
  PlaylistPage,
  UserPage,
  SearchPage,
  CategoriesPage,
  ArtistPage
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
      <Player />
    </div>

    <ProfileModal v-if="openEditProfile"/>
    <PlaylistModal v-if="openEditPlaylist"/>
  </div>
</template>
