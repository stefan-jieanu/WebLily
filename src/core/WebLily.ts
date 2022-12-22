import {LlyGL, gl} from '../gl/LlyGL';
import {LlyShader} from '../gl/LlyShader';
import {vertexShaderSource, fragmentShaderSource} from '../shaders/simple';
import {GfxObject} from '../graphics/GfxObject';
import {Vec3} from '../math/Vec3';
import {Camera} from '../graphics/Camera';
import {Renderer} from '../graphics/Renderer';

export class WebLily {
  public static instance: WebLily | null;
  private _canvas: HTMLCanvasElement;
  private _shader: LlyShader;
  private _sprite1: GfxObject;
  private _sprite2: GfxObject;
  private _camera: Camera;
  private _renderer: Renderer;

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

    this._sprite1 = new GfxObject(
      new Vec3(0, 0, 0),
      new Vec3(100, 100, 1),
      new Vec3(0, 0, 45)
    );

    this._sprite2 = new GfxObject(
      new Vec3(120, 300, 0),
      new Vec3(300, 150, 1),
      new Vec3(0, 0, 90)
    );

    this._camera = Camera.orthographic(
      -(this._canvas.width / 2),
      this._canvas.width / 2,
      -(this._canvas.height / 2),
      this._canvas.height / 2
    );
    this._camera.position = new Vec3(0, 0, 0);
    this._camera.rotation = new Vec3(0, 0, 67);
    this._camera.scale = new Vec3(1, 1, 1);

    this._renderer = new Renderer();
    this._renderer.setShader(this._shader);
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

    // Destroy the renderer instance
    Renderer.instance = null;
  }

  private loop(): void {
    gl.clearColor(0, 0.2, 0.4, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this._shader.bind();

    // Set uniforms
    const colorPosition = this._shader.getUniformLocation('u_color');
    gl.uniform4f(colorPosition, 1, 0.5, 0, 1);

    const projectionPosition = this._shader.getUniformLocation('u_projectionView');
    gl.uniformMatrix4fv(
      projectionPosition,
      false,
      new Float32Array(this._camera.projectionViewMatrix.data)
    );

    this._sprite1.rotation = new Vec3(
      this._sprite1.rotation.x,
      this._sprite1.rotation.y,
      this._sprite1.rotation.z + 0.1
    );
    this._renderer.submit(this._sprite1);
    this._renderer.submit(this._sprite2);
    this._renderer.flush();

    requestAnimationFrame(this.loop.bind(this));
  }

  private resize(): void {
    // Resize canvas on the DOM
    const canvasWrapper = this._canvas.parentElement!;
    this._canvas.width = canvasWrapper.offsetWidth;
    this._canvas.height = (this._canvas.width * 9) / 16;

    // Resize WebGL context viewport
    gl.viewport(0, 0, this._canvas.width, (this._canvas.width * 9) / 16);

    // Resize the camera projection
    this._camera?.resetProjection(
      -(this._canvas.width / 2),
      this._canvas.width / 2,
      -(this._canvas.height / 2),
      this._canvas.height / 2
    );
  }

  public resizeCallback(): void {
    this.resize();
  }
}
