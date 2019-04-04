import { Component, OnInit } from '@angular/core';
// import { FileService } from 'src/app/services/file-service';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  public songs: String[] = ['song1', 'song2', 'song3', 'song4', 'song5', 'song6', 'song7', 'song8'];
  public displayMode: string = 'detail';

  constructor(public fileChooser: FileChooser, public media: Media, /*public fileService: FileService*/) { }

  ngOnInit() {
    console.log(this.songs);
  }

  changeDisplayMode() {
    this.displayMode = this.displayMode === 'detail' ? 'list' : 'detail';
  }

  delete(index: number) {
    this.songs.splice(index,1);
  }
}
