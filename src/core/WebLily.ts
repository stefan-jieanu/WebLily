import {LlyGL, gl} from '../gl/LlyGL';
import {LlyShader} from '../gl/LlyShader';
import {vertexShaderSource, fragmentShaderSource} from '../shaders/simple';
import {GfxObject} from '../graphics/GfxObject';
import {Camera} from '../graphics/Camera';
import {Renderer} from '../graphics/Renderer';
import {Color} from '../graphics/Color';
import {vec3} from 'gl-matrix';

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

    // Set callbacks
    // this._canvas.addEventListener(
    //   'mousedown',
    //   this.mouseDownCallback.bind(this),
    //   false
    // );
    // this._canvas.addEventListener(
    //   'mouseup',
    //   this.mouseUpCallback.bind(this),
    //   false
    // );
    // this._canvas.addEventListener(
    //   'wheel',
    //   this.mouseScrollCallback.bind(this),
    //   false
    // );

    // Disable right click context menu
    this._canvas.addEventListener('contextmenu', (e: Event) =>
      e.preventDefault()
    );

    // Create a shader
    this._shader = new LlyShader(
      'basic',
      vertexShaderSource,
      fragmentShaderSource
    );

    this._sprite1 = new GfxObject(
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(100, 100, 1),
      vec3.fromValues(0, 0, 45)
    );

    this._sprite2 = new GfxObject(
      vec3.fromValues(120, 300, 0),
      vec3.fromValues(300, 150, 1),
      vec3.fromValues(0, 0, 0)
    );

    this._camera = Camera.orthographic(
      -(this._canvas.width / 2),
      this._canvas.width / 2,
      -(this._canvas.height / 2),
      this._canvas.height / 2
    );
    this._camera.position = vec3.fromValues(10, 0, 0);
    this._camera.rotation = vec3.fromValues(0, 0, 45);
    this._camera.scale = vec3.fromValues(0.5, 0.5, 1);

    this._renderer = new Renderer();
    this._renderer.clearColor = new Color(0.2, 0.2, 0.2);
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
    this._renderer.clear();

    // Set uniforms
    // const colorPosition = this._shader.getUniformLocation('u_color');
    // gl.uniform4f(colorPosition, 1, 0.5, 0, 1);

    // this._sprite1.rotation = vec3.fromValues(
    //   this._sprite1.rotation[0],
    //   this._sprite1.rotation[1],
    //   this._sprite1.rotation[2]
    // );
    // console.log(this._sprite1.rotation[0], this._sprite1.rotation[1]);

    this._renderer.beginScene(this._camera, this._shader);
    this._renderer.submit(this._sprite1);
    this._renderer.submit(this._sprite2);
    this._renderer.flush();
    this._renderer.endScene();

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

  public mouseDownCallback(e: MouseEvent): void {
    const rect: DOMRect = this._canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    const clipX = (canvasX / rect.width) * 2 - 1;
    const clipY = (canvasY / rect.height) * -2 + 1;

    // Map canvasPos to device coordinates (-0.5, 0.5)
    // function mapValueRange(
    //   value: number,
    //   inMin: number,
    //   inMax: number,
    //   outMin: number,
    //   outMax: number
    // ) {
    //   return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    // }

    // function transformPoint(m: number[], v: number[]): Vec3 {
    //   const dst = new Vec3();
    //   const v0 = v[0];
    //   const v1 = v[1];
    //   const v2 = v[2];
    //   const d = v0 * m[0 * 4 + 3] + v1 * m[1 * 4 + 3] + v2 * m[2 * 4 + 3] + m[3 * 4 + 3];
    //   dst.x = (v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0] + m[3 * 4 + 0]) / d;
    //   dst.y = (v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1] + m[3 * 4 + 1]) / d;
    //   dst.z = (v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2] + m[3 * 4 + 2]) / d;
    //   return dst;
    // }

    // const trs = Matrix4x4.translate(new Vec3(canvasX, canvasY, 0));
    // const rot = Matrix4x4.translate(new Vec3(0, 0, 0));
    // const sca = Matrix4x4.translate(new Vec3(1, 1, 0));

    // const model = Matrix4x4.multiply(Matrix4x4.multiply(sca, rot), trs);

    // const newPos = transformPoint(
    //   Matrix4x4.multiply(this._camera.projectionViewMatrix, model).data,
    //   [clipX, clipY, 0]
    // );

    // Transform device coordinates to world position
    // const scaled = Matrix4x4.multiplyVec3(
    //   devicePos,
    //   this._camera.projectionViewMatrix
    // );

    // this._sprite1.position = ();
    // console.log(`${newPos.x}, ${newPos.y}`);
  }

  public mouseUpCallback(e: MouseEvent): void {}

  public mouseScrollCallback(e: MouseEvent): void {}

  public mouseMoveCallback(e: MouseEvent): void {
    const rect: DOMRect = this._canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // console.log(`${x}, ${y}`);
  }
}
