import { HintType } from './hint.type';
import { Difficulty } from '../model/difficulty';

export class HintCounts {

  constructor() {}

  nakedSingles: number = 0;

  hiddenSinglesRow: number = 0;
  hiddenSinglesCol: number = 0;
  hiddenSinglesBox: number = 0;

  nakedPairsRow: number = 0;
  nakedPairsCol: number = 0;
  nakedPairsBox: number = 0;

  pointingRows: number = 0;
  pointingCols: number = 0;

  rowBoxReductions: number = 0;
  colBoxReductions: number = 0;

  nakedTriplesRow: number = 0;
  nakedTriplesCol: number = 0;
  nakedTriplesBox: number = 0;

  nakedQuadsRow: number = 0;
  nakedQuadsCol: number = 0;
  nakedQuadsBox: number = 0;

  hiddenPairsRow: number = 0;
  hiddenPairsCol: number = 0;
  hiddenPairsBox: number = 0;

  hiddenTriplesRow: number = 0;
  hiddenTriplesCol: number = 0;
  hiddenTriplesBox: number = 0;

  hiddenQuadsRow: number = 0;
  hiddenQuadsCol: number = 0;
  hiddenQuadsBox: number = 0;

  guesses: number = 0;

  serialize() : string {
    return JSON.stringify({
      "nakedSingles": this.nakedSingles,

      "hiddenSinglesRow": this.hiddenSinglesRow,
      "hiddenSinglesCol": this.hiddenSinglesCol,
      "hiddenSinglesBox": this.hiddenSinglesBox,

      "nakedPairsRow": this.nakedPairsRow,
      "nakedPairsCol": this.nakedPairsCol,
      "nakedPairsBox": this.nakedPairsBox,

      "pointingRows": this.pointingRows,
      "pointingCols": this.pointingCols,

      "rowBoxReductions": this.rowBoxReductions,
      "colBoxReductions": this.colBoxReductions,

      "nakedTriplesRow": this.nakedTriplesRow,
      "nakedTriplesCol": this.nakedTriplesCol,
      "nakedTriplesBox": this.nakedTriplesBox,

      "nakedQuadsRow": this.nakedQuadsRow,
      "nakedQuadsCol": this.nakedQuadsCol,
      "nakedQuadsBox": this.nakedQuadsBox,

      "hiddenPairsRow": this.hiddenPairsRow,
      "hiddenPairsCol": this.hiddenPairsCol,
      "hiddenPairsBox": this.hiddenPairsBox,

      "hiddenTriplesRow": this.hiddenTriplesRow,
      "hiddenTriplesCol": this.hiddenTriplesCol,
      "hiddenTriplesBox": this.hiddenTriplesBox,

      "hiddenQuadsRow": this.hiddenQuadsRow,
      "hiddenQuadsCol": this.hiddenQuadsCol,
      "hiddenQuadsBox": this.hiddenQuadsBox,

      "guesses": this.guesses
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
        this.nakedSingles++;
      case HintType.HIDDEN_SINGLE_ROW:
        this.hiddenSinglesRow++;
      case HintType.HIDDEN_SINGLE_COL:
        this.hiddenSinglesCol++;
      case HintType.HIDDEN_SINGLE_BOX:
        this.hiddenSinglesBox++;
      case HintType.NAKED_PAIRS_ROW:
        this.nakedPairsRow++;
      case HintType.NAKED_PAIRS_COL:
        this.nakedPairsCol++;
      case HintType.NAKED_PAIRS_BOX:
        this.nakedPairsBox++;
      case HintType.POINTING_ROW:
        this.pointingRows++;
      case HintType.POINTING_COL:
        this.pointingCols++;
      case HintType.ROW_BOX_REDUCTION:
        this.rowBoxReductions++;
      case HintType.COL_BOX_REDUCTION:
        this.colBoxReductions++;
      case HintType.NAKED_TRIPLES_ROW:
        this.nakedTriplesRow++;
      case HintType.NAKED_TRIPLES_COL:
        this.nakedTriplesCol++;
      case HintType.NAKED_TRIPLES_BOX:
        this.nakedTriplesBox++;
      case HintType.HIDDEN_PAIRS_ROW:
        this.hiddenPairsRow++;
      case HintType.HIDDEN_PAIRS_COL:
        this.hiddenPairsCol++;
      case HintType.HIDDEN_PAIRS_BOX:
        this.hiddenPairsBox++;
      case HintType.NAKED_QUADS_ROW:
        this.nakedQuadsRow++;
      case HintType.NAKED_QUADS_COL:
        this.nakedQuadsCol++;
      case HintType.NAKED_QUADS_BOX:
        this.nakedQuadsBox++;
      case HintType.HIDDEN_TRIPLES_ROW:
        this.hiddenTriplesRow++;
      case HintType.HIDDEN_TRIPLES_COL:
        this.hiddenTriplesCol++;
      case HintType.HIDDEN_TRIPLES_BOX:
        this.hiddenTriplesBox++;
      case HintType.HIDDEN_QUADS_ROW:
        this.hiddenQuadsRow++;
      case HintType.HIDDEN_QUADS_COL:
        this.hiddenQuadsCol++;
      case HintType.HIDDEN_QUADS_BOX:
        this.hiddenQuadsBox++;
      case HintType.GUESS:
        this.guesses++;
    }
  }

  getNakedSingles() : number {
    return this.nakedSingles;
  }

  getHiddenSingles() : number {
    return this.hiddenSinglesRow
         + this.hiddenSinglesCol
         + this.hiddenSinglesBox;
  }

  getNakedPairs() : number {
    return this.nakedPairsRow
         + this.nakedPairsCol
         + this.nakedPairsBox;
  }

  getPointingRowsCols() : number {
    return this.pointingRows
         + this.pointingCols;
  }

  getBoxReductions() : number {
    return this.rowBoxReductions
         + this.colBoxReductions;
  }

  getNakedTriples() : number {
    return this.nakedTriplesRow
         + this.nakedTriplesCol
         + this.nakedTriplesBox;
  }

  getNakedQuads() : number {
    return this.nakedQuadsRow
         + this.nakedQuadsCol
         + this.nakedQuadsBox;
  }

  getHiddenPairs() : number {
    return this.hiddenPairsRow
         + this.hiddenPairsCol
         + this.hiddenPairsBox;
  }

  getHiddenTriples() : number {
    return this.hiddenTriplesRow
         + this.hiddenTriplesCol
         + this.hiddenTriplesBox;
  }

  getHiddenQuads() : number {
    return this.hiddenQuadsRow
         + this.hiddenQuadsCol
         + this.hiddenQuadsBox;
  }

  getGuesses() : number {
    return this.guesses;
  }

  getTotalHints() : number {
    return 0 
      + this.nakedSingles 

      + this.hiddenSinglesRow 
      + this.hiddenSinglesCol 
      + this.hiddenSinglesBox

      + this.nakedPairsRow 
      + this.nakedPairsCol 
      + this.nakedPairsBox

      + this.pointingRows  
      + this.pointingCols

      + this.rowBoxReductions 
      + this.colBoxReductions

      + this.nakedTriplesRow 
      + this.nakedTriplesCol 
      + this.nakedTriplesBox

      + this.nakedQuadsRow
      + this.nakedQuadsCol
      + this.nakedQuadsBox

      + this.hiddenPairsRow 
      + this.hiddenPairsCol 
      + this.hiddenPairsBox

      + this.hiddenTriplesRow 
      + this.hiddenTriplesCol 
      + this.hiddenTriplesBox

      + this.hiddenQuadsRow 
      + this.hiddenQuadsCol 
      + this.hiddenQuadsBox

      + this.guesses;
  }

  /**
   * Determine the difficulty of a sudoku based on the techniques required to
   * achieve the solution.
   */
  getActualDifficulty() : Difficulty {

    // HARDEST
    if (this.guesses > 0) {
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
    if (   this.getHiddenSingles() > 0
        || this.nakedSingles       > 0) {
      return Difficulty.EASY;
    }

    return  Difficulty.EASY;
  } // getDifficultyType()

  /**
   * 
   */
  toString() : string {
    let s ='';
    // s += 'NS   : ' + this.nakedSingles + '\n'

    // s += 'HS*  : ' + this.hiddenSinglesRow + ', ' 
    //                + this.hiddenSinglesCol + ', ' 
    //                + this.hiddenSinglesBox + '\n';

    if (this.nakedPairsRow + this.nakedPairsCol + this.nakedPairsBox > 0) {
      s += 'NP*  : ' + this.nakedPairsRow + ', ' 
                     + this.nakedPairsCol + ', ' 
                     + this.nakedPairsBox + '\n';
    }

    if (this.pointingRows + this.pointingCols > 0) {
      s += 'P*   : ' + this.pointingRows  + ', ' 
                     + this.pointingCols + '\n';
    }

    if (this.rowBoxReductions + this.colBoxReductions > 0) {
      s += '*BR  : ' + this.rowBoxReductions + ', ' 
                     + this.colBoxReductions + '\n';
    }

    if (this.nakedTriplesRow + this.nakedTriplesCol + this.nakedTriplesBox > 0) {
      s += 'NT*  : ' + this.nakedTriplesRow + ', ' 
                     + this.nakedTriplesCol + ', ' 
                     + this.nakedTriplesBox + '\n';
    }

    if (this.nakedQuadsRow + this.nakedQuadsCol + this.nakedQuadsBox > 0) {
      s += 'NQ*  : ' + this.nakedQuadsRow + ', ' 
                     + this.nakedQuadsCol + ', ' 
                     + this.nakedQuadsBox + '\n';
    }

    if (this.hiddenPairsRow + this.hiddenPairsCol + this.hiddenPairsBox > 0) {
      s += 'HP*  : ' + this.hiddenPairsRow + ', ' 
                     + this.hiddenPairsCol + ', ' 
                     + this.hiddenPairsBox + '\n';
    }

    if (this.hiddenTriplesRow + this.hiddenTriplesCol + this.hiddenTriplesBox > 0) {
      s += 'HT*  : ' + this.hiddenTriplesRow + ', ' 
                     + this.hiddenTriplesCol + ', ' 
                     + this.hiddenTriplesBox + '\n';
    }

    if (this.hiddenQuadsRow + this.hiddenQuadsCol + this.hiddenQuadsBox > 0) {
      s += 'HQ*  : ' + this.hiddenQuadsRow + ', ' 
                     + this.hiddenQuadsCol + ', ' 
                     + this.hiddenQuadsBox + '\n';
    }

    if (this.guesses > 0) {
      s += 'G    : ' + this.guesses + '\n';
    }

    // s += 'Total: ' + this.getTotalHints();
    return s;
  }
  
}
