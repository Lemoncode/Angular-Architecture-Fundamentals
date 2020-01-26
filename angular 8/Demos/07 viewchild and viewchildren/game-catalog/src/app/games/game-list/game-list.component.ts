import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  ViewChildren,
  QueryList
} from '@angular/core';
import { GameModel } from '../game.model';
import { GameService } from '../game.service';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit, AfterViewInit {

  listFilter: string;
  showImage: boolean;

  imageWidth = 50;
  imageMargin = 2;

  @ViewChild('filterElement', { static: false }) filterElementRef: ElementRef;
  @ViewChild(NgModel, { static: false }) filterInput: NgModel;

  filteredGames: GameModel[];
  games: GameModel[];

  constructor(private gameService: GameService) {

  }

  ngOnInit() {
    this.gameService.getGames().subscribe(
      (games: GameModel[]) => {
        this.games = games;
        this.performFilter(this.listFilter);
      }
    )
  }

  performFilter(filterBy?: string): void {
    if (filterBy) {
      this.filteredGames = this.games
        .filter(
          (g: GameModel) => g.name.toLocaleLowerCase()
            .indexOf(filterBy.toLocaleLowerCase()) !== -1
        );
    } else {
      this.filteredGames = this.games;
    }
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  // onFilterChange(filter: string): void {
  //   this.listFilter = filter;
  //   this.performFilter(this.listFilter);
  // }

  ngAfterViewInit(): void {
    // console.log(this.filterElementRef);
    this.filterElementRef.nativeElement.focus();
    this.filterInput.valueChanges.subscribe((value) => {
      this.performFilter(value);
    });
  }
}
