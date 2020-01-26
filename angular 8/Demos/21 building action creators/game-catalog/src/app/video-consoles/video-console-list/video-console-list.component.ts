import { Component, OnInit, OnDestroy } from '@angular/core';

import { VideoConsoleModel } from '../video-console.model';

import { Subscription } from 'rxjs';
import { VideoConsoleService } from '../video-console.service';

import { Store, select } from '@ngrx/store';

import * as fromVideoConsole from '../state/video-consoles.reducer';
import * as videoConsolesActions from '../state/video-consoles.actions';

@Component({
  selector: 'app-video-console-list',
  templateUrl: './video-console-list.component.html',
  styleUrls: ['./video-console-list.component.css']
})
export class VideoConsoleListComponent implements OnInit, OnDestroy {
  errorMessage: string;
  displayCode: boolean;
  videoConsoles: VideoConsoleModel[];
  selectedVideoConsole: VideoConsoleModel | null;
  sub: Subscription;

  constructor(
    private store: Store<fromVideoConsole.State>,
    private videoConsoleService: VideoConsoleService
    ) { }

  ngOnInit(): void {
    // this.sub = this.videoConsoleService.selectedVideoConsoleChanges$.subscribe(
    //   selectedVideoConsole => this.selectedVideoConsole = selectedVideoConsole
    // );
    this.store.pipe(
      select(fromVideoConsole.getCurrentVideoConsole)
    ).subscribe(
      selectedVideoConsole => this.selectedVideoConsole = selectedVideoConsole
    )

    this.videoConsoleService.getVideoConsoles().subscribe(
      (videoConsoles: VideoConsoleModel[]) => this.videoConsoles = videoConsoles,
      (err: any) => this.errorMessage = err.error
    );

    this.store.pipe(
      select(fromVideoConsole.getShowVideoConsoleCode)
    ).subscribe(
      showVideoConsoleCode => this.displayCode = showVideoConsoleCode,
    );
  }

  ngOnDestroy(): void {
    // this.sub.unsubscribe();
  }

  checkChanged(value: boolean): void {
    this.store.dispatch(new videoConsolesActions.ToggleVideoConsoleCode(value));
  }

  newVideoConsole(): void {
    //this.videoConsoleService.changeSelectedVideoConsole(this.videoConsoleService.newVideoConsole());
    this.store.dispatch(new videoConsolesActions.InitializeCurrentVideoConsole());
  }

  videoConsoleSelected(videoConsole: VideoConsoleModel) : void {
    this.store.dispatch(new videoConsolesActions.SetCurrentVideoConsole(videoConsole));
  }
}
