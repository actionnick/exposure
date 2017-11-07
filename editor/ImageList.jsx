var React = require("react");
var _ = require("lodash");

class ImageList extends React.Component {
  static propTypes = {
    frames: React.PropTypes.array,
    selectedFrame: React.PropTypes.object,
    fileSelectCallback: React.PropTypes.func,
    frameSelectCallback: React.PropTypes.func
  }

  fileUpload(e) {
    this.fileInput.click();
    e.preventDefault();
  }

  getImages() {
    var selectedKey = this.props.selectedFrame.key;
    return _.map(this.props.frames, frame => (
      <div id='list-item-container' key={frame.key}>
        <img id="image-list-item"
          className={frame.key === selectedKey ? 'selected' : 'not-selected'}
          key={frame.key}
          src={frame.thumbnail.src}
          onClick={() => this.props.actions.frameSelected(frame.key)}
        />
      </div>
    ));
  }

  render() {
    if (_.isEmpty(this.props.frames)) {
      return null;
    }

    var images = this.getImages();

    return (
      <div id="images" className="no-buffer">
        <div id="image-list">
          <input
            ref={fileInput => this.fileInput = fileInput}
            id="file-upload"
            type="file"
            onChange={event => this.props.actions.initNewFrame(event.target.files[0])}
          />
          {images}
          <div id='list-item-container' style={{height: "75px"}}>
            <img onClick={event => this.fileUpload(event)} id="side-file-upload-icon" src={"assets/photo_upload_small.svg"} />
          </div>
        </div>
      </div>
    );
  }
}

module.exports = ImageList;
