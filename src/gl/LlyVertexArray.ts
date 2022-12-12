import {gl} from './LlyGL';
import {LlyBuffer} from './LlyBuffer';

/**
 * Wrapper for a WebGL vertex array.
 */
export class LlyVertexArray {
  private _vertexArray: WebGLVertexArrayObject;
  private _mode: number;
  private _buffers: LlyBuffer[] = [];
  private _indexBuffer: LlyBuffer | null = null;

  public constructor(mode: number = gl.TRIANGLES) {
    this._vertexArray = gl.createVertexArray()!;
    this._mode = mode;
  }

  /**
   * Adds a buffer to the vertex array.
   * @param buffer The array buffer to add.
   */
  public addBuffer(buffer: LlyBuffer): void {
    if (buffer.targetBufferType !== gl.ARRAY_BUFFER)
      throw Error('Not an array buffer');

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

  public get mode(): number {
    return this._mode;
  }

  /**
   * Sets the index buffer for this vertex array.
   * @param buffer The index buffer to set.
   */
  public setIndexBuffer(buffer: LlyBuffer): void {
    if (buffer.targetBufferType !== gl.ELEMENT_ARRAY_BUFFER)
      throw Error('Not an element buffer');

    this.bind();
    buffer.bind();
    this._indexBuffer = buffer;

    this.unbind();
    buffer.unbind();
  }

  public indexBufferDataType(): number | null {
    if (this._indexBuffer) return this._indexBuffer.dataType;
    return null;
  }

  public indexBufferCount(): number | null {
    if (this._indexBuffer) return this._indexBuffer.data.length;
    return null;
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
