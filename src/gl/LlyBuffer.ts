import {gl} from './LlyGL';

/**
 * Holds the information needed for a WebGL buffer attribute.
 */
export class AttributeInfo {
  /**
   * The location of this attribute.
   */
  public location: number;

  /**
   * The number of elements in this attribute (i.e Vector3 = 3).
   */
  public count: number;

  /**
   * Number of elements to offset these attributes from the beginning of the buffer.
   */
  public offset: number;

  public constructor() {
    this.location = 0;
    this.count = 0;
    this.offset = 0;
  }
}

/**
 * Wrapper for a WebGL buffer.
 */
export class LlyBuffer {
  private _singleElementCount: number;
  private _stride: number;
  private _buffer: WebGLBuffer;
  private _hasAttributes = false;
  private _normalized = false;

  private _targetBuffferType: number;
  private _dataType: number;
  private _drawType: number;
  private _typeSize: number;

  private _data: number[] = [];
  private _attributes: AttributeInfo[] = [];

  /**
   * Creates a new buffer.
   * @param singleElementCount The count of the number of elements per vertex
   * @param dataType The data type of this buffer. Default: gl.FLOAT
   * @param targetBufferType The buffer target type. Default: gl.ARRAY_BUFFER
   * @param drawType The drawing type for this buffer. Defualt: gl.STATIC_DRAW
   */
  public constructor(
    singleElementCount: number,
    data: number[],
    dataType: number = gl.FLOAT,
    targetBufferType: number = gl.ARRAY_BUFFER,
    drawType: number = gl.STATIC_DRAW,
    normalized = false
  ) {
    this._singleElementCount = singleElementCount;
    this._data = data;
    this._dataType = dataType;
    this._targetBuffferType = targetBufferType;
    this._drawType = drawType;
    this._normalized = normalized;

    // Determine byte size
    switch (this._dataType) {
      case gl.FLOAT:
      case gl.INT:
      case gl.UNSIGNED_INT:
        this._typeSize = 4;
        break;
      case gl.SHORT:
      case gl.UNSIGNED_SHORT:
        this._typeSize = 2;
        break;
      case gl.BYTE:
      case gl.UNSIGNED_BYTE:
        this._typeSize = 1;
        break;
      default:
        throw new Error(`Invalid data type: ${dataType.toString()}`);
    }

    this._stride = this._singleElementCount * this._typeSize;
    this._buffer = gl.createBuffer()!;

    this.bufferData();
  }

  public get hasAtttributes(): boolean {
    return this._hasAttributes;
  }

  public get attributes(): AttributeInfo[] {
    return this._attributes;
  }

  public get singleElementCount(): number {
    return this._singleElementCount;
  }

  public get dataType(): number {
    return this._dataType;
  }

  public get normalized(): boolean {
    return this._normalized;
  }

  public get stride(): number {
    return this._stride;
  }

  public get typeSize(): number {
    return this._typeSize;
  }

  public get data(): number[] {
    return this._data;
  }

  public get targetBufferType(): number {
    return this._targetBuffferType;
  }

  /**
   * Bind this buffer
   */
  public bind(): void {
    gl.bindBuffer(this._targetBuffferType, this._buffer);
  }

  /**
   * Unbinds this buffer.
   */
  public unbind(): void {
    gl.bindBuffer(this._targetBuffferType, null);
  }

  /**
   * Adds an attribute with the provided information to this buffer.
   * @param info The information to add.
   */
  public addAttribute(info: AttributeInfo): void {
    this._hasAttributes = true;
    this._attributes.push(info);
  }

  private bufferData(): void {
    this.bind();

    let bufferData: ArrayBuffer;
    switch (this._dataType) {
      case gl.FLOAT:
        bufferData = new Float32Array(this._data);
        break;
      case gl.INT:
        bufferData = new Int32Array(this._data);
        break;
      case gl.UNSIGNED_INT:
        bufferData = new Uint32Array(this._data);
        break;
      case gl.SHORT:
        bufferData = new Int16Array(this._data);
        break;
      case gl.UNSIGNED_SHORT:
        bufferData = new Uint16Array(this._data);
        break;
      case gl.BYTE:
        bufferData = new Int8Array(this._data);
        break;
      case gl.UNSIGNED_BYTE:
        bufferData = new Uint8Array(this._data);
        break;
      default:
        throw new Error('Unknown data type');
    }

    gl.bufferData(this._targetBuffferType, bufferData, this._drawType);
    this.unbind();
  }

  /**
   * Destroy the WebGL buffer
   */
  public destroy(): void {
    gl.deleteBuffer(this._buffer);
  }
}
