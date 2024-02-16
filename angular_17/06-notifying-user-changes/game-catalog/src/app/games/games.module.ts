import { NgModule } from '@angular/core';
import { GameListComponent } from './game-list/game-list.component';
import { SharedModule } from '../shared/shared.module';
import { GameService } from './game.service';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [GameListComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: GameListComponent }]),
  ],
  providers: [GameService],
})
export class GamesModule {}
