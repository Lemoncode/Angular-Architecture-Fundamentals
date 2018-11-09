import { VideoConsoleModel } from '../video-console.model';
import * as fromRoot from '../../state/app.state';

export interface State extends fromRoot.State {
  videoconsoles: VideoConsoleState;
}

export interface VideoConsoleState {
  showVideoConsoleCode: boolean;
  currentVideoConsole: VideoConsoleModel;
  videoconsoles: VideoConsoleModel[];
}

// export const reducer = (state, action) => {
export const reducer = (state: VideoConsoleState, action): VideoConsoleState => {
  switch (action.type) {
    case 'TOGGLE_VIDEO_CONSOLE_CODE':
      console.log(`existing state: ${JSON.stringify(state)}`);
      console.log(`action payload: ${action.payload}`);
      return {
        ...state,
        showVideoConsoleCode: action.payload,
      };

    default:
      return state;
  }
};
