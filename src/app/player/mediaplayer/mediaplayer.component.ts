import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Platform } from '@ionic/angular';
import { UtilService } from 'src/providers/util.service';
import * as Data from '../../../AppConstants';
import { PersistenceService } from 'src/providers/persistence.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-mediaplayer',
  templateUrl: './mediaplayer.component.html',
  styleUrls: ['./mediaplayer.component.scss'],
})
export class MediaplayerComponent implements OnInit {

  public shuffle: boolean = false; // save and retrieve from local storage
  public isPlaying: boolean = false;
  public progress: number = 0;
  public max: number = 100;
  public constants = Data;
  public repeatModes: string[] = Object.values(this.constants.REPEAT_MODES);
  public repeatMode: string = this.repeatModes[0];
  public currentRepeatIndex: number = 0;

  constructor(public keyboard: Keyboard, public platform: Platform, public util: UtilService,
              public persistenceService: PersistenceService, public backgroundMode: BackgroundMode,
              public events: Events) { 

    events.subscribe('playback:init', (songs, index) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Playback init detected. Index:' + index);
      console.log('songs');
      console.log(songs);
    });

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

  play() {
    this.isPlaying = !this.isPlaying;
    console.log('play');
    if (this.isPlaying) {
      this.backgroundMode.enable();
    } else {
      this.backgroundMode.disable();
    }
  }

  previous() {
    console.log('previous');
  }

  next() {
    console.log('next');
  }

  updateProgress(event) {
    this.progress = event.detail.value;
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
