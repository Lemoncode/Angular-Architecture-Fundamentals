import { Component, OnInit, OnDestroy } from '@angular/core';
import { IGame } from '../game.model';
import { GameService } from '../game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-summary-detail',
  templateUrl: './game-summary-detail.component.html',
  styles: []
})
export class GameSummaryDetailComponent implements OnInit, OnDestroy {
  game: IGame | null;
  sub: Subscription;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    // this.gameService.selectedGameChange$
    //   .subscribe((selectedGame) => this.game = selectedGame);
    this.sub = this.gameService.selectedGameChange$
    .subscribe((selectedGame) => this.game = selectedGame);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
