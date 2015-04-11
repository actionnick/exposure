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

var p1 = [0, height];
var p2 = [width, 0];

var slope = (p2[0] - p1[0]) / (p2[1] - p1[1]);

var p0 = [p1[0] - 10, p1[1] - (10 * 1/slope)];
var p3 = [p2[0] + 10, p2[1] + (10 * 1/slope)];

var points = [p0, p1, p2, p3];

var newPoint = vec2.create();

canvas.onmousedown = function(event) {
  newPoint = [event.layerX, event.layerY];
  points.push(newPoint);
  points.sort(function(a, b) {
    return a[0] - b[0];
  });
};

canvas.onmousemove = function(event) {
  if (newPoint) {
    newPoint[0] = event.layerX;
    newPoint[1] = event.layerY;
    points.sort(function(a, b) {
      return a[0] - b[0];
    });
  }
};

canvas.onmouseup = function(event) {
  newPoint = false;
};

var interpolatePoint = function(p0, p1, p2, p3, t0, t1, t2, t3, t) {
  var a1, a2, a3, b1, b2, c;
  a1 = [];
  a2 = [];
  a3 = [];
  b1 = [];
  b2 = [];
  c = [];

  vec2.add(a1, vec2.scale([], p0, (t1 - t)/(t1 - t0)), vec2.scale([], p1, (t - t0)/(t1 - t0)));
  vec2.add(a2, vec2.scale([], p1, (t2 - t)/(t2 - t1)), vec2.scale([], p2, (t - t1)/(t2 - t1)));
  vec2.add(a3, vec2.scale([], p2, (t3 - t)/(t3 - t2)), vec2.scale([], p3, (t - t2)/(t3 - t2)));

  vec2.add(b1, vec2.scale([], a1, (t2 - t)/(t2 - t0)), vec2.scale([], a2, (t - t0)/(t2 - t0)));
  vec2.add(b2, vec2.scale([], a2, (t3 - t)/(t3 - t1)), vec2.scale([], a3, (t - t1)/(t3 - t1)));

  vec2.add(c, vec2.scale([], b1, (t2 - t)/(t2 - t1)), vec2.scale([], b2, (t - t1)/(t2 - t1)));

  return c;
};

var catmullRomSplineSegment = function(p0, p1, p2, p3, samples, knot) {
  var t, t0, t1, t2, t3;
  knot = knot || 0.5
  var points = [];

  t0 = 0;
  t1 = Math.pow((Math.sqrt(Math.pow((p1[0] - p0[0]), 2) + Math.pow((p1[1] - p0[1]), 2))), knot);
  t2 = Math.pow((Math.sqrt(Math.pow((p2[0] - p1[0]), 2) + Math.pow((p2[1] - p1[1]), 2))), knot) + t1;
  t3 = Math.pow((Math.sqrt(Math.pow((p3[0] - p2[0]), 2) + Math.pow((p3[1] - p2[1]), 2))), knot) + t2;

  var sampleStep = (t2 - t1) / samples;
  var t = t1;
  while (t < t2) {
    t += sampleStep;
    points.push(interpolatePoint(p0, p1, p2, p3, t0, t1, t2, t3, t));
  }

  return points;
};

// Return a fully interpolated spline through all the control points.
// Control points are included in the
var catmullRomSpline = function(controlPoints, samples, knot) {
  if (controlPoints.length < 4) {
    throw "Must have at least 4 control points to generate catmull rom spline";
  }
  var points = [];
  var p0, p1, p2, p3, offset;

  controlPoints.forEach(function(point, i) {
    offset = 1;
    p0 = point;

    do {
      p1 = controlPoints[i + offset];
      offset++;
    } while (p0 && p1 && p0[0] === p1[0] && p0[1] === p1[1]);

    do {
      p2 = controlPoints[i + offset];
      offset++;
    } while (p1 && p2 && p1[0] === p2[0] && p1[1] === p2[1]);

    do {
      p3 = controlPoints[i + offset];
      offset++;
    } while (p2 && p3 && p2[0] === p3[0] && p2[1] === p3[1]);

    if (!(p1 && p2 && p3)) {
      return;
    }

    points.push(p1);
    points = points.concat(catmullRomSplineSegment(p0, p1, p2, p3, samples, knot));
  });

  return points;
};

var frameLoop = function() {
  context.fillStyle = "black";
  context.fillRect(0, 0, width, height);

  catmullRomSpline(points, 1000, 0.5).forEach(function(point, index, array) {
    context.fillStyle = "white";
    context.fillRect(point[0], point[1], 1, 1);
  });
  requestAnimationFrame(frameLoop);
};

requestAnimationFrame(frameLoop);
