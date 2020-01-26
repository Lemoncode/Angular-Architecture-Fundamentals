import * as fromRoot from '../../state/app.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VideoConsoleState } from './video-consoles.reducer';

export interface State extends fromRoot.Sate {
  videoconsoles: VideoConsoleState;
}

const getVideoConsoleFeatureState = createFeatureSelector<VideoConsoleState>('videoconsoles');

export const getShowVideoConsoleCode = createSelector(
  getVideoConsoleFeatureState,
  state => state.showVideoConsoleCode
);

export const getCurrentVideoConsoleId = createSelector(
  getVideoConsoleFeatureState,
  state => state.currentVideoConsoleId,
);

export const getCurrentVideoConsole = createSelector(
  getVideoConsoleFeatureState,
  getCurrentVideoConsoleId,
  (state, videoConsoleId) => {
    if (videoConsoleId === 0) {
      return {
        id: 0,
        name: '',
        code: 'new',
        description: '',
        rating: 0,
      };
    } else {
      return videoConsoleId ? state.videoconsoles.find(p => p.id === videoConsoleId) : null;
    }
  }
)

export const getVideoConsoles = createSelector(
  getVideoConsoleFeatureState,
  state => state.videoconsoles,
);

export const getError = createSelector(
  getVideoConsoleFeatureState,
  state => state.error
);
