const React = require("react");
const _ = require("lodash");
const ReactSlider = require("react-slider");

const COLORS = [
  "cyans",
  "magentas",
  "yellows",
  "blacks",
  "reds",
  "greens",
  "blues",
  "grays",
  "whites",
];
const SHIFTABLE = ["cyan", "magenta", "yellow", "black", "red", "green", "blue", "white", "gray"];

class SelectiveColors extends React.Component {
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
      <div className="selective-colors">
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

        {SHIFTABLE.map(color => (
          <div key={`${color}-${this.state.currentColor}`} className="slider-layout">
            <p>{color}</p>
            <div className="slider-container centering-parent">
              <ReactSlider
                onChange={this.handleChange.bind(this, `${this.state.currentColor}_${color}_shift`)}
                min={0}
                max={100}
                defaultValue={s[`${this.state.currentColor}_${color}_shift`] * 100}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

module.exports = SelectiveColors;
