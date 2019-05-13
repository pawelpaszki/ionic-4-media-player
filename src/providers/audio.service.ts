import { Injectable } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { Song } from '../interfaces/song';
import { UtilService } from './util.service';
import { Subscription } from 'rxjs';
import { Events } from '@ionic/angular';
import { MusicControls } from '@ionic-native/music-controls/ngx';

@Injectable()
export class AudioService { 

  mediaObj: MediaObject;
  private songs: Song[];
  private songIds: number[];
  private currentSongIndex: number;
  private currentlyPlayedId: number;
  private noRepeat: boolean = false;

  private onStatusUpdateSubscriber: Subscription;

  private isPlaying: boolean = false;

  constructor(public media: Media, public util: UtilService, public events: Events, public musicControls: MusicControls) {

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
      this.isPlaying = true;
      this.musicControls.updateIsPlaying(true);
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
    this.isPlaying = true;
    this.musicControls.updateIsPlaying(true);
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
    this.createMusicControls();
  }

  createMusicControls() {
    this.musicControls.create({
      track       : 'Time is Running Out',        // optional, default : ''
      artist      : 'Coma',                       // optional, default : ''
      cover       : 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/techno-triangle-album-cover-flyer-template-2f2a9d4851c7de5f4f2362d3352f42fc_screen.jpg?ts=1477673828',      // optional, default : nothing
      // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
      //           or a remote url ('http://...', 'https://...', 'ftp://...')
      isPlaying   : true,                         // optional, default : true
      //dismissable : false,                         // optional, default : false

      hasClose  : true,       // show close button, optional, default: false
    
      // // Android only, optional
      // // text displayed in the status bar when the notification (and the ticker) are updated, optional
      // ticker    : 'Now playing "Time is Running Out"',
      // // All icons default to their built-in android equivalents
      // playIcon: 'media_play',
      // pauseIcon: 'media_pause',
      // prevIcon: 'media_prev',
      // nextIcon: 'media_next',
      // closeIcon: 'media_close',
      // notificationIcon: 'notification'
     });

    this.musicControls.subscribe().subscribe((action) => {
      let message = JSON.parse(action).message;
      switch(message) {
                    case 'music-controls-next':
                        this.stopPlayback();
                        this.playNext();
                        break;
                    case 'music-controls-previous':
                        this.stopPlayback();
                        this.playPrevious();
                        break;
                    case 'music-controls-pause':
                        this.pause();
                        this.events.publish('playback:paused');
                        // this.events.publish('playback:pause');
                        break;
                    case 'music-controls-play':
                        this.unpause();
                        this.events.publish('playback:resumed');
                        // this.events.publish('playback:unpause');
                        break;
                    case 'music-controls-destroy':
                       // Do something
                        break;
                    case 'music-controls-media-button' :
                            // Do something
                        break;
                    case 'music-controls-headset-unplugged':
                            // Do something
                        break;
                    case 'music-controls-headset-plugged':
                            // Do something
                        break;
                    default:
                        break;
        }
    });
    this.musicControls.listen();
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

  isMusicPlaying(): boolean {
    return this.isPlaying;
  }

  pause() {
    this.isPlaying = false;
    this.mediaObj.pause();
    this.musicControls.updateIsPlaying(false);
  }

  stopPlayback() {
    this.isPlaying = false;
    this.musicControls.updateIsPlaying(true);
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