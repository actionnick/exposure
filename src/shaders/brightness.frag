precision highp float;
varying vec2 screenPosition;

uniform sampler2D texture;

// controls brightness
// min - 0
// max - 2
// default - 1
uniform float t;

void main() {
  vec4 color = texture2D(texture, vec2(screenPosition.s, screenPosition.t));
  gl_FragColor = mix(color, vec4(1.0, 1.0, 1.0, 1.0), t - 1.0);
}