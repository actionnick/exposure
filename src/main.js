var glShader = require('gl-shader')
var glslify = require("glslify");
var glMatrix = require("gl-matrix");
var mat4 = glMatrix.mat4;
var vec2 = glMatrix.vec2;

function initWebGL(canvas) {
  gl = null;

  try {
    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true}) || canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true});
  }
  catch(e) {}

  // If we don't have a GL context, give up now
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
    gl = null;
  }

  return gl;
}

window.canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var width = 600;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');


var frameLoop = function() {

  requestAnimationFrame(frameLoop);
};

requestAnimationFrame(frameLoop);
