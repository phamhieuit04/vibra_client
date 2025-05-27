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
import SongModal from "@/components/SongModal.vue";
import SidePanel from "@/components/SidePanel.vue";
import CategoriesSongPage from "@/components/CategoriesSongPage.vue";

import { useSongStore } from "@/stores/song";
import { useViewStore } from "@/stores/view";
import { storeToRefs } from "pinia";
import CategoriesPage from "@/components/CategoriesPage.vue";
import { useModalStore } from "@/stores/modal";

const useSong = useSongStore()
const { currentTrack } = storeToRefs(useSong)

const useView = useViewStore()
const { currentComponent, isFullscreen, showSidePanel } = storeToRefs(useView)

const useModal = useModalStore()
const { openEditProfile, openEditPlaylist, openUploadSong } = storeToRefs(useModal)

const player = ref(null)

const components = {
  HomePage,
  PlaylistPage,
  UserPage,
  SearchPage,
  CategoriesPage,
  ArtistPage,
  CategoriesSongPage
};

onMounted(() => {
  useView.setFullscreenPage(player.value);
})

</script>
<template>
  <div class="bg-black">
    <Header />
    <Sidebar />
    <div :class="['transition-all duration-300 fixed top-[64px] overflow-auto h-full bg-[#1D1512] rounded-[24px]',
      showSidePanel ? 'left-[23%] w-[57.4%]' : 'left-[23%] w-[76.6%]']">
      <component :is="components[currentComponent]" />
    </div>
    <div v-if="showSidePanel"
      class="fixed top-[64px] left-[80.7%] w-[19%] overflow-auto h-full bg-[#1D1512] rounded-[24px]">
      <SidePanel/>
    </div>
    <div ref="player">
      <SongPage v-if="isFullscreen" />
      <Player />
    </div>

    <SongModal v-if="openUploadSong" />
    <ProfileModal v-if="openEditProfile" />
    <PlaylistModal v-if="openEditPlaylist" />
  </div>
</template>
