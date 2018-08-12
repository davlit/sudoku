import { Common }               from '../common/common';
import { CELLS }                from '../common/common';
import { Difficulty }           from './difficulty';
import { DIFFICULTY_LABELS }    from './difficulty';
import { HintCounts }           from '../hint/hintCounts';

export class Sudoku {
  private _initialValues: number[];
  private _completedSudoku: number[];
  private _difficulty: Difficulty;
  private _generatePasses: number;
  private _solutionsCount: number;
  private _hintCounts: HintCounts;

  constructor() {
    this._initialValues = [];
    this._completedSudoku = [];
    this._difficulty = undefined;
    this._generatePasses = 0;
    this._solutionsCount = 0;
    this._hintCounts = undefined;
  }

  /**
   * Returns a blank sudoku.
   */
  static getEmptySudoku() {
    let emptySudoku = new Sudoku();
    for (let i of CELLS) {
        emptySudoku._initialValues.push(0);
    }
    return emptySudoku;
  }

  /**
   * Returns a sudoku serialized as a string.
   */
  serialize() : string {
    return JSON.stringify({
      "_initialValues": this._initialValues,
      "_completedSudoku": this._completedSudoku,
      "_difficulty": this._difficulty,
      "_generatePasses": this._generatePasses,
      "_solutionsCount": this._solutionsCount,
      "_hintCounts": this._hintCounts.serialize()
    });
  } // serialize()

  /**
   * Converts a string-serialized sudoku to an object.
   * 
   * @param sudokuData 
   */
  static deserialize(sudokuData: string) : Sudoku {

    console.info('sudokuData:\n' + sudokuData);

    let data = JSON.parse(sudokuData);
    let sudoku = new Sudoku();
    sudoku._initialValues = data._initialValues;
    sudoku._completedSudoku = JSON.parse('[' + data._completedSudoku + ']');
    sudoku._difficulty = data._difficulty;
    sudoku._generatePasses = data._generatePasses;
    sudoku._solutionsCount = data._solutionsCount;
    sudoku._hintCounts = HintCounts.deserialize(data._hintCounts);
    return sudoku;
  } // deserialize()

  get initialValues() : number[] {
    return this._initialValues;
  }

  set initialValues(initialValues: number[]) {
    this._initialValues = initialValues;
  }

  get completedSudoku() : number[] {
    return this._completedSudoku;
  }

  set completedSudoku(completedSudoku: number[]) {
    this._completedSudoku = completedSudoku;
  }

  get difficulty() : Difficulty {
    return this._difficulty;
  }

  set difficulty(difficulty: Difficulty) {
    this._difficulty = difficulty;
  }

  get generatePasses() : number {
    return this._generatePasses;
  }

  set generatePasses(generatePasses: number) {
    this._generatePasses = generatePasses;
  }

  get solutionsCount() : number {
    return this._solutionsCount;
  }

  set solutionsCount(solutionsCount: number) {
    this._solutionsCount = solutionsCount;
  }

  get hintCounts() : HintCounts {
    return this._hintCounts;
  }

  set hintCounts(hintCounts: HintCounts) {
    this._hintCounts = hintCounts;
  }

  /**
   * Counts the number of empty cells in the sudoku.
   */
  getInitialEmptyCells() : number {
    let emptyCells: number = 0;
    for (let i of this._initialValues) {
      if (i === 0) {
        emptyCells++;
      }
    }
    return emptyCells;
  }

  /**
   * Counts the number of given cells in the sudoku.
   */
  getInitialFilledCells() : number {
    let filledCells: number = 0;
    for (let i of this._initialValues) {
      if (i != 0) {
        filledCells++;
      }
    }
    return filledCells;
  }

  /**
   * Returns the sudoku as a displayable string.
   */
  toString() : string {
    let s = '';
    s += '-Given/empty cells: ' 
        + this.getInitialFilledCells() + '/'
        + this.getInitialEmptyCells()  + '\n';
    s += '-given values:\n';
    s += Common.valuesArrayToString(this._initialValues) + '\n';
    s += '-Finished values:\n';
    s += Common.valuesArrayToString(this._completedSudoku) + '\n';
    s += '-Difficulty: ';
    if (this._difficulty) {
      s += DIFFICULTY_LABELS[this._difficulty].label + '\n'; 
    } else {
      s += 'Pending\n';
    }
    if (this._solutionsCount) {
      s += '-Solutions count: ' + this._solutionsCount + '\n';
    }
    if (this._hintCounts) {
      s += this._hintCounts.toString() + '\n';
    }
    return s;
  }

}
