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
    _(json).keys().forEach(function(key) {
      self[key] = json[key];
    });
  }

  get json() {
    var keys = [
      "brightness",
      "contrast",
      "mid"
    ];

    var json = {};
    keys.forEach(function(key) {
      json[key] = self[key];
    });

    return json;
  }

  // brightness
  set brightness(val) {
    if (validateNum(this._brightness, val, 0, 2)) {
      this._brightness = val;
      this.emit("updated");
    }
  }
  get brightness() {
    return this._brightness || 1;
  }


  // contrast
  set contrast(val) {
    if (validateNum(this._contrast, val, 0, 3)) {
      this._contrast = val;
      this.emit("updated");
    }
  }
  get contrast() {
    return this._contrast || 1;
  }

  set mid(val) {
    if (validateNum(this._mid, val, 0, 1)) {
      this._mid = val;
      this.emit("updated");
    }
  }
  get mid() {
    return this._mid || 0.5;
  }
}

var isNum = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

// returns true if this is a different number value within the min and max range.
var validateNum = function(currentVal, newVal, min, max) {
  return isNum(newVal) && currentVal !== newVal && newVal >= min && newVal <= max;
};

module.exports = ExposureSettings;
