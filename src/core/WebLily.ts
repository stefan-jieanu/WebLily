import {LlyGL, gl} from '../gl/LlyGL';
import {LlyShader} from '../gl/LlyShader';
import {vertexShaderSource, fragmentShaderSource} from '../shaders/simple';
import {Sprite} from '../graphics/Sprite';
import {Vec3} from '../math/Vec3';
import {Matrix4x4} from '../math/Matrix4x4';

export class WebLily {
  public static instance: WebLily | null;
  private _canvas: HTMLCanvasElement;
  private _shader: LlyShader;
  private _sprite1: Sprite;
  private _projection: Matrix4x4;

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

    this._sprite1 = new Sprite(
      new Vec3(500, 200, 0),
      new Vec3(100, 100, -2),
      new Vec3(-1, 0, 45)
    );

    this._projection = Matrix4x4.orthographic(
      0,
      this._canvas.width,
      0,
      this._canvas.height,
      -1.0,
      100.0
    );
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

    const projectionPosition = this._shader.getUniformLocation('u_projection');
    gl.uniformMatrix4fv(
      projectionPosition,
      false,
      new Float32Array(this._projection.data)
    );

    const trs = Matrix4x4.translation(this._sprite1.position);
    const rot = Matrix4x4.rotation(this._sprite1.rotation);
    this._sprite1.rotation = new Vec3(
      this._sprite1.rotation.x,
      this._sprite1.rotation.y,
      this._sprite1.rotation.z
    );
    const scale = Matrix4x4.scale(this._sprite1.scale);
    const modelLocation = this._shader.getUniformLocation('u_model');
    gl.uniformMatrix4fv(
      modelLocation,
      false,
      // new Float32Array(
      //   Matrix4x4.multiply(Matrix4x4.multiply(scale, rot), trs).data
      // )
      new Float32Array(rot.data)
    );

    // Draw the sprite
    this._sprite1.draw();

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
