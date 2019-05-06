import { Injectable } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { Song } from '../interfaces/song';
import { UtilService } from './util.service';

@Injectable()
export class AudioService { 

  mediaObj: MediaObject;
  private songs: Song[];
  private songIds: number[];
  private currentSongIndex: number;
  private ignoreStopSubscriber: boolean = false;
  private currentlyPlayedId: number;
  constructor(public media: Media, public util: UtilService) {

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
    this.currentSongIndex = ++this.currentSongIndex % this.songs.length;
    this.startPlayback(this.songIds[this.currentSongIndex], this.songs, this.songIds);
  }

  playPrevious() {
    this.currentSongIndex = (--this.currentSongIndex + this.songs.length) % this.songs.length
    this.startPlayback(this.songIds[this.currentSongIndex], this.songs, this.songIds);
  }

  startPlayback(id: number, songs: Song[], ids: number[]) {
    this.currentlyPlayedId = id;
    this.songs = songs;
    this.songIds = ids;
    this.currentSongIndex = this.getSongIdIndex(id);
    console.log('ids: ' + ids);
    console.log('id index: ' + this.currentSongIndex);
    this.mediaObj = this.media.create(this.getCurrentlyPlayedSong().mediaPath);
    this.mediaObj.play();
    this.mediaObj.setVolume(1);
    this.mediaObj.onStatusUpdate.subscribe(status => {
      console.log('status update: ' + status);
      console.log('ignoreStopSubscriber: ' + this.ignoreStopSubscriber);
      if (status === 4) {
        if (!this.ignoreStopSubscriber) {
          this.stopPlayback(true);
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

  private getSongIdIndex(id: number): number {
    return this.songIds.indexOf(id);
  }

  private getSongIndex(id: number): number {
    for (let i = 0; i < this.songs.length; i++) {
      if (this.songs[i].id === id) {
        return i;
      }
    }
    return 0;
  }

  pause() {
    this.mediaObj.pause();
  }

  stopPlayback(ignoreStopSubscriber: boolean) {
    this.ignoreStopSubscriber = ignoreStopSubscriber;
    console.log('in stop: ignoreStopSubscriber');
    if (this.mediaObj !== undefined) {
      this.mediaObj.stop();
      this.mediaObj.release();
    }
  }

  getCurrentlyPlayedSong() {
    return this.util.getSongById(this.songs, this.currentlyPlayedId);
  }
  
}