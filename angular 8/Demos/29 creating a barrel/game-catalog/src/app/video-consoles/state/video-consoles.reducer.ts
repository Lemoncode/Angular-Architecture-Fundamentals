import { VideoConsoleModel } from '../video-console.model';
import { VideoConsoleActionTypes } from './video-consoles.actions';

export interface VideoConsoleState {
  showVideoConsoleCode: boolean;
  currentVideoConsoleId: number | null;
  videoconsoles: VideoConsoleModel[];
  error: string;
}

const initialState: VideoConsoleState = {
  showVideoConsoleCode: true,
  currentVideoConsoleId: null,
  videoconsoles: [],
  error: '',
};

export const reducer = (state: VideoConsoleState = initialState, action): VideoConsoleState => {
  switch (action.type) {
    case VideoConsoleActionTypes.LoadSuccess:
      return {
        ...state,
        videoconsoles: [...action.payload],
        error: '',
      };

    case VideoConsoleActionTypes.LoadFailed:
      return {
        ...state,
        videoconsoles: [],
        error: action.payload,
      };

    case VideoConsoleActionTypes.ToggleVideoConsoleCode:
      return {
        ...state,
        showVideoConsoleCode: action.payload,
      };

    case VideoConsoleActionTypes.SetCurrentVideoConsole:
      return {
        ...state,
        currentVideoConsoleId: action.payload.id
      };

    case VideoConsoleActionTypes.ClearCurrentVideoConsole:
      return {
        ...state,
        currentVideoConsoleId: null
      };

    case VideoConsoleActionTypes.InitializeCurrentVideoConsole:
      return {
        ...state,
        currentVideoConsoleId: 0
      };

    case VideoConsoleActionTypes.UpdateVideoConsoleSuccess:
      const updatedVideoConsoles = state.videoconsoles.map(
        vc => action.payload.id === vc.id ? action.payload : vc
      );
      return {
        ...state,
        videoconsoles: updatedVideoConsoles,
        currentVideoConsoleId: action.payload.id,
        error: '',
      };

    case VideoConsoleActionTypes.UpdateVideoConsoleFailed:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

