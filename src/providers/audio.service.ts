import { Injectable } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { Song } from '../interfaces/song';
import { UtilService } from './util.service';
import { Subscription } from 'rxjs';

@Injectable()
export class AudioService { 

  mediaObj: MediaObject;
  private songs: Song[];
  private songIds: number[];
  private currentSongIndex: number;
  private currentlyPlayedId: number;
  private noRepeat: boolean = false;
  private ignoreStopSubscriber: boolean = false;

  private onStatusUpdateSubscriber: Subscription ;
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
    this.currentSongIndex = ++this.currentSongIndex % this.songIds.length;
    this.startPlayback(this.songIds[this.currentSongIndex], this.songs, this.songIds);
  }

  playPrevious() {
    this.currentSongIndex = (--this.currentSongIndex + this.songIds.length) % this.songIds.length
    this.startPlayback(this.songIds[this.currentSongIndex], this.songs, this.songIds);
  }

  startPlayback(id: number, songs: Song[], ids: number[], noRepeat?: boolean) {
    if (noRepeat !== undefined) {
      this.noRepeat = noRepeat;
    }
    this.currentlyPlayedId = id;
    this.songs = songs;
    this.songIds = ids;
    this.currentSongIndex = this.getSongIdIndex(this.currentlyPlayedId);
    console.log('ids: ' + ids);
    console.log('currentSongIndex: ' + this.currentSongIndex);
    console.log('noRepeat: ' + this.noRepeat);
    console.log('currentlyPlayedId: ' + this.currentlyPlayedId);
    this.mediaObj = this.media.create(this.getCurrentlyPlayedSong().mediaPath);
    this.mediaObj.seekTo(0);
    this.mediaObj.play();
    this.mediaObj.setVolume(1);
    this.onStatusUpdateSubscriber = 
    this.mediaObj.onStatusUpdate.subscribe(status => {
      if (status === 4) {
        this.onStatusUpdateSubscriber.unsubscribe();
        if (!this.noRepeat || this.currentSongIndex < this.songIds.length - 1) {
          this.stopPlayback();
          this.playNext();
        } 
      }
    });
  }

  updatePlaybackControlProperties(songs: Song[], ids: number[], noRepeat: boolean) {
    this.songs = songs;
    this.songIds = ids;
    this.noRepeat = noRepeat;
    this.currentSongIndex = this.getSongIdIndex(this.currentlyPlayedId) > -1 ? this.getSongIdIndex(this.currentlyPlayedId) : 0;
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

  stopPlayback() {
    this.onStatusUpdateSubscriber.unsubscribe();
    if (this.mediaObj !== undefined) {
      this.mediaObj.stop();
      this.mediaObj.release();
    }
  }

  getCurrentlyPlayedSong(): Song {
    if (this.songs !== undefined && this.songs.length > 0 && this.currentlyPlayedId !== undefined) {
      return this.util.getSongById(this.songs, this.currentlyPlayedId);
    } else {
      return null;
    }
  }
  
}