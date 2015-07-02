var React = require("react");

class Controls extends React.Component {
  handleChange(event) {
    var target = event.target;
    var key = target.id;
    var value = target.value / 100;
    this.props.onControlChange(key, value);
  }

  render() {
    var settings = this.props.exposureSettings;
    return (
      <div>
        <input id="brightness" onChange={this.handleChange.bind(this)} type="range" min="0" max="200" defaultValue={settings.brightness * 100}/>
        <input id="contrast" onChange={this.handleChange.bind(this)} type="range" min="0" max="300" defaultValue={settings.contrast * 100}/>
        <input id="mid" onChange={this.handleChange.bind(this)} type="range" min="0" max="100" defaultValue={settings.mid * 100}/>
      </div>
    );
  }
}

Controls.propTypes = {
  onControlChange: React.PropTypes.func,
  exposureSettings: React.PropTypes.object
};

module.exports = Controls;
