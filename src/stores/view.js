import { defineStore } from "pinia";
export const useViewStore = defineStore("view", {
  state: () => ({
    currentComponent: "HomePage",
    selected: null,
    page: null,
    isFullscreen: false,
    playlistData: null,
    artistData: null,
    userData: null,
  }),

  actions: {
    setComponent(name) {
      this.currentComponent = name;
    },

    selectItem(item) {
      this.selected = item;
    },

    setPlaylistData(playlist) {
      this.playlistData = playlist;
    },

    setArtistData(artist){
      this.artistData = artist;
    },

    toggleFullscreen() {
      const el = this.page;
      if (!document.fullscreenElement) {
        el.requestFullscreen();
        this.isFullscreen = true;
      } else {
        document.exitFullscreen();
        this.isFullscreen = false;
      }
    },

    setFullscreenPage(page){
      this.page = page;
    },

    listenFullscreenChange() {
      document.addEventListener('fullscreenchange', () => {
        this.isFullscreen = !!document.fullscreenElement;
      });
    },
    
  },
});
