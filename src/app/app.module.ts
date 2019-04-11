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
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { PersistenceService } from 'src/providers/persistence.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { FileService } from 'src/providers/file.service';
import { AudioService } from 'src/providers/audio.service';
import { UtilService } from 'src/providers/util.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    Media,
    File,    
    FileChooser,
    FilePath,
    FileService,
    PersistenceService,
    AudioService,
    UtilService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
