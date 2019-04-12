import { Component, AfterContentInit } from '@angular/core';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { PersistenceService, Song } from 'src/providers/persistence.service';
import * as Data from '../../../AppConstants';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Platform } from '@ionic/angular';
import { FileService } from 'src/providers/file.service';
import { AudioService } from 'src/providers/audio.service';
import { UtilService } from 'src/providers/util.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements AfterContentInit {

  public searchPhrase: string = '';
  public searchEnabled: boolean = false;
  public allMarkedForDeletion: boolean = false;
  public editMode: boolean = false;
  public reorderingEnabled: boolean = false;
  public deletionEnabled: boolean = false;
  public songs: Song[] = [];
  public constants = Data;
  public sortModes: string[] = Object.values(this.constants.SORT_MODES);
  public sortBy: string = this.sortModes[0];// TODO get from persistence service later
  public displayMode: string = this.constants.DISPLAY_MODES.DETAIL; // TODO get from persistence service later

  constructor(public fileChooser: FileChooser, public persistenceService: PersistenceService,
              public keyboard: Keyboard, public platform: Platform, public fileService: FileService, public audioService: AudioService,
              public util: UtilService) { }

  ngAfterContentInit() {
    this.persistenceService.getSongs().then(songs => {
      console.log(songs);
      this.songs = songs;
    });
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
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.reorderingEnabled = false;
      this.deletionEnabled = false;
    }
  }

  toggleReordering() {
    this.reorderingEnabled = !this.reorderingEnabled;
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

  toggleMarkedForDeletion() {
    this.songs.forEach(song => {
      song.isMarkedForDeletion = this.allMarkedForDeletion;
    });
  }

  clearModes() {
    this.reorderingEnabled = false;
    this.deletionEnabled = false;
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
  }

  sortSongs() {
    switch (this.sortBy) { // 'NAME_ASCENDING' | 'NAME_DESCENDING' | 'PLAYED_ASCENDING' | 'PLAYED_DESCENDING'
      case this.sortModes[0]: {
        // do nothing - no sort
        console.log(this.sortModes[0]);
        break;
      }
      case this.sortModes[1]: {
        console.log(this.sortModes[1]);
        this.songs.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        break;
      }
      case this.sortModes[2]: {
        console.log(this.sortModes[2]);
        this.songs.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.songs.reverse();
        break;
      }
      case this.sortModes[3]: {
        console.log(this.sortModes[3]);
        this.songs.sort((a,b) => (a.numberOfPlaybacks > b.numberOfPlaybacks) ? 1 : ((b.numberOfPlaybacks > a.numberOfPlaybacks) ? -1 : 0));
        break;
      }
      case this.sortModes[4]: {
        console.log(this.sortModes[4]);
        this.songs.sort((a,b) => (a.numberOfPlaybacks > b.numberOfPlaybacks) ? 1 : ((b.numberOfPlaybacks > a.numberOfPlaybacks) ? -1 : 0));
        this.songs.reverse();
        break;
      }
    }
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
    let songURI = await this.fileService.openFile();
    let nativePath = await this.fileService.getNativePath(songURI);
    let fileInfo = await this.fileService.getFileInfo(nativePath);
    let mediaPath = nativePath.replace(/file:\/\//g, '');
    let fileName = fileInfo.name;
    let fileSize = await this.fileService.getFileSize(songURI);
    let duration = await this.audioService.getDuration(mediaPath);
    this.songs.push(
      {
        name: fileName,
        mediaPath: mediaPath,
        duration: this.util.durationToDisplayTime(duration),
        numberOfPlaybacks: 0,
        favourite: false,
        imageURL: null,
        isMarkedForDeletion: false,
        size: this.util.convertToDisplaySize(fileSize)
      }
    );
    await this.persistenceService.saveSongs(this.songs);
  }

  play(index: number) {
    console.log('play: ' + index);
  }

  async toggleFavourite(index: number) { // think about efficiency of saving on each favourite click !
    this.songs[index].favourite = !this.songs[index].favourite
    await this.persistenceService.saveSongs(this.songs);
  }
}
