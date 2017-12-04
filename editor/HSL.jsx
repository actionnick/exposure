const React = require("react");
const ReactSlider = require("react-slider");
const ExposureSettings = require("../src/exposure_settings");

const COLORS = ["cyans", "magentas", "yellows", "reds", "greens", "blues"];
const CONTROLS = ["hue", "saturation"];

class HSL extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentColor: "cyans",
    };
  }

  static propTypes = {
    frame: React.PropTypes.object,
    settings: React.PropTypes.object,
    actions: React.PropTypes.object.isRequired,
  };

  handleColorChange(event) {
    this.setState({ currentColor: event.target.value });
  }

  handleChange(key, value) {
    this.props.actions.onControlChange(key, value / 100);
  }

  render() {
    const s = this.props.settings;

    return (
      <div className="controls-section">
        <h1>HSL</h1>
        <h2>Master</h2>
        <div className="slider-layout">
          <p>hue</p>
          <div className="slider-container centering-parent">
            <ReactSlider
              onChange={this.handleChange.bind(this, "hue")}
              min={-50}
              max={50}
              value={s.hue * 100}
            />
          </div>
        </div>

        <div className="slider-layout">
          <p>saturation</p>
          <div className="slider-container centering-parent">
            <ReactSlider
              onChange={this.handleChange.bind(this, "saturation")}
              min={-100}
              max={100}
              value={s.saturation * 100}
            />
          </div>
        </div>

        <div className="slider-layout">
          <p>lightness</p>
          <div className="slider-container centering-parent">
            <ReactSlider
              onChange={this.handleChange.bind(this, "lightness")}
              min={-100}
              max={100}
              value={s.lightness * 100}
            />
          </div>
        </div>

        <select
          name="colors"
          value={this.state.currentColor}
          onChange={event => this.handleColorChange(event)}
          className={this.state.currentColor}
        >
          {COLORS.map(color => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>

        {CONTROLS.map(control => (
          <div key={`${control}-${this.state.currentColor}`} className="slider-layout">
            <p>{control}</p>
            <div className="slider-container centering-parent">
              <ReactSlider
                onChange={this.handleChange.bind(this, `${this.state.currentColor}_${control}`)}
                min={ExposureSettings.PROPS[`${this.state.currentColor}_${control}`].min * 100}
                max={ExposureSettings.PROPS[`${this.state.currentColor}_${control}`].max * 100}
                value={s[`${this.state.currentColor}_${control}`] * 100}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

module.exports = HSL;
