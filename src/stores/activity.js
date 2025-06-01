import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";
import { ref } from "vue";

export const useActivityStore = defineStore("activity", {
  state: () => ({
    followArtistList: [],
    followAlbumList: [],
    favSongList: [],
    myPlaylistList: [],
    myAlbumList: [],
    mySongList: [],

    allCategories: [],
    searchKey: "",

    notifyList: [],
    notify: {
      index: 0,
      isError: false,
      message: '',
    },
  }),

  actions: {
    async fetchData() {
      try {
        const authStore = useAuthStore();
        const albumRes = await axios.get(
          "http://spotify_clone_api.test/api/library/list-playlist?type=1",
          {
            headers: {
              Authorization: "Bearer " + authStore.user.token,
            },
            type: 1,
          }
        );
        const myPlaylistRes = await axios.get(
          "http://spotify_clone_api.test/api/library/list-playlist?type=2",
          {
            headers: {
              Authorization: "Bearer " + authStore.user.token,
            },
            type: 2,
          }
        );
        const artistRes = await axios.get(
          "http://spotify_clone_api.test/api/library/list-artist",
          {
            headers: {
              Authorization: "Bearer " + authStore.user.token,
            },
          }
        );
        const songRes = await axios.get(
          "http://spotify_clone_api.test/api/library/list-song",
          {
            headers: {
              Authorization: "Bearer " + authStore.user.token,
            },
          }
        );
        this.setFollowArtistList(artistRes.data.data);
        this.setMyPlaylistList(myPlaylistRes.data.data);
        this.setFollowAlbumList(albumRes.data.data);
        const rawList = songRes.data.data;
        const onlySongs = rawList.map((item) => item.song);
        const myFavSongList = ref([
          {
            name: "",
            total_song: 0,
            thumbnail_path: "",
            isFav: true,
            author: [
              {
                name: authStore.user.name,
              },
            ],
            songs: [],
          },
        ]);
        myFavSongList.value.songs = onlySongs;
        myFavSongList.value.total_song = onlySongs.length;
        myFavSongList.value.name = "Bài hát yêu thích";
        myFavSongList.value.thumbnail_path = "";
        myFavSongList.value.isFav = true;
        this.setFavSongList(myFavSongList.value);
      } catch (e) {
        console.log(e);
        alert("Call API thất bại");
      }
    },

    async fetchUserData() {
      try {
        const authStore = useAuthStore();
        const res = await axios.get(
          `http://spotify_clone_api.test/api/profile/list-album`,
          {
            headers: {
              Authorization: "Bearer " + authStore.user.token,
            },
          }
        );
        const res2 = await axios.get(
          `http://spotify_clone_api.test/api/profile/list-song`,
          {
            headers: {
              Authorization: "Bearer " + authStore.user.token,
            },
          }
        );
        this.myAlbumList = res.data.data;
        this.mySongList = res2.data.data;
      } catch (e) {
        console.log(e);
        alert("Call API thất bại");
      }
    },

    addNotify(isError, message) {
      this.notifyList.push({isError, message});
    },

    removeNotify(index) {
      this.notifyList.splice(index, 1);
    },

    // fetchIndex() {
    //   for (let i = 0; i < this.notifyList.length; i++) {
    //     this.notifyList[i].index = i;
    //   }
    // },

    changeSearchKey(searchKeyValue) {
      this.searchKey = searchKeyValue;
    },

    setFollowArtistList(listArtist) {
      this.followArtistList = listArtist;
    },
    setFollowAlbumList(listAlbum) {
      this.followAlbumList = listAlbum;
    },
    setFavSongList(listSong) {
      this.favSongList = listSong;
    },
    setMyPlaylistList(playlist) {
      this.myPlaylistList = playlist;
    },
    setMyAlbumList(listAlbum) {
      this.myAlbumList = listAlbum;
    },
    setCategories(categoriesList) {
      this.allCategories = categoriesList;
    },
  },
});
