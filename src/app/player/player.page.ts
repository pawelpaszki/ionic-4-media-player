import { Component } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: 'player.page.html',
  styleUrls: ['player.page.scss'],
})
export class PlayerPage {

  public visibleTab: string = 'player';
  public segmentChanged(ev: any) {
    this.visibleTab = ev.detail.value;
  }

  public changeTab(value: string) {
    this.visibleTab = value;
  }
}
