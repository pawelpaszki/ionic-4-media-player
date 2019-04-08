import { Component, AfterContentInit } from '@angular/core';
// import { FileService } from 'src/app/services/file-service';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { PersistenceService, Song } from 'src/providers/persistence.service';
import * as Data from '../../../AppConstants';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements AfterContentInit {

  public allMarkedForDeletion: boolean = false;
  public editMode: boolean = false;
  public reorderingEnabled: boolean = false;
  public deletionEnabled: boolean = false;
  public songs: Song[] = [];
  public constants = Data;
  public sortModes: string[] = Object.values(this.constants.SORT_MODES);
  public sortBy: string = this.sortModes[0];// TODO get from persistence service later
  public displayMode: string = this.constants.DISPLAY_MODES.DETAIL; // TODO get from persistence service later

  constructor(public fileChooser: FileChooser, public media: Media, public persistenceService: PersistenceService /*public fileService: FileService*/) { }

  ngAfterContentInit() {
    this.persistenceService.getSongs().then(object => {
      this.songs = object.songs;
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
  }
}
