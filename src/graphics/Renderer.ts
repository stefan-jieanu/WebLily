import {gl} from '../gl/LlyGL';
import {Queue} from '../util/Util';
import {GfxObject} from './GfxObject';
import {Matrix4x4, Vec3} from '../math/LlyMath';
import {LlyShader} from '../gl/LlyShader';

export class Renderer {
  public static instance: Renderer | null;

  private _renderQueue: Queue<GfxObject>;
  // @ts-expect-error: We'll change this in the future anyways when we have a material sistem
  private _shader: LlyShader;

  public constructor() {
    if (Renderer.instance) throw new Error('Renderer already exists');
    Renderer.instance = this;

    this._renderQueue = new Queue();
  }

  public setShader(shader: LlyShader): void {
    this._shader = shader;
  }

  public submit(item: GfxObject): void {
    this._renderQueue.enqueue(item);
  }

  public flush(): void {
    let item: GfxObject | undefined = this._renderQueue.dequeue();
    while (item !== undefined) {
      const trs = Matrix4x4.translate(item.position);
      const rot = Matrix4x4.rotate(item.rotation);
      item.rotation = new Vec3(
        item.rotation.x,
        item.rotation.y,
        item.rotation.z
      );
      const scale = Matrix4x4.scale(item.scale);
      const modelLocation = this._shader.getUniformLocation('u_model');
      gl.uniformMatrix4fv(
        modelLocation,
        false,
        new Float32Array(
          Matrix4x4.multiply(Matrix4x4.multiply(scale, rot), trs).data
        )
        // new Float32Array(rot.data)
      );

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
}
