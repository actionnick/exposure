var React = require("react");
var ImageStage = require("./image_stage");
var ImageList = require("./image_list");
var Controls = require("./controls");
var Frame = require("../src/frame");
var About = require("./about");
var ImageCollection = require("./image_collection");
var _  = require('lodash');

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

var imageCollection = new ImageCollection();
var render = function(frame)  {
  // Render image to stage
  React.render(<ImageStage 
    fileSelectCallback={imageCollection.handleImageLoad}
    selectedFrame={imageCollection.selectedFrame}
    webGLSupported={Modernizr.webgl}
    loading={false}
  />, imageStage);

  imageCollection.on("loading", function() {
    React.render(<ImageStage 
      fileSelectCallback={imageCollection.handleImageLoad}
      selectedFrame={imageCollection.selectedFrame}
      webGLSupported={Modernizr.webgl}
      loading={true}
    />, imageStage);
  });

  if (frame) {
    if (firstRender) {
      firstRender = false;
      imagesPanel.className += " editing";
      imageStage.className += " editing";
      controlPanel.className += " editing";
    }
    // Update images list
    React.render(<ImageList 
      frames={imageCollection.frames}
      selectedFrame={frame}
      fileSelectCallback={imageCollection.handleImageLoad}
      frameSelectCallback={imageCollection.selectFrame}
    />, imagesPanel);

    // Update control panel
    var onControlChange = function(key, value) {
      frame.settings[key] = value;
    };
    React.render(<Controls onControlChange={onControlChange} frame={frame}/>, controlPanel);
    frame.settings.on("updated", function() {
      React.render(<Controls onControlChange={onControlChange} frame={frame}/>, controlPanel);
    });
  }
};

var renderAbout = function(open) {
  React.render(<About isOpen={open} closeModal={renderAbout.bind(undefined, false)}/>, modal);
};

imageCollection.on("selected", render);
render();

if (document.cookie.indexOf("visited") < 0) {
  renderAbout(true);
  document.cookie += "visited";
};

aboutButton.onclick = renderAbout.bind(undefined, true);
