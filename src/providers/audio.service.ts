import { Injectable } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { Song } from '../interfaces/song';
import { UtilService } from './util.service';
import { Subscription } from 'rxjs';
import { Events } from '@ionic/angular';
import { MusicControls } from '@ionic-native/music-controls/ngx';
import { PersistenceService } from './persistence.service';

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

  constructor(public media: Media, public util: UtilService, public events: Events, public musicControls: MusicControls,
              public persistenceService: PersistenceService ) {

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
      this.sendProgressUpdate();
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
    this.sendProgressUpdate();
    this.incrementPlaybacksCount();
  }

  incrementPlaybacksCount() {
    for (let song of this.songs) {
      if (song.id === this.currentlyPlayedId) {
        song.numberOfPlaybacks = song.numberOfPlaybacks + 1;
        this.persistenceService.saveSongs(this.songs);
        this.events.publish('songs:updated');
      }
    }
  }

  createMusicControls() {
    const cover = this.getCurrentlyPlayedSong().largeThumbnail !== null &&
                  this.getCurrentlyPlayedSong().largeThumbnail !== undefined ? 
                  this.getCurrentlyPlayedSong().largeThumbnail : 'https://i.ibb.co/mTNkwPP/skull-icon-inv.png';
    this.musicControls.create({
      track       : this.getCurrentlyPlayedSong().name,        // optional, default : ''
      cover       : cover,
      isPlaying   : true,                         // optional, default : true
      dismissable : true,                         // optional, default : false

      hasClose  : true,       // show close button, optional, default: false
    
      // // Android only, optional
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

  async sendProgressUpdate() {
    if (this.isPlaying) {
      const tempProgress = await this.getProgress();
      const progress = tempProgress > 0 ? Math.floor(tempProgress) : 0;
      this.events.publish('playback:progress', this.getCurrentlyPlayedSong(), progress);
      setTimeout(() => {
        this.sendProgressUpdate();
      }, 500);
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