// Views
const React = require("react");
const ReactDOM = require('react-dom');
const ExposureApp = require('./ExposureApp.jsx');

const { createStore } = require('redux');
const { Provider } = require('react-redux');
const reducer = require('./reducer');

var mainContainer = document.getElementById("main");

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render((
  <Provider store={store}>
    <ExposureApp />
  </Provider>
), mainContainer);

// Image collection manages the state of the page. It will handle uploading
// new images, keeping track of what the selected image currently is, and
// emitting events when state changes.
// var imageCollection = new ImageCollection();
// imageCollection.on("loading", function() {
//   ReactDOM.render(<ImageStage
//     fileSelectCallback={imageCollection.handleImageLoad}
//     selectedFrame={null}
//     webGLSupported={Modernizr.webgl}
//     loading={true}
//   />, imageStage);
// });

// var render = function(frame, onControlChange)  {
//   // Render image to stage
//   ReactDOM.render(<ImageStage
//     fileSelectCallback={imageCollection.handleImageLoad}
//     selectedFrame={imageCollection.selectedFrame}
//     webGLSupported={Modernizr.webgl}
//     loading={false}
//   />, imageStage);

//   if (frame) {
//     if (firstRender) {
//       firstRender = false;
//       imagesPanel.className += " editing";
//       imageStage.className += " editing";
//       controlPanel.className += " editing";
//     }
//     // Update images list
//     ReactDOM.render(<ImageList
//       frames={imageCollection.frames}
//       selectedFrame={frame}
//       fileSelectCallback={imageCollection.handleImageLoad}
//       frameSelectCallback={imageCollection.selectFrame}
//     />, imagesPanel);

//     ReactDOM.render(<Controls onControlChange={onControlChange} frame={frame}/>, controlPanel);
//   }
// };

// // Everytime a new image is selected bind the appropriate event handlers that
// // keep the control panel up to date on settings changes.
// imageCollection.on("selected", function(frame) {
//   // Update control panel
//   var onControlChange = function(key, value) {
//     frame.settings[key] = value;
//   };
//   if (EventEmitter.listenerCount(frame.settings, "updated") === 0) {
//     frame.settings.on("updated", function() {
//       ReactDOM.render(<Controls onControlChange={onControlChange} frame={frame}/>, controlPanel);
//     });
//   }
//   render(frame, onControlChange);
// });
