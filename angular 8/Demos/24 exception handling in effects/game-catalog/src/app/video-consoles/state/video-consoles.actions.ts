import { Action, ActionReducerMap } from '@ngrx/store';
import { VideoConsoleModel } from '../video-console.model';

export enum VideoConsoleActionTypes {
  ToggleVideoConsoleCode = '[Video Console] Toggle Video Console Code',
  SetCurrentVideoConsole = '[Video Console] Set current Video Console',
  ClearCurrentVideoConsole = '[Video Console] Clear current Video Console',
  InitializeCurrentVideoConsole = '[Video Console] Initialize current Vodeo Console',
  Load = '[Video Console] Load',
  LoadSuccess = '[Video Console] Load Success',
  LoadFailed = '[Video Console] Load Failed'
}

export class ToggleVideoConsoleCode implements Action {
  readonly type = VideoConsoleActionTypes.ToggleVideoConsoleCode;

  constructor(public payload: boolean) { }
}

export class SetCurrentVideoConsole implements Action {
  readonly type = VideoConsoleActionTypes.SetCurrentVideoConsole

  constructor(public payload: VideoConsoleModel) { }
}

export class ClearCurrentVideoConsole implements Action {
  readonly type = VideoConsoleActionTypes.ClearCurrentVideoConsole
}

export class InitializeCurrentVideoConsole implements Action {
  readonly type = VideoConsoleActionTypes.InitializeCurrentVideoConsole
}

export class Load implements Action {
  readonly type = VideoConsoleActionTypes.Load;
}

export class LoadSuccess implements Action {
  readonly type = VideoConsoleActionTypes.LoadSuccess;

  constructor(public payload: VideoConsoleModel[]) { }
}

export class LoadFailed implements Action {
  readonly type = VideoConsoleActionTypes.LoadFailed;

  constructor(public payload: string) { }
}

export type VideoConsoleActions = ToggleVideoConsoleCode |
  SetCurrentVideoConsole |
  ClearCurrentVideoConsole |
  InitializeCurrentVideoConsole |
  Load |
  LoadSuccess |
  LoadFailed;
