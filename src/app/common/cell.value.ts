/**
 * An instance of this class represents a cell and it's value.
 */
export class CellValue {
  private _cell: number;    // 0..80 - cell index
  private _value: number;   // 0..9  - 1..9, 0 is no value

  constructor(cell: number, value: number) {
    this._cell = cell;
    this._value = value;
  }

  set cell(cell: number) {
    this._cell = cell;
  }
  
  get cell() {
    return this._cell;
  }
  
  set value(value: number) {
    this._value = value;
  }
  
  get value() {
    return this._value;
  }
  
} // class CellValue

