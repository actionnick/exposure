var React = require("react");
var FileInput = require("react-file-input");
var Modal = require("react-modal");

class ImageStage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showJSON: false
    }
  }

  showJSON() {
    this.setState({
      showJSON: true
    });
  }

  hideJSON() {
    this.setState({
      showJSON: false
    });
  }

  componentDidUpdate() {
    var frame = this.props.selectedFrame;
    if (frame) {
      var canvas = frame.canvas;
      canvas.className = "current-canvas";
      this.refs.container.getDOMNode().appendChild(frame.canvas);
    }
  }

  fileUpload(e) {
    this.refs.fileInput.getDOMNode().click();
    e.preventDefault();
  }

  fileDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    var dt = e.dataTransfer;
    var files = dt.files;

    this.props.fileSelectCallback({target: {files: files}});
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
        <Modal
          isOpen={true}
          className="about_modal"
        >
          <h3>Oops! It doesn't seem like your browser supports webGL!</h3>
          <p>You should download one of these browsers. Your life will be better</p>
          <iframe className="browser-download" src="http://outdatedbrowser.com/en"></iframe>
        </Modal>
      )
    } else if (this.props.loading) {
      return (
        <div id="image-container" className="editing">
          <img id="loading-icon" src={"assets/color_aperture.svg"} />
        </div>
      )
    } else if (this.props.selectedFrame) {
      var frame = this.props.selectedFrame;
      return (
        <div style={{width: "100%", height: "100%"}}>
          <img className="toJSON" src="assets/tojson.svg" onClick={this.showJSON.bind(this)}/>
          <div key={frame.key} id="image-container" className="padding editing" ref="container"></div>
          <Modal
            isOpen={this.state.showJSON}
            className="about_modal"
          >
            <img id="close" onClick={this.hideJSON.bind(this)} src="../assets/x.svg"/>
            <h3>JSON</h3>
            <p>You can save this filter in its JSON form and use it to initialize exposure in your app. More about that can be found <a href="https://github.com/actionnick/exposure#usage" target="_blank">here</a>.</p>
            <pre id="json-output">{vkbeautify.json(JSON.stringify(frame.settings.json), 2)}</pre>
          </Modal>
        </div>
      );
    } else {
      return (
        <div id="image-container" >
          <input ref="fileInput" id="file-upload" type="file" onChange={this.props.fileSelectCallback}></input>
          <div id="file-upload-area" draggable='true' 
            onClick={this.fileUpload.bind(this)} 
            onDragEnter={this.fileEnter.bind(this)}
            onDragOver={this.fileOver.bind(this)}
            onDrop={this.fileDrop.bind(this)} 
          >
            <img id="file-upload-icon" src={"assets/photo_upload_big.svg"} />
          </div>
        </div>
      );
    }
  }
}

ImageStage.propTypes = {
  selectedFrame: React.PropTypes.object,
  fileSelectCallback: React.PropTypes.func,
  webGLSupported: React.PropTypes.bool,
  loading: React.PropTypes.bool
};

module.exports = ImageStage;
