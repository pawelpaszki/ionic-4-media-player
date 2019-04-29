import { Injectable } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { Song } from './persistence.service';

@Injectable()
export class AudioService { 

  mediaObj: MediaObject;
  private songs: Song[];
  private currentSongIndex: number;
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
    if (this.currentSongIndex === this.songs.length - 1) {
      this.currentSongIndex = 0;
    } else {
      this.currentSongIndex = this.currentSongIndex + 1;
    }
    this.startPlayback(this.currentSongIndex, this.songs[this.currentSongIndex].mediaPath, this.songs);
  }

  startPlayback(index: number, mediaPath: string, songs: Song[]) {
    this.currentSongIndex = index;
    this.songs = songs;
    this.mediaObj = this.media.create(mediaPath);
    this.mediaObj.play();
    this.mediaObj.setVolume(1);
    this.mediaObj.onStatusUpdate.subscribe(status => {
      if (status === 4) {
        this.stopPlayback();
        this.playNext();
      }
    });
  }

  seekTo(value: number) {
    if (this.mediaObj !== undefined) {
      return this.mediaObj.seekTo(value);
    }
  }

  pause() {
    this.mediaObj.pause();
  }

  stopPlayback() {
    if (this.mediaObj !== undefined) {
      this.mediaObj.stop();
      this.mediaObj.release();
    }
  }

  
}