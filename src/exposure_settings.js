const EventEmitter = require("events").EventEmitter;
const _ = require("lodash");
const assert = require("assert");
const catRomSpline = require("cat-rom-spline");
const { DEFAULT_CONTROL_POINTS, setUniformForCurves } = require("./curves");

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

    // LEVELS
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

    // CURVES
    rgb_curves: {
      virtual: true,
      type: Array,
      default: DEFAULT_CONTROL_POINTS,
    },
    rgb_curve_points: {
      type: Array,
      internal: true,
      default: [],
      setUniform: filter => setUniformForCurves(filter, "rgb_curve_enabled", "rgb_curve_points", 3),
    },
    rgb_curve_enabled: {
      type: Boolean,
      internal: true,
      default: false,
    },
    r_curves: {
      virtual: true,
      type: Array,
      default: DEFAULT_CONTROL_POINTS,
    },
    r_curve_points: {
      type: Array,
      internal: true,
      default: [],
      setUniform: filter => setUniformForCurves(filter, "r_curve_enabled", "r_curve_points", 4),
    },
    r_curve_enabled: {
      type: Boolean,
      internal: true,
      default: false,
    },
    g_curves: {
      virtual: true,
      type: Array,
      default: DEFAULT_CONTROL_POINTS,
    },
    g_curve_points: {
      type: Array,
      internal: true,
      default: [],
      setUniform: filter => setUniformForCurves(filter, "g_curve_enabled", "g_curve_points", 5),
    },
    g_curve_enabled: {
      type: Boolean,
      internal: true,
      default: false,
    },
    b_curves: {
      virtual: true,
      type: Array,
      default: DEFAULT_CONTROL_POINTS,
    },
    b_curve_points: {
      type: Array,
      internal: true,
      default: [],
      setUniform: filter => setUniformForCurves(filter, "b_curve_enabled", "b_curve_points", 6),
    },
    b_curve_enabled: {
      type: Boolean,
      internal: true,
      default: false,
    },

    // SELECTIVE COLORS
    cyans_cyan_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    cyans_magenta_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    cyans_yellow_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    cyans_black_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    cyans_red_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    cyans_green_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    cyans_blue_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    cyans_white_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    cyans_gray_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },

    magentas_cyan_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    magentas_magenta_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    magentas_yellow_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    magentas_black_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    magentas_red_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    magentas_green_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    magentas_blue_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    magentas_white_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    magentas_gray_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },

    yellows_cyan_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    yellows_magenta_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    yellows_yellow_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    yellows_black_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    yellows_red_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    yellows_green_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    yellows_blue_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    yellows_white_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    yellows_gray_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },

    blacks_cyan_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    blacks_magenta_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    blacks_yellow_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    blacks_black_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    blacks_red_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    blacks_green_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    blacks_blue_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    blacks_white_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    blacks_gray_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },

    reds_cyan_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    reds_magenta_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    reds_yellow_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    reds_black_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    reds_red_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    reds_green_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    reds_blue_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    reds_white_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    reds_gray_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },

    greens_cyan_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    greens_magenta_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    greens_yellow_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    greens_black_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    greens_red_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    greens_green_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    greens_blue_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    greens_white_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    greens_gray_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },

    blues_cyan_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    blues_magenta_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    blues_yellow_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    blues_black_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    blues_red_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    blues_green_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    blues_blue_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    blues_white_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    blues_gray_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },

    grays_cyan_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    grays_magenta_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    grays_yellow_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    grays_black_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    grays_red_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    grays_green_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    grays_blue_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    grays_white_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    grays_gray_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },

    whites_cyan_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    whites_magenta_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    whites_yellow_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    whites_black_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    whites_red_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    whites_green_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    whites_blue_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    whites_white_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
    whites_gray_shift: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.0,
    },
  };

  static get defaultValues() {
    var keys = _.keys(ExposureSettings.PROPS);
    var json = {};
    keys.forEach(key => {
      if (!ExposureSettings.PROPS[key].internal) {
        json[key] = ExposureSettings.PROPS[key].default;
      }
    });

    return json;
  }

  get updated() {
    if (!this._updated) {
      this._updated = _.throttle(() => this.emit("updated"), 500);
    }

    return this._updated;
  }

  initFromJson(json) {
    var self = this;
    _.keys(json).forEach(function(key) {
      self[key] = json[key];
    });
  }

  get json() {
    var keys = _.keys(ExposureSettings.PROPS);
    var json = {};
    keys.forEach(key => {
      if (!ExposureSettings.PROPS[key].internal) {
        json[key] = this[key];
      }
    });

    return json;
  }

  get rgb_curves() {
    return this._rgb_curves || DEFAULT_CONTROL_POINTS;
  }

  set rgb_curves(val) {
    return this.setCurves(val, "_rgb_curves", "rgb_curve_enabled", "rgb_curve_points");
  }

  get r_curves() {
    return this._r_curves || DEFAULT_CONTROL_POINTS;
  }

  set r_curves(val) {
    return this.setCurves(val, "_r_curves", "r_curve_enabled", "r_curve_points");
  }

  get g_curves() {
    return this._g_curves || DEFAULT_CONTROL_POINTS;
  }

  set g_curves(val) {
    return this.setCurves(val, "_g_curves", "g_curve_enabled", "g_curve_points");
  }

  get b_curves() {
    return this._b_curves || DEFAULT_CONTROL_POINTS;
  }

  set b_curves(val) {
    return this.setCurves(val, "_b_curves", "b_curve_enabled", "b_curve_points");
  }

  setCurves(val, controlPointsIdentifier, enabledIdentifier, pointsIdentifier) {
    const sortedArray = [...val].sort(([x0], [x1]) => x0 - x1);

    if (val.length < 2 || !val || _.isEqual(DEFAULT_CONTROL_POINTS, sortedArray)) {
      this[controlPointsIdentifier] = DEFAULT_CONTROL_POINTS;
      this[enabledIdentifier] = false;
      this[pointsIdentifier] = [];
      this.updated();
    } else {
      this[enabledIdentifier] = true;
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

      this[pointsIdentifier] = pointMapping;
      this.updated();
      this[controlPointsIdentifier] = val;
    }

    return this[controlPointsIdentifier];
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
      if (_.isUndefined(this[`_${key}`]) || _.isNull(this[`_${key}`])) {
        return prop.default;
      } else {
        return this[`_${key}`];
      }
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
        this.updated();
      }
    };
  }

  if (!_.isEmpty(propertyDefinition)) {
    Object.defineProperty(ExposureSettings.prototype, key, propertyDefinition);
  }
});

module.exports = ExposureSettings;
