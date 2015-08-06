var React = require("react");
var ImageStage = require("./image_stage");
var ImageList = require("./image_list");
var Controls = require("./controls");
var Frame = require("../src/frame");
var ImageCollection = require("./image_collection");

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var actionsBar = document.getElementById("actions");
var imagesPanel = document.getElementById("images");
var imageStage = document.getElementById("current-image");
var controlPanel = document.getElementById("controls");

window.imageCollection = new ImageCollection();
var render = function(frame)  {
  // Render image to stage
  React.render(<ImageStage 
    fileSelectCallback={imageCollection.handleImageLoad}
    selectedFrame={imageCollection.selectedFrame}
  />, imageStage);

  if (frame) {
    // Update images list
    // React.render(<ImageList 
    //   frames={imageCollection.groupings}
    //   selectedFrame={selectedFrame}
    //   fileSelectCallback={imageCollection.handleImageLoad}
    //   imageSelectCallback={imageCollection.setCurrentImage}
    // />, imagesPanel);

    // Update control panel
    var onControlChange = function(key, value) {
      frame.settings[key] = value;
    };
    React.render(<Controls onControlChange={onControlChange} settings={frame.settings}/>, controlPanel);
    frame.settings.on("updated", function() {
      React.render(<Controls onControlChange={onControlChange} settings={frame.settings}/>, controlPanel);
    });
  }
  
};

imageCollection.on("selected", render);
render();
