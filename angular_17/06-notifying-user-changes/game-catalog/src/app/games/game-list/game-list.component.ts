import { Component, OnInit } from '@angular/core';
import { GameModel } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.css',
})
export class GameListComponent implements OnInit {
  // listFilter!: string;
  private _listFilter!: string;

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.performFilter(value);
  }

  showImage!: boolean;

  imageWidth = 50;
  imageMargin = 2;

  filteredGames!: GameModel[];
  games!: GameModel[];

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.getGames().subscribe((games: GameModel[]) => {
      this.games = games;
      this.performFilter(this.listFilter);
    });
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  // onFilterChange(filter: string): void {
  //   this.listFilter = filter;
  //   this.performFilter(this.listFilter);
  // }

  performFilter(filterBy?: string): void {
    if (filterBy) {
      this.filteredGames = this.games.filter(
        (g: GameModel) =>
          g.name.toLocaleLowerCase().indexOf(filterBy.toLocaleLowerCase()) !==
          -1
      );
    } else {
      this.filteredGames = this.games;
    }
  }
}
