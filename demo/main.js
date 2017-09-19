// Views
const React = require("react");
const ReactDOM = require('react-dom');
const ImageStage = require("./image_stage");
const ImageList = require("./image_list");
const Controls = require("./controls");
const ExposureApp = require('./ExposureApp.jsx');

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const _  = require('lodash');

// Image processing
const Frame = require("../src/frame");
const ImageCollection = require("./image_collection");
const EventEmitter = require('events').EventEmitter;

const { createStore, applyMiddleware } = require('redux');
const { Provider } = require('react-redux');
const reducer = require('./reducer');

var firstRender = true;
var mainRedux = document.getElementById("main-redux");

// Image collection manages the state of the page. It will handle uploading
// new images, keeping track of what the selected image currently is, and
// emitting events when state changes.
var imageCollection = new ImageCollection();
imageCollection.on("loading", function() {
  ReactDOM.render(<ImageStage
    fileSelectCallback={imageCollection.handleImageLoad}
    selectedFrame={null}
    webGLSupported={Modernizr.webgl}
    loading={true}
  />, imageStage);
});

var render = function(frame, onControlChange)  {
  // Render image to stage
  ReactDOM.render(<ImageStage
    fileSelectCallback={imageCollection.handleImageLoad}
    selectedFrame={imageCollection.selectedFrame}
    webGLSupported={Modernizr.webgl}
    loading={false}
  />, imageStage);

  if (frame) {
    if (firstRender) {
      firstRender = false;
      imagesPanel.className += " editing";
      imageStage.className += " editing";
      controlPanel.className += " editing";
    }
    // Update images list
    ReactDOM.render(<ImageList
      frames={imageCollection.frames}
      selectedFrame={frame}
      fileSelectCallback={imageCollection.handleImageLoad}
      frameSelectCallback={imageCollection.selectFrame}
    />, imagesPanel);

    ReactDOM.render(<Controls onControlChange={onControlChange} frame={frame}/>, controlPanel);
  }
};

// Everytime a new image is selected bind the appropriate event handlers that
// keep the control panel up to date on settings changes.
imageCollection.on("selected", function(frame) {
  // Update control panel
  var onControlChange = function(key, value) {
    frame.settings[key] = value;
  };
  if (EventEmitter.listenerCount(frame.settings, "updated") === 0) {
    frame.settings.on("updated", function() {
      ReactDOM.render(<Controls onControlChange={onControlChange} frame={frame}/>, controlPanel);
    });
  }
  render(frame, onControlChange);
});

ReactDOM.render((
  <Provider store={createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())}>
    <ExposureApp />
  </Provider>
))
