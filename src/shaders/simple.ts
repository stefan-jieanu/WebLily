export const vertexShaderSource = `
  attribute vec3 position;

  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

export const fragmentShaderSource = `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(1.0, 0, 0, 1.0);
  }
`;
