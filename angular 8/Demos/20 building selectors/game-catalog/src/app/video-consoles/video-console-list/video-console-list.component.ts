import { Component, OnInit, OnDestroy } from '@angular/core';

import { VideoConsoleModel } from '../video-console.model';

import { Subscription } from 'rxjs';
import { VideoConsoleService } from '../video-console.service';

import { Store, select } from '@ngrx/store';

import * as fromVideoConsole from '../state/video-consoles.reducer';

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
    this.sub = this.videoConsoleService.selectedVideoConsoleChanges$.subscribe(
      selectedVideoConsole => this.selectedVideoConsole = selectedVideoConsole
    );

    this.videoConsoleService.getVideoConsoles().subscribe(
      (videoConsoles: VideoConsoleModel[]) => this.videoConsoles = videoConsoles,
      (err: any) => this.errorMessage = err.error
    );

    // this.store.pipe(
    //   select('videoconsoles')
    // ).subscribe(
    //   (vcs) => {
    //     if (vcs) {
    //       this.displayCode = vcs.showVideoConsoleCode
    //     }
    //   }
    // );
    this.store.pipe(
      select(fromVideoConsole.getShowVideoConsoleCode)
    ).subscribe(
      showVideoConsoleCode => this.displayCode = showVideoConsoleCode,
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  checkChanged(value: boolean): void {
    // this.displayCode = value;
    this.store.dispatch({
      type: 'TOGGLE_VIDEO_CONSOLE_CODE',
      payload: value,
    });
  }

  newVideoConsole(): void {
    this.videoConsoleService.changeSelectedVideoConsole(this.videoConsoleService.newVideoConsole());
  }

  videoConsoleSelected(videoConsole: VideoConsoleModel) : void {
    this.videoConsoleService.changeSelectedVideoConsole(videoConsole);
  }
}
