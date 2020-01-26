import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';


import { GameListComponent } from './game-list/game-list.component';
import { GameEditComponent } from './game-edit/game-edit.component';
import { GameDetailsComponent } from './game-details/game-details.component';

import { GameService } from './game.service';
import { GameParameterService } from './game-parameter.service';


@NgModule({
  declarations: [GameListComponent, GameEditComponent, GameDetailsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: GameListComponent },
      { path: ':id', component: GameDetailsComponent },
      {
        path: ':id/edit',
        component: GameEditComponent
      }
    ]),
  ],
  providers: [
    GameService,
    GameParameterService
  ]
})
export class GamesModule { }
