import { VALUES } from '../common/common';

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
  private _kOccurrences: number[];
  private _groupCells: number[];

  constructor(groupCells: number[]) {
    this.initialize();
    this._groupCells = groupCells;
  }

  get groupCells() : number[] {
    return this._groupCells;
  }

  /**
   * Initialize value occurrences to no values in group. 
   * _vOccurrences[0] is not used.
   */
  initialize() : void {
    this._vOccurrences = [0,  0, 0, 0,  0, 0, 0,  0, 0, 0];
    this._kOccurrences = [0,  9, 9, 9,  9, 9, 9,  9, 9, 9];
  }

  // TESTING ONLY
  setVOccurrences(vOccurrences: number[]) {
    this._vOccurrences = vOccurrences;
  }
        
  /**
   * Increment the count of times corresponding value is in group. 
   * Typically this will be 0 -> 1.
   */
  addValue(value: number) : void { 	
    this._vOccurrences[value]++;
  }

  /**
   * Decrement number of times corresponding value is in group. 
   * Typically this will be 1 -> 0.
   */
  removeValue(value: number) : void {   
    this._vOccurrences[value]--;
  }

  /**
   * Returns true if given value appears in the group.
   */
  containsValue(value: number) : boolean {
    return this._vOccurrences[value] > 0;
  }

  /**
   * A group is valid if any value if no values occur more than once 
   * in the group.
   */
  isValid() : boolean {
    for (let v of VALUES) {
      if (this._vOccurrences[v] > 1) {
        return false;    // stop and return group not valid
      }
    }
    return true;
  }

  /**
   * Determines if group is complete. That is, if any occurrence in 
   * the group does not hold a value of 1, then the group is not 
   * complete or is invalid. Equivalently, if every occurrence (1..9) 
   * contains a 1, the group is complete (and valid).
   * 
   * Returns true if group is complete (and valid).
   */
  isComplete() : boolean {
    for (let v of VALUES) {
      if (this._vOccurrences[v] != 1) {
        return false;
      }
    }
    return true;
  }

  getValueCellsCount() : number {
    let count: number = 0;
    for (let v of VALUES) {
      count += this._vOccurrences[v]
      // or
      if (this._vOccurrences[v] > 0) {
        count++;
      }
    }
    return count;
  }

  /**
   * Increment the count of times corresponding candidate is in group. 
   */
  addCandidate(candidate: number) : void { 	
    this._kOccurrences[candidate]++;
  }

  /**
   * Decrement number of times corresponding candidate is in group. 
   */
  removeCandidate(candidate: number) : void {   
    this._kOccurrences[candidate]--;
  }

  /**
   * Make the group full. Every value 1..9 is present once in the group
   */
  setComplete() {
    this._vOccurrences = [0,  1, 1, 1,  1, 1, 1,  1, 1, 1];
  }

  /**
   * Represent the state of the group as a string.
   */
  toString() : string {
    let s = '';
    for (let v of VALUES) {
      s += (this._vOccurrences[v] === 0) ? '.' : this._vOccurrences[v];
      if (v == 3 || v == 6) {
        s += ' ';
      }
    }
    s += '|';
    for (let k of VALUES) {
      s += (this._kOccurrences[k] === 0) ? '.' : this._kOccurrences[k];
      if (k == 3 || k == 6) {
        s += ' ';
      }
    }
    if (!this.isValid()) {
      s += ' * * *';
    }
    return s;
  }
        
}
