import { Component, OnInit } from '@angular/core';
import { YoutubeService } from 'src/providers/youtube.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  public downloadedMediaIds: string[] = [];
  public searchResults = [];
  constructor(public youtube: YoutubeService, public events: Events) {
    events.subscribe('yt:search', (searchPhrase) => {
      this.search(searchPhrase);
    });
    events.subscribe('download:finished', (id) => {
      this.removeDownloadedId(id);
    });
  }

  ngOnInit() {
  }

  search(searchPhrase: string) {
    console.log('search: ' + searchPhrase);
    this.youtube.search(searchPhrase).subscribe((response: any) => {
      console.log(response);
      if (response.items !== undefined) {
        response.items.forEach(item => {
          this.searchResults.push({id: item.id.videoId, name: item.snippet.title, thumbnails: {large: item.snippet.thumbnails.high.url, medium: item.snippet.thumbnails.medium.url}});
        });
      }
    });
  }

  downloadMedia(id: string, name: string, largeThumbnail?: string, mediumThumbnail?: string) {
    if (this.downloadedMediaIds.indexOf(id) === -1) {
      this.downloadedMediaIds.push(id);
      this.youtube.extractMedia(id)
      .subscribe((response: any) => {
        console.log(response);
        if (response.data !== undefined && response.data.Key !== undefined) {
          this.youtube.downloadFile(id, name, largeThumbnail, mediumThumbnail);
        }
      });
    }
  }

  removeDownloadedId(id) {
    for( var i = 0; i < this.downloadedMediaIds.length; i++){ 
      if (this.downloadedMediaIds[i] === id) {
        this.downloadedMediaIds.splice(i, 1);
        break;
      }
    }
  }

}