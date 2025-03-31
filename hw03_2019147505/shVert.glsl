#version 300 es

in vec2 a_position;
out vec4 v_color;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    gl_PointSize = 10.0;
    v_color = vec4(1.0, 0.0, 0.0, 1.0);
} 