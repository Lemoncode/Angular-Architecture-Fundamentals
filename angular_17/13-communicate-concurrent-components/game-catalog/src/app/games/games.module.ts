import { NgModule } from '@angular/core';
import { GameListComponent } from './game-list/game-list.component';
import { SharedModule } from '../shared/shared.module';
import { GameService } from './game.service';
import { RouterModule } from '@angular/router';
import { GameEditComponent } from './game-edit/game-edit.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { GameParameterService } from './game-parameter.service';
import { GameSummaryComponent } from './game-summary/game-summary.component';
import { GameSummaryListComponent } from './game-summary/game-summary-list.component';
import { GameSummaryDetailComponent } from './game-summary/game-summary-detail.component';

@NgModule({
  declarations: [GameListComponent, GameEditComponent, GameDetailsComponent, GameSummaryComponent, GameSummaryListComponent, GameSummaryDetailComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: GameListComponent },
      { path: 'summary', component: GameSummaryComponent },
      { path: ':id', component: GameDetailsComponent },
      { path: ':id/edit', component: GameEditComponent },
    ]),
  ],
  providers: [GameService, GameParameterService],
})
export class GamesModule {}
