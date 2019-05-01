export interface Song {
  id: number,
  name: string,
  mediaPath: string,
  numberOfPlaybacks: number,
  imageURL: string,
  size: string,
  duration: number,
  favourite: boolean,
  isMarkedForDeletion: boolean,
  isSelectedForPlayback: boolean
}