import { Component, OnInit } from '@angular/core';

import { VideoConsoleModel } from '../video-console.model';

import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import * as fromVideoConsole from '../state/video-consoles.reducer';
import * as videoConsolesActions from '../state/video-consoles.actions';

@Component({
  selector: 'app-video-console-list',
  templateUrl: './video-console-list.component.html',
  styleUrls: ['./video-console-list.component.css']
})
export class VideoConsoleListComponent implements OnInit {
  errorMessage: string;
  displayCode: boolean;
  videoConsoles$: Observable<VideoConsoleModel[]>;
  selectedVideoConsole: VideoConsoleModel | null;

  constructor(
    private store: Store<fromVideoConsole.State>
    ) { }

  ngOnInit(): void {
    this.store.pipe(
      select(fromVideoConsole.getCurrentVideoConsole)
    ).subscribe(
      selectedVideoConsole => this.selectedVideoConsole = selectedVideoConsole
    )

    this.store.dispatch(new videoConsolesActions.Load());
    this.videoConsoles$ = this.store.pipe(
      select(fromVideoConsole.getVideoConsoles)
    );

    this.store.pipe(
      select(fromVideoConsole.getShowVideoConsoleCode)
    ).subscribe(
      showVideoConsoleCode => this.displayCode = showVideoConsoleCode,
    );
  }

  checkChanged(value: boolean): void {
    this.store.dispatch(new videoConsolesActions.ToggleVideoConsoleCode(value));
  }

  newVideoConsole(): void {
    this.store.dispatch(new videoConsolesActions.InitializeCurrentVideoConsole());
  }

  videoConsoleSelected(videoConsole: VideoConsoleModel) : void {
    this.store.dispatch(new videoConsolesActions.SetCurrentVideoConsole(videoConsole));
  }
}
