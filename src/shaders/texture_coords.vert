attribute vec3 position;

uniform mat4 p_matrix;
uniform mat4 mv_matrix;

varying vec2 uv;

void main() {
  gl_Position = p_matrix * mv_matrix * vec4(position, 1.0);
  uv = position.xy;
}
