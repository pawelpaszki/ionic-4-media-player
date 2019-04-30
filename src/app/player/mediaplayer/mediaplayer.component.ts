import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Platform } from '@ionic/angular';
import { UtilService } from 'src/providers/util.service';
import * as Data from '../../../AppConstants';
import { PersistenceService, Song } from 'src/providers/persistence.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Events } from '@ionic/angular';
import { AudioService } from 'src/providers/audio.service';

@Component({
  selector: 'app-mediaplayer',
  templateUrl: './mediaplayer.component.html',
  styleUrls: ['./mediaplayer.component.scss'],
})
export class MediaplayerComponent implements OnInit {

  public shuffle: boolean = false; // save and retrieve from local storage
  public isPlaying: boolean = false;
  public progress: number = 0;
  public max: number = 0;
  public constants = Data;
  public repeatModes: string[] = Object.values(this.constants.REPEAT_MODES);
  public repeatMode: string = this.repeatModes[0];
  public currentRepeatIndex: number = 0;
  public songs: Song[];
  public currentlyPlayedSong: Song;
  public canSeek: boolean = true;

  constructor(public keyboard: Keyboard, public platform: Platform, public util: UtilService,
              public persistenceService: PersistenceService, public backgroundMode: BackgroundMode,
              public events: Events, public audioService: AudioService) { 

    events.subscribe('playback:init', (songs, index) => {
      // user and time are the same arguments passed in `events.publish(songs, index)`
      this.songs = songs;
      this.play(index, songs);
    });
    platform.pause.subscribe((result)=>{
      this.canSeek = false;
      console.log('canSeek: ' + this.canSeek);
    });
    platform.resume.subscribe((result)=>{
      this.canSeek = true;
      console.log('canSeek: ' + this.canSeek);
    });

  }

  ionViewWillLeave() {
    this.canSeek = false;
  }

  ngOnInit() {
    this.persistenceService.getShuffleMode().then(shuffleOn => {
      console.log('shuffle on: ' + shuffleOn);
      this.shuffle = shuffleOn !== undefined && shuffleOn !== null ? shuffleOn : false;
    });

    this.persistenceService.getRepeatMode().then(repeatMode => {
      console.log('repeatMode: ' + repeatMode);
      this.repeatMode = repeatMode !== undefined && repeatMode !== null ? repeatMode : this.repeatModes[0];
    });
    setTimeout(() => {
      this.setAlbumIconAreaHeight();
    }, 100);
  }

  stop() {
    console.log('stop');
  }

  play(index: number, songs: Song[]) {
    if (songs === null || index === null) {
      this.audioService.unpause();
    } else {
      this.currentlyPlayedSong = songs[index];
      this.audioService.stopPlayback();
      this.audioService.startPlayback(index, songs[index].mediaPath, this.songs);
      this.max = this.currentlyPlayedSong.duration;
      this.progress = 0;
    }
    this.isPlaying = true;
    console.log('play');
    this.backgroundMode.enable();
    this.backgroundMode.disableWebViewOptimizations();
    this.getProgress();
  }

  async getProgress() {
    if (this.isPlaying) {
      const tempProgress = await this.audioService.getProgress();
      this.currentlyPlayedSong = this.audioService.getCurrentlyPlayedSong();
      this.max = this.currentlyPlayedSong.duration;
      this.progress = tempProgress > 0 ? Math.floor(tempProgress) : 0;
      if (!(this.progress > this.currentlyPlayedSong.duration)) {
        setTimeout(() => {
          this.getProgress();
        }, 500);
      }
    }
  }

  pause() {
    this.audioService.pause();
    this.isPlaying = false;
    this.backgroundMode.disable();
  }

  previous() {
    this.audioService.stopPlayback();
    this.audioService.playPrevious();
  }

  next() {
    this.audioService.stopPlayback();
    this.audioService.playNext();
  }

  async updateProgress(event) {
    const tempProgress = await this.audioService.getProgress();
    const roundedProgress = tempProgress > 0 ? Math.floor(tempProgress) : 0;
    if (Math.floor(Math.abs(event.detail.value - roundedProgress)) > 1 && this.canSeek) {
      this.progress = event.detail.value;
      this.audioService.seekTo(this.progress * 1000);
    }
  }

  async toggleShuffle() {
    this.shuffle = !this.shuffle;
    await this.persistenceService.persistShuffleMode(this.shuffle);
  }

  async changeRepeatMode() {
    if (this.repeatModes !== undefined && this.repeatModes !== null && this.repeatModes.length > 1) {
      const currentRepeatIndex = this.repeatModes.indexOf(this.repeatMode);
      if (currentRepeatIndex === this.repeatModes.length - 1) {
        this.repeatMode = this.repeatModes[0];
      } else {
        this.repeatMode = this.repeatModes[currentRepeatIndex + 1];
      }
      this.persistenceService.persistRepeatMode(this.repeatMode);
    }
  }

  setAlbumIconAreaHeight() {
    const bodyHeight = document.body.scrollHeight;
    const bodyWidth = document.body.scrollWidth;
    const toolbarHeight = 60;
    const tabBarHeight = 60;
    const mediaProgressHeight = 60;
    const topFunctionBarHeight = 40;
    const playControlsHeight = 50;
    const albumAreaHeight = bodyHeight - toolbarHeight - tabBarHeight - mediaProgressHeight - topFunctionBarHeight - playControlsHeight;

    let albumPhotoArea = document.getElementById('albumPhoto');
    let albumImage = document.getElementById('image');
    albumPhotoArea.style.height = `${albumAreaHeight}px`;
    albumPhotoArea.style.top = `${topFunctionBarHeight}px`;
    if (albumAreaHeight > bodyWidth) {
      albumImage.style.height = `${bodyWidth}px`;
      albumImage.style.width = `${bodyWidth}px`;
      let topPosition = (albumAreaHeight - bodyWidth) / 2;
      albumImage.style.top = `${topPosition}px`;
    } else if (bodyWidth > albumAreaHeight) {
      albumImage.style.height = `${albumAreaHeight}px`;
      albumImage.style.width = `${albumAreaHeight}px`;
      let leftPosition = (bodyWidth - albumAreaHeight) / 2;
      albumImage.style.left = `${leftPosition}px`;
    }
  }

}
