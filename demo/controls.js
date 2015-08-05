var React = require("react");

class Controls extends React.Component {
  get handleChange() {
    if (!this._handleChange) {
      this._handleChange = function(event) {
        var target = event.target;
        var key = target.id;
        var value = target.value / 100;
        this.props.onControlChange(key, value);
      }.bind(this);
    }
    return this._handleChange; 
  }

  get divStyle() {
    return {
      height: "100%",
      overflowY: "scroll",
      textAlign: "center"
    }
  }

  render() {
    var s = this.props.settings;
    var p = this.props.settings.PROPS;
    return (
      <div style={this.divStyle}>
        <p>brightness</p>
        <input id="brightness" onChange={this.handleChange} type="range" min="0" max="200" defaultValue={s.brightness * 100}/>
        <p>contrast</p>
        <input id="contrast" onChange={this.handleChange} type="range" min="0" max="300" defaultValue={s.contrast * 100}/>
        <input id="mid" onChange={this.handleChange} type="range" min="0" max="100" defaultValue={s.mid * 100}/>
        <p>levels</p>
        <p>rgb levels</p>
        <input id="rgb_in_min" onChange={this.handleChange} type="range" min="0" max="100" defaultValue={s.rgb_in_min * 100}/>
        <input id="rgb_in_max" onChange={this.handleChange} type="range" min="0" max="100" defaultValue={s.rgb_in_max * 100}/>
        <input id="rgb_out_min" onChange={this.handleChange} type="range" min="0" max="100" defaultValue={s.rgb_out_min * 100}/>
        <input id="rgb_out_max" onChange={this.handleChange} type="range" min="0" max="100" defaultValue={s.rgb_out_max * 100}/>
        <input id="rgb_gamma" onChange={this.handleChange} type="range" min="0" max="1000" defaultValue={s.rgb_gamma * 100}/>
        <p>red levels</p>
        <input id="r_in_min" onChange={this.handleChange} type="range" min="0" max="100" defaultValue={s.r_in_min * 100}/>
        <input id="r_in_max" onChange={this.handleChange} type="range" min="0" max="100" defaultValue={s.r_in_max * 100}/>
        <input id="r_out_min" onChange={this.handleChange} type="range" min="0" max="100" defaultValue={s.r_out_min * 100}/>
        <input id="r_out_max" onChange={this.handleChange} type="range" min="0" max="100" defaultValue={s.r_out_max * 100}/>
        <input id="r_gamma" onChange={this.handleChange} type="range" min="0" max="1000" defaultValue={s.r_gamma * 100}/>
        <p>green levels</p>
        <input id="g_in_min" onChange={this.handleChange} type="range" min="0" max="100" defaultValue={s.g_in_min * 100}/>
        <input id="g_in_max" onChange={this.handleChange} type="range" min="0" max="100" defaultValue={s.g_in_max * 100}/>
        <input id="g_out_min" onChange={this.handleChange} type="range" min="0" max="100" defaultValue={s.g_out_min * 100}/>
        <input id="g_out_max" onChange={this.handleChange} type="range" min="0" max="100" defaultValue={s.g_out_max * 100}/>
        <input id="g_gamma" onChange={this.handleChange} type="range" min="0" max="1000" defaultValue={s.g_gamma * 100}/>
        <p>blue levels</p>
        <input id="b_in_min" onChange={this.handleChange} type="range" min="0" max="100" defaultValue={s.b_in_min * 100}/>
        <input id="b_in_max" onChange={this.handleChange} type="range" min="0" max="100" defaultValue={s.b_in_max * 100}/>
        <input id="b_out_min" onChange={this.handleChange} type="range" min="0" max="100" defaultValue={s.b_out_min * 100}/>
        <input id="b_out_max" onChange={this.handleChange} type="range" min="0" max="100" defaultValue={s.b_out_max * 100}/>
        <input id="b_gamma" onChange={this.handleChange} type="range" min="0" max="1000" defaultValue={s.b_gamma * 100}/>
      </div>
    );
  }
}

Controls.propTypes = {
  onControlhange: React.PropTypes.func,
  settings: React.PropTypes.object
};

module.exports = Controls;
