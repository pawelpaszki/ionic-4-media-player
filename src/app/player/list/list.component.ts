import { Component, AfterContentInit } from '@angular/core';
// import { FileService } from 'src/app/services/file-service';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';

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
  public songs: any[] = [ {name: 'song1 by some random artist', isMarkedForDeletion: false},
                          {name: 'song2 by some random artist', isMarkedForDeletion: false},
                          {name: 'song3 by some random artist', isMarkedForDeletion: false},
                          {name: 'song4 by some random artist', isMarkedForDeletion: false},
                          {name: 'song5 by some random artist', isMarkedForDeletion: false},
                          {name: 'song6 by some random artist', isMarkedForDeletion: false},
                          {name: 'song7 by some random artist', isMarkedForDeletion: false},
                          {name: 'song8 by some random artist', isMarkedForDeletion: false},
                          {name: 'song9 by some random artist', isMarkedForDeletion: false},
                          {name: 'song10 by some random artist', isMarkedForDeletion: false},
                          {name: 'song11 by some random artist', isMarkedForDeletion: false},
                          {name: 'song12 by some random artist', isMarkedForDeletion: false} ];
  public displayMode: string = 'detail';

  constructor(public fileChooser: FileChooser, public media: Media, /*public fileService: FileService*/) { }

  ngAfterContentInit() {
    console.log(this.songs);
  }

  changeDisplayMode() {
    this.displayMode = this.displayMode === 'detail' ? 'list' : 'detail';
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
}
