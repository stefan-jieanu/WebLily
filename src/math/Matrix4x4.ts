import {Vec3} from './Math';

export class Matrix4x4 {
  private _data: number[] = [];

  public constructor() {
    // eslint-disable-next-line
    this._data = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  public get data(): number[] {
    return this._data;
  }

  public static identity(): Matrix4x4 {
    return new Matrix4x4();
  }

  public static orthographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
    nearClip: number,
    farClip: number
  ): Matrix4x4 {
    const matrix = new Matrix4x4();

    const lr = 1.0 / (left - right);
    const bt = 1.0 / (bottom - top);
    const nf = 1.0 / (nearClip - farClip);

    matrix._data[0] = -2.0 * lr;
    matrix._data[5] = -2.0 * bt;
    matrix._data[10] = 2.0 * nf;

    matrix._data[12] = (left + right) * lr;
    matrix._data[13] = (top + bottom) * bt;
    matrix._data[14] = (farClip + nearClip) * nf;

    return matrix;
  }

  public static translation(position: Vec3): Matrix4x4 {
    const matrix = new Matrix4x4();

    matrix._data[12] = position.x;
    matrix._data[13] = position.y;
    matrix._data[14] = position.z;

    return matrix;
  }
}
