precision highp float;
varying vec2 screenPosition;

uniform sampler2D texture;

void main() {
  vec4 color = texture2D(texture, vec2(screenPosition.s, screenPosition.t));
  gl_FragColor = color;
}
