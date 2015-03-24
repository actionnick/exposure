precision highp float;
varying vec2 uv;

uniform sampler2D texture;

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
  vec4 color = texture2D(texture, vec2(uv.s, uv.t));
  float alpha = color.a;
  // First adjust levels based on all channels
  // Map the color according to the new min and max
  color = min(max(color - rgb_in_min, 0.0)/(rgb_in_max - rgb_in_min), 1.0);

  // Gamma correction
  color = pow(color, vec4(1.0 / rgb_gamma));

  // Linear interpolation based on output values
  // returns min * (1 - color) + max * color
  color = mix(vec4(rgb_out_min), vec4(rgb_out_max), color);

  // Then adjust channels seperately
  color.r = min(max(color.r - r_in_min, 0.0)/(r_in_max - r_in_min), 1.0);
  color.r = pow(color.r, (1.0 / r_gamma));
  color.r = mix(r_out_min, r_out_max, color.r);

  color.g = min(max(color.g - g_in_min, 0.0)/(g_in_max - g_in_min), 1.0);
  color.g = pow(color.g, (1.0 / g_gamma));
  color.g = mix(g_out_min, g_out_max, color.g);

  color.b = min(max(color.b - b_in_min, 0.0)/(b_in_max - b_in_min), 1.0);
  color.b = pow(color.b, (1.0 / b_gamma));
  color.b = mix(b_out_min, b_out_max, color.b);

  gl_FragColor.rgb = color.rgb;
  gl_FragColor.a = alpha;
}