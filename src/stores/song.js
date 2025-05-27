import { defineStore } from "pinia";
import defaultImgage from "@/assets/default.jpg";
import defaultSong from "@/assets/DefaultSong.mp3";
import axios from "axios";
import { useAuthStore } from "./auth";

export const useSongStore = defineStore("song", {
  state: () => ({
    isPlaying: false,
    audio: null,
    currentPlaylist: null,
    vol: 80,
    currentTrack: {
      name: "Bài hát chào người mới",
      thumbnail_path: defaultImgage,
      author: {
        name: "Duy",
      },
      song_path: defaultSong,
    },
  }),
  actions: {
    setPlaylist(playlist) {
      this.currentPlaylist = playlist;
    },

    setVolume(range) {
      this.vol = range;
    },

    loadSingleSong(track) {
      const playlistSong = [track];
      this.loadSong(playlistSong, track);
    },

    loadSong(playlist, track) {
      this.currentPlaylist = playlist;
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

    playOrPauseSong() {
      if (this.audio.paused) {
        this.isPlaying = true;
        this.audio.play();
      } else {
        this.isPlaying = false;
        this.audio.pause();
      }
    },

    playOrPauseThisSong(playlist, track) {
      if (!this.audio || !this.audio.src || this.currentTrack.id !== track.id) {
        this.loadSong(playlist, track);
        return;
      }
      this.playOrPauseSong();
    },

    prevSong(currentTrack, playlist) {
      if (playlist === null) return;
      const currentIndex = playlist.findIndex(
        (song) => song.id === currentTrack.id
      );
      if (currentIndex === 0) return;
      let track = playlist[currentIndex - 1];
      this.loadSong(playlist, track);
    },

    nextSong(currentTrack, playlist) {
      if (playlist == null) return;
      const currentIndex = playlist.findIndex(
        (song) => song.id === currentTrack.id
      );
      if (currentIndex === playlist.length - 1) {
        this.playFromFirst(playlist);
      } else {
        this.loadSong(playlist, playlist[currentIndex + 1]);
      }
    },

    playFromFirst(playlist) {
      this.loadSong(playlist, playlist[0]);
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
