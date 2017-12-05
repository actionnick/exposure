"use strict";

var textureFromArray = require("./texture_from_array");

function setUniformForCurves(filter, enabledIdentifier, pointsIdentifier) {
  var textureUnit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5;

  if (filter.settings[enabledIdentifier]) {
    var gl = filter.gl;
    // Points are mapped from 0 to 1023.0
    var mappedArray = filter.settings[pointsIdentifier].map(function (val) {
      return Math.max(val / 1023.0);
    });
    var texture = textureFromArray(gl, mappedArray);
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    var z = gl.getUniformLocation(filter.shader.program, pointsIdentifier);
    gl.uniform1i(z, textureUnit);
  }
}

var DEFAULT_CONTROL_POINTS = [[0.0, 0.0], [1023.0, 1023.0]];

module.exports = {
  DEFAULT_CONTROL_POINTS: DEFAULT_CONTROL_POINTS,
  setUniformForCurves: setUniformForCurves
};
