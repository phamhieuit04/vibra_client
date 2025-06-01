import { defineStore } from "pinia";
import defaultImgage from "@/assets/default.jpg";
import defaultSong from "@/assets/DefaultSong.mp3";
import axios from "axios";
import { useAuthStore } from "./auth";
import { useActivityStore } from "./activity";

export const useSongStore = defineStore("song", {
  state: () => ({
    isPlaying: false,
    audio: null,
    currentPlaylist: null,
    songTime: 0,
    vol: 80,
    currentTrack: {
      id: 0,
      name: "Bài hát chào người mới",
      thumbnail_path: defaultImgage,
      author: {
        name: "Duy",
      },
      song_path: defaultSong,
    },
    currentWaitlist: [],
    prevList: [],
    isShuffle: true,
  }),
  actions: {
    playThisSong(track) {
      this.currentTrack = track;

      if (this.audio && this.audio.src) {
        this.audio.pause();
        this.isPlaying = false;
        this.audio.src = "";
      }

      this.audio = new Audio();
      this.audio.src = track.song_path;

      if (!this.audio.src || !this.audio) {
        console.log("Nguồn không tồn tại hoặc bài hát bị lỗi định dạng");
        return;
      }

      try {
        const authStore = useAuthStore();
        const res = axios.get(
          `http://spotify_clone_api.test/api/song/update/${track.id}`,
          {
            headers: {
              Authorization: "Bearer " + authStore.user.token,
            },
          }
        );
      } catch (e) {
        console.log(e);
        alert("Call API thất bại");
      }

      setTimeout(() => {
        this.isPlaying = true;
        this.audio.play();
      }, 200);
    },

    addSongToWaitlist(track) {
      track.index = this.currentWaitlist.length;
      this.currentWaitlist.push(track);
      this.fetchIndex();
      useActivityStore().addNotify(false, "Đã thêm bài hát vào hàng chờ!")
    },
    addPlaylistToWaitlist(playlist) {
      if (!playlist || playlist.length == 0) return;
      for (let i = playlist.length - 1; i >= 0; i--) {
        this.currentWaitlist.unshift(playlist[i]);
      }
      this.fetchIndex();
      useActivityStore().addNotify(false, "Đã thêm danh sách phát này vào hàng chờ!")
    },

    addAndPlayThisPlaylist(playlist) {
      if (!playlist || playlist.length == 0) return;
      for (let i = playlist.length - 1; i > 0; i--) {
        this.currentWaitlist.unshift(playlist[i]);
      }
      this.playThisSong(playlist[0]);
      this.fetchIndex();
      useActivityStore().addNotify(false, "Đã thêm danh sách phát này vào hàng chờ!")
    },

    deleteSongFromWaitlist(track) {
      this.currentWaitlist.splice(track.index, 1);
      this.fetchIndex();
    },

    fetchIndex() {
      for (let i = 0; i < this.currentWaitlist.length; i++) {
        this.currentWaitlist[i].index = i;
      }
    },

    nextSongs() {
      if (this.currentWaitlist.length > 0) {
        if(this.isShuffle == false){
          this.prevList.unshift(this.currentTrack);
          const nextSong = this.currentWaitlist.shift();
          this.playThisSong(nextSong);
          this.fetchIndex();
          console.log('chưa shuffle')
        }
        else{
          const tmpTrack = this.currentWaitlist[Math.floor(Math.random() * this.currentWaitlist.length)];
          this.playThisSongInWaitlist(tmpTrack)
        }
      } else {
        this.playThisSong(this.currentTrack);
        this.fetchIndex();
        return;
      }
    },

    prevSongs() {
      if (this.prevList.length > 0) {
        const prevSong = this.prevList.shift();
        this.currentWaitlist.unshift(this.currentTrack);
        this.playThisSong(prevSong);
        this.fetchIndex();
      } else {
        return;
      }
    },

    playOrPauseThisSong(track) {
      if (!this.audio || !this.audio.src || this.currentTrack.id !== track.id) {
        this.playThisSong(track);
        return;
      }
      this.playOrPauseSong();
    },

    playOrPauseSong() {
      if (this.audio.paused) {
        this.isPlaying = true;
        this.audio.play();
      } else {
        this.isPlaying = false;
        this.audio.pause();
      }
    },

    playThisSongInWaitlist(track) {
      this.prevList.unshift(this.currentTrack);
      this.playThisSong(track);
      this.deleteSongFromWaitlist(track);
    },

    setPlaylist(playlist) {
      this.currentPlaylist = playlist;
    },

    setVolume(range) {
      this.vol = range;
    },
    setSongTime(time){
      this.songTime = time
    },

    resetState() {
      isPlaying = false;
      audio = null;
      currentPlaylist = null;
      currentTrack = null;
    },
  },
  persist: true,
});
