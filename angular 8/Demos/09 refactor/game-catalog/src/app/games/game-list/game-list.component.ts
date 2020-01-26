import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { GameModel } from '../game.model';
import { GameService } from '../game.service';
import { CriteriaComponent } from 'src/app/shared/criteria/criteria.component';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit, AfterViewInit {
  includeDetail = true;
  showImage: boolean;
  imageWidth = 50;
  imageMargin = 2;

  @ViewChild(CriteriaComponent, { static: false })filterComponent: CriteriaComponent;
  parentListFilter;

  filteredGames: GameModel[];
  games: GameModel[];

  constructor(private gameService: GameService) {

  }

  ngAfterViewInit(): void {
    this.parentListFilter = this.filterComponent.listFilter;
  }

  ngOnInit() {
    this.gameService.getGames().subscribe(
      (games: GameModel[]) => {
        this.games = games;
        this.performFilter(this.parentListFilter);
      }
    )
  }

  onValueChange(value: string): void {
    this.performFilter(value);
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
}
