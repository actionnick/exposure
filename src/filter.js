var glShader = require("gl-shader");
var glslify = require("glslify");
var glFbo = require("gl-fbo");
var draw = require("a-big-triangle");
var ExposureSettings = require("./exposure_settings");
var _ = require("lodash");

class Filter {
  constructor(gl, json) {
    this.settings = new ExposureSettings(json);
    this.gl = gl;
    this.shader = glShader(
      this.gl,
      glslify("./shaders/sample.vert"),
      glslify("./shaders/exposure.frag")
    );
    this.shader.attributes.position.location = 0;
    this.fbo = glFbo(gl, [gl.drawingBufferWidth, gl.drawingBufferHeight]);
    this.fbo.color[0].minFilter = gl.LINEAR;
    this.fbo.color[0].magFilter = gl.LINEAR;
  }

  bind() {
    this.fbo.bind();
    this.fbo.shape = [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight];
  }

  unbind() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }

  textureFromArray(gl, array) {
    const floatArray = new Float32Array(array);
    const oldActive = gl.getParameter(gl.ACTIVE_TEXTURE);
    gl.activeTexture(gl.TEXTURE15); // working register 31, thanks.

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.LUMINANCE,
      floatArray.length,
      1,
      0,
      gl.LUMINANCE,
      gl.FLOAT,
      floatArray
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.activeTexture(oldActive);

    return texture;
  }

  setUniforms() {
    var settings = this.settings;
    var uniforms = this.shader.uniforms;
    _.keys(ExposureSettings.PROPS).forEach(key => {
      if (ExposureSettings.PROPS[key].virtual) {
        return;
      }
      if (key == "rgb_curve_points") {
        if (this.settings.rgb_curve_enabled) {
          const gl = this.gl;
          const array = this.settings.rgb_curve_points.map(val => val / 1024.0);
          console.log("array", array);
          const texture = this.textureFromArray(gl, array);
          const textureUnit = 5;
          gl.activeTexture(gl.TEXTURE0 + textureUnit);
          gl.bindTexture(gl.TEXTURE_2D, texture);

          var z = gl.getUniformLocation(this.shader.program, "rgb_curve_points");
          gl.uniform1i(z, textureUnit);
        }
      } else {
        uniforms[key] = settings[key];
      }
    });
  }

  draw() {
    var gl = this.gl;

    this.unbind();

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    this.shader.bind();
    this.shader.uniforms.texture = this.fbo.color[0].bind(0);
    this.setUniforms();

    draw(gl);
  }
}

module.exports = Filter;
