import { Component } from '@angular/core';
import { GameModel } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-summary-detail',
  templateUrl: './game-summary-detail.component.html',
  styles: ``,
})
export class GameSummaryDetailComponent {
  // game = this.gameService.currentGame;
  get game(): GameModel | null {
    return this.gameService.currentGame;
  }

  constructor(private gameService: GameService) {}

  ngOnInit() {}
}
