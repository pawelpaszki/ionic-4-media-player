import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

  public durationToDisplayTime(duration: number): string {
    if (this.isNormalInteger(duration.toString())) {
      let hours, minutes, seconds;
      seconds = duration % 60;
      seconds < 10 ? seconds = `0${seconds}` : seconds;
      if (duration < 60) {
        return `0:${seconds}`;
      } else if (duration < 3600) {
        return Math.floor(duration / 60) + `:${seconds}`;
      } else if (duration >= 3600) {
        hours = Math.floor(duration / 3600);
        minutes = Math.floor((duration - hours * 3600) / 60); 
        minutes < 10 ? minutes = `0${minutes}` : minutes;
        return `${hours}:${minutes}:${seconds}`;
      }
    } else {
      return '0:00';
    }
  }

  public isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
  }
}