precision highp float;
varying vec2 uv;

uniform sampler2D texture;

// controls brightness
// min - 0
// max - 2
// default - 1
uniform float t;

void main() {
  vec4 color = texture2D(texture, vec2(uv.s, uv.t));
  gl_FragColor = mix(color, vec4(1.0, 1.0, 1.0, 1.0), t - 1.0);
}