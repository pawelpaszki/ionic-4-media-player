import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Song } from '../interfaces/song';

@Injectable()
export class PersistenceService {

  constructor(private storage: Storage) {
    
  }
  
  public getSongs(): Promise<any> {
    return this.storage.get('songs');
  }

  public saveSongs(songs: Song[]): Promise<any> {
    return this.storage.set('songs', songs);
  }

  public persistShuffleMode(shuffleOn: boolean) {
    return this.storage.set('shuffleOn', shuffleOn);
  }

  public getShuffleMode(): Promise<any> {
    return this.storage.get('shuffleOn');
  }

  public persistRepeatMode(repeatMode: string) {
    return this.storage.set('repeatMode', repeatMode);
  }

  public getRepeatMode(): Promise<any> {
    return this.storage.get('repeatMode');
  }

  public persistSortMode(sortMode: string) {
    return this.storage.set('sortMode', sortMode);
  }

  public getSortMode(): Promise<any> {
    return this.storage.get('sortMode');
  }

  public getNextId(): Promise<any> {
    return this.storage.get('id');
  }

  public setNextId(id: number) {
    return this.storage.set('id', id);
  }
}
