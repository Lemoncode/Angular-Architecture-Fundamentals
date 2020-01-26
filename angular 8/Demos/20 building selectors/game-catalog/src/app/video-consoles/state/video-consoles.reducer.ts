import * as fromRoot from '../../state/app.state';
import { VideoConsoleModel } from '../video-console.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface VideoConsoleState {
  showVideoConsoleCode: boolean;
  currentVideoConsole: VideoConsoleModel;
  videoconsoles: VideoConsoleModel[];
}

export interface State extends fromRoot.Sate {
  videoconsoles: VideoConsoleState;
}

const initialState: VideoConsoleState = {
  showVideoConsoleCode: true,
  currentVideoConsole: null,
  videoconsoles: [],
};

const getVideoConsoleFeatureState = createFeatureSelector<VideoConsoleState>('videoconsoles');

export const getShowVideoConsoleCode = createSelector(
  getVideoConsoleFeatureState,
  state => state.showVideoConsoleCode
);

export const getCurrentVideoConsole = createSelector(
  getVideoConsoleFeatureState,
  state => state.currentVideoConsole,
);

export const getVideoConsoles = createSelector(
  getVideoConsoleFeatureState,
  state => state.videoconsoles,
);


export const reducer = (state: VideoConsoleState = initialState, action): VideoConsoleState => {
  switch (action.type) {
    case 'TOGGLE_VIDEO_CONSOLE_CODE':
      console.log(`existing state: ${JSON.stringify(state)}`);
      console.log(`actio payload: ${action.payload}`);
      return {
        ...state,
        showVideoConsoleCode: action.payload
      };

    default:
      return state;
  }
};

