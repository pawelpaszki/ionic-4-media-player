import { Injectable } from '@angular/core';
import { Song } from 'src/interfaces/song';
import * as Data from '../AppConstants';
import { ToastService } from './toast.service';

@Injectable()
export class UtilService {

  constructor(private toast: ToastService) {}

  private repeatModes = Data.REPEAT_MODES;

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

  public convertToDisplaySize(size: number, precision?: number): string {
    if (0 === size) {
      return "0 Bytes";
    }
    var c = 1024,
      d = precision || 2,
      e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      f = Math.floor(Math.log(size) / Math.log(c));
    return parseFloat((size / Math.pow(c, f)).toFixed(d)) + " " + e[f];
  }

  public getSongsIds(songs: Song[], id: number, shuffleOn: boolean, repeatMode: string): number[] {
    let ids = songs.map((song) => {
      return song.id;
    });
    switch(repeatMode) {
      case this.repeatModes.ALL: 
        // do nothing
        break;
      case this.repeatModes.PART_OF_SONG: 
        // ignore for now
        break;
      case this.repeatModes.SONG: 
        ids = [id];
        break;
      case this.repeatModes.FAVOURITE: 
        let favouriteIds = this.getFavouriteSongsIds(songs);
        if (favouriteIds.length === 0 && ids.length > 0) {
          this.toast.showToast('No favourite songs. All songs will be played');
        } else {
          ids = favouriteIds;
        }
        break;
      case this.repeatModes.SELECTED: 
        let selectedIds = this.getSelectedIds(songs);
        if (selectedIds.length === 0 && ids.length > 0) {
          this.toast.showToast('No songs selected for playback. All songs will be played');
        } else {
          ids = selectedIds;
        }
        break;
    }
    if (shuffleOn) {
      ids = this.shuffleIds(ids);
    }
    return ids;
  }

  private getSelectedIds(songs: Song[]) {
    return songs.filter(song => song.isSelectedForPlayback).map((song) => {return song.id});
  }

  private getFavouriteSongsIds(songs: Song[]) {
    return songs.filter(song => song.favourite).map((song) => {return song.id});
  }

  private shuffleIds(ids: number[]): number[] {
    let counter = ids.length;
    while (counter > 0) {
      let index = Math.floor(Math.random() * counter);
      counter--;
      let temp = ids[counter];
      ids[counter] = ids[index];
      ids[index] = temp;
    }
    return ids;
  }

  public getSongById(songs: Song[], id: number): Song {
    return songs.find(song => song.id === id);
  }
}