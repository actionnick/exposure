// Creates a [array.length x 1] texture where each pixel is a value in the array.
function textureFromArray(gl, array) {
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

module.exports = textureFromArray;
