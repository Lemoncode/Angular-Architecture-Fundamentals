import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-summary',
  templateUrl: './game-summary.component.html',
  styles: []
})
export class GameSummaryComponent implements OnInit {
  monthCount: number;
  constructor(private gameService: GameService) { }
  dateRangeToMonths = (start: Date, end: Date = new Date()) => (
    end.getMonth() - start.getMonth() +
    (12 * (end.getFullYear() - start.getFullYear()))
  );

  ngOnInit() {
    this.gameService.selectedGameChange$
      .pipe(
        map((selectedGame) => {
          const { release } = selectedGame;
          if (release) {
            return this.dateRangeToMonths(new Date(release));
          }
          return 0;
        })
      )
      .subscribe((mc) => this.monthCount = mc);
  }

}