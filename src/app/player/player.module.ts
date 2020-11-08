import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PlayerPage } from './player.page';
import { MediaplayerComponent } from './mediaplayer/mediaplayer.component';
import { ListComponent } from './list/list.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: PlayerPage
      }
    ])
  ],
  declarations: [
    PlayerPage,
    MediaplayerComponent,
    ListComponent,
    SearchComponent,
  ],
  exports:[
    MediaplayerComponent,
    ListComponent,
    SearchComponent
  ]
})
export class PlayerModule {}
