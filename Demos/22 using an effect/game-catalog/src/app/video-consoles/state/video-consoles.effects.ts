import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { VideoConsoleService } from '../video-console.service';
import * as videoConsoleActions from './video-consoles.actions';
import { VideoConsoleModel } from '../video-console.model';

import { mergeMap, map } from 'rxjs/operators';

@Injectable()
export class VideoConsoleEffects {
  constructor(
    private actions$: Actions,
    private videoConsoleService: VideoConsoleService
  ){}


  @Effect()
  loadVideoConsoles$ = this.actions$.pipe(
    ofType(videoConsoleActions.VideoConsoleActionTypes.Load),
    mergeMap((action: videoConsoleActions.Load) =>
      this.videoConsoleService.getVideoConsoles()
        .pipe(
          map((vcs: VideoConsoleModel[]) => (new videoConsoleActions.LoadSuccess(vcs)))
        )
    )
  )
}
