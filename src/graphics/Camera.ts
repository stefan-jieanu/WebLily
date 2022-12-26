// import {Vec3, Matrix4x4} from '../math/LlyMath';
import {vec3, mat4} from 'gl-matrix';
import {degreesToRadians} from '../math/LlyMath';

export abstract class Camera {
  protected _projectionMatrix: mat4;
  protected _viewMatrix: mat4;
  protected _projectionViewMatrix: mat4;

  protected _position: vec3;
  protected _rotation: vec3;
  protected _scale: vec3;

  public constructor() {
    this._projectionMatrix = mat4.create();
    this._viewMatrix = mat4.create();
    this._viewMatrix = mat4.identity(this._viewMatrix);
    this._projectionViewMatrix = mat4.create();

    this._position = vec3.create();
    this._rotation = vec3.create();
    this._scale = vec3.fromValues(1, 1, 1);
  }

  public static orthographic(
    left: number,
    right: number,
    bottom: number,
    top: number
  ): OrthographicCamera {
    return new OrthographicCamera(left, right, bottom, top);
  }

  public resetProjection(
    left: number,
    right: number,
    bottom: number,
    top: number
  ): void {}

  public get projectionMatrix(): mat4 {
    return this._projectionMatrix;
  }

  // public get projectionMatrixArray(): Float32Array {
  //   return new Float32Array(this._projectionMatrix.data);
  // }

  public get projectionViewMatrix(): mat4 {
    return this._projectionViewMatrix;
  }

  // public get projectionViewMatrixArray(): Float32Array {
  //   return new Float32Array(this._projectionViewMatrix.data);
  // }

  public get viewMatrix(): mat4 {
    return this._viewMatrix;
  }

  public set position(value: vec3) {
    this._position = value;
    this.recalculateViewMatrix();
  }

  public set rotation(value: vec3) {
    this._rotation = value;
    this.recalculateViewMatrix();
  }

  public set scale(value: vec3) {
    this._scale = value;
    this.recalculateViewMatrix();
  }

  protected recalculateViewMatrix(): void {
    // TODO: investigate why angles are doubled on the view matrix
    mat4.translate(this._viewMatrix, this._viewMatrix, this._position);
    mat4.rotateX(
      this._viewMatrix,
      this._viewMatrix,
      degreesToRadians(this._rotation[0] / 2)
    );
    mat4.rotateY(
      this._viewMatrix,
      this._viewMatrix,
      degreesToRadians(this._rotation[1] / 2)
    );
    mat4.rotateZ(
      this._viewMatrix,
      this._viewMatrix,
      degreesToRadians(this._rotation[2] / 2)
    );
    mat4.scale(this._viewMatrix, this._viewMatrix, this._scale);

    mat4.multiply(
      this._projectionViewMatrix,
      this._projectionMatrix,
      this._viewMatrix
    );
  }
}

class OrthographicCamera extends Camera {
  constructor(left: number, right: number, bottom: number, top: number) {
    super();
    this.resetProjection(left, right, bottom, top);
  }

  public resetProjection(
    left: number,
    right: number,
    bottom: number,
    top: number
  ): void {
    mat4.ortho(this._projectionMatrix, left, right, bottom, top, -1.0, 100);

    this.recalculateViewMatrix();
  }
}
