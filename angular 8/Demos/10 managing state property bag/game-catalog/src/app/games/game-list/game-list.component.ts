import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { GameModel } from '../game.model';
import { GameService } from '../game.service';
import { CriteriaComponent } from 'src/app/shared/criteria/criteria.component';
import { GameParameterService } from '../game-parameter.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit, AfterViewInit {
  includeDetail = true;
  // showImage: boolean;
  imageWidth = 50;
  imageMargin = 2;

  @ViewChild(CriteriaComponent, { static: false })filterComponent: CriteriaComponent;
  parentListFilter: string;

  filteredGames: GameModel[];
  games: GameModel[];

  get showImage(): boolean {
    return this.gameParameterService.showImage;
  }

  set showImage(value: boolean) {
    this.gameParameterService.showImage = value;
  }

  constructor(
    private gameService: GameService,
    private gameParameterService: GameParameterService
    ) {

  }

  ngAfterViewInit(): void {
    this.parentListFilter = this.filterComponent.listFilter;
  }

  ngOnInit() {
    this.gameService.getGames().subscribe(
      (games: GameModel[]) => {
        this.games = games;
        // this.performFilter(this.parentListFilter);
        this.filterComponent.listFilter = this.gameParameterService.filterBy;
      }
    )
  }

  onValueChange(value: string): void {
    this.performFilter(value);
    this.gameParameterService.filterBy = value;
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
