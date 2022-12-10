import {gl} from './LlyGL';

export class Shader {
  private _name: string;
  private _program: WebGLProgram;

  /**
   * Creates a new shader
   * @param name The name of the shader
   * @param vertexSource The source of the vertex shader
   * @param fragmentSource The source of the fragment shader
   */
  public constructor(
    name: string,
    vertexSource: string,
    fragmentSource: string
  ) {
    this._name = name;
    const vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
    const fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);

    this._program = this.createProgram(vertexShader, fragmentShader);
  }

  public get name(): string {
    return this._name;
  }

  private loadShader(source: string, shaderType: number): WebGLShader {
    const shader = gl.createShader(shaderType)!;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const error = gl.getShaderInfoLog(shader);

    if (error)
      throw new Error(`Error compiling shader ${this._name}: ${error}`);

    return shader;
  }

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram {
    const program = gl.createProgram()!;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    const error = gl.getProgramInfoLog(program);
    if (error)
      throw new Error(`Error creating program ${this._name}: ${error}`);

    return program;
  }
}
