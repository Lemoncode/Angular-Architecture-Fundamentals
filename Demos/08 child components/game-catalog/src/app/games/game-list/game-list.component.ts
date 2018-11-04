import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NgModel } from '@angular/forms';

import { IGame } from '../game.model';
import { GameService } from '../game.service';
import { CriteriaComponent } from 'src/app/shared/criteria/criteria.component';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
// export class GameListComponent implements OnInit, AfterViewInit {
export class GameListComponent implements OnInit, AfterViewInit {
  showImage: boolean;
  includeDetail: boolean = true;
  imageWidth = 50;
  imageMargin = 2;
  /*diff*/
  @ViewChild(CriteriaComponent)filterComponent: CriteriaComponent;
  parentListFilter: string;
  /*diff*/
  filteredGames: IGame[];
  games: IGame[];

  constructor(private gameService: GameService) {}
  /*diff*/
  ngAfterViewInit(): void {
    this.parentListFilter = this.filterComponent.listFilter;
  }
  /*diff*/
  ngOnInit() {
    this.gameService.getGames().subscribe(
      (games: IGame[]) => {
        this.games = games;
        /*diff*/
        this.performFilter(this.parentListFilter);
        /*diff*/
      }
    );
  }

  onValueChange(value: string): void {
    this.performFilter(value);
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  performFilter(filterBy?: string): void {
    if (filterBy) {
      this.filteredGames = this.games
        .filter(
          (g: IGame) =>
          g.name.toLocaleLowerCase()
            .indexOf(filterBy.toLocaleLowerCase()) !== -1
        );
    } else {
      this.filteredGames = this.games;
    }
  }

}
