const React = require('react');
const ReactDOM = require('react-dom/lib/ReactDOM');
const { connect } = require('react-redux');
const ImageStage = require('./image_stage');
const ImageList = require("./image_list");
const Controls = require("./controls");
const _ = require('lodash');

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
    actions: {

    }
  }
};

class ExposureApp extends React.Component {
  static propTypes = {
    frames: React.PropTypes.array,
    currentFrame: React.PropTypes.array
  }

  render() {
    <div id="main" className="no-buffer">
      <div id="top" className="no-buffer">
        <div id="logo" className="no-buffer"></div>
      </div>
      <div id="middle" className="no-buffer">
        <div id="images" className="no-buffer">
          <ImageList
            frames={imageCollection.frames}
            selectedFrame={frame}
            fileSelectCallback={imageCollection.handleImageLoad}
            frameSelectCallback={imageCollection.selectFrame}
          />
        </div>
        <div id="current-image" className="no-buffer">
          <ImageStage
            fileSelectCallback={imageCollection.handleImageLoad}
            selectedFrame={null}
            webGLSupported={Modernizr.webgl}
            loading={true}
          />
        </div>
        <div id="controls" className="no-buffer">
          <Controls onControlChange={onControlChange} frame={frame}/>
        </div>
      </div>
    </div>
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExposureApp);
