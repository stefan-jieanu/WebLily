export class Color {
  public r: number;
  public g: number;
  public b: number;
  public a: number;

  public constructor(r = 0, g = 0, b = 0, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  public static get black(): Color {
    return new Color(0, 0, 0);
  }

  public static get white(): Color {
    return new Color(1, 1, 1);
  }

  public static get red(): Color {
    return new Color(1, 0, 0);
  }

  public static get green(): Color {
    return new Color(0, 1, 0);
  }

  public static get blue(): Color {
    return new Color(0, 0, 1);
  }

  public static get yellow(): Color {
    return new Color(0, 1, 1);
  }

  public static get purple(): Color {
    return new Color(1, 0, 1);
  }

  public static get teal(): Color {
    return new Color(0, 0.5, 0.5);
  }
}
