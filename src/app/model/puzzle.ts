import { Common }            from '../common/common';
import { Difficulty,
         DIFFICULTY_LABELS } from './difficulty';
import { HintCounts }        from '../hint/hintCounts';

export class Puzzle {
  private _initialValues: number[];
  private _completedPuzzle: number[];
  private _difficulty: Difficulty;
  private _generatePasses: number;
  private _solutionsCount: number;
  private _hintCounts: HintCounts;

  constructor() {
    this._initialValues = undefined;
    this._completedPuzzle = undefined;
    this._difficulty = undefined;
    this._generatePasses = undefined;
    this._solutionsCount = undefined;
    this._hintCounts = undefined;
  }

  serialize() : string {
    return JSON.stringify({
      "_initialValues": this._initialValues,
      "_completedPuzzle": this._completedPuzzle,
      "_difficulty": this._difficulty,
      "_generatePasses": this._generatePasses,
      "_solutionsCount": this._solutionsCount,
      "_hintCounts": this._hintCounts.serialize()
    });
  } // serialize()

  static deserialize(puzzleData) : Puzzle {
    let data = JSON.parse(puzzleData);
    let puzzle = new Puzzle();
    puzzle._initialValues = data._initialValues;
    puzzle._completedPuzzle = JSON.parse('[' + data._completedPuzzle + ']');
    puzzle._difficulty = data._difficulty;
    puzzle._generatePasses = data._generatePasses;
    puzzle._solutionsCount = data._solutionsCount;
    puzzle._hintCounts = HintCounts.deserialize(data._hintCounts);
    return puzzle;
  } // deserialize()

  get initialValues() : number[] {
    return this._initialValues;
  }

  set initialValues(initialValues: number[]) {
    this._initialValues = initialValues;
  }

  get completedPuzzle() : number[] {
    return this._completedPuzzle;
  }

  set completedPuzzle(completedPuzzle: number[]) {
    this._completedPuzzle = completedPuzzle;
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

  getInitialEmptyCells() {
    let emptyCells: number = 0;
    for (let i of this._initialValues) {
      if (i === 0) {
        emptyCells++;
      }
    }
    return emptyCells;
  }

  getInitialFilledCells() {
    let filledCells: number = 0;
    for (let i of this._initialValues) {
      if (i != 0) {
        filledCells++;
      }
    }
    return filledCells;
  }

  toString() : string {
    let s = '';
    s += '-Given/empty cells: ' 
        + this.getInitialFilledCells() + '/'
        + this.getInitialEmptyCells()  + '\n';
    s += '-Finished values:\n';
    s += Common.valuesArrayToString(this._completedPuzzle) + '\n';
    s += '-Difficulty: ' 
        + DIFFICULTY_LABELS[this._difficulty] + '\n'; 
    if (this._solutionsCount) {
      s += '-Solutions count: ' + this._solutionsCount + '\n';
    }
    if (this._hintCounts) {
      s += this._hintCounts.toString() + '\n';
    }
    return s;
  }

}