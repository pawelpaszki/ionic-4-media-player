import { Injectable } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media/ngx';

@Injectable()
export class AudioService { 

  mediaObj: MediaObject;
  constructor(public media: Media) {

  }

  getDuration(mediaPath: string): Promise<any> {
    const p: Promise<any> = new Promise((resolve, reject) => {
      if (this.mediaObj) {
        this.mediaObj.release();
      }
      this.mediaObj = this.media.create(mediaPath);
      this.mediaObj.play();
      this.mediaObj.setVolume(0);
      setTimeout(() => {
        const duration = Math.round(this.mediaObj.getDuration()).toString();
        resolve(duration);
        this.mediaObj.stop();
        this.mediaObj.release();
      }, 30);
    });
    return p;
  }

  unpause() {
    try {
      this.mediaObj.play();
    } catch (error) {
      // TODO ??
    }
  }

  getProgress(): Promise<any> {
    if (this.mediaObj !== undefined) {
      return this.mediaObj.getCurrentPosition();
    } else {
      return new Promise(function(resolve, reject) {
        resolve(0);
      });
    }
  }

  startPlayback(mediaPath: string) {
    this.mediaObj = this.media.create(mediaPath);
    this.mediaObj.play();
    this.mediaObj.setVolume(1);
  }

  seekTo(value: number) {
    if (this.mediaObj !== undefined) {
      return this.mediaObj.seekTo(value);
    }
  }

  pause() {
    this.mediaObj.pause();
  }

  // stopPlayback() {
  //   this.mediaObj.stop();
  //   this.mediaObj.release();
  // }

  
}