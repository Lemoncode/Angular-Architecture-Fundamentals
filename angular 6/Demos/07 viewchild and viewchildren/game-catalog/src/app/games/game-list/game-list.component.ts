import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NgModel } from '@angular/forms';

import { IGame } from '../game.model';
import { GameService } from '../game.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit, AfterViewInit {
  showImage: boolean;
  listFilter: string = '';
  imageWidth = 50;
  imageMargin = 2;

  @ViewChild('filterElement') filterElementRef: ElementRef;
  @ViewChild(NgModel) filterInput: NgModel;
  // @ViewChildren(NgModel)
  // inputElementRefs: QueryList<ElementRef>;

  filteredGames: IGame[];
  games: IGame[];

  // private _listFilter: string;

  // get listFilter(): string {
  //   return this._listFilter;
  // }

  // set listFilter(value: string) {
  //   this._listFilter = value;
  //   this.performFilter(this.listFilter);
  // }

  constructor(private gameService: GameService) {}

  ngAfterViewInit(): void {
    this.filterElementRef.nativeElement.focus();
    // console.log(this.inputElementRefs);
    this.filterInput.valueChanges
    .pipe(
      tap((val) => console.log(val))
    )
    .subscribe(
      () => {
        console.log(this.listFilter);
        this.performFilter(this.listFilter);
      }
    );
  }

  ngOnInit() {
    this.gameService.getGames().subscribe(
      (games: IGame[]) => {
        this.games = games;
        this.performFilter(this.listFilter);
      }
    );
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
