import { Common } from '../common/common';
import { Difficulty } from './difficulty';
import { HintCounts } from '../hint/hintCounts';

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
    this._actualDifficulty = undefined;
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
// console.log(puzzleData.getStats());
    let data = JSON.parse(puzzleData);
    let puzzle = new Puzzle();
    puzzle._initialValues = data._initialValues;
    puzzle._completedPuzzle = data._completedPuzzle;
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

  static getDifficultyLabel(difficulty: Difficulty) : string {
    switch (difficulty) {
      // case Difficulty.UNKNOWN:
      //   return 'Unknown';
      case Difficulty.EASY:
        return 'Easy';
      case Difficulty.MEDIUM:
        return 'Medium';
      case Difficulty.HARD:
        return 'Hard';
      case Difficulty.HARDEST:
        return 'Hardest';
    }
  }

  toString() : string {
    let s = '';
    s += '-Initial given/empty/total cells: ' 
        + this.getInitialFilledCells() + '/'
        + this.getInitialEmptyCells()  + '/'
        + (this.getInitialFilledCells() + this.getInitialEmptyCells()) + '\n';
    s += '-Initial & finished values:\n';
    s += Common.valuesArrayToString(this._initialValues) + '\n';
    s += Common.valuesArrayToString(this._completedPuzzle) + '\n';
    s += '-Creation passes: ' + this._generatePasses + '\n';
    s += '-Difficulty desired/actual: ' 
        + Puzzle.getDifficultyLabel(this._desiredDifficulty) + '/'
        + Puzzle.getDifficultyLabel(this._actualDifficulty) + '\n';
    if (this._solutionsCount) {
      s += '-Solutions count: ' + this._solutionsCount + '\n';
    }
    if (this._stats) {
      s += '-Stats:\n' + this._stats.toString() + '\n';
    }
    return s;
  }

}
