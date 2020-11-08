import { Component } from '@angular/core';
import { Events, Platform } from '@ionic/angular';
import { UtilService } from 'src/providers/util.service';
import { AudioService } from 'src/providers/audio.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ToastService } from 'src/providers/toast.service';

@Component({
  selector: 'app-player',
  templateUrl: 'player.page.html',
  styleUrls: ['player.page.scss'],
})
export class PlayerPage {

  private title: string = 'Yimp';
  private searchPhrase: string = '';
  constructor(public events: Events, public util: UtilService, public platform: Platform,
    private audioService: AudioService, private androidPermissions: AndroidPermissions, private toast: ToastService) {

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
    );
    
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
    events.subscribe('playback:init', (songs, index) => {
      this.visibleTab = 'player';
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

  search() {
    console.log('publish search');
    if (this.searchPhrase.length > 2) {
      this.events.publish('yt:search', this.searchPhrase);
      this.searchPhrase = '';
    } else {
      this.toast.showToast('Search phrase too short - minimum 3 characters required!')
    }
  }
}
