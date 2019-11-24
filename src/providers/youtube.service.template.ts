import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Events } from '@ionic/angular';
import { ToastService } from './toast.service';

@Injectable()
export class YoutubeService {

  constructor(public http: HttpClient, public transfer: FileTransfer, public file: File, private events: Events, private toast: ToastService) {}

  search(searchPhrase: string) {
    const ytKey = 'your_key_goes_here';
    return this.http.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${searchPhrase}&type=video&key=${ytKey}`);
  }

  getDuration(id: string) {
    const ytKey = 'your_key_goes_here';
    return this.http.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${id}&part=contentDetails&key=${ytKey}`);
  }

  extractMedia(youtubeVideoId: string) {
    const token = 'api_token';
    return this.http.post(`server_url:port_number`, {id: youtubeVideoId, token: token});
  }

  downloadFile(youtubeVideoId: string, name: string, largeThumbnail?: string, mediumThumbnail?: string) {
    const s3Url = `s3_bucket_url/${youtubeVideoId}.mp3`;
    const fileTransfer: FileTransferObject = this.transfer.create();
    return fileTransfer.download(s3Url, this.file.externalRootDirectory  + `/Download/${youtubeVideoId}.mp3`).then((entry) => {
      this.events.publish('download:song', entry.toURL(), name, largeThumbnail, mediumThumbnail);
      this.events.publish('download:finished', youtubeVideoId);
      this.toast.showToast(`${name} downloaded successfully`);
    }, (error) => {
      this.events.publish('download:finished', youtubeVideoId);
      this.toast.showToast(`Unable to download ${name}`);
    });
  }
}