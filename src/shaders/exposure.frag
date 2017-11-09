precision mediump float;
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

uniform sampler2D rgb_curve_points;
uniform bool rgb_curve_enabled;
// uniform int rgb_curve_points_length;

void main() {
  vec4 color = texture2D(texture, vec2(screenPosition.s, screenPosition.t));
  float alpha = color.a;

  ////////////////////////////
  /////// brightness /////////
  ////////////////////////////
  color = mix(color, vec4(1.0, 1.0, 1.0, 1.0), brightness - 1.0);
  color.a = 1.0;

  ////////////////////////////
  //////// contrast //////////
  ////////////////////////////
  color.r = ((color.r - mid) * contrast) + mid;
  color.g = ((color.g - mid) * contrast) + mid;
  color.b = ((color.b - mid) * contrast) + mid;
  color.a = 1.0;

  ////////////////////////////
  ///////// levels ///////////
  ////////////////////////////
  // First adjust levels based on all channels
  // Map the color according to the new min and max
  color = min(max(color - rgb_in_min, 0.0)/(rgb_in_max - rgb_in_min), 1.0);
  color.a = 1.0;

  // Gamma correction
  color = pow(color, vec4(1.0 / rgb_gamma));
  color.a = 1.0;

  // Linear interpolation based on output values
  // returns min * (1 - color) + max * color
  color = mix(vec4(rgb_out_min), vec4(rgb_out_max), color);
  color.a = 1.0;

  // Then adjust channels seperately
  color.r = min(max(color.r - r_in_min, 0.0)/(r_in_max - r_in_min), 1.0);
  color.r = pow(color.r, (1.0 / r_gamma));
  color.r = mix(r_out_min, r_out_max, color.r);
  color.a = 1.0;

  color.g = min(max(color.g - g_in_min, 0.0)/(g_in_max - g_in_min), 1.0);
  color.g = pow(color.g, (1.0 / g_gamma));
  color.g = mix(g_out_min, g_out_max, color.g);
  color.a = 1.0;

  color.b = min(max(color.b - b_in_min, 0.0)/(b_in_max - b_in_min), 1.0);
  color.b = pow(color.b, (1.0 / b_gamma));
  color.b = mix(b_out_min, b_out_max, color.b);
  color.a = 1.0;

  // always preserve alpha
  color.a = alpha;
  gl_FragColor = color;

  ////////////////////////////
  ///////   curves   /////////
  ////////////////////////////

  // rgb curves
  if (rgb_curve_enabled) {
    float max = length(vec4(1.0, 1.0, 1.0, 1.0));
    float current = length(color);
    int in_val = int((current / max) * 1000.0);
    // int out_val = rgb_curve_points[in_val];

    vec4 out_val = texture2D(rgb_curve_points, vec2(screenPosition.s, 0.5));

    if (out_val.x > 0.500) {
      gl_FragColor = vec4(1.0, 1.0, 0.5, 1.0);
    }

    // color = mix(color, vec4(1.0, 1.0, 1.0, 1.0), 1.0 - (float(in_val) / float(out_val)));
  }
}
