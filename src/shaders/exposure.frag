precision highp float;
varying vec2 screenPosition;

uniform sampler2D texture;

// controls brightness
// min - 0
// max - 2
// default - 1
uniform float brightness;

// controls contrast
// min - 0.0
// max - 3.0
// default - 1.0
uniform float contrast;

// determines which values are raised and which are lowered
// min - 0.0
// max - 1.0
// default - 0.5
uniform float mid;

void main() {
  vec4 color = texture2D(texture, vec2(screenPosition.s, screenPosition.t));
  color = mix(color, vec4(1.0, 1.0, 1.0, 1.0), brightness - 1.0);

  color.r = ((color.r - mid) * contrast) + mid;
  color.g = ((color.g - mid) * contrast) + mid;
  color.b = ((color.b - mid) * contrast) + mid;
  color.a = color.a;

  gl_FragColor = color;
}
