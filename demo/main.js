var React = require("react");
var ImageStage = require("./image_stage");
var ImageList = require("./image_list");
var Controls = require("./controls");
var Frame = require("../src/frame");

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var actionsBar = document.getElementById("actions");
var imagesPanel = document.getElementById("images");
var imageStage = document.getElementById("current-image");
var controlPanel = document.getElementById("controls");

var images = [];
var currentImage;

var handleImageLoad = function(event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      images.push(img);
      currentImage = img;
      React.render(<ImageStage imageSelected={true} canvasReadyCallback={canvasReady}/>, imageStage);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

var canvasReady = function(canvasNode) {
  window.frame = new Frame(currentImage, canvasNode, function(frame) {
    var frame = frame;
    var onControlChange = function(key, value) {
      frame.settings[key] = value;
    };
    React.render(<Controls onControlChange={onControlChange} settings={frame.settings}/>, controlPanel);
    frame.settings.on("updated", function() {
      React.render(<Controls onControlChange={onControlChange} settings={frame.settings}/>, controlPanel);
    });
    frame.draw();
  });
};

React.render(<ImageStage fileSelectCallback={handleImageLoad}/>, imageStage);
