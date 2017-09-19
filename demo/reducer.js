const initialState = {
  loading: false,
  frames: [],
  selectedFrame: null
}

const reducer = (state=initialState, action) => {
  const newState = { ...state };

  if (action.type === 'START_IMAGE_LOAD') {
    newState.loading = true;
  } else if (action.type === 'FRAME_INITIATED') {
    const frame = action.frame;
    newState.frames.unshift(frame);
    newState.selectedFrame = frame;
    newState.loading = false;
  } else if (action.type === 'FRAME_SELECTED') {
    newState.selectedFrame = _.find(newState.frames, ['key', action.key]);
  }

  return newState;
};

module.exports = reducer;
