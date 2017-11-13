const textureFromArray = require("./texture_from_array");

function setUniformForCurves(filter, enabledIdentifier, pointsIdentifier, textureUnit = 5) {
  if (filter.settings[enabledIdentifier]) {
    const gl = filter.gl;
    // Points are mapped from 0 to 1023.0
    const mappedArray = filter.settings[pointsIdentifier].map(val => Math.max(val / 1023.0));
    const texture = textureFromArray(gl, mappedArray);
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const z = gl.getUniformLocation(filter.shader.program, pointsIdentifier);
    gl.uniform1i(z, textureUnit);
  }
}

const DEFAULT_CONTROL_POINTS = [[0.0, 0.0], [1023.0, 1023.0]];

module.exports = {
  DEFAULT_CONTROL_POINTS,
  setUniformForCurves,
};
