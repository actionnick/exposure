var React = require("react");
var _ = require("lodash");

class ImageList extends React.Component {
  getImages() {
    var imageStyle = {
      width: "100%"
    };
    var selectedKey = this.props.selectedFrame.key;
    var self = this;
    return _.map(this.props.frames, function(frame) {
      return <img 
        style={imageStyle} 
        key={frame.key} 
        src={frame.img.src} 
        onClick={self.props.frameSelectCallback.bind(undefined, frame.key)}/>
    }); 
  }

  render() {
    var divStyle = {
      width: "100%",
      height: "100%"
    };
    var images = this.getImages();
    return (
      <div style={divStyle}>
        {images}
        <input id="file-upload" type="file" onChange={this.props.fileSelectCallback}></input>
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
