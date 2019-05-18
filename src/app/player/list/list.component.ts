import { Component, AfterContentInit, ChangeDetectorRef } from '@angular/core';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { PersistenceService } from 'src/providers/persistence.service';
import * as Data from '../../../AppConstants';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Platform } from '@ionic/angular';
import { FileService } from 'src/providers/file.service';
import { AudioService } from 'src/providers/audio.service';
import { UtilService } from 'src/providers/util.service';
import { Events } from '@ionic/angular';
import { Song } from '../../../interfaces/song';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements AfterContentInit {

  public searchPhrase: string = '';
  public markForPlaybackSelectionEnabled: boolean = false;
  public searchEnabled: boolean = false;
  public allMarkedForDeletion: boolean = false;
  public allMarkedForPlayback: boolean = false;
  public editMode: boolean = false;
  public reorderingEnabled: boolean = false;
  public deletionEnabled: boolean = false;
  public songs: Song[] = [];
  public constants = Data;
  public sortModes: string[] = Object.values(this.constants.SORT_MODES);
  public sortBy: string = this.sortModes[0];
  public displayMode: string = this.constants.DISPLAY_MODES.DETAIL; // TODO get from persistence service later
  private nextId: number;

  constructor(public fileChooser: FileChooser, public persistenceService: PersistenceService,
              public keyboard: Keyboard, public platform: Platform, public fileService: FileService, public audioService: AudioService,
              public util: UtilService, public events: Events, private cd: ChangeDetectorRef) { 

    events.subscribe('songs:updated', () => {
      this.getNewSongList();
    });

    this.events.subscribe('download:song', (url, name, largeThumbnail, mediumThumbnail) => {
      this.persistFile(url, name, largeThumbnail, mediumThumbnail);
    });

    platform.resume.subscribe((result) =>{
      this.getNewSongList();
    });
  }

  private getNewSongList() {
    this.persistenceService.getSongs().then(songs => {
      this.songs = songs;
      this.allMarkedForPlayback = this.allSongsMarkedForPlayback();
      this.updateSongs();
    });
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this.persistenceService.getSongs().then(songs => {
        if (songs !== undefined && songs !== null && songs.length > 0) {
          this.songs = songs;
          this.allMarkedForPlayback = this.allSongsMarkedForPlayback();
        }
        this.persistenceService.getSortMode().then(sortBy => {
          this.sortBy = sortBy !== undefined && sortBy !== null ? sortBy : this.sortModes[0];
          if (this.sortBy !== this.sortModes[0] && songs !== undefined && songs.length > 0) {
            this.sortSongs();
          }
          this.persistenceService.getNextId().then(id => {
            this.nextId = id !== undefined && id !== null ? id : 0;
          });
        });
      });
    }, 100);
  }

  changeDisplayMode() {
    this.displayMode = this.displayMode === this.constants.DISPLAY_MODES.DETAIL ? this.constants.DISPLAY_MODES.LIST : this.constants.DISPLAY_MODES.DETAIL;
  }

  delete(index: number) {
    this.songs.splice(index,1);
  }

  reorderItems(event) {
    const itemToMove = this.songs.splice(event.detail.from, 1)[0];
    this.songs.splice(event.detail.to, 0, itemToMove);
    event.detail.complete();
    this.sortBy = this.sortModes[0]; // no sort after rearranging
    this.persistenceService.persistSortMode(this.sortBy);
  }

  async toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.reorderingEnabled = false;
      this.deletionEnabled = false;
      this.markForPlaybackSelectionEnabled = false;
      this.updateSongs();
      await this.persistenceService.saveSongs(this.songs);
    }
  }

  toggleMarkForPlaybackSelection() {
    if (!this.markForPlaybackSelectionEnabled) {
      this.markForPlaybackSelectionEnabled = true;
    }
  }

  toggleReordering() {
    if (!this.reorderingEnabled) {
      this.reorderingEnabled = true;
    }
  }

  deleteAction() {
    if (!this.deletionEnabled) {
      this.deletionEnabled = true;
    } else {
      if (this.songs !== null && this.songs !== undefined && this.songs.length > 0) {
        let tempSongs = [];
        this.songs.forEach(song => {
          if (!song.isMarkedForDeletion) {
            tempSongs.push(song);
          }
        });
        this.songs = tempSongs;
      }
    }
  }

  toggleMarkedAllForPlayback(value: boolean) {
    this.allMarkedForPlayback = value;
    this.songs.forEach(song => {
      song.isSelectedForPlayback = value;
    });
  }

  toggleMarkedAllForDeletion(value: boolean) {
    this.allMarkedForDeletion = value;
    this.songs.forEach(song => {
      song.isMarkedForDeletion = value;
    });
  }

  toggleMarkedForPlayback(markedForPlayback: boolean) {
    if (!markedForPlayback) {
      this.allMarkedForPlayback = false;
    } else {
      if (this.allSongsMarkedForPlayback()) {
        this.allMarkedForPlayback = true;
      }
    }
  }

  allSongsMarkedForPlayback(): boolean {
    let allMarked = true;
    for (let i = 0; i < this.songs.length; i++) {
      if (!this.songs[i].isSelectedForPlayback) {
        allMarked = false;
        break;
      }
    }
    if (!allMarked || this.songs.length === 0) {
      return false
    } else {
      return true;
    }
  }

  allSongsMarkedForDeletion(): boolean {
    let allMarked = true;
    for (let i = 0; i < this.songs.length; i++) {
      if (!this.songs[i].isMarkedForDeletion) {
        allMarked = false;
        break;
      }
    }
    if (!allMarked || this.songs.length === 0) {
      return false
    } else {
      return true;
    }
  }

  toggleMarkedForDeletion(markedForDeletion: boolean) {
    if (!markedForDeletion) {
      this.allMarkedForDeletion = false;
    } else {
      if (this.allSongsMarkedForDeletion()) {
        this.allMarkedForDeletion = true;
      }
    }
  }

  clearModes() {
    this.reorderingEnabled = false;
    this.deletionEnabled = false;
    this.markForPlaybackSelectionEnabled = false;
  }

  changeSort() {
    if (this.sortModes !== undefined && this.sortModes !== null && this.sortModes.length > 1) {
      const currentSortIndex = this.sortModes.indexOf(this.sortBy);
      if (currentSortIndex === this.sortModes.length - 1) {
        this.sortBy = this.sortModes[0];
      } else {
        this.sortBy = this.sortModes[currentSortIndex + 1];
      }
    }
    this.sortSongs();
    this.persistenceService.persistSortMode(this.sortBy);
  }

  sortSongs() {
    switch (this.sortBy) { // 'NAME_ASCENDING' | 'NAME_DESCENDING' | 'PLAYED_ASCENDING' | 'PLAYED_DESCENDING'
      case this.sortModes[0]: {
        // do nothing - no sort
        break;
      }
      case this.sortModes[1]: {
        this.songs.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        break;
      }
      case this.sortModes[2]: {
        this.songs.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.songs.reverse();
        break;
      }
      case this.sortModes[3]: {
        this.songs.sort((a,b) => (a.numberOfPlaybacks > b.numberOfPlaybacks) ? 1 : ((b.numberOfPlaybacks > a.numberOfPlaybacks) ? -1 : 0));
        break;
      }
      case this.sortModes[4]: {
        this.songs.sort((a,b) => (a.numberOfPlaybacks > b.numberOfPlaybacks) ? 1 : ((b.numberOfPlaybacks > a.numberOfPlaybacks) ? -1 : 0));
        this.songs.reverse();
        break;
      }
    }
    this.updateSongs();
  }

  toggleSearch() {
    this.searchEnabled = !this.searchEnabled;
    if (!this.searchEnabled) {
      this.searchPhrase = '';
    }
  }

  updateSearchPhrase(event) {
    this.searchPhrase = event.detail.value;
  }

  async addFile() {
    let songURL = await this.fileService.openFile();
    this.persistFile(songURL);
  }

  async persistFile(url: string, name?: string, largeThumbnail?: string, mediumThumbnail?: string) {
    try {
      let nativePath = await this.fileService.getNativePath(url);
      let fileInfo = await this.fileService.getFileInfo(nativePath);
      let mediaPath = nativePath.replace(/file:\/\//g, '');
      let fileName = name !== undefined && name.length > 0 ? name : fileInfo.name;
      const lgThumbnail = largeThumbnail !== undefined ? largeThumbnail : null;
      const mdThumbnail = mediumThumbnail !== undefined ? mediumThumbnail : null;
      let fileSize = await this.fileService.getFileSize(url);
      let duration = await this.audioService.getDuration(mediaPath);
      if (this.songs === null) {
        this.songs = [];
      }
      this.songs.push(
        {
          id: this.nextId,
          name: fileName,
          mediaPath: mediaPath,
          duration: duration,
          numberOfPlaybacks: 0,
          favourite: false,
          imageURL: null,
          isMarkedForDeletion: false,
          isSelectedForPlayback: false,
          size: this.util.convertToDisplaySize(fileSize),
          largeThumbnail: lgThumbnail,
          mediumThumbnail: mdThumbnail
        }
      );
      this.nextId = this.nextId + 1;
      await this.persistenceService.saveSongs(this.songs);
      await this.persistenceService.setNextId(this.nextId);
      this.updateSongs();
    } catch (error) {
      console.log(error);
    }
  }

  updateSongs() {
    this.events.publish('update:songs', this.songs);
  }

  play(id: number) {
    this.events.publish('playback:init', this.songs, id);
  }

  async toggleFavourite(index: number) { // think about efficiency of saving on each favourite click !
    this.songs[index].favourite = !this.songs[index].favourite;
    this.updateSongs();
    await this.persistenceService.saveSongs(this.songs);
  }
}
