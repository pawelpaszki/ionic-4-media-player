import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Media } from '@ionic-native/media/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { PersistenceService } from 'src/providers/persistence.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { FileService } from 'src/providers/file.service';
import { AudioService } from 'src/providers/audio.service';
import { UtilService } from 'src/providers/util.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx'
import { ToastService } from 'src/providers/toast.service';
import { MusicControls } from '@ionic-native/music-controls/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { HttpClientModule } from '@angular/common/http';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { YoutubeService } from 'src/providers/youtube.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    Media,
    FileTransfer,
    File,
    AndroidPermissions,
    FileChooser,
    FilePath,
    FileService,
    PersistenceService,
    AudioService,
    UtilService,
    YoutubeService,
    ScreenOrientation,
    BackgroundMode,
    ToastService,
    MusicControls,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
