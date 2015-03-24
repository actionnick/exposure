precision highp float;
varying vec2 uv;

uniform sampler2D texture;

// controls contrast
// min - 0.0
// max - 3.0
// default - 1.0
uniform float t;

// determines which values are raised and which are lowered
// min - 0.0
// max - 1.0
// default - 0.5
uniform float mid;

void main() {
  vec4 color = texture2D(texture, vec2(uv.s, uv.t));
  gl_FragColor.r = ((color.r - mid) * t) + mid;
  gl_FragColor.g = ((color.g - mid) * t) + mid;
  gl_FragColor.b = ((color.b - mid) * t) + mid;
  gl_FragColor.a = color.a;
}