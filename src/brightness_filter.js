var glShader = require("gl-shader");
var glslify = require("glslify");
var Filter = require("./filter");

class BrightnessFilter extends Filter {
  constructor(gl) {
    super(gl);
    this.brightness = 1;
  }

  getShader() {
    return glShader(this.gl,
      glslify("./shaders/sample.vert"),
      glslify("./shaders/brightness.frag")
    );
  }

  setUniforms() {
    this.shader.uniforms.t = this.brightness;
  }

  set brightness(value) {
    return this._brightness = Math.min(Math.max(value, 0), 2);
  }

  get brightness() {
    return this._brightness;
  }
}

module.exports = BrightnessFilter;
