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
  var image = event.target;
  var width = image.width;
  var height = image.height;
  canvas.width = width;
  canvas.height = height;
  gl.viewport(0, 0, width, height);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var img = event.currentTarget;
  var shader = glShader(gl,
    glslify('../../../src/shaders/texture_coords.vert'),
    glslify('../../../src/shaders/levels.frag')
  );
  shader.bind();

  //Create vertex buffer
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     1.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     1.0,  0.0,  0.0,
     0.0,  0.0,  0.0
  ]), gl.STATIC_DRAW);

  // Create texture coord buffer
  // var texBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);

  //Set attributes
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  shader.attributes.position.pointer();

  // Set uniforms
  var orthoMat = mat4.ortho([], 0, width, 0, height, 0, 1);
  var mvMatrix = mat4.scale([], mat4.create(), [width, height, 0]);

  // Setup texture
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.bindTexture(gl.TEXTURE_2D, null);

  // Bind texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  shader.uniforms.texture = 0;
  shader.uniforms.p_matrix = orthoMat;
  shader.uniforms.mv_matrix = mvMatrix;
  shader.uniforms.rgb_in_min = 0.0;
  shader.uniforms.rgb_in_max = 1.0;
  shader.uniforms.rgb_out_min = 0.0;
  shader.uniforms.rgb_out_max = 1.0;
  shader.uniforms.rgb_gamma = 1.0;

  shader.uniforms.r_in_min = 0.0;
  shader.uniforms.r_in_max = 1.0;
  shader.uniforms.r_out_min = 0.0;
  shader.uniforms.r_out_max = 1.0;
  shader.uniforms.r_gamma = 1.0;

  shader.uniforms.g_in_min = 0.0;
  shader.uniforms.g_in_max = 1.0;
  shader.uniforms.g_out_min = 0.0;
  shader.uniforms.g_out_max = 1.0;
  shader.uniforms.g_gamma = 1.0;

  shader.uniforms.b_in_min = 0.0;
  shader.uniforms.b_in_max = 1.0;
  shader.uniforms.b_out_min = 0.0;
  shader.uniforms.b_out_max = 1.0;
  shader.uniforms.b_gamma = 1.0;

  var $control = $("#control");
  var $control2 = $("#control2");
  var $control3 = $("#control3");
  var $control4 = $("#control4");
  var $control5 = $("#control5");

  $control.on('mousemove', function(event) {
    var num = event.target.valueAsNumber / 100;
    shader.uniforms.g_in_min = num;
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  });
  $control2.on('mousemove', function(event) {
    var num = event.target.valueAsNumber / 100;
    shader.uniforms.g_in_max = num;
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  });
  $control3.on('mousemove', function(event) {
    var num = event.target.valueAsNumber / 100;
    shader.uniforms.g_out_min = num;
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  });
  $control4.on('mousemove', function(event) {
    var num = event.target.valueAsNumber / 100;
    shader.uniforms.g_out_max = num;
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  });
  $control5.on('mousemove', function(event) {
    var num = event.target.valueAsNumber / 100;
    shader.uniforms.g_gamma = num;
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  });


  //Draw
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

var image = new Image();
image.onload = startProgram;
image.src = '../assets/chimp.jpg'
document.body.appendChild(image);

window.gl = gl;