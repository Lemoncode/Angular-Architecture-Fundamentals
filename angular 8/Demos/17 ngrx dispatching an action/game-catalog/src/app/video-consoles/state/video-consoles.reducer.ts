export const reducer = (state, action) => {
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

