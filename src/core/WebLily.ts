import {LlyGL, gl} from '../gl/LlyGL';
import {Shader} from '../gl/Shader';
import {vertexShaderSource, fragmentShaderSource} from '../shaders/simple';

export class WebLily {
  public static instance: WebLily | null;

  private _canvas: HTMLCanvasElement;
  private _shader: Shader;
  private _buffer: WebGLBuffer;

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

    // Resize the canvas to the right size
    this.resize();

    // Create a shader
    this._shader = new Shader(
      'basic',
      vertexShaderSource,
      fragmentShaderSource
    );
    this._shader.use();

    // Create a buffer
    this._buffer = gl.createBuffer()!;

    // eslint-disable-next-line
    let vertices = [
      0, 0, 0,
      0, 0.5, 0,
      0.5, 0.5, 0
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);

    // Set buffer data for shader
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
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
    gl.clearColor(0, 0.2, 0.4, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(this.loop.bind(this));
  }

  private resize(): void {
    // Resize canvas on the DOM
    const canvasWrapper = this._canvas.parentElement!;
    this._canvas.width = canvasWrapper.offsetWidth;
    this._canvas.height = (this._canvas.width * 9) / 16;

    // Resize WebGL context viewport
    gl.viewport(0, 0, this._canvas.width, (this._canvas.width * 9) / 16);
  }

  public resizeCallback(): void {
    this.resize();
  }
}
