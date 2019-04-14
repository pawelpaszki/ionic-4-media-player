import { Component } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-player',
  templateUrl: 'player.page.html',
  styleUrls: ['player.page.scss'],
})
export class PlayerPage {

  constructor(public events: Events) {
    events.subscribe('playback:init', (songs, index) => {
      this.visibleTab = 'player'; // change to player??
    });
  }

  public visibleTab: string = 'player';
  public segmentChanged(ev: any) {
    this.visibleTab = ev.detail.value;
  }

  public changeTab(value: string) {
    this.visibleTab = value;
  }

  getDisplayType(value: string) {
    return value === this.visibleTab ? 'block' : 'none';
  }
}
