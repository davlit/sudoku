import { NakedType } from './naked.type';
import { CANDIDATES } from '../common/common';

/**
 * Cell is one of the 81 cells in a standard sudoku.
 * 
 * State:
 * - value
 * - candidates
 */
export class Cell {
  private _value: number;
  private _candidates: boolean[];
  private _rowIndex: number;
  private _colIndex: number;
  private _boxIndex: number;

  /**
   * Initialize the cell to empty: no value and all candidates. Give the cell
   * a reference to its row, column, and box.
   * @param rowIndex 
   * @param colIndex 
   * @param boxIndex 
   */
  constructor(rowIndex: number, colIndex:number, boxIndex:number) {
    // this._value = 0;   // no value
    this._candidates = new Array(10);
    // this.setAllCandidates();  // every value is candidate
    this._rowIndex = rowIndex;
    this._colIndex = colIndex;
    this._boxIndex = boxIndex;
    this.initialize();
  }

  initialize() {
    this._value = 0;          // empty, no value
    this.setAllCandidates();  // every value is candidate
  }

  get value() : number {
    return this._value;
  }

  set value(value: number) {
    this._value = value;
  }

  get candidates() : boolean[] {
    return this._candidates;
  }

  get rowIndex() : number {
    return this._rowIndex;
  }

  get colIndex() : number {
    return this._colIndex;
  }

  get boxIndex() : number {
    return this._boxIndex;
  }

  public hasValue() : boolean {
    return this._value > 0;
  }

  public countCandidates() : number {
    let count = 0;
    if (this.hasValue()) {
      return count;
    }
    for (let k of CANDIDATES) {
      if (this._candidates[k]) {
        count++;
      }
    }
    return count;
  }

  /**
   * Make every value a candidate.
   */
  public setAllCandidates() : void {
    for (let k of CANDIDATES) {
      this._candidates[k] = true;
    }
  } // setAllCandidates()

  /**
   * Clear all candidates.
   */
  public removeAllCandidates() : void {
    for (let k of CANDIDATES) {
      this._candidates[k] = false;
    }
  } // removeAllCandidates()

  // public copyCell() : Cell {
  //   let copiedCell: Cell = new Cell(this._rowIndex, this._colIndex, this._boxIndex);
  //   copiedCell._value = this._value;
  //   for (let k of CANDIDATES) {
  //     copiedCell._candidates[k] = this._candidates[k];
  //   }
  //   return copiedCell;
  // } // copyCell()

  public copyCell() : Cell {
    let toCell : Cell = new Cell(this.rowIndex, this.colIndex, this.boxIndex);
    toCell._value = this._value;
    for (let i = 0; i < this._candidates.length; i++) {
      toCell._candidates[i] = this._candidates[i];
    }
    return toCell;
  }

  public restoreCell(fromCell) : void {
    this._value = fromCell._value;
    for (let i = 0; i < this._candidates.length; i++) {
      this._candidates[i] = fromCell._candidates[i];
    }
    this._rowIndex = fromCell._rowIndex;
    this._colIndex = fromCell._colIndex;
    this._boxIndex = fromCell._boxIndex;
  }

} // class Cell
