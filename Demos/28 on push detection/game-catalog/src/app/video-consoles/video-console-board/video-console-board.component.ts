import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { VideoConsoleModel } from '../video-console.model';
import { Store, select } from '@ngrx/store';
import * as fromVideoConsole from '../state/video-consoles.reducer';
import * as videoConsoleActions from '../state/video-consoles.actions';


@Component({
  selector: 'app-video-console-board',
  templateUrl: './video-console-board.component.html'
})
export class VideoConsoleBoardComponent implements OnInit {
  errorMessage$: Observable<string>;
  displayCode$: Observable<boolean>;
  videoConsoles$: Observable<VideoConsoleModel[]>;
  selectedVideoConsole$: Observable<VideoConsoleModel>;

  constructor(
    private store: Store<fromVideoConsole.State>
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new videoConsoleActions.Load());
    this.videoConsoles$ = this.store.pipe(select(fromVideoConsole.getVideoConsoles));
    this.errorMessage$ = this.store.pipe(select(fromVideoConsole.getError));
    this.selectedVideoConsole$ = this.store.pipe(
      select(fromVideoConsole.getCurrentVideoConsole)
    );
    this.displayCode$ = this.store.pipe(
      select(fromVideoConsole.getShowVideoConsoleCode)
    );
  }

  checkChanged(value: boolean): void {
    this.store.dispatch(new videoConsoleActions.ToggleVideoConsoleCode(value));
  }

  newVideoConsole(): void {
    this.store.dispatch(new videoConsoleActions.InitializeCurrentVideoConsole());
  }

  videoConsoleSelected(videoConsole: VideoConsoleModel): void {
    this.store.dispatch(new videoConsoleActions.SetCurrentVideoConsole(videoConsole));
  }
}
