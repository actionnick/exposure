var React = require("react");

class ImageStage extends React.Component {
  componentDidUpdate() {
    if (this.props.imageSelected) {
      this.props.canvasReadyCallback(this.refs.canvas.getDOMNode());
    }
  }

  render() {
    if (this.props.imageSelected) {
      var canvasStyle = {
        maxHeight: "100%",
        maxWidth: "100%",
        marginLeft: "auto",
        marginRight: "auto"
      };
      return (
        <div id="image-container">
          <canvas id="image-container-element" style={canvasStyle} ref="canvas"/>
        </div>
      );
    } else {
      return (
        <div id="image-container">
          <input id="image-container-element" type="file" onChange={this.props.fileSelectCallback}></input>
        </div>
      );
    }
  }
}

ImageStage.propTypes = {
  imageSelected: React.PropTypes.bool,
  fileSelectCallback: React.PropTypes.func,
  canvasReadyCallback: React.PropTypes.func
};

ImageStage.defaultProps = {
  imageSelected: false
};

module.exports = ImageStage;
