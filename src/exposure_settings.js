const EventEmitter = require("events").EventEmitter;
const _ = require("lodash");
const assert = require("assert");
const catRomSpline = require("cat-rom-spline");
const textureFromArray = require("./texture_from_array");

class ExposureSettings extends EventEmitter {
  constructor(json) {
    super();
    this.PROPS = ExposureSettings.PROPS;
    if (json) {
      this.initFromJson(json);
    }
    this.emit("initialized");
  }

  // getters/setters will be dynamically generated for these props except for virtual mutators.
  // virtual = true, these are meant for API usage but will not be passed into the shader.
  // internal = true, accessible for mutation but will not automatically emit an updated event.
  static PROPS = {
    brightness: {
      type: Number,
      min: 0.0,
      max: 2.0,
      default: 1.0,
    },
    contrast: {
      type: Number,
      min: 0.0,
      max: 3.0,
      default: 1.0,
    },
    mid: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.5,
    },
    rgb_in_min: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    rgb_in_max: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 1.0,
    },
    rgb_out_min: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    rgb_out_max: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 1.0,
    },
    rgb_gamma: {
      type: Number,
      min: 0.0,
      max: 10.0,
      default: 1.0,
    },
    r_in_min: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    r_in_max: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 1.0,
    },
    r_out_min: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    r_out_max: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 1.0,
    },
    r_gamma: {
      type: Number,
      min: 0.0,
      max: 10.0,
      default: 1.0,
    },
    g_in_min: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    g_in_max: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 1.0,
    },
    g_out_min: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    g_out_max: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 1.0,
    },
    g_gamma: {
      type: Number,
      min: 0.0,
      max: 10.0,
      default: 1.0,
    },
    b_in_min: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    b_in_max: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 1.0,
    },
    b_out_min: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    b_out_max: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 1.0,
    },
    b_gamma: {
      type: Number,
      min: 0.0,
      max: 10.0,
      default: 1.0,
    },
    rgb_curves: {
      virtual: true,
      type: Array,
      default: [[0.0, 0.0], [1023.0, 1023.0]],
    },
    rgb_curve_points: {
      type: Array,
      internal: true,
      default: [],
      setUniform: filter => {
        if (filter.settings.rgb_curve_enabled) {
          const gl = filter.gl;
          // Points are mapped from 0 to 1023.0
          const mappedArray = filter.settings.rgb_curve_points.map(val => val / 1023.0);
          window.mappedArray = mappedArray;
          const texture = textureFromArray(gl, mappedArray);
          const textureUnit = 5;
          gl.activeTexture(gl.TEXTURE0 + textureUnit);
          gl.bindTexture(gl.TEXTURE_2D, texture);

          const z = gl.getUniformLocation(filter.shader.program, "rgb_curve_points");
          gl.uniform1i(z, textureUnit);
        }
      },
    },
    rgb_curve_enabled: {
      type: Boolean,
      internal: true,
      default: false,
    },
  };

  initFromJson(json) {
    var self = this;
    _.keys(json).forEach(function(key) {
      self[key] = json[key];
    });
  }

  get json() {
    var keys = _.keys(ExposureSettings.PROPS);
    var self = this;
    var json = {};
    keys.forEach(function(key) {
      json[key] = self[key];
    });

    return json;
  }

  get rgb_curves() {
    return this._rgb_curves || ExposureSettings.PROPS.rgb_curves.default;
  }

  // Points go from 0 -> 1023
  set rgb_curves(val) {
    const sortedArray = [...val].sort(([x0], [x1]) => x0 - x1);

    if (
      val.length < 2 ||
      !val ||
      _.isEqual(ExposureSettings.PROPS.rgb_curves.default, sortedArray)
    ) {
      this._rgb_curves = ExposureSettings.PROPS.rgb_curves.default;
      this.rgb_curve_enabled = false;
      this.rgb_curve_points = [];
      this.emit("updated");
      return;
    }

    this.rgb_curve_enabled = true;
    // Add a point in the far lower left and far upper right
    const paddedPoints = [[-250, -250], ...sortedArray, [1400, 1400]];

    const placedPoints = paddedPoints.length - 4;
    const segments = placedPoints + 1;
    const numberOfPoints = 1024;

    const points = catRomSpline(paddedPoints, {
      samples: Math.floor(numberOfPoints / segments),
    });

    let pointMapping = [];
    points.forEach(point => {
      point[0] = Math.round(point[0]);
      point[1] = Math.round(point[1]);

      pointMapping[point[0]] = point[1];
    });

    let currentOutput = 0;
    let output;
    _.times(numberOfPoints, input => {
      output = pointMapping[input];
      if (!_.isNumber(output)) {
        pointMapping[input] = currentOutput;
      } else {
        currentOutput = output;
      }
    });

    pointMapping = _.dropRight(pointMapping, Math.max(pointMapping.length - numberOfPoints, 0));

    this.rgb_curve_points = pointMapping;
    window.pointMapping = pointMapping;
    this.emit("updated");

    this._rgb_curves = val;
  }
}

// returns true if this is a different number value within the min and max range.
var validateNum = function(currentVal, newVal, min, max) {
  return currentVal !== newVal && newVal >= min && newVal <= max;
};

// intialize property setters and getters
_.keys(ExposureSettings.PROPS).forEach(function(key) {
  const prop = ExposureSettings.PROPS[key];
  const descriptor = Object.getOwnPropertyDescriptor(ExposureSettings.prototype, key);

  const propertyDefinition = {};

  if (!_.has(descriptor, "get")) {
    propertyDefinition.get = function() {
      return this[`_${key}`] || prop.default;
    };
  }

  if (!_.has(descriptor, "set")) {
    propertyDefinition.set = function(val) {
      if (prop.type === Array) {
        assert(_.isArray(val), `Expected array for ${key}`);
      } else if (prop.type === Boolean) {
        assert(_.isBoolean(val), `Expected boolean for ${key}`);
      } else if (prop.type === Number) {
        assert(_.isNumber(val), `Expected number for ${key}`);
        assert(val >= prop.min && val <= prop.max, `Out of range value for ${key}`);
      }

      this[`_${key}`] = val;
      if (!prop.internal) {
        this.emit("updated");
      }
    };
  }

  if (!_.isEmpty(propertyDefinition)) {
    Object.defineProperty(ExposureSettings.prototype, key, propertyDefinition);
  }
});

module.exports = ExposureSettings;
