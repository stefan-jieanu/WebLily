export let gl: WebGLRenderingContext;

/**
 * Gets the WebGL instace from the canvas and mangages WebGL settings
 */
export class LlyGL {
  public static init(canvas: HTMLCanvasElement): boolean {
    if (!(canvas instanceof HTMLCanvasElement)) return false;

    // @ts-expect-error: Validity of gl context is checked manually
    // If at any point it is null that means it was used in the wrong place
    gl = canvas.getContext('webgl');

    if (!gl) {
      return false;
    }

    return true;
  }
}
