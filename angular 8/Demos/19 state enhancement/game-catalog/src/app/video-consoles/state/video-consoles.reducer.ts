import * as fromRoot from '../../state/app.state';
import { VideoConsoleModel } from '../video-console.model';

export interface VideoConsoleState {
  showVideoConsoleCode: boolean;
  currentVideoConsole: VideoConsoleModel;
  videoconsoles: VideoConsoleModel[];
}

const initialState: VideoConsoleState = {
  showVideoConsoleCode: true,
  currentVideoConsole: null,
  videoconsoles: [],
};

export interface State extends fromRoot.Sate {
  videoconsoles: VideoConsoleState;
}

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

