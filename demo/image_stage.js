var React = require("react");
var FileInput = require("react-file-input");

class ImageStage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
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
    if (this.props.selectedFrame) {
      return (
        <div key={this.props.selectedFrame.key} id="image-container" className="padding editing" ref="container"></div>
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
  fileSelectCallback: React.PropTypes.func
};

module.exports = ImageStage;
