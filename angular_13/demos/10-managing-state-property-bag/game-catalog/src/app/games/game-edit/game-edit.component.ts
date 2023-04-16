import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";

import { GameModel } from "../game.model";
import { GameService } from "../game.service";

interface IIndexable {
  [key: string]: any;
}

@Component({
  selector: "app-game-edit",
  templateUrl: "./game-edit.component.html",
  styleUrls: ["./game-edit.component.css"],
})
export class GameEditComponent implements OnInit {
  @ViewChild(NgForm, { static: false }) editForm!: NgForm;
  pageTitle = "Game Edit";
  errorMessage!: string;
  private originalGame!: GameModel;
  game!: GameModel;

  get isDirty(): boolean {
    return this.editForm.dirty ? true : false;
  }

  constructor(
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +params["id"];
      this.getGame(id);
    });
  }

  // TODO: Declare as private??
  getGame(id: number): void {
    this.gameService
      .getGame(id)
      .subscribe((game) => this.onGameRetrieved(game));
  }

  // TODO: Declare as private??
  onGameRetrieved(game: GameModel): void {
    // Reset back to pristine
    // this.editForm.reset();

    // Display data in form
    // Use copy to allow cancel
    this.originalGame = game;
    this.game = { ...game };

    this.pageTitle =
      this.game.id === 0 ? "Add game" : `Edit game: ${this.game.name}`;
  }

  cancel(): void {
    this.router.navigate(["/games"]);
  }

  deleteGame(): void {
    if (this.game.id) {
      // TODO: Implement guard
      this.gameService
        .deleteGame(this.game.id)
        .subscribe(() => this.onSaveComplete());
    } else {
      this.onSaveComplete();
    }
  }

  saveGame(): void {
    if (this.editForm.valid) {
      this.gameService.saveGame(this.game).subscribe(() => {
        // Assign changes from copy
        Object.keys(this.game).forEach(
          (key) =>
            ((this.originalGame as IIndexable)[key] = (this.game as IIndexable)[
              key
            ])
        );
        this.onSaveComplete();
      });
    } else {
      this.errorMessage = "Please correct the validation errors.";
    }
  }

  onSaveComplete(): void {
    // Reset back to pristine
    this.editForm.reset(this.editForm.value);
    // Navigate back to the product list
    this.router.navigate(["/games"]);
  }
}