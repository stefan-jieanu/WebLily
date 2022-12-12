export let gl: WebGL2RenderingContext;

/**
 * Gets the WebGL instace from the canvas and mangages WebGL settings
 */
export class LlyGL {
  public static init(canvas: HTMLCanvasElement): void {
    if (!(canvas instanceof HTMLCanvasElement))
      throw new Error('Could not get canvas');

    // @ts-expect-error: Validity of gl context is checked manually
    // If at any point it is null that means it was used in the wrong place
    gl = canvas.getContext('webgl2');
    const isWebGL2 = !!gl;
    if (!isWebGL2) throw new Error('WebGL version not supported');

    if (!gl) {
      throw new Error('Could not init webgl2');
    }
  }
}
