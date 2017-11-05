const ReactSlider = require("react-slider");

class Controls extends React.Component {
  static propTypes = {
    onControlhange: React.PropTypes.func,
    frame: React.PropTypes.object
  }

  handleChange(key, value) {
    if (value.length) {
      this.props.onControlChange(key + "min", value[0] / 100);
      this.props.onControlChange(key + "max", value[1] / 100);
    } else {
      this.props.onControlChange(key, value / 100);
    }
  }

  get divStyle() {
    return {
      height: "100%",
      overflowY: "scroll",
      textAlign: "center"
    }
  }

  render() {
    if (!this.props.frame) {
      return null;
    }

    var s = this.props.frame.settings;
    var p = s.PROPS;
    return (
      <div id='controls' className='no-buffer'>
        <div className="controls-section">
          <h1>general</h1>

          <div className="slider-layout">
            <p>brightness</p>
            <div className="slider-container centering-parent">
              <ReactSlider onChange={this.handleChange.bind(this, "brightness")}  min={0} max={200} defaultValue={s.brightness * 100} />
            </div>
          </div>

          <div className="slider-layout">
            <p>contrast</p>
            <div className="slider-container centering-parent">
              <ReactSlider onChange={this.handleChange.bind(this, "contrast")}  min={0} max={300} defaultValue={s.contrast * 100} />
            </div>
          </div>
        </div>

        <div className="controls-section">
          <h1>levels</h1>
          <h2>rgb</h2>
          <div className="slider-layout">
            <p>in</p>
            <div className="slider-container centering-parent">
              <ReactSlider onChange={this.handleChange.bind(this, "rgb_in_")}  min={0} max={100} defaultValue={[s.rgb_in_min * 100, s.rgb_in_max * 100]} />
            </div>
          </div>
          <div className="slider-layout">
            <p>out</p>
            <div className="slider-container centering-parent">
              <ReactSlider onChange={this.handleChange.bind(this, "rgb_out_")}  min={0} max={100} defaultValue={[s.rgb_out_min * 100, s.rgb_out_max * 100]} />
            </div>
          </div>
          <div className="slider-layout">
            <p>gamma</p>
            <div className="slider-container centering-parent">
              <ReactSlider onChange={this.handleChange.bind(this, "rgb_gamma")}  min={0} max={1000} defaultValue={s.rgb_gamma * 100} />
            </div>
          </div>

          <h2>red</h2>
          <div className="slider-layout">
            <p>in</p>
            <div className="slider-container centering-parent">
              <ReactSlider className="slider red-slider" onChange={this.handleChange.bind(this, "r_in_")}  min={0} max={100} defaultValue={[s.r_in_min * 100, s.r_in_max * 100]} />
            </div>
          </div>
          <div className="slider-layout">
            <p>out</p>
            <div className="slider-container centering-parent">
              <ReactSlider className="slider red-slider" onChange={this.handleChange.bind(this, "r_out_")}  min={0} max={100} defaultValue={[s.r_out_min * 100, s.r_out_max * 100]} />
            </div>
          </div>
          <div className="slider-layout">
            <p>gamma</p>
            <div className="slider-container centering-parent">
              <ReactSlider className="slider red-slider" onChange={this.handleChange.bind(this, "r_gamma")}  min={0} max={1000} defaultValue={s.r_gamma * 100} />
            </div>
          </div>

          <h2>green</h2>
          <div className="green slider-layout">
            <p>in</p>
            <div className="slider-container centering-parent">
              <ReactSlider className="slider green-slider" onChange={this.handleChange.bind(this, "g_in_")}  min={0} max={100} defaultValue={[s.g_in_min * 100, s.g_in_max * 100]} />
            </div>
          </div>
          <div className="green slider-layout">
            <p>out</p>
            <div className="slider-container centering-parent">
              <ReactSlider className="slider green-slider" onChange={this.handleChange.bind(this, "g_out_")}  min={0} max={100} defaultValue={[s.g_out_min * 100, s.g_out_max * 100]} />
            </div>
          </div>
          <div className="green slider-layout">
            <p>gamma</p>
            <div className="slider-container centering-parent">
              <ReactSlider className="slider green-slider" onChange={this.handleChange.bind(this, "g_gamma")}  min={0} max={1000} defaultValue={s.g_gamma * 100} />
            </div>
          </div>

          <h2>blue</h2>
          <div className="slider-layout">
            <p>in</p>
            <div className="slider-container centering-parent">
              <ReactSlider className="slider blue-slider" onChange={this.handleChange.bind(this, "b_in_")}  min={0} max={100} defaultValue={[s.b_in_min * 100, s.b_in_max * 100]} />
            </div>
          </div>
          <div className="slider-layout">
            <p>out</p>
            <div className="slider-container centering-parent">
              <ReactSlider className="slider blue-slider" onChange={this.handleChange.bind(this, "b_out_")}  min={0} max={100} defaultValue={[s.b_out_min * 100, s.b_out_max * 100]} />
            </div>
          </div>
          <div className="slider-layout">
            <p>gamma</p>
            <div className="slider-container centering-parent">
              <ReactSlider className="slider blue-slider" onChange={this.handleChange.bind(this, "b_gamma")}  min={0} max={1000} defaultValue={s.b_gamma * 100} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Controls;
