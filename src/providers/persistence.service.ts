import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export interface Song {
  name: string,
  mediaPath: string,
  numberOfPlaybacks: number,
  imageURL: string,
  size: string,
  duration: number,
  favourite: boolean,
  isMarkedForDeletion: boolean
}

@Injectable()
export class PersistenceService {

  constructor(private storage: Storage) {
    //this.persistSongs(); // remove later
  }
  
  public getSongs(): Promise<any> {
    return this.storage.get('songs');
  }

  public saveSongs(songs: Song[]): Promise<any> {
    return this.storage.set('songs', songs);
  }

  public persistSongs() {
    this.storage.set('songs', [
      { name: 'Coma - Sierpien',
          mediaPath: 'TBD',
          numberOfPlaybacks: 10,
          imageURL: 'TBD',
          size: '6.57 MB',
          duration: 255,
          favourite: false,
          isMarkedForDeletion: false},
        { name: 'Coma - Magda',
          mediaPath: 'TBD',
          numberOfPlaybacks: 229,
          imageURL: 'TBD',
          size: '6.57 MB',
          duration: 255,
          favourite: true,
          isMarkedForDeletion: false},
        { name: 'Coma - Nie wierze skurwysynom',
          mediaPath: 'TBD',
          numberOfPlaybacks: 254,
          imageURL: 'TBD',
          size: '6.57 MB',
          duration: 255,
          favourite: false,
          isMarkedForDeletion: false},
        { name: 'Coma - Listopad',
          mediaPath: 'TBD',
          numberOfPlaybacks: 950,
          imageURL: 'TBD',
          size: '6.57 MB',
          duration: 255,
          favourite: true,
          isMarkedForDeletion: false},
        { name: 'Coma - Spadam',
          mediaPath: 'TBD',
          numberOfPlaybacks: 425,
          imageURL: 'TBD',
          size: '6.57 MB',
          duration: 255,
          favourite: false,
          isMarkedForDeletion: false},
        { name: 'Coma - Proste Decyzje',
          mediaPath: 'TBD',
          numberOfPlaybacks: 338,
          imageURL: 'TBD',
          size: '6.57 MB',
          duration: 255,
          favourite: true,
          isMarkedForDeletion: false},
        { name: 'Coma - Leszek Zukowski',
          mediaPath: 'TBD',
          numberOfPlaybacks: 694,
          imageURL: 'TBD',
          size: '6.57 MB',
          duration: 255,
          favourite: false,
          isMarkedForDeletion: false},
        { name: 'Coma - Wrony',
          mediaPath: 'TBD',
          numberOfPlaybacks: 905,
          imageURL: 'TBD',
          size: '6.57 MB',
          duration: 255,
          favourite: true,
          isMarkedForDeletion: false},
        { name: 'Coma - Zaprzepaszczone sily wielkiej armii swietych znakow',
          mediaPath: 'TBD',
          numberOfPlaybacks: 324,
          imageURL: 'TBD',
          size: '6.57 MB',
          duration: 255,
          favourite: false,
          isMarkedForDeletion: false},
        { name: 'Coma - Pierwsze wyjscie z mroku',
          mediaPath: 'TBD',
          numberOfPlaybacks: 349,
          imageURL: 'TBD',
          size: '6.57 MB',
          duration: 255,
          favourite: true,
          isMarkedForDeletion: false},
        { name: 'Coma - Moscow',
          mediaPath: 'TBD',
          numberOfPlaybacks: 913,
          imageURL: 'TBD',
          size: '6.57 MB',
          duration: 255,
          favourite: false,
          isMarkedForDeletion: false},
        { name: 'Coma - Popoludnia bezkarnie cytrynowe',
          mediaPath: 'TBD',
          numberOfPlaybacks: 569,
          imageURL: 'TBD',
          size: '6.57 MB',
          duration: 255,
          favourite: true,
          isMarkedForDeletion: false},
        { name: 'Coma - Lajki',
          mediaPath: 'TBD',
          numberOfPlaybacks: 350,
          imageURL: 'TBD',
          size: '6.57 MB',
          duration: 255,
          favourite: false,
          isMarkedForDeletion: false},
        { name: 'Coma - Odwolane',
          mediaPath: 'TBD',
          numberOfPlaybacks: 191,
          imageURL: 'TBD',
          size: '6.57 MB',
          duration: 255,
          favourite: true,
          isMarkedForDeletion: false},
        { name: 'Coma - Sto tysiecy jednakowych miast',
          mediaPath: 'TBD',
          numberOfPlaybacks: 867,
          imageURL: 'TBD',
          size: '6.57 MB',
          duration: 255,
          favourite: false,
          isMarkedForDeletion: false}
    ]);
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
}
