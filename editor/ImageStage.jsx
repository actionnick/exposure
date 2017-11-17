const React = require("react");
const FileInput = require("react-file-input");
const Modal = require("react-modal");

class ImageStage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showJSON: false,
    };
  }

  static propTypes = {
    selectedFrame: React.PropTypes.object,
    fileSelectCallback: React.PropTypes.func,
    webGLSupported: React.PropTypes.bool,
    loading: React.PropTypes.bool,
  };

  showJSON() {
    this.setState({
      showJSON: true,
    });
  }

  hideJSON() {
    this.setState({
      showJSON: false,
    });
  }

  componentDidUpdate() {
    var frame = this.props.selectedFrame;
    if (frame) {
      var canvas = frame.canvas;
      canvas.className = "current-canvas";
      this.container.appendChild(frame.canvas);
    }
  }

  fileUpload(e) {
    this.fileInput.click();
    e.preventDefault();
  }

  fileDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    const file = e.target.files[0];

    this.props.actions.initNewFrame(file);
  }

  fileEnter(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  fileOver(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    if (!this.props.webGLSupported) {
      return (
        <Modal isOpen={true} className="about_modal" contentLabel="Oops!">
          <h3>Oops! It doesn't seem like your browser supports webGL!</h3>
          <p>You should download one of these browsers. Your life will be better</p>
          <iframe className="browser-download" src="http://outdatedbrowser.com/en" />
        </Modal>
      );
    } else if (this.props.loading) {
      return (
        <div id="image-container" className="editing">
          <img id="loading-icon" src={"assets/color_aperture.svg"} />
        </div>
      );
    } else if (this.props.selectedFrame) {
      var frame = this.props.selectedFrame;
      return (
        <div style={{ width: "100%", height: "100%" }}>
          <img className="toJSON" src="assets/tojson.svg" onClick={this.showJSON.bind(this)} />
          <div
            key={frame.key}
            id="image-container"
            className="padding editing"
            ref={container => (this.container = container)}
          />

          <Modal isOpen={this.state.showJSON} className="about_modal" contentLabel="JSON">
            <img id="close" onClick={this.hideJSON.bind(this)} src="assets/x.svg" />
            <h3>JSON</h3>
            <p>
              You can save this filter in its JSON form and use it to initialize exposure in your
              app. More about that can be found{" "}
              <a href="https://github.com/actionnick/exposure#usage" target="_blank">
                here
              </a>.
            </p>
            <pre id="json-output">{vkbeautify.json(JSON.stringify(frame.settings.json), 2)}</pre>
          </Modal>
        </div>
      );
    } else {
      return (
        <div id="image-container">
          <input
            ref={fileInput => (this.fileInput = fileInput)}
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={e => this.fileDrop(e)}
          />
          <div
            id="file-upload-area"
            draggable="true"
            onClick={e => this.fileUpload(e)}
            onDragEnter={e => this.fileEnter(e)}
            onDragOver={e => this.fileOver(e)}
            onDrop={e => this.fileDrop(e)}
          >
            <img id="file-upload-icon" src={"assets/photo_upload_big.svg"} />
          </div>
        </div>
      );
    }
  }
}

module.exports = ImageStage;
