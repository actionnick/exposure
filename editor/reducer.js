const _ = require("lodash");

const initialState = {
  loading: false,
  frames: [],
  selectedFrame: null,
  settings: {},
};

const reducer = (state = initialState, action) => {
  const newState = { ...state };

  if (action.type === "START_IMAGE_LOAD") {
    newState.loading = true;
  } else if (action.type === "FRAME_INITIATED") {
    const frame = action.frame;
    newState.frames.unshift(frame);
    newState.selectedFrame = frame;
    newState.loading = false;
  } else if (action.type === "FRAME_SELECTED") {
    newState.selectedFrame = _.find(newState.frames, ["key", action.key]);
  } else if (action.type === "INPUTS_CHANGED") {
    newState.selectedFrame.settings[action.key] = action.value;
  } else if (action.type === "ADD_POINT") {
    newState.selectedFrame.settings.rgb_curves = [
      ...newState.selectedFrame.settings.rgb_curves,
      [action.x, action.y],
    ];
  } else if (action.type === "MOVE_CONTROL_POINT") {
    const newPoints = newState.selectedFrame.settings.rgb_curves;
    newPoints[action.index] = [action.x, action.y];
    newState.selectedFrame.settings.rgb_curves = newPoints;
  } else if (action.type === "REMOVE_CONTROL_POINT") {
    const newPoints = newState.selectedFrame.settings.rgb_curves;
    newPoints.splice(action.index, 1);
    newState.selectedFrame.settings.rgb_curves = newPoints;
  }

  window.selectedFrame = newState.selectedFrame;

  if (newState.selectedFrame) {
    newState.settings = newState.selectedFrame.settings.json;
  }

  return newState;
};

module.exports = reducer;
