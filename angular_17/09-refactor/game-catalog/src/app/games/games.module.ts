import { NgModule } from '@angular/core';
import { GameListComponent } from './game-list/game-list.component';
import { SharedModule } from '../shared/shared.module';
import { GameService } from './game.service';
import { RouterModule } from '@angular/router';
import { GameEditComponent } from './game-edit/game-edit.component';
import { GameDetailsComponent } from './game-details/game-details.component';

@NgModule({
  declarations: [GameListComponent, GameEditComponent, GameDetailsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: GameListComponent },
      { path: ':id', component: GameDetailsComponent },
      { path: ':id/edit', component: GameEditComponent },
    ]),
  ],
  providers: [GameService],
})
export class GamesModule {}
