import {gl} from './LlyGL';
import {LlyBuffer} from './LlyBuffer';

/**
 * Wrapper for a WebGL vertex array.
 */
export class LlyVertexArray {
  private _vertexArray: WebGLVertexArrayObject;
  private _buffers: LlyBuffer[] = [];

  public constructor() {
    this._vertexArray = gl.createVertexArray()!;
  }

  public addBuffer(buffer: LlyBuffer): void {
    this.bind();
    buffer.bind();

    if (buffer.hasAtttributes) {
      for (const attrib of buffer.attributes) {
        gl.enableVertexAttribArray(attrib.location);
        gl.vertexAttribPointer(
          attrib.location,
          attrib.count,
          buffer.dataType,
          buffer.normalized,
          buffer.stride,
          attrib.offset * buffer.typeSize
        );
      }
    }

    this._buffers.push(buffer);

    buffer.unbind();
    this.unbind();
  }

  public setElementBuffer(buffer: LlyBuffer): void {
    if (buffer.targetBufferType !== gl.ELEMENT_ARRAY_BUFFER)
      throw Error('Not an element buffer');

    this.bind();
    buffer.bind();
  }

  /**
   * Binds this vertex array.
   */
  public bind(): void {
    gl.bindVertexArray(this._vertexArray);
  }

  /**
   * Unbinds the vertex array.
   */
  public unbind(): void {
    gl.bindVertexArray(null);
  }

  /**
   * Destroy the WebGL vertex array.
   */
  public delete(): void {
    gl.deleteVertexArray(this._vertexArray);
  }
}
