var React = require("react");
var _ = require("lodash");

class ImageList extends React.Component {
  fileUpload(e) {
    this.refs.fileInput.getDOMNode().click();
    e.preventDefault();
  }

  getImages() {
    if (_.isEmpty(this.props.frames)) {
      return null;
    }

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
    var images = this.getImages();
    return (
      <div id="image-list">
        <input ref="fileInput" id="file-upload" type="file" onChange={this.props.fileSelectCallback}></input>
        {images}
        <div id='list-item-container' style={{height: "75px"}}>
          <img onClick={event => this.fileUpload(event)} id="side-file-upload-icon" src={"assets/photo_upload_small.svg"} />
        </div>
      </div>
    );
  }
}

ImageList.propTypes = {
  frames: React.PropTypes.array,
  selectedFrame: React.PropTypes.object,
  fileSelectCallback: React.PropTypes.func,
  frameSelectCallback: React.PropTypes.func
};

module.exports = ImageList;
