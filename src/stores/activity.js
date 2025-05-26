import { defineStore } from "pinia";
export const useActivityStore = defineStore("activity", {
  state: () => ({
    followArtistList: [],
    favSongList: [],
    userAction: false,
  }),

  actions: {
    setFollowArtistList(listArtist) {
      this.followArtistList = listArtist;
    },
    setFavSongList(listSong) {
      this.favSongList = listSong;
    },
    onUserAction(){
        this.userAction = !this.userAction;
    },
  },
});