import { HintType } from './hint.type';
import { Difficulty } from '../model/difficulty';

export class HintCounts {
  private _nakedSingles: number;

  private _hiddenSinglesRow: number;
  private _hiddenSinglesCol: number;
  private _hiddenSinglesBox: number;

  private _nakedPairsRow: number;
  private _nakedPairsCol: number;
  private _nakedPairsBox: number;

  private _pointingRows: number;
  private _pointingCols: number;

  private _rowBoxReductions: number;
  private _colBoxReductions: number;

  private _nakedTriplesRow: number;
  private _nakedTriplesCol: number;
  private _nakedTriplesBox: number;

  private _nakedQuadsRow: number;
  private _nakedQuadsCol: number;
  private _nakedQuadsBox: number;

  private _hiddenPairsRow: number;
  private _hiddenPairsCol: number;
  private _hiddenPairsBox: number;

  private _hiddenTriplesRow: number;
  private _hiddenTriplesCol: number;
  private _hiddenTriplesBox: number;

  private _hiddenQuadsRow: number;
  private _hiddenQuadsCol: number;
  private _hiddenQuadsBox: number;

  private _guesses: number;

  constructor() {
    this._nakedSingles = 0;

    this._hiddenSinglesRow = 0;
    this._hiddenSinglesCol = 0;
    this._hiddenSinglesBox = 0;

    this._nakedPairsRow = 0;
    this._nakedPairsCol = 0;
    this._nakedPairsBox = 0;

    this._pointingRows = 0;
    this._pointingCols = 0;

    this._rowBoxReductions = 0;
    this._colBoxReductions = 0;

    this._nakedTriplesRow = 0;
    this._nakedTriplesCol = 0;
    this._nakedTriplesBox = 0;

    this._nakedQuadsRow = 0;
    this._nakedQuadsCol = 0;
    this._nakedQuadsBox = 0;

    this._hiddenPairsRow = 0;
    this._hiddenPairsCol = 0;
    this._hiddenPairsBox = 0;

    this._hiddenTriplesRow = 0;
    this._hiddenTriplesCol = 0;
    this._hiddenTriplesBox = 0;

    this._hiddenQuadsRow = 0;
    this._hiddenQuadsCol = 0;
    this._hiddenQuadsBox = 0;

    this._guesses = 0;
  } // constructor

  get nakedSingles() : number {
    return this._nakedSingles;
  }

  get hiddenSinglesRow() : number {
    return this._hiddenSinglesRow;
  }
  get hiddenSinglesCol() : number {
    return this._hiddenSinglesCol;
  }
  get hiddenSinglesBox() : number {
    return this._hiddenSinglesBox;
  }

  get nakedPairsRow() : number {
    return this._nakedPairsRow;
  }
  get nakedPairsCol() : number {
    return this._nakedPairsCol;
  }
  get nakedPairsBox() : number {
    return this._nakedPairsBox;
  }

  get pointingRows() : number {
    return this._pointingRows;
  }
  get pointingCols() : number {
    return this._pointingCols;
  }

  get rowBoxReductions() : number {
    return this._rowBoxReductions;
  }
  get colBoxReductions() : number {
    return this._colBoxReductions;
  }

  get nakedTriplesRow() : number {
    return this._nakedTriplesRow;
  }
  get nakedTriplesCol() : number {
    return this._nakedTriplesCol;
  }
  get nakedTriplesBox() : number {
    return this._nakedTriplesBox;
  }

  get nakedQuadsRow() : number {
    return this._nakedQuadsRow;
  }
  get nakedQuadsCol() : number {
    return this._nakedQuadsCol;
  }
  get nakedQuadsBox() : number {
    return this._nakedQuadsBox;
  }

  get hiddenPairsRow() : number {
    return this._hiddenPairsRow;
  }
  get hiddenPairsCol() : number {
    return this._hiddenPairsCol;
  }
  get hiddenPairsBox() : number {
    return this._hiddenPairsBox;
  }

  get hiddenTriplesRow() : number {
    return this._hiddenTriplesRow;
  }
  get hiddenTriplesCol() : number {
    return this._hiddenTriplesCol;
  }
  get hiddenTriplesBox() : number {
    return this._hiddenTriplesBox;
  }

  get hiddenQuadsRow() : number {
    return this._hiddenQuadsRow;
  }
  get hiddenQuadsCol() : number {
    return this._hiddenQuadsCol;
  }
  get hiddenQuadsBox() : number {
    return this._hiddenQuadsBox;
  }

  get guesses() : number {
    return this._guesses;
  }


  set nakedSingles(n: number) {
    this._nakedSingles = n;
  }

  set hiddenSinglesRow(n: number) {
    this._hiddenSinglesRow = n;
  }
  set hiddenSinglesCol(n: number) {
    this._hiddenSinglesCol = n;
  }
  set hiddenSinglesBox(n: number) {
    this._hiddenSinglesBox = n;
  }

  set nakedPairsRow(n: number) {
    this._nakedPairsRow = n;
  }
  set nakedPairsCol(n: number) {
    this._nakedPairsCol = n;
  }
  set nakedPairsBox(n: number) {
    this._nakedPairsBox = n;
  }

  set pointingRows(n: number) {
    this._pointingRows = n;
  }
  set pointingCols(n: number) {
    this._pointingCols = n;
  }

  set rowBoxReductions(n: number) {
    this._rowBoxReductions = n;
  }
  set colBoxReductions(n: number) {
    this._colBoxReductions = n;
  }

  set nakedTriplesRow(n: number) {
    this._nakedTriplesRow = n;
  }
  set nakedTriplesCol(n: number) {
    this._nakedTriplesCol = n;
  }
  set nakedTriplesBox(n: number) {
    this._nakedTriplesBox = n;
  }

  set nakedQuadsRow(n: number) {
    this._nakedQuadsRow = n;
  }
  set nakedQuadsCol(n: number) {
    this._nakedQuadsCol = n;
  }
  set nakedQuadsBox(n: number) {
    this._nakedQuadsBox = n;
  }

  set hiddenPairsRow(n: number) {
    this._hiddenPairsRow = n;
  }
  set hiddenPairsCol(n: number) {
    this._hiddenPairsCol = n;
  }
  set hiddenPairsBox(n: number) {
    this._hiddenPairsBox = n;
  }

  set hiddenTriplesRow(n: number) {
    this._hiddenTriplesRow = n;
  }
  set hiddenTriplesCol(n: number) {
    this._hiddenTriplesCol = n;
  }
  set hiddenTriplesBox(n: number) {
    this._hiddenTriplesBox = n;
  }

  set hiddenQuadsRow(n: number) {
    this._hiddenQuadsRow = n;
  }
  set hiddenQuadsCol(n: number) {
    this._hiddenQuadsCol = n;
  }
  set hiddenQuadsBox(n: number) {
    this._hiddenQuadsBox = n;
  }

  set guesses(n: number) {
    this._guesses = n;
  }



  // nakedSingles: number = 0;

  // hiddenSinglesRow: number = 0;
  // hiddenSinglesCol: number = 0;
  // hiddenSinglesBox: number = 0;

  // nakedPairsRow: number = 0;
  // nakedPairsCol: number = 0;
  // nakedPairsBox: number = 0;

  // pointingRows: number = 0;
  // pointingCols: number = 0;

  // rowBoxReductions: number = 0;
  // colBoxReductions: number = 0;

  // nakedTriplesRow: number = 0;
  // nakedTriplesCol: number = 0;
  // nakedTriplesBox: number = 0;

  // nakedQuadsRow: number = 0;
  // nakedQuadsCol: number = 0;
  // nakedQuadsBox: number = 0;

  // hiddenPairsRow: number = 0;
  // hiddenPairsCol: number = 0;
  // hiddenPairsBox: number = 0;

  // hiddenTriplesRow: number = 0;
  // hiddenTriplesCol: number = 0;
  // hiddenTriplesBox: number = 0;

  // hiddenQuadsRow: number = 0;
  // hiddenQuadsCol: number = 0;
  // hiddenQuadsBox: number = 0;

  // guesses: number = 0;

  serialize() : string {
    return JSON.stringify({
      "nakedSingles": this._nakedSingles,

      "hiddenSinglesRow": this._hiddenSinglesRow,
      "hiddenSinglesCol": this._hiddenSinglesCol,
      "hiddenSinglesBox": this._hiddenSinglesBox,

      "nakedPairsRow": this._nakedPairsRow,
      "nakedPairsCol": this._nakedPairsCol,
      "nakedPairsBox": this._nakedPairsBox,

      "pointingRows": this._pointingRows,
      "pointingCols": this._pointingCols,

      "rowBoxReductions": this._rowBoxReductions,
      "colBoxReductions": this._colBoxReductions,

      "nakedTriplesRow": this._nakedTriplesRow,
      "nakedTriplesCol": this._nakedTriplesCol,
      "nakedTriplesBox": this._nakedTriplesBox,

      "nakedQuadsRow": this._nakedQuadsRow,
      "nakedQuadsCol": this._nakedQuadsCol,
      "nakedQuadsBox": this._nakedQuadsBox,

      "hiddenPairsRow": this._hiddenPairsRow,
      "hiddenPairsCol": this._hiddenPairsCol,
      "hiddenPairsBox": this._hiddenPairsBox,

      "hiddenTriplesRow": this._hiddenTriplesRow,
      "hiddenTriplesCol": this._hiddenTriplesCol,
      "hiddenTriplesBox": this._hiddenTriplesBox,

      "hiddenQuadsRow": this._hiddenQuadsRow,
      "hiddenQuadsCol": this._hiddenQuadsCol,
      "hiddenQuadsBox": this._hiddenQuadsBox,

      "guesses": this._guesses
    });
  }

  static deserialize(hintCountsData) : HintCounts {
// console.log('hintCountsData: ' + hintCountsData);
    let data = JSON.parse(hintCountsData);
    let hintCounts = new HintCounts();
    hintCounts.nakedSingles = data.nakedSingles;

    hintCounts.hiddenSinglesRow = data.hiddenSinglesRow;
    hintCounts.hiddenSinglesCol = data.hiddenSinglesCol;
    hintCounts.hiddenSinglesBox = data.hiddenSinglesBox;

    hintCounts.nakedPairsRow = data.nakedPairsRow;
    hintCounts.nakedPairsCol = data.nakedPairsCol;
    hintCounts.nakedPairsBox = data.nakedPairsBox;

    hintCounts.pointingRows = data.pointingRows;
    hintCounts.pointingCols = data.pointingCols;

    hintCounts.rowBoxReductions = data.rowBoxReductions;
    hintCounts.colBoxReductions = data.colBoxReductions;

    hintCounts.nakedTriplesRow = data.nakedTriplesRow;
    hintCounts.nakedTriplesCol = data.nakedTriplesCol;
    hintCounts.nakedTriplesBox = data.nakedTriplesBox;

    hintCounts.nakedQuadsRow = data.nakedQuadsRow;
    hintCounts.nakedQuadsCol = data.nakedQuadsCol;
    hintCounts.nakedQuadsBox = data.nakedQuadsBox;

    hintCounts.hiddenPairsRow = data.hiddenPairsRow;
    hintCounts.hiddenPairsCol = data.hiddenPairsCol;
    hintCounts.hiddenPairsBox = data.hiddenPairsBox;

    hintCounts.hiddenTriplesRow = data.hiddenTriplesRow;
    hintCounts.hiddenTriplesCol = data.hiddenTriplesCol;
    hintCounts.hiddenTriplesBox = data.hiddenTriplesBox;

    hintCounts.hiddenQuadsRow = data.hiddenQuadsRow;
    hintCounts.hiddenQuadsCol = data.hiddenQuadsCol;
    hintCounts.hiddenQuadsBox = data.hiddenQuadsBox;

    hintCounts.guesses = data.guesses;
    return hintCounts;
  }

  incrementHintCount(hintType: HintType) {
    switch (hintType) {
      case HintType.NAKED_SINGLE:
        this._nakedSingles++;
      case HintType.HIDDEN_SINGLE_ROW:
        this._hiddenSinglesRow++;
      case HintType.HIDDEN_SINGLE_COL:
        this._hiddenSinglesCol++;
      case HintType.HIDDEN_SINGLE_BOX:
        this._hiddenSinglesBox++;
      case HintType.NAKED_PAIRS_ROW:
        this._nakedPairsRow++;
      case HintType.NAKED_PAIRS_COL:
        this._nakedPairsCol++;
      case HintType.NAKED_PAIRS_BOX:
        this._nakedPairsBox++;
      case HintType.POINTING_ROW:
        this._pointingRows++;
      case HintType.POINTING_COL:
        this._pointingCols++;
      case HintType.ROW_BOX_REDUCTION:
        this._rowBoxReductions++;
      case HintType.COL_BOX_REDUCTION:
        this._colBoxReductions++;
      case HintType.NAKED_TRIPLES_ROW:
        this._nakedTriplesRow++;
      case HintType.NAKED_TRIPLES_COL:
        this._nakedTriplesCol++;
      case HintType.NAKED_TRIPLES_BOX:
        this._nakedTriplesBox++;
      case HintType.HIDDEN_PAIRS_ROW:
        this._hiddenPairsRow++;
      case HintType.HIDDEN_PAIRS_COL:
        this._hiddenPairsCol++;
      case HintType.HIDDEN_PAIRS_BOX:
        this._hiddenPairsBox++;
      case HintType.NAKED_QUADS_ROW:
        this._nakedQuadsRow++;
      case HintType.NAKED_QUADS_COL:
        this._nakedQuadsCol++;
      case HintType.NAKED_QUADS_BOX:
        this._nakedQuadsBox++;
      case HintType.HIDDEN_TRIPLES_ROW:
        this._hiddenTriplesRow++;
      case HintType.HIDDEN_TRIPLES_COL:
        this._hiddenTriplesCol++;
      case HintType.HIDDEN_TRIPLES_BOX:
        this._hiddenTriplesBox++;
      case HintType.HIDDEN_QUADS_ROW:
        this._hiddenQuadsRow++;
      case HintType.HIDDEN_QUADS_COL:
        this._hiddenQuadsCol++;
      case HintType.HIDDEN_QUADS_BOX:
        this._hiddenQuadsBox++;
      case HintType.GUESS:
        this._guesses++;
    }
  }

  getNakedSingles() : number {
    return this._nakedSingles;
  }

  getHiddenSingles() : number {
    return this._hiddenSinglesRow
         + this._hiddenSinglesCol
         + this._hiddenSinglesBox;
  }

  getNakedPairs() : number {
    return this._nakedPairsRow
         + this._nakedPairsCol
         + this._nakedPairsBox;
  }

  getPointingRowsCols() : number {
    return this._pointingRows
         + this._pointingCols;
  }

  getBoxReductions() : number {
    return this._rowBoxReductions
         + this._colBoxReductions;
  }

  getNakedTriples() : number {
    return this._nakedTriplesRow
         + this._nakedTriplesCol
         + this._nakedTriplesBox;
  }

  getNakedQuads() : number {
    return this._nakedQuadsRow
         + this._nakedQuadsCol
         + this._nakedQuadsBox;
  }

  getHiddenPairs() : number {
    return this._hiddenPairsRow
         + this._hiddenPairsCol
         + this._hiddenPairsBox;
  }

  getHiddenTriples() : number {
    return this._hiddenTriplesRow
         + this._hiddenTriplesCol
         + this._hiddenTriplesBox;
  }

  getHiddenQuads() : number {
    return this._hiddenQuadsRow
         + this._hiddenQuadsCol
         + this._hiddenQuadsBox;
  }

  getGuesses() : number {
    return this._guesses;
  }

  getTotalHints() : number {
    return 0 
      + this._nakedSingles 

      + this._hiddenSinglesRow 
      + this._hiddenSinglesCol 
      + this._hiddenSinglesBox

      + this._nakedPairsRow 
      + this._nakedPairsCol 
      + this._nakedPairsBox

      + this._pointingRows  
      + this._pointingCols

      + this._rowBoxReductions 
      + this._colBoxReductions

      + this._nakedTriplesRow 
      + this._nakedTriplesCol 
      + this._nakedTriplesBox

      + this._nakedQuadsRow
      + this._nakedQuadsCol
      + this._nakedQuadsBox

      + this._hiddenPairsRow 
      + this._hiddenPairsCol 
      + this._hiddenPairsBox

      + this._hiddenTriplesRow 
      + this._hiddenTriplesCol 
      + this._hiddenTriplesBox

      + this._hiddenQuadsRow 
      + this._hiddenQuadsCol 
      + this._hiddenQuadsBox

      + this._guesses;
  }

  /**
   * Determine the difficulty of a sudoku based on the techniques required to
   * achieve the solution.
   */
  public getActualDifficulty() : Difficulty {

    // HARDEST
    if (this._guesses > 0) {
      return Difficulty.HARDEST;
    } 
    
    // HARD
    if (   this.getNakedTriples()  > 0
        || this.getNakedQuads()    > 0
        || this.getHiddenPairs()   > 0
        || this.getHiddenTriples() > 0
        || this.getHiddenQuads()   > 0) {
      return Difficulty.HARD;
    }
    
    // MEDIUM
    if (   this.getNakedPairs()       > 0
        || this.getPointingRowsCols() > 0
        || this.getBoxReductions()    > 0) {
      return Difficulty.MEDIUM;
    }
    
    // EASY
    // if (   this.getHiddenSingles() > 0
    //     // || this.nakedSingles       > 0) {
    //     || this.getNakedSingles()  > 0) {
    //   return Difficulty.EASY;
    // }

    return  Difficulty.EASY;
  } // getDifficultyType()

  /**
   * Prints hint counts based on entries in the hint log. Some data are
   * supressed if zero.
   * 
   * Abbreviations
   * *   - R - row, C - column, or B - box
   * NS  - naked singles (row, column, or box doesn't matter)
   * HS* - hidden single (row/col/box)
   * NP* - naked pairs (row/col/box)
   * P*  - pointing (row/column)
   * *BR - (row/col) box reduction
   * NT* - naked triples (row/col/box)
   * NQ* - naked quads (row/col/box)
   * HP* - hidden pairs (row/col/box)
   * HT* - hidden triples (row/col/box)
   * HQ* - hidden quads (row/col/box)
   * G   - guesses  (row, column, or box doesn't matter)
   */
  public toString() : string {
    let s ='';
    // s += 'NS   : ' + this._nakedSingles + '\n'

    // s += 'HS*  : ' + this._hiddenSinglesRow + ', ' 
    //                + this._hiddenSinglesCol + ', ' 
    //                + this._hiddenSinglesBox + '\n';

    if (this._nakedPairsRow + this._nakedPairsCol + this._nakedPairsBox > 0) {
      s += 'NP*  : ' + this._nakedPairsRow + ', ' 
                     + this._nakedPairsCol + ', ' 
                     + this._nakedPairsBox + '\n';
    }

    if (this._pointingRows + this._pointingCols > 0) {
      s += 'P*   : ' + this._pointingRows  + ', ' 
                     + this._pointingCols + '\n';
    }

    if (this._rowBoxReductions + this._colBoxReductions > 0) {
      s += '*BR  : ' + this._rowBoxReductions + ', ' 
                     + this._colBoxReductions + '\n';
    }

    if (this._nakedTriplesRow + this._nakedTriplesCol + this._nakedTriplesBox > 0) {
      s += 'NT*  : ' + this._nakedTriplesRow + ', ' 
                     + this._nakedTriplesCol + ', ' 
                     + this._nakedTriplesBox + '\n';
    }

    if (this._nakedQuadsRow + this._nakedQuadsCol + this._nakedQuadsBox > 0) {
      s += 'NQ*  : ' + this._nakedQuadsRow + ', ' 
                     + this._nakedQuadsCol + ', ' 
                     + this._nakedQuadsBox + '\n';
    }

    if (this._hiddenPairsRow + this._hiddenPairsCol + this._hiddenPairsBox > 0) {
      s += 'HP*  : ' + this._hiddenPairsRow + ', ' 
                     + this._hiddenPairsCol + ', ' 
                     + this._hiddenPairsBox + '\n';
    }

    if (this._hiddenTriplesRow + this._hiddenTriplesCol + this._hiddenTriplesBox > 0) {
      s += 'HT*  : ' + this._hiddenTriplesRow + ', ' 
                     + this._hiddenTriplesCol + ', ' 
                     + this._hiddenTriplesBox + '\n';
    }

    if (this._hiddenQuadsRow + this._hiddenQuadsCol + this._hiddenQuadsBox > 0) {
      s += 'HQ*  : ' + this._hiddenQuadsRow + ', ' 
                     + this._hiddenQuadsCol + ', ' 
                     + this._hiddenQuadsBox + '\n';
    }

    if (this._guesses > 0) {
      s += 'G    : ' + this._guesses + '\n';
    }

    // s += 'Total: ' + this.getTotalHints();
    return s;
  }
  
}
