var mat4 = require("gl-mat4");
var glShader = require("gl-shader");
var glslify = require("glslify");
var Filter = require("./filter");
var resizeImage = require("./resize_image");
var _ = require("lodash");

var MAX_SIZE = 2500;

class Frame {
  constructor(img, canvas, json, callback) {
    var gl = this.gl = this.getGLContext(canvas);
    this.canvas = canvas;
    this.callback = callback;
    this.json = json;

    if (_.isFunction(json) && _.isUndefined(callback)) {
      this.callback = json;
      this.json = {};
    }

    if (img.width > MAX_SIZE || img.height > MAX_SIZE) {
      resizeImage(img, MAX_SIZE, this.initWithImg.bind(this));
    } else {
      this.initWithImg(img);
    }
  }

  initWithImg(img) {
    this.img = img;
    var gl = this.gl;
    this.width = this.canvas.width = img.width;
    this.height = this.canvas.height = img.height;

    // filter that will actually manipulate image in framebuffer
    this.filter = new Filter(gl, this.json);
    this.exposureSettings = this.filter.exposureSettings;
    this.exposureSettings.on("updated", this.filterDraw.bind(this));

    // shader for drawing image
    this.shader = glShader(gl,
      glslify('./shaders/texture_coords.vert'),
      glslify('./shaders/texture_map.frag')
    );

    // create geometry buffer to draw image on
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
       1.0,  1.0,  0.0,
       0.0,  1.0,  0.0,
       1.0,  0.0,  0.0,
       0.0,  0.0,  0.0
    ]), gl.STATIC_DRAW);

    // uniform matrices
    this.orthoMat = mat4.ortho([], 0, this.width, 0, this.height, 0, 1);
    this.mvMatrix = mat4.scale([], mat4.create(), [this.width, this.height, 0]);

    // setup texture
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
    gl.bindTexture(gl.TEXTURE_2D, null);

    this.callback(this);
  }

  getGLContext(canvas) {
    return canvas.getContext("webgl", {preserveDrawingBuffer: true}) || canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true});
  }

  setAttributes() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.shader.attributes.position.pointer();
  }

  bindTexture() {
    var gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }

  setUniforms() {
    this.shader.uniforms.p_matrix = this.orthoMat;
    this.shader.uniforms.mv_matrix = this.mvMatrix;
  }

  draw() {
    var gl = this.gl;

    this.filter.bind();

    this.shader.bind();
    this.setAttributes();
    this.bindTexture();
    this.setUniforms();

    gl.viewport(0, 0, this.width, this.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    this.filterDraw();
  }

  filterDraw() {
    this.filter.shader.bind();
    this.filter.draw();
  }
}

module.exports = Frame;
