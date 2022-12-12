import {LlyGL, gl} from '../gl/LlyGL';
import {LlyShader} from '../gl/LlyShader';
import {AttributeInfo, LlyBuffer} from '../gl/LlyBuffer';
import {LlyVertexArray} from '../gl/LlyVertexArray';
import {vertexShaderSource, fragmentShaderSource} from '../shaders/simple';

export class WebLily {
  public static instance: WebLily | null;

  private _canvas: HTMLCanvasElement;
  private _shader: LlyShader;
  private _buffer: LlyBuffer;
  private _bufferElem: LlyBuffer;
  private _vertexArray: LlyVertexArray;

  public static create(canvas: HTMLCanvasElement): WebLily {
    return new WebLily(canvas);
  }

  public constructor(canvas: HTMLCanvasElement) {
    if (WebLily.instance) throw Error('Multiple application instances');
    WebLily.instance = this;
    this._canvas = canvas;

    // Init WebGL
    LlyGL.init(this._canvas);

    // Resize the canvas to the right size
    this.resize();

    // Create a shader
    this._shader = new LlyShader(
      'basic',
      vertexShaderSource,
      fragmentShaderSource
    );

    // eslint-disable-next-line
    let vertices = [
      0, 0, 0,
      0, -0.5, 0,
      0.5, -0.5, 0,
      0.5, 0, 0
    ];

    const positionAttribute = new AttributeInfo();
    positionAttribute.location =
      this._shader.getAttributeLocation('a_position');
    positionAttribute.offset = 0;
    positionAttribute.count = 3;

    this._buffer = new LlyBuffer(3, vertices);
    this._buffer.addAttribute(positionAttribute);
    this._bufferElem = new LlyBuffer(
      1,
      [0, 1, 2, 2, 3, 0],
      gl.UNSIGNED_SHORT,
      gl.ELEMENT_ARRAY_BUFFER,
      gl.STATIC_DRAW
    );

    this._vertexArray = new LlyVertexArray();
    this._vertexArray.addBuffer(this._buffer);
    this._vertexArray.setIndexBuffer(this._bufferElem);
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

    this._shader.bind();

    // Set uniforms
    const colorPosition = this._shader.getUniformLocation('u_color');
    gl.uniform4f(colorPosition, 1, 0.5, 0, 1);

    this._vertexArray.bind();
    gl.drawElements(
      this._vertexArray.mode,
      this._vertexArray.indexBufferCount()!,
      this._vertexArray.indexBufferDataType()!,
      0
    );

    this._vertexArray.unbind();

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
