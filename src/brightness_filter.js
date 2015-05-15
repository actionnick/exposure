var BaseFilter = require("./base_filter");

class BrightnessFilter extends BaseFilter {
  constructor(gl) {
    super(gl);
    this.brightness = 1;
    this.shader = shader("./shaders/brightness.frag");
  }

  set brightness(value) {
    return this.brightness = Math.min(Math.max(value, 0), 2);
  }
}

module.exports = BrightnessFilter;
