import {LlyGL, gl} from '../gl/LlyGL';
import {LlyShader} from '../gl/LlyShader';
import {AttributeInfo, LlyBuffer} from '../gl/LlyBuffer';
import {LlyVertexArray} from '../gl/LlyVertexArray';
import {vertexShaderSource, fragmentShaderSource} from '../shaders/simple';
import {vertexShaderSource2, fragmentShaderSource2} from '../shaders/simple';

export class WebLily {
  public static instance: WebLily | null;

  private _canvas: HTMLCanvasElement;
  private _shader: LlyShader;
  private _shader2: LlyShader;
  private _buffer1: LlyBuffer;
  private _buffer2: LlyBuffer;
  private _bufferElem: LlyBuffer;
  private _vao: LlyVertexArray;
  private _vao2: LlyVertexArray;

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
    // this._shader.bind();

    // Create a shader
    this._shader2 = new LlyShader(
      'basic',
      vertexShaderSource2,
      fragmentShaderSource2
    );
    // this._shader.bind();

    // eslint-disable-next-line
    let vertices1 = [
      0, 0, 0,
      0, 0.5, 0,
      0.5, 0.5, 0
    ];
    // eslint-disable-next-line
    let vertices2 = [
      0, 0, 0,
      0, -0.5, 0,
      0.5, -0.5, 0,
      0.5, 0, 0
    ];
    const positionAttribute = new AttributeInfo();
    positionAttribute.location = this._shader.getAttributeLocation('position');
    positionAttribute.offset = 0;
    positionAttribute.count = 3;

    const positionAttribute2 = new AttributeInfo();
    positionAttribute2.location =
      this._shader2.getAttributeLocation('position');
    positionAttribute2.offset = 0;
    positionAttribute2.count = 4;

    // Create a buffer
    this._buffer1 = new LlyBuffer(3, vertices1);
    this._buffer1.addAttribute(positionAttribute);

    this._vao = new LlyVertexArray();
    this._vao.addBuffer(this._buffer1);

    this._buffer2 = new LlyBuffer(3, vertices2);
    this._buffer2.addAttribute(positionAttribute);
    this._bufferElem = new LlyBuffer(
      6,
      [0, 1, 2, 2, 3, 0],
      gl.UNSIGNED_SHORT,
      gl.ELEMENT_ARRAY_BUFFER,
      gl.TRIANGLES,
      gl.STATIC_DRAW
    );

    this._vao2 = new LlyVertexArray();
    this._vao2.addBuffer(this._buffer2);
    this._vao2.setElementBuffer(this._bufferElem);
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
    this._vao.bind();
    gl.drawArrays(
      gl.TRIANGLES,
      0,
      this._buffer1.data.length / this._buffer1.elementSize
    );

    this._shader2.bind();
    this._vao2.bind();
    gl.drawElements(gl.TRIANGLES, 6, this._bufferElem.dataType, 0);

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
