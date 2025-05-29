import { defineStore } from "pinia";
export const useModalStore = defineStore("modal", {
  state: () => ({
    playlistEditData: null,
    songUpdateData: null,

    openEditProfile: false,
    openEditPlaylist: false,
    openUploadSong: false,
    openEditAlbum: false,
  }),

  actions: {
    setPlaylistEditData(playlist) {
      this.playlistEditData = playlist;
    },
  },
});
