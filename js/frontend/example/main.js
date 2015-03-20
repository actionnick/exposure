var glShader = require('gl-shader')
var glslify = require("glslify");
var glMatrix = require("gl-matrix");
var mat4 = glMatrix.mat4;

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

var gl = initWebGL(canvas);
gl.clearColor(0.0, 1.0, 1.0, 1.0);

function startProgram(event) {
  var width = event.target.width;
  var height = event.target.height;
  canvas.width = width;
  canvas.height = height;
  gl.viewport(0, 0, width, height);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var img = event.currentTarget;
  var shader = glShader(gl,
    glslify('../../../shaders/example.vert'),
    glslify('../../../shaders/color.frag')
  );
  shader.bind();

  //Create vertex buffer
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     1.0,  1.0,  0.0,
    -1.0,  1.0,  0.0,
     1.0, -1.0,  0.0,
    -1.0, -1.0,  0.0
  ]), gl.STATIC_DRAW);

  //Set attributes
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  shader.attributes.position.pointer();

  //Set uniforms
  var orthoMat = mat4.ortho([], -1, 1, -1, 1, -1, 100);
  var mvMatrix = mat4.translate([], mat4.create(), [0, 0, 0]);

  shader.uniforms.p_matrix = orthoMat;
  shader.uniforms.mv_matrix = mvMatrix;

  //Draw
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

var image = new Image();
image.onload = startProgram;
image.src = '../assets/chimp.jpg'
document.body.appendChild(image);

window.gl = gl;