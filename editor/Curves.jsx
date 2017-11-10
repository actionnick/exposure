const React = require("react");
const _ = require("lodash");

class Curves extends React.Component {
  static propTypes = {
    frame: React.PropTypes.object,
    actions: React.PropTypes.object.isRequired,
  };

  getGrid() {
    const points = [
      // vertical
      [256, 256, 0, 1024],
      [512, 512, 0, 1024],
      [768, 768, 0, 1024],

      // horizontal
      [0, 1024, 256, 256],
      [0, 1024, 512, 512],
      [0, 1024, 768, 768],
    ];

    return points.map(([x1, x2, y1, y2], index) => (
      <line
        key={index}
        x1={`${x1}`}
        x2={`${x2}`}
        y1={`${y1}`}
        y2={`${y2}`}
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="square"
      />
    ));
  }

  getControlPoints() {
    const settings = this.props.frame.settings;

    return settings.rgb_curves.map(([x, y], index) => (
      <circle
        key={`${x}${y}${index}`}
        cx={`${x}`}
        cy={`${1024 - y}`}
        r="20"
        fill="white"
        stroke="black"
        strokeWidth="5"
      />
    ));
  }

  getPlotPoints() {
    const settings = this.props.frame.settings;

    if (_.isEmpty(settings.rgb_curve_points)) {
      return <line x1="0" x2="1024" y1="1024" y2="0" stroke="white" strokeWidth="5" />;
    }
  }

  render() {
    return (
      <svg
        version="1.1"
        baseProfile="full"
        width="100%"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="rgbGradient" x1="0" x2="1" y1="1" y2="0">
            <stop offset="0%" stopColor="#333333" />
            <stop offset="100%" stopColor="#CCCCCC" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#rgbGradient)" />

        {this.getGrid()}
        {this.getPlotPoints()}
        {this.getControlPoints()}
      </svg>
    );
  }
}

module.exports = Curves;
