import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';

@Injectable()
export class YoutubeService {

  constructor(public http: HttpClient, public transfer: FileTransfer, public file: File) {}

  search(searchPhrase: string) {
    const ytKey = 'your_key_goes_here';
    return this.http.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${searchPhrase}&type=video&key=${ytKey}`);
  }
}