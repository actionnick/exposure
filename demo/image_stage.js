var React = require("react");

class ImageStage extends React.Component {
  componentDidUpdate() {
    var frame = this.props.selectedFrame;
    if (frame) {
      var canvas = frame.canvas;
      canvas.className = "current-canvas";
      this.refs.container.getDOMNode().appendChild(frame.canvas);
    }
  }

  render() {
    if (this.props.selectedFrame) {
      return (
        <div key={this.props.selectedFrame.key} id="image-container" ref="container">
        </div>
      );
    } else {
      return (
        <div id="image-container">
          <input id="file-upload" type="file" onChange={this.props.fileSelectCallback}></input>
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
