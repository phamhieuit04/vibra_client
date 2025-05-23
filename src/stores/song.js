import { defineStore } from "pinia";

export const useSongStore = defineStore("song", {
  state: () => ({
    isPlaying: false,
    audio: null,
    currentPlaylist: null,
    currentTrack: null,
  }),
  actions: {
    setPlaylist(playlist) {
      this.currentPlaylist = playlist;
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
      this.audio.src = track.path;

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
      if(currentTrack.id === 1) return;
      let track = playlist.tracks[currentTrack.id - 2];
      this.loadSong(playlist, track);
    },

    nextSong(currentTrack, playlist) {
      if (currentTrack.id === playlist.tracks.length) {
        this.loadSong(playlist, playlist.tracks[0]);
      } else {
        this.loadSong(playlist, playlist.tracks[currentTrack.id]);
      }
    },

    playFromFirst(playlist) {
      this.loadSong(playlist, playlist.tracks[0]);
    },

    resetState() {
      isPlaying = false;
      audio = null;
      currentPlaylist = null;
      currentTrack = null;
    }
  },
  persist: true
});
