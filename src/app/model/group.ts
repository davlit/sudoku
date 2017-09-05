import { Common } from '../common/common';
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
  private _cells: number[];

  constructor(groupCells: number[]) {
    this._vOccurrences = new Array(10);
    this._cells = groupCells;
    this.initialize();
  }

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

  private hasValue(v: number) : boolean {
    return this._vOccurrences[v] > 0;
  }

} // class Group


// export class Group {
//   vOccurrences: number[];
//   cells: number[]

//   constructor(groupCells: number[]) {
//     this.vOccurrences = new Array(10);
//     for (let v of VALUES) {
//       this.vOccurrences[v] = 0;
//     }
//     this.cells = groupCells;
//   }

  // /**
  //  * 
  //  */
  // public containsValue(v: number) : boolean {
  //   // return this.vOccurrences[v] == 1;
  //   return this._vOccurrences[v] > 0;
  // }

//} // class Group

// export class Group {
//   private _vOccurrences: number[];  // number of occurrences of each value
//   // private cells: number[];
//   private _cellIndexes: number[];   // cell indexes of cells in group

//   constructor(groupCells: number[]) {
//     // this.vOccurrences = new Array(10);
//     // for (let v of VALUES) {
//     //   this.vOccurrences[v] = 0;
//     // }
//     this.initialize();
//     // this.cells = groupCells;
//     this._cellIndexes = groupCells;
//   }

//   /**
//    * Initialize to all empty cells -- no cells in group have a value.
//    * _vOccurrences[0] is not used. Indexes [1]..[9] corresponde to
//    * sudoku values 1..9. The value of each _vOccurrences[x] will be
//    * - vOccurrences[x] = 0 --> the value x (1..9) is not in any cell
//    * - vOccurrences[x] = 1 --> the value x (1..9) is in one group cell
//    * - vOccurrences[x] = 2 --> the value x (1..9) is in two group cells
//    * The last case means the group (row, column, or box) is in an 
//    * invalid state.
//    */
//   initialize() {
//     this._vOccurrences = [0,  0, 0, 0,  0, 0, 0,  0, 0, 0];
//   }

//   /**
//    * 
//    */
//   setValue(v) {
//     this._vOccurrences[v] = 1;
//   }

//   /**
//    * 
//    */
//   incrementOccurrence(v) {
//     this._vOccurrences[v]++;
//   }

//   /**
//    * 
//    */
//   decrementOccurrence(v) {
//     this._vOccurrences[v]--;
//   }

//   /**
//    * 
//    */
//   containsValue(v: number) : boolean {
//     // return this.vOccurrences[v] == 1;
//     return this._vOccurrences[v] > 0;
//   }

//   /**
//    * 
//    */
//   isValid() {
//     for (let v of VALUES) {
//       if (this._vOccurrences[v] > 1) {
//         return false;
//       }
//     }
//     return true;
//   }

//   /**
//    * 
//    */
//   openCellsCount() : number {
//     let count = 0;
//     for (let v of VALUES) {
//       if (this._vOccurrences[v] === 0) {
//         count++;
//       }
//     }
//     return count;
//   }

//   /**
//    * 
//    */
//   valueCellsCount() : number {
//     return 9 - this.openCellsCount();
//   }

//   /**
//    * 
//    */
//   get cellIndexes() : number[] {
//     return this._cellIndexes;
//   }

//   /**
//    * Represent the state of a row, column, or box as a string. The "group"
//    * parameter is the individual row, column, or box.
//    */
//   public toString() : string {
//     let s = '';
//     for (let v of VALUES) {
//       // s += (group.vOccurrences[v] === 0) ? '.' : group.vOccurrences[v];
//       s += (!this.containsValue(v)) ? '.' : v;
//       if (v == 3 || v == 6) {
//         s += ' ';
//       }
//     }
//     s += ' ';
//     for (let i = 0; i < this._cellIndexes.length; i++) {
//       s += Common.pad(this._cellIndexes[i], 2) + ' ';
//       if (i == 2 || i == 5) {
//         s += ' ';
//       }
//     }
//     return s;
//   }

// } // class Group


// export class Group {
//   private _vOccurrences: number[];
//   private _kOccurrences: number[];
//   private _groupCells: number[];

//   constructor(groupCells: number[]) {
//     this.initialize();
//     this._groupCells = groupCells;
//   }

//   get groupCells() : number[] {
//     return this._groupCells;
//   }

//   /**
//    * Initialize value occurrences to no values in group. 
//    * _vOccurrences[0] is not used.
//    */
//   initialize() : void {
//     this._vOccurrences = [0,  0, 0, 0,  0, 0, 0,  0, 0, 0];
//     this._kOccurrences = [0,  9, 9, 9,  9, 9, 9,  9, 9, 9];
//   }

//   // TESTING ONLY
//   setVOccurrences(vOccurrences: number[]) {
//     this._vOccurrences = vOccurrences;
//   }
        
//   /**
//    * Increment the count of times corresponding value is in group. 
//    * Typically this will be 0 -> 1.
//    */
//   addValue(value: number) : void { 	
//     this._vOccurrences[value]++;
//   }

//   /**
//    * Decrement number of times corresponding value is in group. 
//    * Typically this will be 1 -> 0.
//    */
//   removeValue(value: number) : void {   
//     this._vOccurrences[value]--;
//   }

//   /**
//    * Returns true if given value appears in the group.
//    */
//   containsValue(value: number) : boolean {
//     return this._vOccurrences[value] > 0;
//   }

//   /**
//    * A group is valid if any value if no values occur more than once 
//    * in the group.
//    */
//   isValid() : boolean {
//     for (let v of VALUES) {
//       if (this._vOccurrences[v] > 1) {
//         return false;    // stop and return group not valid
//       }
//     }
//     return true;
//   }

//   /**
//    * Determines if group is complete. That is, if any occurrence in 
//    * the group does not hold a value of 1, then the group is not 
//    * complete or is invalid. Equivalently, if every occurrence (1..9) 
//    * contains a 1, the group is complete (and valid).
//    * 
//    * Returns true if group is complete (and valid).
//    */
//   isComplete() : boolean {
//     for (let v of VALUES) {
//       if (this._vOccurrences[v] != 1) {
//         return false;
//       }
//     }
//     return true;
//   }

//   /**
//    * Return the number of closed cells in the group.
//    * A closed cell has a value. Sometimes called a value cell. It can be closed
//    * by having an initial given value or by having a value assigned in solving
//    * the sudoku. A closed cell cannot have any candidates.
//    */
//   getClosedCellsCount() {
//     let count = 0;
//     for (let v of VALUES) {
//       if (this._vOccurrences[v] > 0) {
//         count++;
//       }
//     }
//     return count;
//   }

//   /**
//    * Return the number of open cells in the group.
//    * An open cell does not have a value and will normally have 1 or more 
//    * candidates. If a cell does not have a value and has no candidates the
//    * sudoku cannot be solved in its current state.
//    */
//   getOpenCellsCount() {
//     return 9 - this.getOpenCellsCount();
//   }

//   /**
//    * Increment the count of times corresponding candidate is in group. 
//    */
//   addCandidate(candidate: number) : void { 	
//     this._kOccurrences[candidate]++;
//   }

//   /**
//    * Decrement number of times corresponding candidate is in group. 
//    */
//   removeCandidate(candidate: number) : void {   
//     this._kOccurrences[candidate]--;
//   }

//   /**
//    * Make the group full. Every value 1..9 is present once in the group
//    */
//   setComplete() {
//     this._vOccurrences = [0,  1, 1, 1,  1, 1, 1,  1, 1, 1];
//   }

//   /**
//    * Represent the state of the group as a string.
//    */
//   toString() : string {
//     let s = '';
//     for (let v of VALUES) {
//       s += (this._vOccurrences[v] === 0) ? '.' : this._vOccurrences[v];
//       if (v == 3 || v == 6) {
//         s += ' ';
//       }
//     }
//     s += '|';
//     for (let k of VALUES) {
//       s += (this._kOccurrences[k] === 0) ? '.' : this._kOccurrences[k];
//       if (k == 3 || k == 6) {
//         s += ' ';
//       }
//     }
//     if (!this.isValid()) {
//       s += ' * * *';
//     }
//     return s;
//   }
        
// }
