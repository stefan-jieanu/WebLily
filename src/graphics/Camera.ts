import {Vec3, Matrix4x4} from '../math/LlyMath';

export abstract class Camera {
  protected _projectionMatrix: Matrix4x4;
  protected _viewMatrix: Matrix4x4;
  protected _projectionViewMatrix: Matrix4x4;

  protected _position: Vec3;
  protected _rotation: Vec3;
  protected _scale: Vec3;

  public constructor() {
    this._projectionMatrix = new Matrix4x4();
    this._viewMatrix = new Matrix4x4();
    this._projectionViewMatrix = new Matrix4x4();

    this._position = new Vec3();
    this._rotation = new Vec3();
    this._scale = new Vec3(1, 1, 1);
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

  public get projectionMatrix(): Matrix4x4 {
    return this._projectionMatrix;
  }

  public get projectionViewMatrix(): Matrix4x4 {
    return this._projectionViewMatrix;
  }

  public set position(value: Vec3) {
    this._position = value;
    this.recalculateViewMatrix();
  }

  public set rotation(value: Vec3) {
    this._rotation = value;
    this.recalculateViewMatrix();
  }

  public set scale(value: Vec3) {
    this._scale = value;
    this.recalculateViewMatrix();
  }

  protected recalculateViewMatrix(): void {
    this._viewMatrix = Matrix4x4.multiply(
      Matrix4x4.multiply(
        Matrix4x4.rotate(this._rotation),
        Matrix4x4.translate(this._position)
      ),
      Matrix4x4.scale(this._scale)
    );

    this._projectionViewMatrix = Matrix4x4.multiply(
      this._viewMatrix,
      this._projectionMatrix
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
    this._projectionMatrix = Matrix4x4.orthographic(
      left,
      right,
      bottom,
      top,
      -1.0,
      100
    );

    this.recalculateViewMatrix();
  }
}
