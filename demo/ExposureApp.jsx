const React = require('react');
const ReactDOM = require('react-dom/lib/ReactDOM');
const { connect } = require('react-redux');
const ImageStage = require('./image_stage');
const ImageList = require("./image_list");
const Controls = require("./controls");
const _ = require('lodash');
const uuid = require('uuid');
const Frame = require('../src/frame');

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      startImageLoad: () => dispatch({ type: 'START_IMAGE_LOAD' }),
      imageLoaded: img => {
        new Frame(img, {
          callback: frame => dispatch({ type: 'FRAME_INITIATED', frame })
        });
      },
      frameSelected: key => dispatch({ type: 'FRAME_SELECTED', key })
    }
  }
};

class ExposureApp extends React.Component {
  static propTypes = {
    frames: React.PropTypes.array,
    selectedFrame: React.PropTypes.object
  }

  render() {
    const { frames, selectedFrame, actions } = this.props;

    return (
      <div id="main" className="no-buffer">
        <div id="top" className="no-buffer">
          <div id="logo" className="no-buffer"></div>
        </div>
        <div id="middle" className="no-buffer">
          <div id="images" className="no-buffer">
            <ImageList
              frames={frames}
              selectedFrame={selectedFrame}
              actions={actions}
            />
          </div>
          <div id="current-image" className="no-buffer">
            <ImageStage
              actions={actions}
              selectedFrame={selectedFrame}
              webGLSupported={Modernizr.webgl}
            />
          </div>
          <div id="controls" className="no-buffer">
            <Controls onControlChange={() => {}} frame={selectedFrame} actions={actions} />
          </div>
        </div>
      </div>
    );
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExposureApp);
