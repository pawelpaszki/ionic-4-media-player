import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Platform } from '@ionic/angular';
import { UtilService } from 'src/providers/util.service';
import * as Data from '../../../AppConstants';

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
  public repeat: string = this.repeatModes[0];// TODO get from persistence service later
  public currentRepeatIndex: number = 0;

  constructor(public keyboard: Keyboard, public platform: Platform, public util: UtilService) { }

  ngOnInit() {}

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

  toggleShuffle() {
    this.shuffle = !this.shuffle; // persist later
  }

  changeRepeatMode() {
    if (this.repeatModes !== undefined && this.repeatModes !== null && this.repeatModes.length > 1) {
      const currentRepeatIndex = this.repeatModes.indexOf(this.repeat);
      if (currentRepeatIndex === this.repeatModes.length - 1) {
        this.repeat = this.repeatModes[0];
      } else {
        this.repeat = this.repeatModes[currentRepeatIndex + 1];
      }
    }
  }

}
