import { Common,
         VALUES } from '../common/common';

/*
 * A Group is a sub-element of a sudoku. A Group can be a sudoku row, column, 
 * or box. A Group contains 9 integer values called occurrences. Each 
 * occurrence represents a value 1..9 and the integer value (0..n) of each 
 * occurrence is the count of the number of times the value appears in the 
 * group. (The occurrences array size is 10 but occurrencs[0] is not used.)  
 * 
 * A sudoku will have 27 groups (9 each of rows, columns, and boxes).
 *
 * - If a Group at, say, index 4 (occurrences[4]) has a value of 0, that 
 * means the cell value of 4 does not appear in the Group object. 
 * - If the Group value at index 4 is 1. The cell value of 4 appears once
 * in the Group object. Note that every sudoku cell containing will appear 
 * in 3 Group objects: the row, column, and box that contain the cell.
 * - If the Group value at index 4 is greater than 1. The cell value of 4
 * appears more than once in the Group object -- possibly in the row, 
 * column, and box. This is an invalid entry and must be corrected.
 * 
 * Again, index 0 is not used.
 * 
 * State:
 * - vOccurrences (can be derived from cells)
 */
export class Group {
  private _vOccurrences: number[];
  private _cells: number[];

  constructor(groupCells: number[]) {
    this._vOccurrences = new Array(10);
    this._cells = groupCells;
    this.initialize();
  }

  /**
   * Initialize to all empty cells -- no cells in group have a value.
   * _vOccurrences[0] is not used. Indexes [1]..[9] corresponde to
   * sudoku values 1..9. The value of each _vOccurrences[x] will be
   * - vOccurrences[x] = 0 --> the value x (1..9) is not in any cell
   * - vOccurrences[x] = 1 --> the value x (1..9) is in one group cell
   * - vOccurrences[x] = 2 --> the value x (1..9) is in two group cells
   * The last case means the group (row, column, or box) is in an 
   * invalid state.
   */
  public initialize() {
    for (let v of VALUES) {
      this._vOccurrences[v] = 0;
    }
  }

  get vOccurrences() {
    return this._vOccurrences;
  }

  get cells() {
    return this._cells;
  }

  public copyGroup() : Group {
    let copiedGroup : Group = new Group(this._cells);
    for (let v of VALUES) {
      copiedGroup._vOccurrences[v] = this._vOccurrences[v];
    }
    return copiedGroup;
  }

  /**
   * Represent the state of a row, column, or box as a string. The "group"
   * parameter is the individual row, column, or box.
   */
  public toString() : string {
    let s = '';
    for (let v of VALUES) {
      // s += (group.vOccurrences[v] === 0) ? '.' : group.vOccurrences[v];
      s += (!this.hasValue(v)) ? '.' : v;
      if (v == 3 || v == 6) {
        s += ' ';
      }
    }
    s += ' ';
    for (let i = 0; i < this._cells.length; i++) {
      s += Common.pad(this._cells[i], 2) + ' ';
      if (i == 2 || i == 5) {
        s += ' ';
      }
    }
    return s;
  } // toString()

  private hasValue(v: number) : boolean {
    return this._vOccurrences[v] > 0;
  }

} // class Group
