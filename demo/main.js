var React = require("react");
const ReactDOM = require('react-dom');
var ImageStage = require("./image_stage");
var ImageList = require("./image_list");
var Controls = require("./controls");
var Frame = require("../src/frame");
var About = require("./about");
var ImageCollection = require("./image_collection");
var _  = require('lodash');
var EventEmitter = require('events').EventEmitter;

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var firstRender = true;
var actionsBar = document.getElementById("actions");
var imagesPanel = document.getElementById("images");
var imageStage = document.getElementById("current-image");
var controlPanel = document.getElementById("controls");
var aboutButton = document.getElementById("about-button");
var modal = document.getElementById("modal");
var main = document.getElementById("main");

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

// Start app
render();

var renderAbout = function(open) {
  ReactDOM.render(<About isOpen={open} closeModal={renderAbout.bind(undefined, false)}/>, modal);
};

// Display about page if user hasn't visited site yet
if (document.cookie.indexOf("visited") < 0) {
  renderAbout(true);
  document.cookie += "visited";
};

aboutButton.onclick = renderAbout.bind(undefined, true);
