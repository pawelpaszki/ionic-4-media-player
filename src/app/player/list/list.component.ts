import { Component, AfterContentInit } from '@angular/core';
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
  public searchEnabled: boolean = false;
  public allMarkedForDeletion: boolean = false;
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
              public util: UtilService, public events: Events) { }

  ngAfterContentInit() {
    setTimeout(() => {
      this.persistenceService.getSongs().then(songs => {
        this.songs = songs;
        this.persistenceService.getSortMode().then(sortBy => {
          this.sortBy = sortBy !== undefined && sortBy !== null ? sortBy : this.sortModes[0];
          if (this.sortBy !== this.sortModes[0]) {
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
      this.updateSongs();
      await this.persistenceService.saveSongs(this.songs);
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
    try {
      let songURI = await this.fileService.openFile();
      let nativePath = await this.fileService.getNativePath(songURI);
      let fileInfo = await this.fileService.getFileInfo(nativePath);
      let mediaPath = nativePath.replace(/file:\/\//g, '');
      let fileName = fileInfo.name;
      let fileSize = await this.fileService.getFileSize(songURI);
      let duration = await this.audioService.getDuration(mediaPath);
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
          size: this.util.convertToDisplaySize(fileSize)
        }
      );
      this.nextId = this.nextId + 1;
      await this.persistenceService.saveSongs(this.songs);
      await this.persistenceService.setNextId(this.nextId);
      this.updateSongs();
    } catch (error) {
      console.log(error.toString());
    }
  }

  updateSongs() {
    this.events.publish('update:songs', this.songs);
  }

  play(id: number) {
    console.log('play: ' + id);
    this.events.publish('playback:init', this.songs, id);
  }

  async toggleFavourite(index: number) { // think about efficiency of saving on each favourite click !
    this.songs[index].favourite = !this.songs[index].favourite;
    this.updateSongs();
    await this.persistenceService.saveSongs(this.songs);
  }
}
