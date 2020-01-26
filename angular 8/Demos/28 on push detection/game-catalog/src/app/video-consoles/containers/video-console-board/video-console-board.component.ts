import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { VideoConsoleModel } from '../../video-console.model';
import { Store, select } from '@ngrx/store';
import * as fromVideoConsole from '../../state/video-consoles.reducer';
import * as videoConsolesActions from '../../state/video-consoles.actions';

@Component({
  selector: 'app-video-console-board',
  templateUrl: './video-console-board.component.html',
  styleUrls: ['./video-console-board.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    this.selectedVideoConsole$ = this.store.pipe(
      select(fromVideoConsole.getCurrentVideoConsole)
    );

    this.store.dispatch(new videoConsolesActions.Load());
    this.videoConsoles$ = this.store.pipe(
      select(fromVideoConsole.getVideoConsoles)
    );
    this.errorMessage$ = this.store.pipe(
      select(fromVideoConsole.getError)
    );

    this.displayCode$ = this.store.pipe(
      select(fromVideoConsole.getShowVideoConsoleCode)
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
