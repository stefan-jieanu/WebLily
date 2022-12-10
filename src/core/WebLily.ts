import {LlyGL, gl} from '../gl/LlyGL';

export class WebLily {
  public static instance: WebLily | null;

  private _canvas: HTMLCanvasElement;

  public static create(canvas: HTMLCanvasElement): WebLily {
    return new WebLily(canvas);
  }

  public constructor(canvas: HTMLCanvasElement) {
    if (WebLily.instance) throw Error('Multiple application instances');
    WebLily.instance = this;
    this._canvas = canvas;

    // Init WebGL
    if (!LlyGL.init(this._canvas))
      throw new Error('Could not initialize WebGL');
  }

  public start(): void {
    console.debug('Started weblily');

    // Start the main loop of the program
    this.loop();
  }

  public stop(): void {
    console.debug('Stopped weblily');

    // Destroy the app instance
    WebLily.instance = null;
  }

  private loop(): void {
    requestAnimationFrame(this.loop.bind(this));
  }

  private drawTriangle(): void {
    // A user-defined function to create and compile shaders
    const initShader = (
      type: 'VERTEX_SHADER' | 'FRAGMENT_SHADER',
      source: string
    ) => {
      const shader = gl.createShader(gl[type]);

      if (!shader) {
        throw new Error('Unable to create a shader.');
      }

      gl.shaderSource(shader, source);

      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(
          `An error occurred compiling the shaders: ${gl.getShaderInfoLog(
            shader
          )}`
        );
      }

      return shader;
    };

    // Vertex shader
    const vertexShader = initShader(
      'VERTEX_SHADER',
      `
      attribute vec4 a_position;
  
      void main() {
        gl_Position = a_position;
      }
      `
    );

    // Fragment shader
    const fragmentShader = initShader(
      'FRAGMENT_SHADER',
      `
      void main() {
        gl_FragColor = vec4(0, 1, 0, 1);
      }
      `
    );

    // WebGL program
    const program = gl.createProgram();

    if (!program) {
      throw new Error('Unable to create the program.');
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(
        `Unable to link the shaders: ${gl.getProgramInfoLog(program)}`
      );
    }

    gl.useProgram(program);

    // Vertext buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [0, 1, 0.866, -0.5, -0.866, -0.5];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const index = gl.getAttribLocation(program, 'a_position');
    const size = 2;
    const type = gl.FLOAT;
    const normalized = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    gl.enableVertexAttribArray(index);

    // Draw the scene
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
