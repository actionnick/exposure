const EventEmitter = require("events").EventEmitter;
const _ = require("lodash");
const assert = require("assert");
const catRomSpline = require("cat-rom-spline");

class ExposureSettings extends EventEmitter {
  constructor(json) {
    super();
    this.PROPS = ExposureSettings.PROPS;
    if (json) {
      this.initFromJson(json);
    }
    this.emit("initialized");
  }

  // getters/setters will be dynamically generated for these props except for 2 cases.
  // virtual = true, these are meant for API usage but will not be passed into the shader.
  // internal = true, these are passed into the shader but not accessible for mutation
  // through the api.
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
      default: [[-250, -250], [0.0, 0.0], [1000, 1000], [1250, 1250]],
    },
    rgb_curve_points: {
      type: Array,
      internal: true,
      default: [],
    },
    rgb_curve_enabled: {
      type: Boolean,
      internal: true,
      default: false,
    },
  };

  get rgb_curves() {
    return this._rgb_curves || ExposureSettings.PROPS.rgb_curves.default;
  }

  // TODO: Resetting curves
  set rgb_curves(val) {
    assert(val.length > 4, "At least 4 points must be passed in");

    if (!_.isEqual(ExposureSettings.PROPS.rgb_curves.default, val)) {
      this.rgb_curve_enabled = true;

      const placedPoints = val.length - 4;
      const segments = placedPoints + 1;

      const numberOfPoints = 1000;

      const points = catRomSpline(val, {
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

      console.log(pointMapping);

      this.emit("updated");
    }

    this._rgb_curves = val;
  }

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
}

// returns true if this is a different number value within the min and max range.
var validateNum = function(currentVal, newVal, min, max) {
  return currentVal !== newVal && newVal >= min && newVal <= max;
};

// intialize property setters and getters
_.keys(ExposureSettings.PROPS).forEach(function(key) {
  const prop = ExposureSettings.PROPS[key];
  if (prop.virtual) return; // Custom setter defined in class

  Object.defineProperty(ExposureSettings.prototype, key, {
    get: function() {
      return this[`_${key}`] || prop.default;
    },
    set: function(val) {
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
    },
  });
});

module.exports = ExposureSettings;
