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
    this._initialValues = null;
    this._completedPuzzle = null;
    this._desiredDifficulty = null;
    this._actualDifficulty = null;
    this._solutionsCount = null;
    this._stats = null;
  }

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
