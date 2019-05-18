import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Platform } from '@ionic/angular';
import { UtilService } from 'src/providers/util.service';
import * as Data from '../../../AppConstants';
import { PersistenceService } from 'src/providers/persistence.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Events } from '@ionic/angular';
import { AudioService } from 'src/providers/audio.service';
import { Song } from '../../../interfaces/song';

@Component({
  selector: 'app-mediaplayer',
  templateUrl: './mediaplayer.component.html',
  styleUrls: ['./mediaplayer.component.scss'],
})
export class MediaplayerComponent implements OnInit {

  public shuffle: boolean = false; // save and retrieve from local storage
  public progress: number = 0;
  public max: number = 0;
  public constants = Data;
  public repeatModes: string[] = Object.values(this.constants.REPEAT_MODES);
  public repeatMode: string = this.repeatModes[0];
  public currentRepeatIndex: number = 0;
  public songs: Song[];
  public currentlyPlayedSong: Song;
  public canSeek: boolean = true;
  public isPlaybackOn: boolean = false;
  public coverAvailable: boolean = false;
  public albumCoverAddress: string = '';
  private albumImageTop: string = '0px';

  constructor(public keyboard: Keyboard, public platform: Platform, public util: UtilService,
              public persistenceService: PersistenceService, public backgroundMode: BackgroundMode,
              public events: Events, public audioService: AudioService, private cd: ChangeDetectorRef) { 
                console.log(platform);

    events.subscribe('playback:init', (songs, index) => {
      // songs and index are the same arguments passed in `events.publish(songs, index)`
      this.play(index, songs);
    });

    events.subscribe('playback:progress', (song, progress) => {
      this.updateProgressProperties(song, progress);
    });

    events.subscribe('update:songs', (songs) => {
      this.updateSongs(songs);
    });

    events.subscribe('playback:complete', () => {
      this.playbackCompletedCleanup();
    });

    events.subscribe('playback:paused', () => {
      setTimeout(() => {
        this.isPlaybackOn = false;
        this.cd.detectChanges();
      }, 100);
    });

    events.subscribe('playback:resumed', () => {
      setTimeout(() => {
        this.isPlaybackOn = true;
        this.cd.detectChanges();
      }, 100);
    });

    platform.pause.subscribe((result)=>{
      this.canSeek = false;
    });
    
    platform.resume.subscribe((result) =>{
      if (!this.isPlaying()) {
        this.isPlaybackOn = false;
        if (this.audioService.getCurrentlyPlayedSong() === null) {
          this.playbackCompletedCleanup();
        }
      } else {
        this.isPlaybackOn = true;
        if (this.audioService.getCurrentlyPlayedSong() !== null) {
          this.currentlyPlayedSong = this.audioService.getCurrentlyPlayedSong();
        }
      }
      this.canSeek = true;
    });
  }

  ionViewWillLeave() {
    this.canSeek = false;
  }

  ngOnInit() {
    this.persistenceService.getShuffleMode().then(shuffleOn => {
      this.shuffle = shuffleOn !== undefined && shuffleOn !== null ? shuffleOn : false;
    });

    this.persistenceService.getRepeatMode().then(repeatMode => {
      this.repeatMode = repeatMode !== undefined && repeatMode !== null ? repeatMode : this.repeatModes[0];
    });
    setTimeout(() => {
      this.setAlbumIconAreaHeight();
    }, 100);
  }

  getDisplayType(value: string) {
    if (value === 'play' && !this.isPlaybackOn) {
      return 'block';
    } else if (value === 'pause' && this.isPlaybackOn) {
      return 'block';
    } else {
      return 'none';
    }
  }

  updateSongs(songs: Song[]) {
    this.songs = songs;
    this.updatePropertiesInAudioService();
  }

  playbackCompletedCleanup() {
    this.isPlaybackOn = false;
    this.coverAvailable = false;
    this.setAlbumIconAreaHeight();
    this.currentlyPlayedSong = null;
    this.progress = 0;
    this.max = 0;
  }

  stop() {
    console.log('stop');
  }

  play(id: number, songs: Song[]) {
    if ((songs === null || id === null) && this.currentlyPlayedSong !== undefined) {
      this.audioService.unpause();
      this.isPlaybackOn = true;
      this.enableBackgroundMode();
    } else {
      this.songs = songs;
      const ids = this.util.getSongsIds(songs, id, this.shuffle, this.repeatMode);
      this.currentlyPlayedSong = this.util.getSongById(songs, id);
      if (this.audioService.getCurrentlyPlayedSong() !== null) {
        this.audioService.stopPlayback();
      }
      this.audioService.startPlayback(id, this.songs, ids, this.repeatMode === this.constants.REPEAT_MODES.NONE);
      this.max = this.currentlyPlayedSong.duration;
      this.progress = 0;
      this.isPlaybackOn = true;
      this.enableBackgroundMode();
    }
  }

  async updateProgressProperties(song: Song, progress: number) {
    this.progress = progress;
    this.currentlyPlayedSong = song;
    this.max = this.currentlyPlayedSong.duration;
    console.log(this.currentlyPlayedSong.largeThumbnail);
    if (this.currentlyPlayedSong.largeThumbnail !== undefined) {
      if (this.albumCoverAddress !== this.currentlyPlayedSong.largeThumbnail) {
        this.albumCoverAddress = this.currentlyPlayedSong.largeThumbnail;
      }
      this.coverAvailable = true;
    } else {
      this.coverAvailable = false;
      this.setAlbumIconAreaHeight();
    }
    this.cd.detectChanges();
  }

  isPlaying() {
    return this.audioService.isMusicPlaying();  
  }

  pause() {
    this.audioService.pause();
    this.backgroundMode.disable();
    this.isPlaybackOn = false;
  }

  previous() {
    if (this.currentlyPlayedSong !== null && this.currentlyPlayedSong !== undefined) {
      this.audioService.stopPlayback();
      this.audioService.playPrevious();
      this.isPlaybackOn = true;
      this.cd.detectChanges();
      this.enableBackgroundMode();
    }
  }

  enableBackgroundMode() {
    this.backgroundMode.enable();
    this.backgroundMode.disableWebViewOptimizations();
  }

  next() {
    if (this.currentlyPlayedSong !== null && this.currentlyPlayedSong !== undefined) {
      this.audioService.stopPlayback();
      this.audioService.playNext();
      this.isPlaybackOn = true;
      this.cd.detectChanges();
      this.enableBackgroundMode();
    }
  }

  async updateProgress(event) {
    const tempProgress = await this.audioService.getProgress();
    const roundedProgress = tempProgress > 0 ? Math.floor(tempProgress) : 0;
    this.progress = event.detail.value;
    if (Math.floor(Math.abs(event.detail.value - roundedProgress)) > 1 && this.canSeek) {
      this.audioService.seekTo(this.progress * 1000);
    }
  }

  async toggleShuffle() {
    this.shuffle = !this.shuffle;
    this.updatePropertiesInAudioService();
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
      this.updatePropertiesInAudioService();
      this.persistenceService.persistRepeatMode(this.repeatMode);
    }
  }

  updatePropertiesInAudioService() {
    if (this.audioService.getCurrentlyPlayedSong() !== null) {
      const ids = this.util.getSongsIds(this.songs, this.currentlyPlayedSong.id, this.shuffle, this.repeatMode);
      this.audioService.updatePlaybackControlProperties(this.songs, ids, this.repeatMode === this.constants.REPEAT_MODES.NONE);
    }
  }

  setAlbumIconAreaHeight() {
    const bodyHeight = document.body.scrollHeight;
    const bodyWidth = document.body.scrollWidth;
    const toolbarHeight = 60;
    const tabBarHeight = 60;
    const mediaProgressHeight = 40;
    const playControlsHeight = 60;
    const albumAreaHeight = bodyHeight - toolbarHeight - tabBarHeight - mediaProgressHeight - playControlsHeight;

    let albumPhotoArea = document.getElementById('albumPhoto');
    
    albumPhotoArea.style.height = `${albumAreaHeight}px`;
    albumPhotoArea.style.top = `0px`;
  }

  getImageTop() {
    return this.albumImageTop;
  }

}
