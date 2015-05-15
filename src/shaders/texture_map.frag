precision highp float;
varying vec2 uv;

uniform sampler2D texture;

void main() {
  vec4 color = texture2D(texture, vec2(uv.s, uv.t));
  gl_FragColor = color;
}
