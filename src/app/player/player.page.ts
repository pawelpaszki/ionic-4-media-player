import { Component } from '@angular/core';
import { Events, Platform } from '@ionic/angular';
import { UtilService } from 'src/providers/util.service';
import { AudioService } from 'src/providers/audio.service';

@Component({
  selector: 'app-player',
  templateUrl: 'player.page.html',
  styleUrls: ['player.page.scss'],
})
export class PlayerPage {

  private title: string = 'Yimp';
  constructor(public events: Events, public util: UtilService, public platform: Platform,
    private audioService: AudioService) {
    events.subscribe('playback:init', (songs, index) => {
      const song = this.util.getSongById(songs, index);
      this.title = song.name;
    });
    events.subscribe('playback:progress', (song, progress) => {
      this.title = song.name;
    });
    events.subscribe('playback:complete', () => {
      this.title = 'Yimp';
    });
    platform.resume.subscribe((result) =>{
      if (this.audioService.getCurrentlyPlayedSong() === null) {
        this.title = 'Yimp';
      } else {
        this.title = this.audioService.getCurrentlyPlayedSong().name;
      }
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
