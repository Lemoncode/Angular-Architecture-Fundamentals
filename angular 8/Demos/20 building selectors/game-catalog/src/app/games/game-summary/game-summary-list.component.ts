import { Component, OnInit } from '@angular/core';
import { GameModel } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-summary-list',
  templateUrl: './game-summary-list.component.html',
  styles: []
})
export class GameSummaryListComponent implements OnInit {
  games: GameModel[];
  selectedGame: GameModel | null;

  constructor(private gameService: GameService) { }

  onSelected(game: GameModel): void {
    this.gameService.changeSelectedGame(game);
  }

  ngOnInit() {
    this.gameService.getGames().subscribe(
      (games: GameModel[]) => {
        this.games = games;
      }
    );

    this.gameService.selectedGameChange$
      .subscribe((sg) => this.selectedGame = sg);
  }

}
