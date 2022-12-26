import {gl} from '../gl/LlyGL';
import {AttributeInfo, LlyBuffer} from '../gl/LlyBuffer';
import {LlyVertexArray} from '../gl/LlyVertexArray';
import {mat4, vec3} from 'gl-matrix';
import {degreesToRadians} from '../math/LlyMath';

export class GfxObject {
  private _scale: vec3;
  private _rotation: vec3;
  private _position: vec3;

  private _modelMtx: mat4;

  private _buffer: LlyBuffer;
  private _bufferElem: LlyBuffer;
  private _vertexArray: LlyVertexArray;

  public constructor(position: vec3, scale: vec3, rotation: vec3) {
    this._position = position;
    this._scale = scale;
    this._rotation = rotation;

    this._modelMtx = mat4.create();
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

    const verticesColor = [
      // eslint-disable-next-line
      1, 0, 1, 1,
      // eslint-disable-next-line
      0, 1, 1, 1,
      // eslint-disable-next-line
      0, 0, 1, 1,
      // eslint-disable-next-line
      1, 1, 0, 1
    ];

    // const vertices = [
    //   // eslint-disable-next-line
    //   -0.5, -0.5, 1, 1, 0, 0, 1,
    //   // eslint-disable-next-line
    //   -0.5, 0.5, 1, 0, 1, 0, 1,
    //   // eslint-disable-next-line
    //   0.5, 0.5, 1, 0, 0, 1, 1,
    //   // eslint-disable-next-line
    //   0.5, -0.5, 1, 0, 1, 0, 1
    // ];

    const positionAttribute = new AttributeInfo();
    // TODO: disgusting temporary fix, to be changed to get proper shader info
    // positionAttribute.location =
    //   this._shader.getAttributeLocation('a_position');
    positionAttribute.location = 0;
    positionAttribute.offset = 0;
    positionAttribute.count = 3;

    const colorAttribute = new AttributeInfo();
    // TODO: disgusting temporary fix, to be changed to get proper shader info
    // positionAttribute.location =
    //   this._shader.getAttributeLocation('a_position');
    colorAttribute.location = 1;
    colorAttribute.offset = 0;
    colorAttribute.count = 4;

    this._buffer = new LlyBuffer(3, vertices);
    this._buffer.addAttribute(positionAttribute);

    const newBuffer = new LlyBuffer(4, verticesColor);
    newBuffer.addAttribute(colorAttribute);

    this._bufferElem = new LlyBuffer(
      1,
      [0, 1, 2, 2, 3, 0],
      gl.UNSIGNED_SHORT,
      gl.ELEMENT_ARRAY_BUFFER,
      gl.STATIC_DRAW
    );

    this._vertexArray = new LlyVertexArray();
    this._vertexArray.addBuffer(this._buffer);
    this._vertexArray.addBuffer(newBuffer);
    this._vertexArray.setIndexBuffer(this._bufferElem);
  }

  public get scale(): vec3 {
    return this._scale;
  }

  public set scale(value: vec3) {
    this._scale = value;
    this.recalculateModelMatrix();
  }

  public get position(): vec3 {
    return this._position;
  }

  public set position(value: vec3) {
    this._position = value;
    this.recalculateModelMatrix();
  }

  public get rotation(): vec3 {
    return this._rotation;
  }

  public set rotation(value: vec3) {
    this._rotation = value;
    this.recalculateModelMatrix();
  }

  public get vertexArray(): LlyVertexArray {
    return this._vertexArray;
  }

  public get modelMtx(): Float32Array {
    return new Float32Array(this._modelMtx);
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
    // let translation: mat4, rotation: mat4, scale: mat4;

    mat4.identity(this._modelMtx);
    mat4.translate(this._modelMtx, this._modelMtx, this._position);
    mat4.rotateX(
      this._modelMtx,
      this._modelMtx,
      degreesToRadians(this._rotation[0])
    );
    mat4.rotateY(
      this._modelMtx,
      this._modelMtx,
      degreesToRadians(this._rotation[1])
    );
    mat4.rotateZ(
      this._modelMtx,
      this._modelMtx,
      degreesToRadians(this._rotation[2])
    );
    mat4.scale(this._modelMtx, this._modelMtx, this._scale);

    // this._modelMtx = Matrix4x4.multiply(
    //   Matrix4x4.multiply(scale, rotation),
    //   translation
    // );
  }
}
