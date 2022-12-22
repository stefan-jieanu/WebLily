export const vertexShaderSource = `
  attribute vec3 a_position;
  attribute vec4 a_color;

  uniform mat4 u_projectionView;
  uniform mat4 u_model;

  varying vec4 v_color;

  void main() {
    gl_Position = u_projectionView * u_model * vec4(a_position, 1.0);
    v_color = a_color;
  }
`;

export const fragmentShaderSource = `
  precision mediump float;

  varying vec4 v_color;
  // uniform vec4 u_color;

  void main() {
    gl_FragColor = v_color;
  }
`;
