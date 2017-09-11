import { Common }            from '../common/common';
import { Difficulty,
         DIFFICULTY_LABELS } from './difficulty';
import { HintCounts }        from '../hint/hintCounts';

export class Puzzle {
  private _initialValues: number[];
  private _completedPuzzle: number[];
  private _desiredDifficulty: Difficulty;
  private _actualDifficulty: Difficulty;
  private _generatePasses: number;
  private _solutionsCount: number;
  private _stats: HintCounts;

  constructor() {
    this._initialValues = undefined;
    this._completedPuzzle = undefined;
    this._desiredDifficulty = undefined;
    this._actualDifficulty = undefined;
    this._generatePasses = undefined;
    this._solutionsCount = undefined;
    this._stats = undefined;
  }

  serialize() : string {
    return JSON.stringify({
      "_initialValues": this._initialValues,
      "_completedPuzzle": this._completedPuzzle,
      "_desiredDifficulty": this._desiredDifficulty,
      "_actualDifficulty": this._actualDifficulty,
      "_generatePasses": this._generatePasses,
      "_solutionsCount": this._solutionsCount,
      "_stats": this._stats.serialize()
    });
  } // serialize()

  static deserialize(puzzleData) : Puzzle {
    let data = JSON.parse(puzzleData);
    let puzzle = new Puzzle();
    puzzle._initialValues = data._initialValues;
    puzzle._completedPuzzle = JSON.parse('[' + data._completedPuzzle + ']');
    puzzle._desiredDifficulty = data._desiredDifficulty;
    puzzle._actualDifficulty = data._actualDifficulty;
    puzzle._generatePasses = data._generatePasses;
    puzzle._solutionsCount = data._solutionsCount;
    puzzle._stats = HintCounts.deserialize(data._stats);
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

  get desiredDifficulty() : Difficulty {
    return this._desiredDifficulty;
  }

  set desiredDifficulty(difficulty: Difficulty) {
    this._desiredDifficulty = difficulty;
  }

  get actualDifficulty() : Difficulty {
    return this._actualDifficulty;
  }

  set actualDifficulty(difficulty: Difficulty) {
    this._actualDifficulty = difficulty;
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

  get stats() : HintCounts {
    return this._stats;
  }

  set stats(stats: HintCounts) {
    this._stats = stats;
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
        + DIFFICULTY_LABELS[this._actualDifficulty] + '\n'; 
    if (this._solutionsCount) {
      s += '-Solutions count: ' + this._solutionsCount + '\n';
    }
    if (this._stats) {
      s += this._stats.toString() + '\n';
    }
    return s;
  }

}
