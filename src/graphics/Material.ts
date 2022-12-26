import {LlyBuffer, AttributeInfo} from '../gl/LlyBuffer';
import {gl} from '../gl/LlyGL';
import {Color} from './Color';

export class ColorMaterial {
  private _buffer: LlyBuffer;
  private _colorAttribute: AttributeInfo;
  private _data: number[];

  constructor(color: Color = Color.purple) {
    this._data = [
      // eslint-disable-next-line
      color.r, color.g, color.b, color.a,
      // eslint-disable-next-line
      color.r, color.g, color.b, color.a,
      // eslint-disable-next-line
      color.r, color.g, color.b, color.a,
      // eslint-disable-next-line
      color.r, color.g, color.b, color.a,
    ];

    this._colorAttribute = new AttributeInfo();
    this._colorAttribute.location = 1;
    this._colorAttribute.offset = 0;
    this._colorAttribute.count = 4;

    this._buffer = new LlyBuffer(
      4,
      this._data,
      gl.FLOAT,
      gl.ARRAY_BUFFER,
      gl.DYNAMIC_DRAW
    );
    this._buffer.addAttribute(this._colorAttribute);
  }

  public get buffer(): LlyBuffer {
    return this._buffer;
  }

  public changeColor(color: Color, vertex?: number): void {
    if (vertex === undefined) {
      this._data[0] = color.r;
      this._data[1] = color.g;
      this._data[2] = color.b;
      this._data[3] = color.a;

      this._data[4] = color.r;
      this._data[5] = color.g;
      this._data[6] = color.b;
      this._data[7] = color.a;

      this._data[8] = color.r;
      this._data[9] = color.g;
      this._data[10] = color.b;
      this._data[11] = color.a;

      this._data[12] = color.r;
      this._data[13] = color.g;
      this._data[14] = color.b;
      this._data[15] = color.a;
    } else {
      this._data[vertex * 4 + 0] = color.r;
      this._data[vertex * 4 + 1] = color.g;
      this._data[vertex * 4 + 2] = color.b;
      this._data[vertex * 4 + 3] = color.a;
    }
    this._buffer.bufferData();
  }
}
