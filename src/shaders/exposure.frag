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

// these control the curves settings
// each texture represents the mapping of color values
uniform sampler2D rgb_curve_points;
uniform bool rgb_curve_enabled;

uniform sampler2D r_curve_points;
uniform bool r_curve_enabled;

uniform sampler2D g_curve_points;
uniform bool g_curve_enabled;

uniform sampler2D b_curve_points;
uniform bool b_curve_enabled;

// HSL
uniform float hue;
uniform float saturation;
uniform float lightness;

uniform float cyans_hue;
uniform float cyans_saturation;
uniform float cyans_lightness;

uniform float magentas_hue;
uniform float magentas_saturation;
uniform float magentas_lightness;

uniform float yellows_hue;
uniform float yellows_saturation;
uniform float yellows_lightness;

uniform float reds_hue;
uniform float reds_saturation;
uniform float reds_lightness;

uniform float greens_hue;
uniform float greens_saturation;
uniform float greens_lightness;

uniform float blues_hue;
uniform float blues_saturation;
uniform float blues_lightness;

// selective color controls
uniform float cyans_cyan_shift;
uniform float cyans_magenta_shift;
uniform float cyans_yellow_shift;
uniform float cyans_black_shift;
uniform float cyans_red_shift;
uniform float cyans_green_shift;
uniform float cyans_blue_shift;
uniform float cyans_gray_shift;
uniform float cyans_white_shift;

uniform float magentas_cyan_shift;
uniform float magentas_magenta_shift;
uniform float magentas_yellow_shift;
uniform float magentas_black_shift;
uniform float magentas_red_shift;
uniform float magentas_green_shift;
uniform float magentas_blue_shift;
uniform float magentas_gray_shift;
uniform float magentas_white_shift;

uniform float yellows_cyan_shift;
uniform float yellows_magenta_shift;
uniform float yellows_yellow_shift;
uniform float yellows_black_shift;
uniform float yellows_red_shift;
uniform float yellows_green_shift;
uniform float yellows_blue_shift;
uniform float yellows_gray_shift;
uniform float yellows_white_shift;

uniform float reds_cyan_shift;
uniform float reds_magenta_shift;
uniform float reds_yellow_shift;
uniform float reds_black_shift;
uniform float reds_red_shift;
uniform float reds_green_shift;
uniform float reds_blue_shift;
uniform float reds_gray_shift;
uniform float reds_white_shift;

uniform float greens_cyan_shift;
uniform float greens_magenta_shift;
uniform float greens_yellow_shift;
uniform float greens_black_shift;
uniform float greens_red_shift;
uniform float greens_green_shift;
uniform float greens_blue_shift;
uniform float greens_gray_shift;
uniform float greens_white_shift;

uniform float blues_cyan_shift;
uniform float blues_magenta_shift;
uniform float blues_yellow_shift;
uniform float blues_black_shift;
uniform float blues_red_shift;
uniform float blues_green_shift;
uniform float blues_blue_shift;
uniform float blues_gray_shift;
uniform float blues_white_shift;

uniform float blacks_cyan_shift;
uniform float blacks_magenta_shift;
uniform float blacks_yellow_shift;
uniform float blacks_black_shift;
uniform float blacks_red_shift;
uniform float blacks_green_shift;
uniform float blacks_blue_shift;
uniform float blacks_gray_shift;
uniform float blacks_white_shift;

uniform float grays_cyan_shift;
uniform float grays_magenta_shift;
uniform float grays_yellow_shift;
uniform float grays_black_shift;
uniform float grays_red_shift;
uniform float grays_green_shift;
uniform float grays_blue_shift;
uniform float grays_gray_shift;
uniform float grays_white_shift;

uniform float whites_cyan_shift;
uniform float whites_magenta_shift;
uniform float whites_yellow_shift;
uniform float whites_black_shift;
uniform float whites_red_shift;
uniform float whites_green_shift;
uniform float whites_blue_shift;
uniform float whites_gray_shift;
uniform float whites_white_shift;

float mix_factor(vec4 range, vec3 hsl) {
  float mix_factor = 0.0;

  if (hsl.x >= range.x && hsl.x <= range.w) {
    // lower range
    if (hsl.x >= range.x && hsl.x < range.y) {
      mix_factor = smoothstep(range.x, range.y, hsl.x);
    }

    // target range
    if (hsl.x >= range.y && hsl.x <= range.z) {
      mix_factor = 1.0;
    }

    // upper range
    if (hsl.x > range.z && hsl.x <= range.w) {
      mix_factor = 1.0 - smoothstep(range.z, range.w, hsl.x);
    }

  }

  vec2 lightness_range = vec2(0.0, 0.08333);
  vec2 saturation_range = vec2(0.0, 0.08333);
  mix_factor *= smoothstep(saturation_range.x, saturation_range.y, hsl.y);
  mix_factor *= smoothstep(lightness_range.x, lightness_range.y, hsl.z);

  return mix_factor;
}

// Returns a number between 0 and 1 as if the number line is circular
// 1.1 => 0.1
// -0.1 => 0.9
float clamp_continuous(float value) {
  float unit = value;

  if (unit > 1.0) {
    unit = mod(unit, 1.0);
  } else if (unit < 0.0) {
    unit = 1.0 + unit;
  }

  return unit;
}

// These functions based on http://www.chilliant.com/rgb2hsv.html
vec3 HUEtoRGB(float h) {
  float r = abs(h * 6.0 - 3.0) - 1.0;
  float g = 2.0 - abs(h * 6.0 - 2.0);
  float b = 2.0 - abs(h * 6.0 - 4.0);
  return clamp(vec3(r, g, b), 0.0, 1.0);
}

vec3 RGBtoHCV(vec3 RGB) {
  float Epsilon = 0.00000000001;
  // Based on work by Sam Hocevar and Emil Persson
  vec4 P = (RGB.g < RGB.b) ? vec4(RGB.bg, -1.0, 2.0/3.0) : vec4(RGB.gb, 0.0, -1.0/3.0);
  vec4 Q = (RGB.r < P.x) ? vec4(P.xyw, RGB.r) : vec4(RGB.r, P.yzx);
  float C = Q.x - min(Q.w, Q.y);
  float H = abs((Q.w - Q.y) / (6.0 * C + Epsilon) + Q.z);
  return vec3(H, C, Q.x);
}

vec3 RGBtoHSL(vec3 RGB) {
  float Epsilon = 0.00000000001;
  vec3 HCV = RGBtoHCV(RGB);
  float L = HCV.z - HCV.y * 0.5;
  float S = HCV.y / (1.0 - abs(L * 2.0 - 1.0) + Epsilon);
  return vec3(HCV.x, S, L);
}

vec3 HSLtoRGB(vec3 HSL) {
  vec3 RGB = HUEtoRGB(HSL.x);
  float C = (1.0 - abs(2.0 * HSL.z - 1.0)) * HSL.y;
  return (RGB - 0.5) * C + HSL.z;
}

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

  ////////////////////////////
  ///////   curves   /////////
  ////////////////////////////

  // rgb curves
  if (rgb_curve_enabled) {
    float in_r = clamp(color.r, 0.0001, 0.9999);
    float in_g = clamp(color.g, 0.0001, 0.9999);
    float in_b = clamp(color.b, 0.0001, 0.9999);

    float out_r = texture2D(rgb_curve_points, vec2(in_r, 0.5)).x;
    float out_g = texture2D(rgb_curve_points, vec2(in_g, 0.5)).x;
    float out_b = texture2D(rgb_curve_points, vec2(in_b, 0.5)).x;

    color.r = clamp(mix(0.0, 1.0, out_r), 0.0, 1.0);
    color.g = clamp(mix(0.0, 1.0, out_g), 0.0, 1.0);
    color.b = clamp(mix(0.0, 1.0, out_b), 0.0, 1.0);
  }

  // r curves
  if (r_curve_enabled) {
    float in_r = clamp(color.r, 0.0001, 0.9999);
    float out_r = texture2D(r_curve_points, vec2(in_r, 0.5)).x;
    color.r = clamp(mix(0.0, 1.0, out_r), 0.0, 1.0);
  }

  // g curves
  if (g_curve_enabled) {
    float in_g = clamp(color.g, 0.0001, 0.9999);
    float out_g = texture2D(g_curve_points, vec2(in_g, 0.5)).x;
    color.g = clamp(mix(0.0, 1.0, out_g), 0.0, 1.0);
  }

  // b curves
  if (b_curve_enabled) {
    float in_b = clamp(color.b, 0.0001, 0.9999);
    float out_b = texture2D(b_curve_points, vec2(in_b, 0.5)).x;
    color.b = clamp(mix(0.0, 1.0, out_b), 0.0, 1.0);
  }

  ////////////////////////////
  ////         HSL        ////
  ////////////////////////////

  vec3 hsl = RGBtoHSL(color.rgb);

  // Color ranges here
  // https://gist.github.com/actionnick/d184d17e39d1669759204bcb8eaad501

  vec4 MASTER_RANGE = vec4(0.0, 0.0, 1.0, 1.0);
  vec4 CYAN_RANGE = vec4(0.375, 0.4583, 0.54167, 0.625);
  vec4 MAGENTA_RANGE = vec4(0.7083, 0.79167, 0.875, 0.9583);
  vec4 YELLOW_RANGE = vec4(0.04167, 0.125, 0.2083, 0.29167);
  vec4 RED_RANGE_1 = vec4(0.875, 0.9583, 1.0, 1.0); // Red is a special case because it goes from 315 -> 45 degrees
  vec4 RED_RANGE_2 = vec4(0.0, 0.0, 0.04167, 0.125);
  vec4 GREEN_RANGE = vec4(0.2083, 0.29167, 0.375, 0.4583);
  vec4 BLUE_RANGE = vec4(0.54167, 0.625, 0.7083, 0.79167);

  // Master
  float master_mix_factor = mix_factor(MASTER_RANGE, hsl);
  hsl.x = clamp_continuous(hsl.x + (hue * master_mix_factor));
  hsl.y = clamp(hsl.y + (saturation * master_mix_factor), 0.0, 1.0);
  hsl.z = clamp(mix(hsl.z, 1.0, max(0.0, lightness)), 0.0, 1.0);
  hsl.z = clamp(mix(hsl.z, 0.0, abs(min(0.0, lightness))), 0.0, 1.0);

  // Cyan
  float cyans_mix_factor = mix_factor(CYAN_RANGE, hsl);
  hsl.x = clamp_continuous(hsl.x + (cyans_hue * cyans_mix_factor));
  hsl.y = clamp(hsl.y + (cyans_saturation * cyans_mix_factor), 0.0, 1.0);
  // hsl.z = clamp(mix(hsl.z, 1.0, max(0.0, cyans_lightness * cyans_mix_factor)), 0.0, 1.0);
  // hsl.z = clamp(mix(hsl.z, 0.0, abs(min(0.0, cyans_lightness * cyans_mix_factor))), 0.0, 1.0);
  hsl.z = clamp(hsl.z + (cyans_lightness * cyans_mix_factor), 0.0, 1.0);

  // Magentas
  float magentas_mix_factor = mix_factor(MAGENTA_RANGE, hsl);
  hsl.x = clamp_continuous(hsl.x + (magentas_hue * magentas_mix_factor));
  hsl.y = clamp(hsl.y + (magentas_saturation * magentas_mix_factor), 0.0, 1.0);
  hsl.z = clamp(hsl.z + (magentas_lightness * magentas_mix_factor), 0.0, 1.0);

  // Yellows
  float yellows_mix_factor = mix_factor(YELLOW_RANGE, hsl);
  hsl.x = clamp_continuous(hsl.x + (yellows_hue * yellows_mix_factor));
  hsl.y = clamp(hsl.y + (yellows_saturation * yellows_mix_factor), 0.0, 1.0);
  hsl.z = clamp(hsl.z + (yellows_lightness * yellows_mix_factor), 0.0, 1.0);

  // Reds
  float reds_mix_factor = max(mix_factor(RED_RANGE_1, hsl), mix_factor(RED_RANGE_2, hsl));
  hsl.x = clamp_continuous(hsl.x + (reds_hue * reds_mix_factor));
  hsl.y = clamp(hsl.y + (reds_saturation * reds_mix_factor), 0.0, 1.0);
  hsl.z = clamp(hsl.z + (reds_lightness * reds_mix_factor), 0.0, 1.0);

  // Greens
  float greens_mix_factor = mix_factor(GREEN_RANGE, hsl);
  hsl.x = clamp_continuous(hsl.x + (greens_hue * greens_mix_factor));
  hsl.y = clamp(hsl.y + (greens_saturation * greens_mix_factor), 0.0, 1.0);
  hsl.z = clamp(hsl.z + (greens_lightness * greens_mix_factor), 0.0, 1.0);

  // Blues
  float blues_mix_factor = mix_factor(BLUE_RANGE, hsl);
  hsl.x = clamp_continuous(hsl.x + (blues_hue * blues_mix_factor));
  hsl.y = clamp(hsl.y + (blues_saturation * blues_mix_factor), 0.0, 1.0);
  hsl.z = clamp(hsl.z + (blues_lightness * blues_mix_factor), 0.0, 1.0);

  ////////////////////////////
  ////  selective color   ////
  ////////////////////////////

  float RED_HUE = 0.0;
  float YELLOW_HUE = 0.167;
  float GREEN_HUE = 0.333;
  float CYAN_HUE = 0.5;
  float MAGENTA_HUE = 0.8333;
  float BLUE_HUE = 0.6667;
  vec2 BLACK_SAT_LUM = vec2(0.0, 0.0);
  vec2 GRAY_SAT_LUM = vec2(0.0, 0.5);
  vec2 WHITE_SAT_LUM = vec2(0.0, 1.0);

  // cyans
  hsl.x = mix(hsl.x, CYAN_HUE, cyans_mix_factor * cyans_cyan_shift);
  hsl.x = mix(hsl.x, MAGENTA_HUE, cyans_mix_factor * cyans_magenta_shift);
  hsl.x = mix(hsl.x, YELLOW_HUE, cyans_mix_factor * cyans_yellow_shift);
  hsl.x = mix(hsl.x, RED_HUE, cyans_mix_factor * cyans_red_shift);
  hsl.x = mix(hsl.x, GREEN_HUE, cyans_mix_factor * cyans_green_shift);
  hsl.x = mix(hsl.x, BLUE_HUE, cyans_mix_factor * cyans_blue_shift);
  hsl.yz = mix(hsl.yz, BLACK_SAT_LUM, cyans_mix_factor * cyans_black_shift);
  hsl.yz = mix(hsl.yz, WHITE_SAT_LUM, cyans_mix_factor * cyans_white_shift);
  hsl.yz = mix(hsl.yz, GRAY_SAT_LUM, cyans_mix_factor * cyans_gray_shift);

  // magentas
  hsl.x = mix(hsl.x, CYAN_HUE, magentas_mix_factor * magentas_cyan_shift);
  hsl.x = mix(hsl.x, MAGENTA_HUE, magentas_mix_factor * magentas_magenta_shift);
  hsl.x = mix(hsl.x, YELLOW_HUE, magentas_mix_factor * magentas_yellow_shift);
  hsl.x = mix(hsl.x, RED_HUE, magentas_mix_factor * magentas_red_shift);
  hsl.x = mix(hsl.x, GREEN_HUE, magentas_mix_factor * magentas_green_shift);
  hsl.x = mix(hsl.x, BLUE_HUE, magentas_mix_factor * magentas_blue_shift);
  hsl.yz = mix(hsl.yz, WHITE_SAT_LUM, magentas_mix_factor * magentas_white_shift);
  hsl.yz = mix(hsl.yz, GRAY_SAT_LUM, magentas_mix_factor * magentas_gray_shift);
  hsl.yz = mix(hsl.yz, BLACK_SAT_LUM, magentas_mix_factor * magentas_black_shift);

  // yellows
  hsl.x = mix(hsl.x, CYAN_HUE, yellows_mix_factor * yellows_cyan_shift);
  hsl.x = mix(hsl.x, MAGENTA_HUE, yellows_mix_factor * yellows_magenta_shift);
  hsl.x = mix(hsl.x, YELLOW_HUE, yellows_mix_factor * yellows_yellow_shift);
  hsl.x = mix(hsl.x, RED_HUE, yellows_mix_factor * yellows_red_shift);
  hsl.x = mix(hsl.x, GREEN_HUE, yellows_mix_factor * yellows_green_shift);
  hsl.x = mix(hsl.x, BLUE_HUE, yellows_mix_factor * yellows_blue_shift);
  hsl.yz = mix(hsl.yz, WHITE_SAT_LUM, yellows_mix_factor * yellows_white_shift);
  hsl.yz = mix(hsl.yz, GRAY_SAT_LUM, yellows_mix_factor * yellows_gray_shift);
  hsl.yz = mix(hsl.yz, BLACK_SAT_LUM, yellows_mix_factor * yellows_black_shift);

  // reds
  hsl.x = mix(hsl.x, CYAN_HUE, reds_mix_factor * reds_cyan_shift);
  hsl.x = mix(hsl.x, MAGENTA_HUE, reds_mix_factor * reds_magenta_shift);
  hsl.x = mix(hsl.x, YELLOW_HUE, reds_mix_factor * reds_yellow_shift);
  hsl.x = mix(hsl.x, RED_HUE, reds_mix_factor * reds_red_shift);
  hsl.x = mix(hsl.x, GREEN_HUE, reds_mix_factor * reds_green_shift);
  hsl.x = mix(hsl.x, BLUE_HUE, reds_mix_factor * reds_blue_shift);
  hsl.yz = mix(hsl.yz, WHITE_SAT_LUM, reds_mix_factor * reds_white_shift);
  hsl.yz = mix(hsl.yz, GRAY_SAT_LUM, reds_mix_factor * reds_gray_shift);
  hsl.yz = mix(hsl.yz, BLACK_SAT_LUM, reds_mix_factor * reds_black_shift);

  // greens
  hsl.x = mix(hsl.x, CYAN_HUE, greens_mix_factor * greens_cyan_shift);
  hsl.x = mix(hsl.x, MAGENTA_HUE, greens_mix_factor * greens_magenta_shift);
  hsl.x = mix(hsl.x, YELLOW_HUE, greens_mix_factor * greens_yellow_shift);
  hsl.x = mix(hsl.x, RED_HUE, greens_mix_factor * greens_red_shift);
  hsl.x = mix(hsl.x, GREEN_HUE, greens_mix_factor * greens_green_shift);
  hsl.x = mix(hsl.x, BLUE_HUE, greens_mix_factor * greens_blue_shift);
  hsl.yz = mix(hsl.yz, WHITE_SAT_LUM, greens_mix_factor * greens_white_shift);
  hsl.yz = mix(hsl.yz, GRAY_SAT_LUM, greens_mix_factor * greens_gray_shift);
  hsl.yz = mix(hsl.yz, BLACK_SAT_LUM, greens_mix_factor * greens_black_shift);

  // blues
  hsl.x = mix(hsl.x, CYAN_HUE, blues_mix_factor * blues_cyan_shift);
  hsl.x = mix(hsl.x, MAGENTA_HUE, blues_mix_factor * blues_magenta_shift);
  hsl.x = mix(hsl.x, YELLOW_HUE, blues_mix_factor * blues_yellow_shift);
  hsl.x = mix(hsl.x, RED_HUE, blues_mix_factor * blues_red_shift);
  hsl.x = mix(hsl.x, GREEN_HUE, blues_mix_factor * blues_green_shift);
  hsl.x = mix(hsl.x, BLUE_HUE, blues_mix_factor * blues_blue_shift);
  hsl.yz = mix(hsl.yz, WHITE_SAT_LUM, blues_mix_factor * blues_white_shift);
  hsl.yz = mix(hsl.yz, GRAY_SAT_LUM, blues_mix_factor * blues_gray_shift);
  hsl.yz = mix(hsl.yz, BLACK_SAT_LUM, blues_mix_factor * blues_black_shift);

  color.rgb = HSLtoRGB(hsl);

  vec3 CYAN = vec3(0.0, 1.0, 1.0);
  vec3 MAGENTA = vec3(1.0, 0.0, 1.0);
  vec3 YELLOW = vec3(1.0, 1.0, 0.0);
  vec3 BLACK = vec3(0.0, 0.0, 0.0);
  vec3 RED = vec3(1.0, 0.0, 0.0);
  vec3 GREEN = vec3(0.0, 1.0, 0.0);
  vec3 BLUE = vec3(0.0, 0.0, 1.0);
  vec3 WHITE = vec3(1.0, 1.0, 1.0);
  vec3 GRAY = vec3(0.5, 0.5, 0.5);
  float MAX_DISTANCE = length(vec3(1.0, 1.0, 1.0));

  // blacks
  float black_distance = length(BLACK - color.rgb);
  float black_mix_factor = pow(1.0 - (black_distance / MAX_DISTANCE), 5.0);

  color.rgb = mix(color.rgb, CYAN, black_mix_factor * blacks_cyan_shift);
  color.rgb = mix(color.rgb, MAGENTA, black_mix_factor * blacks_magenta_shift);
  color.rgb = mix(color.rgb, YELLOW, black_mix_factor * blacks_yellow_shift);
  color.rgb = mix(color.rgb, BLACK, black_mix_factor * blacks_black_shift);
  color.rgb = mix(color.rgb, RED, black_mix_factor * blacks_red_shift);
  color.rgb = mix(color.rgb, GREEN, black_mix_factor * blacks_green_shift);
  color.rgb = mix(color.rgb, BLUE, black_mix_factor * blacks_blue_shift);
  color.rgb = mix(color.rgb, WHITE, black_mix_factor * blacks_white_shift);
  color.rgb = mix(color.rgb, GRAY, black_mix_factor * blacks_gray_shift);

  // grays
  float gray_distance = length(GRAY - color.rgb);
  float gray_mix_factor = pow(1.0 - (gray_distance / MAX_DISTANCE), 5.0);

  color.rgb = mix(color.rgb, CYAN, gray_mix_factor * grays_cyan_shift);
  color.rgb = mix(color.rgb, MAGENTA, gray_mix_factor * grays_magenta_shift);
  color.rgb = mix(color.rgb, YELLOW, gray_mix_factor * grays_yellow_shift);
  color.rgb = mix(color.rgb, BLACK, gray_mix_factor * grays_black_shift);
  color.rgb = mix(color.rgb, RED, gray_mix_factor * grays_red_shift);
  color.rgb = mix(color.rgb, GREEN, gray_mix_factor * grays_green_shift);
  color.rgb = mix(color.rgb, BLUE, gray_mix_factor * grays_blue_shift);
  color.rgb = mix(color.rgb, WHITE, gray_mix_factor * grays_white_shift);
  color.rgb = mix(color.rgb, GRAY, gray_mix_factor * grays_gray_shift);

  // whites
  float white_distance = length(WHITE - color.rgb);
  float white_mix_factor = pow(1.0 - (white_distance / MAX_DISTANCE), 5.0);

  color.rgb = mix(color.rgb, CYAN, white_mix_factor * whites_cyan_shift);
  color.rgb = mix(color.rgb, MAGENTA, white_mix_factor * whites_magenta_shift);
  color.rgb = mix(color.rgb, YELLOW, white_mix_factor * whites_yellow_shift);
  color.rgb = mix(color.rgb, BLACK, white_mix_factor * whites_black_shift);
  color.rgb = mix(color.rgb, RED, white_mix_factor * whites_red_shift);
  color.rgb = mix(color.rgb, GREEN, white_mix_factor * whites_green_shift);
  color.rgb = mix(color.rgb, BLUE, white_mix_factor * whites_blue_shift);
  color.rgb = mix(color.rgb, WHITE, white_mix_factor * whites_white_shift);
  color.rgb = mix(color.rgb, GRAY, white_mix_factor * whites_gray_shift);

  // always preserve alpha
  color.a = alpha;
  gl_FragColor = color;
}
