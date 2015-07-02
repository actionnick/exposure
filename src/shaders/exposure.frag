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

// these are all the level settings
// color settings range from 0.0 to 1.0
// default min is 0.0
// default max is 1.0
// gamma ranges from 0.0 to 9.99, default is 1.0
uniform float rgb_in_min;
uniform float rgb_in_max;
uniform float rgb_out_min;
uniform float rgb_out_max;
uniform float rgb_gamma;

uniform float r_in_min;
uniform float r_in_max;
uniform float r_out_min;
uniform float r_out_max;
uniform float r_gamma;

uniform float g_in_min;
uniform float g_in_max;
uniform float g_out_min;
uniform float g_out_max;
uniform float g_gamma;

uniform float b_in_min;
uniform float b_in_max;
uniform float b_out_min;
uniform float b_out_max;
uniform float b_gamma;

void main() {
  vec4 color = texture2D(texture, vec2(screenPosition.s, screenPosition.t));
  float alpha = color.a;

  ////////////////////////////
  /////// brightness /////////
  ////////////////////////////
  color = mix(color, vec4(1.0, 1.0, 1.0, 1.0), brightness - 1.0);

  ////////////////////////////
  //////// contrast //////////
  ////////////////////////////
  color.r = ((color.r - mid) * contrast) + mid;
  color.g = ((color.g - mid) * contrast) + mid;
  color.b = ((color.b - mid) * contrast) + mid;

  ////////////////////////////
  ///////// levels ///////////
  ////////////////////////////
  // First adjust levels based on all channels
  // Map the color according to the new min and max
  color = min(max(color - rgb_in_min, 0.0)/(rgb_in_max - rgb_in_min), 1.0);

  // Gamma correction
  color = pow(color, vec4(1.0 / rgb_gamma));

  // Linear interpolation based on output values
  // returns min * (1 - color) + max * color
  color = mix(vec4(rgb_out_min), vec4(rgb_out_max), color);

  // always preserve alpha
  color.a = alpha;
  gl_FragColor = color;
}
