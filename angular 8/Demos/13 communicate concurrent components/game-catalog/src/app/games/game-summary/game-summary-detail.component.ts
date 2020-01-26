import { Component, OnInit } from '@angular/core';
import { GameModel } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-summary-detail',
  templateUrl: './game-summary-detail.component.html',
  styles: []
})
export class GameSummaryDetailComponent implements OnInit {
  // game = this.gameService.currentGame;

  get game(): GameModel {
    return this.gameService.currentGame;
  }


  constructor(private gameService: GameService) { }

  ngOnInit() {

  }
}
