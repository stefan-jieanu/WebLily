import {gl} from '../gl/LlyGL';
import {Queue} from '../util/Util';
import {GfxObject} from './GfxObject';
import {Matrix4x4, Vec3} from '../math/LlyMath';
import {LlyShader} from '../gl/LlyShader';
import {Camera} from './Camera';
import {Color} from './Color';

export class Renderer {
  public static instance: Renderer | null;

  private _renderQueue: Queue<GfxObject>;
  private _shader: LlyShader | null = null;
  private _camera: Camera | null = null;

  public constructor() {
    if (Renderer.instance) throw new Error('Renderer already exists');
    Renderer.instance = this;

    this._renderQueue = new Queue();
  }

  public set clearColor(color: Color) {
    gl.clearColor(color.r, color.g, color.b, color.a);
  }

  public clear(): void {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  public beginScene(camera: Camera, shader: LlyShader): void {
    this._camera = camera;
    this._shader = shader;

    this._shader.bind();
    const projectionPosition =
      this._shader.getUniformLocation('u_projectionView');

    gl.uniformMatrix4fv(
      projectionPosition,
      false,
      this._camera.projectionViewMatrixArray
    );
  }

  public submit(item: GfxObject): void {
    this._renderQueue.enqueue(item);
  }

  public flush(): void {
    let item: GfxObject | undefined = this._renderQueue.dequeue();
    while (item !== undefined) {
      const modelLocation = this._shader!.getUniformLocation('u_model');
      gl.uniformMatrix4fv(modelLocation, false, item.modelMtx);

      // Draw the sprite
      item.vertexArray.bind();
      gl.drawElements(
        item.vertexArray.mode,
        item.vertexArray.indexBufferCount()!,
        item.vertexArray.indexBufferDataType()!,
        0
      );
      item.vertexArray.unbind();

      item = this._renderQueue.dequeue();
    }
  }

  public endScene(): void {
    this._camera = null;
    this._shader = null;
  }
}
