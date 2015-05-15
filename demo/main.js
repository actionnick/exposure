var React = require("react");
var ImageStage = require("./image_stage");
var ImageList = require("./image_list");

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var effectsBar = document.getElementById("effects");
var imagesPanel = document.getElementById("images");
var imageStage = document.getElementById("current-image");
var controlPanel = document.getElementById("controls");

var images = [];
var currentImage;

var handleImageLoad = function(event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    images.push(e.target.result);
    currentImage = e.target.result;
    React.render(<ImageStage imageSelected={true} canvasReadyCallback={canvasReady}/>, imageStage);
  };
  reader.readAsDataURL(file);
};

var canvasReady = function(canvasNode) {
  debugger;
  // create an img
  // onload initialze exposure object with image and canvas
};

React.render(<ImageStage fileSelectCallback={handleImageLoad}/>, imageStage);
