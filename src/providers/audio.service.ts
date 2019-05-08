import { Injectable } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { Song } from '../interfaces/song';
import { UtilService } from './util.service';
import { Subscription } from 'rxjs';
import { Events } from '@ionic/angular';

@Injectable()
export class AudioService { 

  mediaObj: MediaObject;
  private songs: Song[];
  private songIds: number[];
  private currentSongIndex: number;
  private currentlyPlayedId: number;
  private noRepeat: boolean = false;

  private onStatusUpdateSubscriber: Subscription ;
  constructor(public media: Media, public util: UtilService, public events: Events) {

  }

  getDuration(mediaPath: string): Promise<any> {
    const p: Promise<any> = new Promise((resolve, reject) => {
      const tempMediaObj = this.media.create(mediaPath);
      tempMediaObj.play();
      tempMediaObj.setVolume(0);
      setTimeout(() => {
        const duration = Math.round(tempMediaObj.getDuration()).toString();
        resolve(duration);
        tempMediaObj.stop();
        tempMediaObj.release();
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
        } else {
          this.events.publish('playback:complete');
        }
      }
    });
  }

  updatePlaybackControlProperties(songs: Song[], ids: number[], noRepeat: boolean) {
    this.songs = songs;
    this.songIds = ids;
    this.noRepeat = noRepeat;
    this.currentSongIndex = this.getSongIdIndex(this.currentlyPlayedId);
    console.log('ids: ' + ids);
    console.log('currentSongIndex: ' + this.currentSongIndex);
    console.log('noRepeat: ' + this.noRepeat);
  }

  seekTo(value: number) {
    if (this.mediaObj !== undefined) {
      return this.mediaObj.seekTo(value);
    }
  }

  private getSongIdIndex(id: number): number {
    return this.songIds.indexOf(id) > -1 ? this.songIds.indexOf(id) : 0;
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