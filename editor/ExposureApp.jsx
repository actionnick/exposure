const React = require("react");
const { connect } = require("react-redux");
const ImageStage = require("./ImageStage.jsx");
const ImageList = require("./ImageList.jsx");
const Controls = require("./Controls.jsx");
const BeforeAfterButton = require("./BeforeAfterButton.jsx");
const _ = require("lodash");
const uuid = require("uuid");
const Frame = require("../src/frame");
const ExposureSettings = require("../src/exposure_settings");
const JsonEditor = require("./JsonEditor.jsx");

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
      addPoint: (x, y, controlPointsIdentifier) =>
        dispatch({ type: "ADD_POINT", x, y, controlPointsIdentifier }),
      moveControlPoint: (index, x, y, controlPointsIdentifier) =>
        dispatch({ type: "MOVE_CONTROL_POINT", index, x, y, controlPointsIdentifier }),
      removeControlPoint: (index, controlPointsIdentifier) =>
        dispatch({ type: "REMOVE_CONTROL_POINT", index, controlPointsIdentifier }),
      addSettings: () => dispatch({ type: "SETTINGS_ADDED", settings: new ExposureSettings() }),
      changeSettings: index => dispatch({ type: "SETTINGS_CHANGED", index }),
      showBefore: () => dispatch({ type: "SHOW_BEFORE" }),
      showAfter: () => dispatch({ type: "SHOW_AFTER" }),
      setSettings: json => dispatch({ type: "SET_SETTINGS", settings: new ExposureSettings(json) }),
    },
  };
};

class ExposureApp extends React.Component {
  static propTypes = {
    frames: React.PropTypes.array,
    selectedFrame: React.PropTypes.object,
    settings: React.PropTypes.array,
    currentSettings: React.PropTypes.object,
  };

  getDownloadButton() {
    if (!this.props.selectedFrame) return null;

    return (
      <div className="top-button">
        <i
          onClick={() => this.props.selectedFrame.download()}
          className="fa fa-floppy-o clickable"
          aria-hidden="true"
        />
      </div>
    );
  }

  render() {
    const {
      frames,
      selectedFrame,
      actions,
      currentSettings,
      showBefore,
      settingsJson,
    } = this.props;

    return (
      <div id="main" className="no-buffer">
        <div id="top" className="no-buffer">
          <div id="logo" className="no-buffer" />
          <BeforeAfterButton
            actions={actions}
            showBefore={showBefore}
            selectedFrame={selectedFrame}
          />
          {this.getDownloadButton()}
          <JsonEditor actions={actions} selectedFrame={selectedFrame} />
        </div>
        <div id="middle" className="no-buffer">
          <ImageList frames={frames} selectedFrame={selectedFrame} actions={actions} />
          <div id="current-image" className="no-buffer">
            <ImageStage
              actions={actions}
              selectedFrame={selectedFrame}
              webGLSupported={Modernizr.webgl}
              showBefore={showBefore}
            />
          </div>

          <Controls frame={selectedFrame} settings={currentSettings} actions={actions} />
        </div>
      </div>
    );
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ExposureApp);
