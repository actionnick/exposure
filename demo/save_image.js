var React = require("react");
var mui = require("material-ui");
var FlatButton = mui.FlatButton;
var Dialog = mui.Dialog;
var ThemeManager = new mui.Styles.ThemeManager();

class SaveImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {imgBlob: null};
  }

  get onDownload() {
    if (!this._onDownload) {
      this._onDownload = function() {
        var canvas = this.props.canvas;
        var imgBlob = canvas.toDataURL('image/png');   
        var img = document.createElement("img");
        img.src = imgBlob;
        document.body.appendChild(img);    
        // this.refs.imageDialog.show();
        // this.setState({imgBlob: imgBlob});
      }.bind(this);
    }
    return this._onDownload;
  }

  get closeDialog() {
    if (!this._closeDialog) {
      this._closeDialog = function() {
        this.refs.imageDialog.dismiss();
        this.setState({imgBlob: null});
      }.bind(this);
    }

    return this._closeDialog;
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  render() {
    var actions = [
      <FlatButton key="close_image_modal" label="Close" secondary={true} onTouchTap={this.closeDialog} />
    ];
    var imgStyle = {
      maxHeight: "100%",
      maxWidth: "100%",
      marginLeft: "auto",
      marginRight: "auto"
    };

    return (
      <div>
        <FlatButton label="Save Image" onClick={this.onDownload}/>
        <Dialog ref="imageDialog" actions={actions} autoDetectWindowHeight={true} autoScrollBodyContent={true}>
            <img style={imgStyle} src={this.state.imgBlob}/>
        </Dialog>
      </div>
    );
  }
}

SaveImage.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = SaveImage;
