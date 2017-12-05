"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mat4 = require("gl-mat4");
var glShader = require("gl-shader");
var glslify = require("glslify");
var Filter = require("./filter");
var resizeImage = require("./resize_image");
var createThumbnail = require("./create_thumbnail");
var _ = require("lodash");
var uuid = require("uuid");
var _download = require("downloadjs");

var MAX_SIZE = 2500;
var THUMBNAIL_SIZE = 300;

var Frame = function () {
  function Frame(img, opts) {
    _classCallCheck(this, Frame);

    this.canvas = opts.canvas || document.createElement("canvas");
    this.callback = opts.callback || function () {};
    this.json = opts.json || {};
    this.gl = this.getGLContext(this.canvas);
    this.key = uuid.v4();

    this.initWithImg(img);
  }

  _createClass(Frame, [{
    key: "download",
    value: function download() {
      var mime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "image/jpeg";
      var fileName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "image.jpeg";

      _download(this.canvas.toDataURL(mime), fileName, mime);
    }
  }, {
    key: "initWithImg",
    value: function initWithImg(img) {
      var gl = this.gl;

      this.img = img;
      this.thumbnail = createThumbnail(img, THUMBNAIL_SIZE);
      this.width = this.canvas.width = img.width;
      this.height = this.canvas.height = img.height;

      // filter that will actually manipulate image in framebuffer
      this.filter = new Filter(gl, this.json);

      // shader for drawing image
      this.shader = glShader(gl, "#define GLSLIFY 1\nattribute vec3 position;\n\nuniform mat4 p_matrix;\nuniform mat4 mv_matrix;\n\nvarying vec2 uv;\n\nvoid main() {\n  gl_Position = p_matrix * mv_matrix * vec4(position, 1.0);\n  uv = position.xy;\n}\n", "precision highp float;\n#define GLSLIFY 1\nvarying vec2 uv;\n\nuniform sampler2D texture;\n\nvoid main() {\n  vec4 color = texture2D(texture, vec2(uv.s, uv.t));\n  gl_FragColor = color;\n}\n");

      // create geometry buffer to draw image on
      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0]), gl.STATIC_DRAW);

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

      this.draw();
      this.callback && this.callback(this);
    }
  }, {
    key: "getGLContext",
    value: function getGLContext(canvas) {
      return canvas.getContext("webgl", { preserveDrawingBuffer: true }) || canvas.getContext("experimental-webgl", { preserveDrawingBuffer: true });
    }
  }, {
    key: "setAttributes",
    value: function setAttributes() {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
      this.shader.attributes.position.pointer();
    }
  }, {
    key: "bindTexture",
    value: function bindTexture() {
      var gl = this.gl;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
  }, {
    key: "setUniforms",
    value: function setUniforms() {
      this.shader.uniforms.p_matrix = this.orthoMat;
      this.shader.uniforms.mv_matrix = this.mvMatrix;
    }
  }, {
    key: "draw",
    value: function draw() {
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

      this.filter.draw();
    }
  }, {
    key: "settings",
    get: function get() {
      return this.filter.settings;
    },
    set: function set(value) {
      this.filter.settings = value;
    }
  }]);

  return Frame;
}();

module.exports = Frame;
