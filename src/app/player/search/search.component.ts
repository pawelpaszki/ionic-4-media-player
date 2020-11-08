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
    this.searchResults = [];
    this.youtube.search(searchPhrase).subscribe((response: any) => {
      if (response.items !== undefined) {
        console.log(response.items);
        response.items.forEach(item => {
          this.youtube.getDuration(item.id.videoId).subscribe((resp: any) => {
            console.log(resp);
            this.searchResults.push({
              id: item.id.videoId,
              name: item.snippet.title,
              duration: this.extractDuration(resp.items[0].contentDetails.duration.toString()),
              thumbnails: {
                large: item.snippet.thumbnails.high.url,
                medium: item.snippet.thumbnails.medium.url
              }
            });
          });
        });
      }
    });
  }
 
  extractDuration(value: string) {
    let duration: string = value.replace("PT","").replace("M",":").replace("H",":").replace("S","");
    duration.endsWith(":") ? duration = `${duration}00` : null; // if 0 seconds
    duration.substr(0,duration.length - 1).endsWith(":") ? 
    duration = `${duration.substr(0,duration.lastIndexOf(":") + 1)}0${duration.substring(duration.lastIndexOf(":") + 1)}` : null; // less then 10s and > 0m
    duration.length === 1 ? duration = `0${duration}` : null;// if less than 10 seconds
    duration.length === 2 ? duration = `0:${duration}` : null; // if only seconds
    duration.charAt(duration.length - 3) === ":" && duration.charAt(duration.length - 5) === ":" ? 
    duration = `${duration.substr(0,duration.indexOf(":")+1)}0${duration.substring(duration.lastIndexOf(":")-1,duration.length)}` : null;
    return duration;
  }

  downloadMedia(id: string, name: string, largeThumbnail?: string, mediumThumbnail?: string) {
    if (this.downloadedMediaIds.indexOf(id) === -1) {
      this.downloadedMediaIds.push(id);
      this.youtube.extractMedia(id)
      .subscribe((response: any) => {
        console.log(response);
        console.log(response.toString());
        if (response !== undefined && response.fileId !== undefined) {
          this.youtube.downloadFile(id, response.fileId, name, largeThumbnail, mediumThumbnail);
        }
      });
    }
  }

  removeDownloadedId(id) {
    for (var i = 0; i < this.downloadedMediaIds.length; i++) { 
      if (this.downloadedMediaIds[i] === id) {
        this.downloadedMediaIds.splice(i, 1);
        break;
      }
    }
  }

}