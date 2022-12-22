import {gl} from '../gl/LlyGL';
import {AttributeInfo, LlyBuffer} from '../gl/LlyBuffer';
import {LlyVertexArray} from '../gl/LlyVertexArray';
import {Matrix4x4, Vec3} from '../math/LlyMath';

export class GfxObject {
  private _scale: Vec3;
  private _rotation: Vec3;
  private _position: Vec3;

  // @ts-expect-error: is assigned in constructor but in a function
  private _modelMtx: Matrix4x4;

  private _buffer: LlyBuffer;
  private _bufferElem: LlyBuffer;
  private _vertexArray: LlyVertexArray;

  public constructor(position: Vec3, scale: Vec3, rotation: Vec3) {
    this._position = position;
    this._scale = scale;
    this._rotation = rotation;
    this.recalculateModelMatrix();

    const vertices = [
      // eslint-disable-next-line
      -0.5, -0.5, 1,
      // eslint-disable-next-line
      -0.5, 0.5, 1,
      // eslint-disable-next-line
      0.5, 0.5, 1,
      // eslint-disable-next-line
      0.5, -0.5, 1
    ];

    const positionAttribute = new AttributeInfo();
    // TODO: disgusting temporary fix, to be changed to get proper shader info
    // positionAttribute.location =
    //   this._shader.getAttributeLocation('a_position');
    positionAttribute.location = 0;
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

  public get scale(): Vec3 {
    return this._scale;
  }

  public set scale(value: Vec3) {
    this._scale = value;
    this.recalculateModelMatrix();
  }

  public get position(): Vec3 {
    return this._position;
  }

  public set position(value: Vec3) {
    this._position = value;
    this.recalculateModelMatrix();
  }

  public get rotation(): Vec3 {
    return this._rotation;
  }

  public set rotation(value: Vec3) {
    this._rotation = value;
    this.recalculateModelMatrix();
  }

  public get vertexArray(): LlyVertexArray {
    return this._vertexArray;
  }

  public get modelMtx(): Float32Array {
    return new Float32Array(this._modelMtx.data);
  }

  public draw(): void {
    this._vertexArray.bind();

    // TODO: move to draw call to a proper renderer class
    gl.drawElements(
      this._vertexArray.mode,
      this._vertexArray.indexBufferCount()!,
      this._vertexArray.indexBufferDataType()!,
      0
    );

    this._vertexArray.unbind();
  }

  private recalculateModelMatrix(): void {
    const translation = Matrix4x4.translate(this._position);
    const rotation = Matrix4x4.rotate(this._rotation);
    const scale = Matrix4x4.scale(this._scale);

    this._modelMtx = Matrix4x4.multiply(
      Matrix4x4.multiply(scale, rotation),
      translation
    );
  }
}
