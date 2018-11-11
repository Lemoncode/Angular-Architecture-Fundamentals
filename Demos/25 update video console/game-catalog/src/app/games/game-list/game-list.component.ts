import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NgModel } from '@angular/forms';

import { IGame } from '../game.model';
import { GameService } from '../game.service';
import { CriteriaComponent } from 'src/app/shared/criteria/criteria.component';
import { GameParameterService } from '../game-parameter.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
// export class GameListComponent implements OnInit, AfterViewInit {
export class GameListComponent implements OnInit, AfterViewInit {
  // showImage: boolean;
  includeDetail: boolean = true;
  imageWidth = 50;
  imageMargin = 2;

  @ViewChild(CriteriaComponent)filterComponent: CriteriaComponent;
  parentListFilter: string;
  filteredGames: IGame[];
  games: IGame[];

  /*diff*/
  get showImage(): boolean {
    return this.gameParameterService.showImage;
  }

  set showImage(value: boolean) {
    this.gameParameterService.showImage = value;
  }
  /*diff*/

  /*diff*/
  constructor(
    private gameService: GameService,
    private gameParameterService: GameParameterService
    ) {}
  /*diff*/

  ngAfterViewInit(): void {
    this.parentListFilter = this.filterComponent.listFilter;
  }

  ngOnInit() {
    this.gameService.getGames().subscribe(
      (games: IGame[]) => {
        this.games = games;
        /*diff*/
        this.filterComponent.listFilter = this.gameParameterService.filterBy;
        // this.performFilter(this.parentListFilter);
        /*diff*/
      }
    );
  }

  onValueChange(value: string): void {
    this.performFilter(value);
    /*diff*/
    this.gameParameterService.filterBy = value;
    /*diff*/
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
