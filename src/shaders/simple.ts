export const vertexShaderSource = `
  attribute vec3 a_position;

  uniform mat4 u_projection;
  uniform mat4 u_model;

  void main() {
    gl_Position = u_projection * u_model * vec4(a_position, 1.0);
  }
`;

export const fragmentShaderSource = `
  precision mediump float;

  uniform vec4 u_color;

  void main() {
    gl_FragColor = u_color;
  }
`;
