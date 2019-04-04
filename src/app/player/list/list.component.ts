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

  public songs: String[] = ['song1 by some random artist', 'song2  by some random artis', 'song3  by some random artis', 'song4  by some random artis', 
                            'song5  by some random artis', 'song6  by some random artis', 'song7  by some random artis', 'song8  by some random artis'];
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

  reorderItems(indexes) {
    console.log(indexes);
    let from = indexes.from;
    let to = indexes.to;
    let fromItem = this.songs[from];
    let toItem = this.songs[to];
    this.songs[to] = fromItem;
    this.songs[from] = toItem;
  }
}
