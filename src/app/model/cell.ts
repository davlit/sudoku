import { NakedType } from './naked.type';
import { CANDIDATES } from '../common/common';

/**
 * Cell is one of the 81 cells in a standard sudoku.
 * 
 * State:
 * - value
 * - candidates
 * - locked (boolean)
 */
export class Cell {
  private _value: number;
  private _candidates: boolean[];
  private _locked: boolean;
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
    this._value = 0;   // no value
    this._candidates = new Array(10);
    this.setAllCandidates();  // every value is candidate
    this._rowIndex = rowIndex;
    this._colIndex = colIndex;
    this._boxIndex = boxIndex;
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

  get locked() : boolean {
    return this._locked;
  }

  set locked(locked: boolean) {
    this._locked = locked;
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

  // set value(value: number) {
  //   this._value = value;
  // }

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
  public unsetAllCandidates() : void {
    for (let k of CANDIDATES) {
      this._candidates[k] = false;
    }
  } // unsetAllCandidates()

  

} // class Cell


//  export class Cell {
//   private _value: number;
//   private _candidates: boolean[];
//   private _locked: boolean;
//   private _rowIndex: number;
//   private _colIndex: number;
//   private _boxIndex: number;

//   /**
//    * Initialize the cell to empty: no value and all candidates. Give the cell
//    * a reference to its row, column, and box.
//    * @param row 
//    * @param col 
//    * @param box 
//    */
//   constructor(rowIndex: number, colIndex: number, boxIndex:number) {
//     this._value = 0;   // no value
//     this._candidates = new Array(10);
//     this.setAllCandidates();  // every value is candidate
//     this._rowIndex = rowIndex;
//     this._colIndex = colIndex;
//     this._boxIndex = boxIndex;
//   }

//   get rowIndex() {
//     return this._rowIndex;
//   }

//   get colIndex() {
//     return this._colIndex;
//   }

//   get boxIndex() {
//     return this._boxIndex;
//   }

//   get value() {
//     return this._value;
//   }

//   set value(value) {
//     this._value = value;
//   }

//   get locked() {
//     return this._locked
//   }

//   public isLocked() : boolean {
//     return this._locked
//   }

//   public lock() : void {
//     this._locked = true;
//   }

//   public unlock() : void {
//     this._locked = false;
//   }

//   public isCandidate(k: number) : boolean {
//     return this._candidates[k];
//   }

//   public setCandidate(k: number) : void {
//     this._candidates[k] = true;
//   }

//   public removeCandidate(k: number) : void {
//     this._candidates[k] = false;
//   }

//   /**
//    * Make every value a candidate.
//    */
//   public setAllCandidates() : void {
//     for (let k of CANDIDATES) {
//       this._candidates[k] = true;
//     }
//   } // setAllCandidates()

//   /**
//    * Clear all candidates.
//    */
//   public unsetAllCandidates() : void {
//     for (let k of CANDIDATES) {
//       this._candidates[k] = false;
//     }
//   } // unsetAllCandidates()

// } // class Cell

// export class Cell {
//   private value: number;
//   private candidates: number[];
//   private locked: boolean;

//   constructor() {
//     this.initialize();
//   }

//   /**
//    * 
//    */
//   initialize() {
//     this.value = 0;               // value 1..9, 0 means no value
//     this.locked = false;          // cell has original given value
//     this.initializeCandidates();
//   }

//   // TESTING ONLY
//   setCandidates(candidates: number[]) {
//     this.candidates = [0,  0, 0, 0,  0, 0, 0,  0, 0, 0];
//     for (let k of candidates) {
//       this.candidates[k] = 1;
//     }
//   }

//   /**
//    * Cell must have a value. candidates[0] is not used.
//    */
//   unsetAllCandidates() {
//     if (this.value != 0) {
//       this.candidates = [0,  0, 0, 0,  0, 0, 0,  0, 0, 0];
//     }
//   }

//   /**
//    * Every value is a candidate. candidates[0] is not used.
//    */
//   initializeCandidates() {
//     if (this.value === 0) {
//       this.candidates = [0,  1, 1, 1, 1, 1, 1, 1, 1, 1];
//     }
//   }

//   /**
//    * Set cell value to 1..9. Remove existing candidates.
//    */
//   setValue(newValue: number) {
//     this.value = newValue;	// set cell's new value
//     for (let k of CANDIDATES) {
//       if (this.candidates[k] === 1) {
//         this.candidates[k] = 0;
//       }
//     }
//   }
  
//   /**
//    * Set cell value to 1..9. Remove existing candidates.
//    */
//   setInitialValue(newValue: number) {
//     this.value = newValue;	// set cell's new value
//     this.unsetAllCandidates();
//     this.locked = true;
//   }

//   /**
//    * Set cell value, unset all candidates and keep the cell unlocked.
//    */
//   setRawValue(newValue: number) {
//     this.value = newValue;	// set cell's new value
//     this.unsetAllCandidates();
//     this.locked = false;
//   }
  
//   /**
//    * Remove cell value. WARNING: 1 or more candidates must be added.
//    */
//   removeValue() {
//     this.value = 0;
//   }

//   /**
//    * Get the value in this cell. Zero means no value.
//    */
//   getValue() {
//     return this.value;
//   }

//   /**
//    * Determine if cell is valid. If the cell has a value, it cannot have any
//    * candidates. If the cell does not have a value, it must have one or more
//    * candidates.
//    */
//   isValid() : boolean {
//     let cands = false;
//     for (let k of CANDIDATES) {
//       if (this.candidates[k] === 1) {
//         cands = true;
//         break;
//       }
//     }
//     let value = this.hasValue();
//     if (value && cands) {
//       // console.log('Cell has value and candidate(s)!');
//       return false;
//     }
//     if (!value && !cands) {
//       // console.log('Cell has no value and no candidate(s)!');
//       return false;
//     }
//     return true;
//   } // isValid()

//   /**
//    * 
//    */
//   isImpossible() {
//     return this.value === 0 && this.getNumberOfCandidates() === 0;
//   }

//   /**
//    * Get an array of candidates.
//    */
//   getCandidates() : number[] {
//     if (this.hasValue()) {
//       return [];
//     }
//     let candidates: number[] = [];
//     for (let k of CANDIDATES) {
//       if (this.candidates[k] === 1) {
//         candidates.push(k);
//       }
//     }
//     return candidates;
//   }
  
//   /**
//    * Returns the number of candidates in cell.
//    */
//   getNumberOfCandidates() {
//     if (this.hasValue()) {
//       return 0;
//     }
//     let count = 0;
//     for (let k of CANDIDATES) {
//       if (this.candidates[k] === 1) {
//         count++;
//       }
//     }
//     return count;
//   }

//   /**
//    * Determine if the cell is locked. A locked cell has a value that cannot
//    * be changed. Cells with initial or given values are locked.
//    */
//   isLocked() {
//     return this.locked;
//   }

//   /**
//    * Lock the cell. When initialized, the cell is not locked.
//    */
//   setLocked() {
//     if (this.hasValue()) {
//       this.locked = true; 
//     }
//   }

//   /**
//    * Determines if cell has a value 1..9.
//    */
//   hasValue() : boolean {
//     return this.value > 0;
//   }
  
//   /**
//    * Add a cell candidate.
//    * - candidate cannot add candidate if cell has a value
//    */
//   addCandidate(k: number) {
//     if (this.value > 0) {
//       console.error('Cannot add candidate; cell has a value.')
//       return;
//     }
//     if (this.candidates[k] < 1) {
//       this.candidates[k] = 1;
//     }
//   }
  
//   /**
//    * 
//    */
//   // new
//   // removeCandidate(k: number, round: number) {
//   removeCandidate(k: number) : void {
//     if (this.candidates[k] === 1) {
//       this.candidates[k] = 0;
//     }
//   }

//   /**
//    * 
//    */
//   restoreCandidate(k: number) {
//     this.candidates[k] = 1;
//   }
  
//   /**
//    * 
//    */
//   isCandidate(k: number) {
//     return this.candidates[k] === 1;
//   }

//   /**
//    * Given a candidate, or zero if none, return the next available candidate.
//    */
//   getNextCandidate(n: number) : number {
//     for (let k = n + 1; k < CANDIDATES.length; k++) {
//       if (this.candidates[k] === 1) {
//         return k;
//       }
//     }
//     return undefined;
//   }
  
//   /**
//    * Returns an array of cell's candidates where the number of candidates is
//    * is greater than 0 but less than or equal to the number specified by the
//    * naked type. For NakedType.SINGLE, PAIR, TRIPLE, QUAD the number of 
//    * candidates in the array are 1, 1..2, 1..3, and 1..4.
//    */
//   findNakedCandidates(nakedType: NakedType) : number[] {
//     let maxCandidates = 0;
//     switch (nakedType) {
//       case NakedType.SINGLE:
//         maxCandidates = 1;
//         break;
//       case NakedType.PAIR:
//         maxCandidates = 2;
//         break;
//       case NakedType.TRIPLE:
//         maxCandidates = 3;
//         break;
//       case NakedType.QUAD:
//         maxCandidates = 4;
//     }
//     let nakeds: number[] = [];
//     if (this.value > 0) {   // no candidates in cell
//       return nakeds;
//     }
//     for (let k of CANDIDATES) {
//       if (this.candidates[k] === 1) {
//         nakeds.push(k);
//         if (nakeds.length > maxCandidates) {
//           return [];  // to many k's in this cell
//         }
//       }
//     } // next k
//     return nakeds;  // cell has maxCandidates or fewer
//   }
    
//   /**
//    * Represent the state of the cell as a string.
//    */
//   toString() : string {
//     let s = 'v:' + (this.value != 0 ? this.value : '.');
//     s += ' k:';
//     for (let k of CANDIDATES) {
//       s += (this.candidates[k] === 1) ? k : '.';
//     }
//     if (!this.isValid()) {
//       s += ' * * *';
//     }
//     return s;
//   }

// }
