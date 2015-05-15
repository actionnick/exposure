precision mediump float;

attribute vec2 position;
varying vec2 screenPosition;

void main() {
  screenPosition = (position + 1.0) * 0.5;
  gl_Position = vec4(position, 1.0, 1.0);
}