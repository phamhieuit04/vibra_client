import { defineStore } from "pinia";
export const useModalStore = defineStore("modal", {
  state: () => ({
    playlistEditData: null,
    openEditProfile: false,
    openEditPlaylist: false,
  }),

  actions: {
    setPlaylistEditData(playlist) {
      this.playlistEditData = playlist;
    },
  },
});
