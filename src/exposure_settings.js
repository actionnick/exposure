var EventEmitter = require("events").EventEmitter;
var _ = require("lodash");

class ExposureSettings extends EventEmitter {
  constructor(json) {
    super();

    if (json) {
      this.initFromJson(json);
    }
    this.emit("initialized");
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

ExposureSettings.PROPS = {
  brightness: {
    min: 0.0,
    max: 2.0,
    default: 1.0
  },
  contrast: {
    min: 0.0,
    max: 3.0,
    default: 1.0
  },
  mid: {
    min: 0.0,
    max: 1.0,
    default: 0.5
  },
  rgb_in_min: {
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  rgb_in_max: {
    min: 0.0,
    max: 1.0,
    default: 1.0
  },
  rgb_out_min: {
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  rgb_out_max: {
    min: 0.0,
    max: 1.0,
    default: 1.0
  },
  rgb_gamma: {
    min: 0.0,
    max: 10.0,
    default: 1.0
  }
};

var isNum = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

// returns true if this is a different number value within the min and max range.
var validateNum = function(currentVal, newVal, min, max) {
  return isNum(newVal) && currentVal !== newVal && newVal >= min && newVal <= max;
};

// intialize property setters and getters
_.keys(ExposureSettings.PROPS).forEach(function(key) {
  Object.defineProperty(ExposureSettings.prototype, key, {
    get: function() {
      return this[`_${key}`] || ExposureSettings.PROPS[key].default;
    },
    set: function(val) {
      if (validateNum(this[`_${key}`], val, ExposureSettings.PROPS[key].min, ExposureSettings.PROPS[key].max)) {
        this[`_${key}`] = val;
        this.emit("updated");
      }
    }
  });
});

module.exports = ExposureSettings;
