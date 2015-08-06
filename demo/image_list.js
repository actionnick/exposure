var React = require("react");

class ImageList extends React.Component {
  render() {
    return <div></div>;
  }
}

ImageList.propTypes = {
  currentGrouping: React.PropTypes.object,
  fileSelectCallback: React.PropTypes.func
};

module.exports = ImageList;
