"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require("events").EventEmitter;
var _ = require("lodash");
var assert = require("assert");
var catRomSpline = require("cat-rom-spline");

var _require = require("./curves"),
    DEFAULT_CONTROL_POINTS = _require.DEFAULT_CONTROL_POINTS,
    setUniformForCurves = _require.setUniformForCurves;

var ExposureSettings = function (_EventEmitter) {
  _inherits(ExposureSettings, _EventEmitter);

  function ExposureSettings(json) {
    var throttled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    _classCallCheck(this, ExposureSettings);

    var _this = _possibleConstructorReturn(this, (ExposureSettings.__proto__ || Object.getPrototypeOf(ExposureSettings)).call(this));

    _this.PROPS = ExposureSettings.PROPS;
    _this.throttled = throttled;
    if (json) {
      _this.initFromJson(json);
    }
    _this.emit("initialized");
    return _this;
  }

  // getters/setters will be dynamically generated for these props except for virtual mutators.
  // virtual = true, these are meant for API usage but will not be passed into the shader.
  // internal = true, accessible for mutation but will not automatically emit an updated event.


  _createClass(ExposureSettings, [{
    key: "initFromJson",
    value: function initFromJson(json) {
      var self = this;
      _.keys(json).forEach(function (key) {
        self[key] = json[key];
      });
    }
  }, {
    key: "setCurves",
    value: function setCurves(val, controlPointsIdentifier, enabledIdentifier, pointsIdentifier) {
      var sortedArray = [].concat(_toConsumableArray(val)).sort(function (_ref, _ref2) {
        var _ref4 = _slicedToArray(_ref, 1),
            x0 = _ref4[0];

        var _ref3 = _slicedToArray(_ref2, 1),
            x1 = _ref3[0];

        return x0 - x1;
      });

      if (val.length < 2 || !val || _.isEqual(DEFAULT_CONTROL_POINTS, sortedArray)) {
        this[controlPointsIdentifier] = DEFAULT_CONTROL_POINTS;
        this[enabledIdentifier] = false;
        this[pointsIdentifier] = [];
        this.updated();
      } else {
        this[enabledIdentifier] = true;
        // Add a point in the far lower left and far upper right
        var paddedPoints = [[-250, -250]].concat(_toConsumableArray(sortedArray), [[1400, 1400]]);

        var placedPoints = paddedPoints.length - 4;
        var segments = placedPoints + 1;
        var numberOfPoints = 1024;

        var points = catRomSpline(paddedPoints, {
          samples: Math.floor(numberOfPoints / segments)
        });

        var pointMapping = [];
        points.forEach(function (point) {
          point[0] = Math.round(point[0]);
          point[1] = Math.round(point[1]);

          pointMapping[point[0]] = point[1];
        });

        var currentOutput = 0;
        var output = void 0;
        _.times(numberOfPoints, function (input) {
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
  }, {
    key: "updated",
    get: function get() {
      var _this2 = this;

      if (!this.throttled) {
        return function () {
          return _this2.emit("updated");
        };
      }

      if (!this._updated) {
        this._updated = _.throttle(function () {
          return _this2.emit("updated");
        }, 100);
      }

      return this._updated;
    }
  }, {
    key: "json",
    get: function get() {
      var _this3 = this;

      var keys = _.keys(ExposureSettings.PROPS);
      var json = {};
      keys.forEach(function (key) {
        if (!ExposureSettings.PROPS[key].internal) {
          json[key] = _this3[key];
        }
      });

      return json;
    }
  }, {
    key: "rgb_curves",
    get: function get() {
      return this._rgb_curves || DEFAULT_CONTROL_POINTS;
    },
    set: function set(val) {
      return this.setCurves(val, "_rgb_curves", "rgb_curve_enabled", "rgb_curve_points");
    }
  }, {
    key: "r_curves",
    get: function get() {
      return this._r_curves || DEFAULT_CONTROL_POINTS;
    },
    set: function set(val) {
      return this.setCurves(val, "_r_curves", "r_curve_enabled", "r_curve_points");
    }
  }, {
    key: "g_curves",
    get: function get() {
      return this._g_curves || DEFAULT_CONTROL_POINTS;
    },
    set: function set(val) {
      return this.setCurves(val, "_g_curves", "g_curve_enabled", "g_curve_points");
    }
  }, {
    key: "b_curves",
    get: function get() {
      return this._b_curves || DEFAULT_CONTROL_POINTS;
    },
    set: function set(val) {
      return this.setCurves(val, "_b_curves", "b_curve_enabled", "b_curve_points");
    }
  }], [{
    key: "defaultValues",
    get: function get() {
      var keys = _.keys(ExposureSettings.PROPS);
      var json = {};
      keys.forEach(function (key) {
        if (!ExposureSettings.PROPS[key].internal) {
          json[key] = ExposureSettings.PROPS[key].default;
        }
      });

      return json;
    }
  }]);

  return ExposureSettings;
}(EventEmitter);

// returns true if this is a different number value within the min and max range.


ExposureSettings.PROPS = {
  brightness: {
    type: Number,
    min: 0.0,
    max: 2.0,
    default: 1.0
  },
  contrast: {
    type: Number,
    min: 0.0,
    max: 3.0,
    default: 1.0
  },
  mid: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.5
  },

  // LEVELS
  rgb_in_min: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  rgb_in_max: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 1.0
  },
  rgb_out_min: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  rgb_out_max: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 1.0
  },
  rgb_gamma: {
    type: Number,
    min: 0.0,
    max: 10.0,
    default: 1.0
  },
  r_in_min: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  r_in_max: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 1.0
  },
  r_out_min: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  r_out_max: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 1.0
  },
  r_gamma: {
    type: Number,
    min: 0.0,
    max: 10.0,
    default: 1.0
  },
  g_in_min: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  g_in_max: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 1.0
  },
  g_out_min: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  g_out_max: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 1.0
  },
  g_gamma: {
    type: Number,
    min: 0.0,
    max: 10.0,
    default: 1.0
  },
  b_in_min: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  b_in_max: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 1.0
  },
  b_out_min: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  b_out_max: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 1.0
  },
  b_gamma: {
    type: Number,
    min: 0.0,
    max: 10.0,
    default: 1.0
  },

  // CURVES
  rgb_curves: {
    virtual: true,
    type: Array,
    default: DEFAULT_CONTROL_POINTS
  },
  rgb_curve_points: {
    type: Array,
    internal: true,
    default: [],
    setUniform: function setUniform(filter) {
      return setUniformForCurves(filter, "rgb_curve_enabled", "rgb_curve_points", 3);
    }
  },
  rgb_curve_enabled: {
    type: Boolean,
    internal: true,
    default: false
  },
  r_curves: {
    virtual: true,
    type: Array,
    default: DEFAULT_CONTROL_POINTS
  },
  r_curve_points: {
    type: Array,
    internal: true,
    default: [],
    setUniform: function setUniform(filter) {
      return setUniformForCurves(filter, "r_curve_enabled", "r_curve_points", 4);
    }
  },
  r_curve_enabled: {
    type: Boolean,
    internal: true,
    default: false
  },
  g_curves: {
    virtual: true,
    type: Array,
    default: DEFAULT_CONTROL_POINTS
  },
  g_curve_points: {
    type: Array,
    internal: true,
    default: [],
    setUniform: function setUniform(filter) {
      return setUniformForCurves(filter, "g_curve_enabled", "g_curve_points", 5);
    }
  },
  g_curve_enabled: {
    type: Boolean,
    internal: true,
    default: false
  },
  b_curves: {
    virtual: true,
    type: Array,
    default: DEFAULT_CONTROL_POINTS
  },
  b_curve_points: {
    type: Array,
    internal: true,
    default: [],
    setUniform: function setUniform(filter) {
      return setUniformForCurves(filter, "b_curve_enabled", "b_curve_points", 6);
    }
  },
  b_curve_enabled: {
    type: Boolean,
    internal: true,
    default: false
  },

  // HSL
  hue: {
    type: Number,
    min: -0.5,
    max: 0.5,
    default: 0.0
  },
  saturation: {
    type: Number,
    min: -1.0,
    max: 1.0,
    default: 0.0
  },
  lightness: {
    type: Number,
    min: -1.0,
    max: 1.0,
    default: 0.0
  },
  cyans_hue: {
    type: Number,
    min: -0.5,
    max: 0.5,
    default: 0.0
  },
  cyans_saturation: {
    type: Number,
    min: -1.0,
    max: 1.0,
    default: 0.0
  },
  magentas_hue: {
    type: Number,
    min: -0.5,
    max: 0.5,
    default: 0.0
  },
  magentas_saturation: {
    type: Number,
    min: -1.0,
    max: 1.0,
    default: 0.0
  },
  yellows_hue: {
    type: Number,
    min: -0.5,
    max: 0.5,
    default: 0.0
  },
  yellows_saturation: {
    type: Number,
    min: -1.0,
    max: 1.0,
    default: 0.0
  },
  reds_hue: {
    type: Number,
    min: -0.5,
    max: 0.5,
    default: 0.0
  },
  reds_saturation: {
    type: Number,
    min: -1.0,
    max: 1.0,
    default: 0.0
  },
  greens_hue: {
    type: Number,
    min: -0.5,
    max: 0.5,
    default: 0.0
  },
  greens_saturation: {
    type: Number,
    min: -1.0,
    max: 1.0,
    default: 0.0
  },
  blues_hue: {
    type: Number,
    min: -0.5,
    max: 0.5,
    default: 0.0
  },
  blues_saturation: {
    type: Number,
    min: -1.0,
    max: 1.0,
    default: 0.0
  },

  // SELECTIVE COLORS
  cyans_cyan_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  cyans_magenta_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  cyans_yellow_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  cyans_black_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  cyans_red_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  cyans_green_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  cyans_blue_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  cyans_white_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  cyans_gray_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },

  magentas_cyan_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  magentas_magenta_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  magentas_yellow_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  magentas_black_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  magentas_red_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  magentas_green_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  magentas_blue_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  magentas_white_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  magentas_gray_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },

  yellows_cyan_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  yellows_magenta_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  yellows_yellow_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  yellows_black_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  yellows_red_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  yellows_green_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  yellows_blue_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  yellows_white_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  yellows_gray_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },

  blacks_cyan_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  blacks_magenta_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  blacks_yellow_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  blacks_black_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  blacks_red_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  blacks_green_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  blacks_blue_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  blacks_white_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  blacks_gray_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },

  reds_cyan_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  reds_magenta_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  reds_yellow_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  reds_black_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  reds_red_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  reds_green_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  reds_blue_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  reds_white_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  reds_gray_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },

  greens_cyan_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  greens_magenta_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  greens_yellow_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  greens_black_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  greens_red_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  greens_green_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  greens_blue_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  greens_white_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  greens_gray_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },

  blues_cyan_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  blues_magenta_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  blues_yellow_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  blues_black_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  blues_red_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  blues_green_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  blues_blue_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  blues_white_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  blues_gray_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },

  grays_cyan_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  grays_magenta_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  grays_yellow_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  grays_black_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  grays_red_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  grays_green_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  grays_blue_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  grays_white_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  grays_gray_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },

  whites_cyan_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  whites_magenta_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  whites_yellow_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  whites_black_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  whites_red_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  whites_green_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  whites_blue_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  whites_white_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  whites_gray_shift: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  }
};
var validateNum = function validateNum(currentVal, newVal, min, max) {
  return currentVal !== newVal && newVal >= min && newVal <= max;
};

// intialize property setters and getters
_.keys(ExposureSettings.PROPS).forEach(function (key) {
  var prop = ExposureSettings.PROPS[key];
  var descriptor = Object.getOwnPropertyDescriptor(ExposureSettings.prototype, key);

  var propertyDefinition = {};

  if (!_.has(descriptor, "get")) {
    propertyDefinition.get = function () {
      if (_.isUndefined(this["_" + key]) || _.isNull(this["_" + key])) {
        return prop.default;
      } else {
        return this["_" + key];
      }
    };
  }

  if (!_.has(descriptor, "set")) {
    propertyDefinition.set = function (val) {
      if (prop.type === Array) {
        assert(_.isArray(val), "Expected array for " + key);
      } else if (prop.type === Boolean) {
        assert(_.isBoolean(val), "Expected boolean for " + key);
      } else if (prop.type === Number) {
        assert(_.isNumber(val), "Expected number for " + key);
        assert(val >= prop.min && val <= prop.max, "Out of range value for " + key);
      }

      this["_" + key] = val;
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
