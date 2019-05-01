import { Injectable } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { Song } from '../interfaces/song';

@Injectable()
export class AudioService { 

  mediaObj: MediaObject;
  private songs: Song[];
  private currentSongIndex: number;
  private ignoreStopSubscriber: boolean = false;
  constructor(public media: Media) {

  }

  getDuration(mediaPath: string): Promise<any> {
    const p: Promise<any> = new Promise((resolve, reject) => {
      if (this.mediaObj) {
        this.mediaObj.release();
      }
      this.mediaObj = this.media.create(mediaPath);
      this.mediaObj.play();
      this.mediaObj.setVolume(0);
      setTimeout(() => {
        const duration = Math.round(this.mediaObj.getDuration()).toString();
        resolve(duration);
        this.mediaObj.stop();
        this.mediaObj.release();
      }, 30);
    });
    return p;
  }

  unpause() {
    try {
      this.mediaObj.play();
    } catch (error) {
      // TODO ??
    }
  }

  getProgress(): Promise<any> {
    if (this.mediaObj !== undefined) {
      return this.mediaObj.getCurrentPosition();
    } else {
      return new Promise(function(resolve, reject) {
        resolve(0);
      });
    }
  }

  playNext() {
    if (this.currentSongIndex > this.songs.length - 2) {
      this.currentSongIndex = 0;
    } else {
      this.currentSongIndex = this.currentSongIndex + 1;
    }
    this.startPlayback( this.songs[this.currentSongIndex].id, this.songs);
  }

  playPrevious() {
    if (this.currentSongIndex === 0 || this.currentSongIndex > this.songs.length - 2) {
      this.currentSongIndex = this.songs.length - 1;
    } else {
      this.currentSongIndex = this.currentSongIndex - 1;
    }
    this.startPlayback( this.songs[this.currentSongIndex].id, this.songs);
  }

  startPlayback(id: number, songs: Song[]) {
    this.songs = songs;
    this.currentSongIndex = this.getSongIndex(id);
    this.mediaObj = this.media.create(this.songs[this.currentSongIndex].mediaPath);
    this.mediaObj.play();
    this.mediaObj.setVolume(1);
    this.mediaObj.onStatusUpdate.subscribe(status => {
      if (status === 4) {
        if (!this.ignoreStopSubscriber) {
          this.stopPlayback();
          this.playNext();
        } else {
          this.ignoreStopSubscriber = false;
        }
      }
    });
  }

  seekTo(value: number) {
    if (this.mediaObj !== undefined) {
      return this.mediaObj.seekTo(value);
    }
  }

  private getSongIndex(id: number) {
    for (let i = 0; i < this.songs.length; i++) {
      if (this.songs[i].id === id) {
        return this.songs[i].id;
      }
    }
    return 0;
  }

  pause() {
    this.mediaObj.pause();
  }

  stopPlayback() {
    this.ignoreStopSubscriber = true;
    console.log('in stop: ignoreStopSubscriber');
    if (this.mediaObj !== undefined) {
      this.mediaObj.stop();
      this.mediaObj.release();
    }
  }

  getCurrentlyPlayedSong() {
    return this.songs[this.currentSongIndex];
  }
  
}