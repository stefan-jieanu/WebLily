import {gl} from './LlyGL';

/**
 * Wrapper for WebGL shader.
 */
export class LlyShader {
  private _name: string;
  private _program: WebGLProgram;
  private _attributes: {[name: string]: number} = {};
  private _uniforms: {[name: string]: WebGLUniformLocation | null} = {};

  /**
   * Creates a new shader.
   * @param name The name of the shader.
   * @param vertexSource The source of the vertex shader.
   * @param fragmentSource The source of the fragment shader.
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
    this.detectAttributes();
    this.detectUniforms();
  }

  public get name(): string {
    return this._name;
  }

  /**
   * Bind this shader for the next draw calls
   */
  public bind(): void {
    gl.useProgram(this._program);
  }

  /**
   * Gets the attribute location for a given name in this shader.
   * @param name The name of the attribute.
   * @returns The location of the attribute.
   */
  public getAttributeLocation(name: string): number {
    if (this._attributes[name] === undefined)
      throw new Error(
        `Unable to find attribute named ${name} in shader ${this.name}`
      );

    return this._attributes[name];
  }

  /**
   * Gets the uniform location for a given name in this shader.
   * @param name The name of the uniform.
   * @returns The location of the uniform.
   */
  public getUniformLocation(name: string): WebGLUniformLocation | null {
    if (this._uniforms[name] === null || this._uniforms[name] === undefined)
      throw new Error(
        `Unable to find uniform named ${name} in shader ${this.name}`
      );

    return this._uniforms[name];
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

  private detectAttributes(): void {
    const attributeCount = gl.getProgramParameter(
      this._program,
      gl.ACTIVE_ATTRIBUTES
    );

    for (let i = 0; i < attributeCount; ++i) {
      const attributeInfo: WebGLActiveInfo | null = gl.getActiveAttrib(
        this._program,
        i
      );

      if (!attributeInfo) break;

      // Go through the shader and get all the attributes
      this._attributes[attributeInfo.name] = gl.getAttribLocation(
        this._program,
        attributeInfo.name
      );
    }
  }

  private detectUniforms(): void {
    const uniformCount = gl.getProgramParameter(
      this._program,
      gl.ACTIVE_UNIFORMS
    );

    for (let i = 0; i < uniformCount; ++i) {
      const uniformInfo: WebGLActiveInfo | null = gl.getActiveUniform(
        this._program,
        i
      );

      if (!uniformInfo) break;

      // Go through the shader and get all the attributes
      this._uniforms[uniformInfo.name] = gl.getUniformLocation(
        this._program,
        uniformInfo.name
      );
    }
  }
}
