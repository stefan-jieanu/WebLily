class Vec3 {
  public x: number;
  public y: number;
  public z: number;

  public constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public toArray(): number[] {
    return [this.x, this.y, this.z];
  }

  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toArray());
  }

  public toInt32Array(): Int32Array {
    return new Int32Array(this.toArray());
  }
}
