import {Vec3, degreesToRadians} from './LlyMath';

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
    // matrix._data[3] = -(right + left) / (right - left);
    // matrix._data[7] = -(top + bottom) / (top - bottom);
    // matrix._data[11] = -(farClip + nearClip) / (farClip - nearClip);

    return matrix;
  }

  public static multiply(left: Matrix4x4, right: Matrix4x4): Matrix4x4 {
    const matrix = new Matrix4x4();

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        matrix._data[4 * i + j] = 0;
        for (let k = 0; k < 4; k++) {
          matrix._data[4 * i + j] +=
            left._data[4 * i + k] * right._data[4 * k + j];
        }
      }
    }

    return matrix;
  }

  public static translation(position: Vec3): Matrix4x4 {
    const matrix = new Matrix4x4();

    matrix._data[12] = position.x;
    matrix._data[13] = position.y;
    matrix._data[14] = position.z;

    return matrix;
  }

  public static scale(scale: Vec3): Matrix4x4 {
    const matrix = new Matrix4x4();

    matrix._data[0] = scale.x;
    matrix._data[5] = scale.y;
    matrix._data[10] = scale.z;

    return matrix;
  }

  public static rotation(angles: Vec3): Matrix4x4 {
    const matrix = new Matrix4x4();

    const x = degreesToRadians(angles.x);
    const y = degreesToRadians(angles.y);
    const z = degreesToRadians(angles.z);
    // First row
    matrix._data[0] = Math.cos(y) * Math.cos(z);
    matrix._data[1] =
      Math.sin(x) * Math.sin(y) * Math.sin(z) - Math.cos(x) * Math.sin(z);
    matrix._data[2] =
      Math.cos(x) * Math.sin(y) * Math.cos(z) + Math.sin(x) * Math.sin(z);

    // Second row
    matrix._data[4] = Math.cos(y) * Math.sin(z);
    matrix._data[5] =
      Math.sin(x) * Math.sin(y) * Math.sin(z) + Math.cos(x) * Math.cos(z);
    matrix._data[6] =
      Math.cos(x) * Math.sin(y) * Math.sin(z) - Math.sin(x) * Math.cos(z);

    // Third row
    matrix._data[8] = -Math.sin(y);
    matrix._data[9] = Math.sin(x) * Math.cos(y);
    matrix._data[10] = Math.cos(x) * Math.cos(y);

    return matrix;
  }

  public static rotationZ(angles: Vec3): Matrix4x4 {
    const matrix = new Matrix4x4();

    const z = degreesToRadians(angles.z);
    matrix._data[0] = Math.cos(z);
    matrix._data[1] = -Math.sin(z);
    matrix._data[4] = Math.sin(z);
    matrix._data[5] = Math.cos(z);

    return matrix;
  }

  public static rotationX(angles: Vec3): Matrix4x4 {
    const matrix = new Matrix4x4();

    const x = degreesToRadians(angles.x);
    matrix._data[5] = Math.cos(x);
    matrix._data[6] = -Math.sin(x);
    matrix._data[9] = Math.sin(x);
    matrix._data[10] = Math.cos(x);

    return matrix;
  }
}
