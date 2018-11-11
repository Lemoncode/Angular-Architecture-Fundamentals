import { Component, OnInit } from '@angular/core';

import { VideoConsoleModel } from '../video-console.model';

import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import * as fromVideoConsole from '../state/video-consoles.reducer';
import * as videoConsoleActions from '../state/video-consoles.actions';

@Component({
  selector: 'app-video-console-list',
  templateUrl: './video-console-list.component.html',
  styleUrls: ['./video-console-list.component.css']
})
export class VideoConsoleListComponent implements OnInit {
  // errorMessage: string;
  errorMessage$: Observable<string>;
  displayCode: boolean;
  videoConsoles$: Observable<VideoConsoleModel[]>;
  selectedVideoConsole: VideoConsoleModel | null;

  constructor(
    private store: Store<fromVideoConsole.State>
  ) { }

  ngOnInit(): void {
    this.store.pipe(select(fromVideoConsole.getCurrentVideoConsole))
      .subscribe(
        selectedVideoConsole => this.selectedVideoConsole = selectedVideoConsole
      );

    this.store.dispatch(new videoConsoleActions.Load());
    this.videoConsoles$ = this.store.pipe(select(fromVideoConsole.getVideoConsoles));
    this.errorMessage$ = this.store.pipe(select(fromVideoConsole.getError));

    this.store.pipe(select(fromVideoConsole.getShowVideoConsoleCode))
      .subscribe(
        showVideoConsoleCode => this.displayCode = showVideoConsoleCode,
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
