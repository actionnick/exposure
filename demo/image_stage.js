var React = require("react");

class ImageStage extends React.Component {
  componentDidUpdate() {
    if (this.props.imageSelected) {
      this.props.canvasReadyCallback(this.refs.canvas.getDOMNode());
    }
  }

  render() {
    if (this.props.imageSelected) {
      var divStyle = {
        width: "100%",
        height: "100%",
        textAlign: "center"
      };
      var canvasStyle = {
        maxHeight: "100%",
        maxWidth: "100%",
        marginLeft: "auto",
        marginRight: "auto"
      };
      return (
        <div style={divStyle}>
          <canvas style={canvasStyle} ref="canvas"/>
        </div>
      );
    } else {
      return (
        <input type="file" onChange={this.props.fileSelectCallback}></input>
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
