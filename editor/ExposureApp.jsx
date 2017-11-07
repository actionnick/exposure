const React = require("react");
const { connect } = require("react-redux");
const ImageStage = require("./ImageStage.jsx");
const ImageList = require("./ImageList.jsx");
const Controls = require("./Controls.jsx");
const _ = require("lodash");
const uuid = require("uuid");
const Frame = require("../src/frame");

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      initNewFrame: file => {
        dispatch({ type: "START_IMAGE_LOAD" });

        const reader = new FileReader();
        reader.onload = event => {
          var img = new Image();
          img.onload = () => {
            new Frame(img, {
              callback: frame => dispatch({ type: "FRAME_INITIATED", frame }),
            });
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      },
      frameSelected: key => dispatch({ type: "FRAME_SELECTED", key }),
      onControlChange: (key, value) => dispatch({ type: "INPUTS_CHANGED", key, value }),
    },
  };
};

class ExposureApp extends React.Component {
  static propTypes = {
    frames: React.PropTypes.array,
    selectedFrame: React.PropTypes.object,
  };

  render() {
    const { frames, selectedFrame, actions } = this.props;

    return (
      <div id="main" className="no-buffer">
        <div id="top" className="no-buffer">
          <div id="logo" className="no-buffer" />
        </div>
        <div id="middle" className="no-buffer">
          <ImageList frames={frames} selectedFrame={selectedFrame} actions={actions} />
          <div id="current-image" className="no-buffer">
            <ImageStage
              actions={actions}
              selectedFrame={selectedFrame}
              webGLSupported={Modernizr.webgl}
            />
          </div>

          <Controls onControlChange={() => {}} frame={selectedFrame} actions={actions} />
        </div>
      </div>
    );
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ExposureApp);
