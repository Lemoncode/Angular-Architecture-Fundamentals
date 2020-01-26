import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { GameListComponent } from './game-list/game-list.component';

import { GameService } from './game.service';
import { GameEditComponent } from './game-edit/game-edit.component';
import { GameDetailsComponent } from './game-details/game-details.component';

import { GameParameterService } from './game-parameter.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: GameListComponent },
      { path: ':id', component: GameDetailsComponent},
      {
        path: ':id/edit',
        // TODO: Implement guard canDeactivate
        component: GameEditComponent
      }
    ]),
  ],
  declarations: [GameListComponent, GameEditComponent, GameDetailsComponent],
  providers: [
    GameService,
    GameParameterService
  ]
})
export class GamesModule { }
