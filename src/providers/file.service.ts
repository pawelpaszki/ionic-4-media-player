import { Injectable } from '@angular/core';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';

@Injectable()
export class FileService {

  constructor(private file: File, private fileChooser: FileChooser, private filePath: FilePath) {
    
  }

  openFile(): Promise<any> {
    return this.fileChooser.open();
  }

  getNativePath(uri: string): Promise<any> {
    return this.filePath.resolveNativePath(uri);
  }

  getFileInfo(nativeURL: string): Promise<any> {
    return this.file.resolveLocalFilesystemUrl(nativeURL);
  }

  getFileSize(uri: string): Promise<any> {
    const p: Promise<any> = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.file.resolveLocalFilesystemUrl(uri).then(fileEntry => {
          fileEntry.getMetadata((metadata) => {
              resolve(metadata.size);
          });
        });
      }, 200);
    });
    return p;
  } 

}