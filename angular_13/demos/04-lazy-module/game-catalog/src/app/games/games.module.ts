import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { GameService } from './game.service';
import { GameListComponent } from './game-list/game-list.component';

@NgModule({
  declarations: [
    GameListComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: GameListComponent }
    ])
  ],
  providers: [
    GameService
  ]
})
export class GamesModule { }
