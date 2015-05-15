var glShader = require("gl-shader");
var glslify = require("glslify");

class BaseFilter {
  constructor(gl) {
    this.gl = gl;
  }

  shader(shaderPath) {
    return glShader(this.gl,
      glslify('./shaders/texture_coords.vert'),
      glslify(shaderPath)
    );
  }
}

module.exports = BaseFilter;
