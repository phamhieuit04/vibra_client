import { defineStore } from "pinia";
export const useActivityStore = defineStore("activity", {
  state: () => ({
    followArtistList: [],
    favSongList: [],
    myPlaylistList: [],
    allCategories: [],
    userAction: false,
  }),

  actions: {
    setFollowArtistList(listArtist) {
      this.followArtistList = listArtist;
    },
    setFavSongList(listSong) {
      this.favSongList = listSong;
    },
    setMyPlaylistList(playlist) {
      this.myPlaylistList = playlist;
    },
    setCategories(categoriesList){
      this.allCategories = categoriesList;
    },
    onUserAction(){
        this.userAction = !this.userAction;
    },
  },
});