import { Component, OnInit } from '@angular/core';
import { IGame } from '../game.model';
import { GameService } from '../game.service';
// import { timer } from 'rxjs';

@Component({
  selector: 'app-game-summary-detail',
  templateUrl: './game-summary-detail.component.html',
  styles: []
})
export class GameSummaryDetailComponent implements OnInit {

  // get g(): IGame {
  get game(): IGame {
    return this.gameService.currentGame;
  }

  constructor(private gameService: GameService) { }

  ngOnInit() {
    // timer(0, 1000).subscribe(
    //   () => console.log(this.g)
    // );
  }

}
