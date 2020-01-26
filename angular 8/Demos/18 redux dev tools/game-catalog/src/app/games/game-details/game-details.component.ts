import { Component, OnInit } from '@angular/core';
import { GameModel } from '../game.model';
import { GameService } from '../game.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit {
  pageTitle = 'Game Details';
  game: GameModel;

  constructor(
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      const id = +param;
      this.getGame(id);
    }
  }

  getGame(id: number): void {
    this.gameService.getGame(id)
      .subscribe(
        (game) => this.game = game
      );
  }

  onBack(): void {
    this.router.navigate(['/games']);
  }
}
