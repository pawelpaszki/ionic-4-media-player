import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Platform } from '@ionic/angular';
import { UtilService } from 'src/providers/util.service';
import * as Data from '../../../AppConstants';
import { PersistenceService } from 'src/providers/persistence.service';

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
  public repeatMode: string = this.repeatModes[0];// TODO get from persistence service later
  public currentRepeatIndex: number = 0;

  constructor(public keyboard: Keyboard, public platform: Platform, public util: UtilService,
              public persistenceService: PersistenceService) { }

  ngOnInit() {
    this.persistenceService.getShuffleMode().then(shuffleOn => {
      console.log('shuffle on: ' + shuffleOn);
      this.shuffle = shuffleOn !== undefined && shuffleOn !== null ? shuffleOn : false;
    });

    this.persistenceService.getRepeatMode().then(repeatMode => {
      console.log('repeatMode: ' + repeatMode);
      this.repeatMode = repeatMode !== undefined && repeatMode !== null ? repeatMode : this.repeatModes[0];
    });
  }

  stop() {
    console.log('stop');
  }

  play() {
    console.log('play');
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

}
