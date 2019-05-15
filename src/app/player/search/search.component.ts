import { Component, OnInit } from '@angular/core';
import { YoutubeService } from 'src/providers/youtube.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  public searchResults = [];
  constructor(public youtube: YoutubeService, public events: Events) {
    events.subscribe('yt:search', (searchPhrase) => {
      console.log('yt:search');
      this.search(searchPhrase);
    });
    // events.subscribe('songs:updated', () => {
    //   this.getNewSongList();
    // });
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

}
