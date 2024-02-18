import { Component } from '@angular/core';
import { GameModel } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-summary-list',
  templateUrl: './game-summary-list.component.html',
  styles: ``,
})
export class GameSummaryListComponent {
  games!: GameModel[];
  selectedGame!: GameModel | null;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameService.getGames().subscribe((games: GameModel[]) => {
      this.games = games;
    });
  }

  onSelected(game: GameModel): void {
    this.gameService.currentGame = game;
  }
}
