const React = require("react");
const _ = require("lodash");

const SETTINGS = {
  rgb: {
    stopColor: "#CCCCCC",
    controlPointsIdentifier: "rgb_curves",
    pointsIdentifier: "rgb_curve_points",
  },
  r: {
    stopColor: "#c72a2a",
    controlPointsIdentifier: "r_curves",
    pointsIdentifier: "r_curve_points",
  },
  g: {
    stopColor: "#3e9e3e",
    controlPointsIdentifier: "g_curves",
    pointsIdentifier: "g_curve_points",
  },
  b: {
    stopColor: "#3e569e",
    controlPointsIdentifier: "b_curves",
    pointsIdentifier: "b_curve_points",
  },
};

class Curves extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clickedPoint: null,
    };
  }

  static propTypes = {
    settings: React.PropTypes.object,
    actions: React.PropTypes.object.isRequired,
    color: React.PropTypes.string.isRequired,
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

  onControlPointDown(event, index) {
    event.stopPropagation();
    this.setState({ clickedPoint: index });
  }

  onControlPointUp(event, index) {
    event.stopPropagation();
    this.setState({ clickedPoint: null });
  }

  getControlPoints() {
    const settings = this.props.settings;
    const controlPointsIdentifier = SETTINGS[this.props.color].controlPointsIdentifier;

    return settings[controlPointsIdentifier].map(([x, y], index) => (
      <circle
        onClick={event => event.stopPropagation()}
        onMouseDown={event => this.onControlPointDown(event, index)}
        onMouseUp={event => this.onControlPointUp(event, index)}
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
    const settings = this.props.settings;
    const pointsIdentifier = SETTINGS[this.props.color].pointsIdentifier;

    if (_.isEmpty(settings[pointsIdentifier])) {
      return <line x1="0" x2="1024" y1="1024" y2="0" stroke="white" strokeWidth="5" />;
    }

    return settings[pointsIdentifier].map((y, x) => (
      <circle key={`${x}${y}`} cx={`${x}`} cy={`${1024 - y}`} r="2" fill="black" />
    ));
  }

  moveControlPoint(event) {
    if (_.isNumber(this.state.clickedPoint)) {
      const { x, y } = this.convertToLocalCoords(event.clientX, event.clientY);
      this.props.actions.moveControlPoint(
        this.state.clickedPoint,
        x,
        y,
        SETTINGS[this.props.color].controlPointsIdentifier
      );
    }
  }

  removeControlPoint(event) {
    if (_.isNumber(this.state.clickedPoint)) {
      this.setState({ clickedPoint: null });
      this.props.actions.removeControlPoint(
        this.state.clickedPoint,
        SETTINGS[this.props.color].controlPointsIdentifier
      );
    }
  }

  handleClick(event) {
    const { x, y } = this.convertToLocalCoords(event.clientX, event.clientY);
    this.props.actions.addPoint(x, y, SETTINGS[this.props.color].controlPointsIdentifier);
  }

  // Takes screen coordinates and converts them to local coords
  convertToLocalCoords(x, y) {
    this.pt.x = x;
    this.pt.y = y;

    // The cursor point, translated into svg coordinates
    const local = this.pt.matrixTransform(this.svg.getScreenCTM().inverse());
    return {
      x: local.x,
      y: 1024 - local.y,
    };
  }

  render() {
    const color = this.props.color;
    return (
      <svg
        ref={svg => {
          if (svg) {
            this.svg = svg;
            this.pt = svg.createSVGPoint();
          }
        }}
        version="1.1"
        baseProfile="full"
        width="100%"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        onClick={event => this.handleClick(event)}
        onMouseMove={event => this.moveControlPoint(event)}
        onMouseLeave={event => this.removeControlPoint(event)}
      >
        <defs>
          <linearGradient id={`${color}-gradient`} x1="0" x2="1" y1="1" y2="0">
            <stop offset="0%" stopColor="#333333" />
            <stop offset="100%" stopColor={SETTINGS[this.props.color].stopColor} />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${color}-gradient)`} />

        {this.getGrid()}
        {this.getPlotPoints()}
        {this.getControlPoints()}
      </svg>
    );
  }
}

module.exports = Curves;
