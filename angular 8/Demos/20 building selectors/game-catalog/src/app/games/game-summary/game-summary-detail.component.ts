import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameModel } from '../game.model';
import { GameService } from '../game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-summary-detail',
  templateUrl: './game-summary-detail.component.html',
  styles: []
})
export class GameSummaryDetailComponent implements OnInit, OnDestroy {
  game: GameModel | null;
  sub: Subscription;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.sub = this.gameService.selectedGameChange$
      .subscribe((selectedGame) => this.game = selectedGame);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
