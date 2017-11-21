const _ = require("lodash");

const initialState = {
  loading: false,
  frames: [],
  selectedFrame: null,
  settings: [],
  currentSettings: null,
  settingsJson: null,
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

    if (newState.currentSettings) {
      newState.selectedFrame.settings = newState.currentSettings;
    } else {
      newState.currentSettings = newState.selectedFrame.settings;
      newState.settings.push(newState.currentSettings);
    }
  } else if (action.type === "FRAME_SELECTED") {
    newState.selectedFrame = _.find(newState.frames, ["key", action.key]);

    if (newState.currentSettings) {
      newState.selectedFrame.settings = newState.currentSettings;
    } else {
      newState.currentSettings = newState.selectedFrame.settings;
      newState.settings.push(newState.currentSettings);
    }
  } else if (action.type === "INPUTS_CHANGED") {
    newState.selectedFrame.settings[action.key] = action.value;
  } else if (action.type === "ADD_POINT") {
    newState.selectedFrame.settings[action.controlPointsIdentifier] = [
      ...newState.selectedFrame.settings[action.controlPointsIdentifier],
      [action.x, action.y],
    ];
  } else if (action.type === "MOVE_CONTROL_POINT") {
    const newPoints = newState.selectedFrame.settings[action.controlPointsIdentifier];
    newPoints[action.index] = [action.x, action.y];
    newState.selectedFrame.settings[action.controlPointsIdentifier] = newPoints;
  } else if (action.type === "REMOVE_CONTROL_POINT") {
    const newPoints = newState.selectedFrame.settings[action.controlPointsIdentifier];
    newPoints.splice(action.index, 1);
    newState.selectedFrame.settings[action.controlPointsIdentifier] = newPoints;
  } else if (action.type === "SETTINGS_ADDED") {
    newState.settings.push(action.settings);
    newState.currentSettings = action.settings;
    newState.selectedFrame.settings = newState.currentSettings;
  } else if (action.type === "SETTINGS_CHANGED") {
    newState.currentSettings = newState.settings[action.index];
    newState.selectedFrame.settings = newState.currentSettings;
  }

  if (newState.currentSettings) {
    newState.settingsJson = newState.currentSettings.json;
  }

  return newState;
};

module.exports = reducer;
