import { defineStore } from "pinia";
export const useActivityStore = defineStore("activity", {
  state: () => ({
    followArtistList: [],
    favSongList: [],
    myPlaylistList: [],
    allCategories: [],
    searchKey: '',
    userAction: false,
  }),

  actions: {
    changeSearchKey(searchKeyValue){
      this.searchKey = searchKeyValue;
    },
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