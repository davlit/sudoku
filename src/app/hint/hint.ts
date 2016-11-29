import { HintType } from './hint.type';
import { ActionType } from '../action/action.type';
import { Difficulty } from '../model/difficulty';
import { Common } from '../common/common';

/**
 * Hint life cycle
 * - created in findX functions, e.g. findNakedSingles()
 * - logged to hintLog in applyHint()
 * - spawn an action in applyHint()
 * 
 * Hint life cydle
 * - created and logged to hintLog in guess()
 * - spawn an action in guess()
 */

// abstract
export abstract class Hint {
  private _type: HintType;
  private _difficultyRating: Difficulty;

  constructor(type: HintType) {
    this._type = type;
  }

  get type() : HintType {
    return this._type;
  }
  
  abstract getCell() : number;

  abstract getValue() : number;

  abstract getActionType() : ActionType;

  // getDifficultyRating(): Difficulty {
  //   switch (this.type) {
  //     case HintType.NAKED_SINGLE:
  //     case HintType.HIDDEN_SINGLE_ROW:
  //     case HintType.HIDDEN_SINGLE_COL:
  //     case HintType.HIDDEN_SINGLE_BOX:
  //       return Difficulty.EASY;
  //     default:
  //       return Difficulty.MEDIUM;
  //   }
  // }

  abstract getDifficultyRating(): Difficulty;

  abstract toString() : string;
  
}

export class ValueHint extends Hint {
  private _cell: number;
  private _value: number;

  constructor(type: HintType, cell: number, value: number) {
    super(type);
    this._cell = cell;
    this._value = value;
  }

  get cell() : number {
    return this._cell;
  }

  get value() : number {
    return this._value;
  }

  getCell() : number {
    return this._cell;
  }

  getValue() : number {
    return this._value;
  }

  getActionType() : ActionType {
    return ActionType.SET_VALUE;
  }

  getDifficultyRating(): Difficulty {
    if (this.type === HintType.GUESS) {
      return Difficulty.HARDEST;
    }
    return Difficulty.EASY;
  }

  toString() : string {

    // convert 0-base rows, cols, boxs to 1-base (1..9)
    let r = Common.rowNr(this._cell);
    let c = Common.colNr(this._cell);
    let b = Common.boxNr(this._cell);

    switch(this.type) {
      case HintType.NAKED_SINGLE:
        return Common.formatString(
          'Naked single {0} in {1},{2}',
          [this._value, r, c]);
      case HintType.HIDDEN_SINGLE_ROW:
        return Common.formatString(
          'Hidden single {0} in row, {1},{2}',
          [this._value, r, c]);
      case HintType.HIDDEN_SINGLE_COL:
        return Common.formatString(
          'Hidden single {0} in col, {1},{2}',
          [this._value, r, c]);
      case HintType.HIDDEN_SINGLE_BOX:
        return Common.formatString(
          'Hidden single {0} in box, {1},{2}',
          [this._value, r, c]);
      case HintType.GUESS:
        return Common.formatString(
          'Guess {0} in {1},{2}',
          [this._value, r, c]);
    } // switch
  } // toString()
}

export class CandidatesHint extends Hint {
  private _cells: number[];
  private _candidates: number[];
  private _removals: {c: number, k: number}[];

  constructor(type: HintType, cells: number[], 
      candidates: number[], removals: {c: number, k: number}[]) {
    super(type);
    this._cells = cells;
    this._candidates = candidates.sort();
    this._removals = removals;
  }

  get cells() : number[] {
    return this._cells;
  }

  getCell() : number {
    return this._cells[0];
  }
  
  getValue() : number {
    return null;
  }

  getActionType() : ActionType {
    return ActionType.REMOVE_CANDIDATE;
  }

  get candidates() : number[] {
    return this._candidates;
  }
  
  get removals() : {c: number, k: number}[] {
    return this._removals;
  }

  getDifficultyRating(): Difficulty { 
    if (this.type >= HintType.NAKED_TRIPLES_ROW) {
      return Difficulty.HARD;
    }
    return Difficulty.MEDIUM;
  }

  toString() : string {

    // convert 0-base rows, cols, boxs to 1-base (1..9)
    let r = Common.rowNr(this._cells[0]);
    let c = Common.colNr(this._cells[0]);
    let b = Common.boxNr(this._cells[0]);

    switch (this.type) {
      case HintType.NAKED_PAIRS_ROW:
        return Common.formatString(
          'Naked pairs {0}/{1} in row {2}',
          [this._candidates[0], this._candidates[1], r]);
      case HintType.NAKED_PAIRS_COL:
        return Common.formatString(
          'Naked pairs {0}/{1} in col {2}',
          [this._candidates[0], this._candidates[1], c]);
      case HintType.NAKED_PAIRS_BOX:
        return Common.formatString(
          'Naked pairs {0}/{1} in box {2}',
          [this._candidates[0], this._candidates[1], b]);

      case HintType.POINTING_ROW:
        return Common.formatString(
          'Pointing row {0}, box {1}, candidate {2}',
          [r, b, this._candidates[0]]);
      case HintType.POINTING_COL:
        return Common.formatString(
          'Pointing column {0}, box {1}, candidate {2}',
          [c, b, this._candidates[0]]);

      case HintType.ROW_BOX_REDUCTION:
        return Common.formatString(
          'Box reduction in box {0}, row {1}, candidate {2}',
          [b, r, this._candidates[0]]);
      case HintType.COL_BOX_REDUCTION:
        return Common.formatString(
          'Box reduction in box {0}, column {1}, candidate {2}',
          [b, c, this._candidates[0]]);

      case HintType.NAKED_TRIPLES_ROW:
        return Common.formatString(
          'Naked triples {0}/{1}/{2} in row {3}',
          [this._candidates[0], this._candidates[1], this._candidates[2], r]);
      case HintType.NAKED_TRIPLES_COL:
        return Common.formatString(
          'Naked triples {0}/{1}/{2} in column {3}',
          [this._candidates[0], this._candidates[1], this._candidates[2], c]);
      case HintType.NAKED_TRIPLES_BOX:
        return Common.formatString(
          'Naked triples {0}/{1}/{2} in box {3}',
          [this._candidates[0], this._candidates[1], this._candidates[2], b]);

      case HintType.NAKED_QUADS_ROW:
        return Common.formatString(
          'Naked quads {0}/{1}/{2}/{3} in row {4}',
          [this._candidates[0], this._candidates[1], this._candidates[2], this._candidates[3], r]);
      case HintType.NAKED_QUADS_COL:
        return Common.formatString(
          'Naked quads {0}/{1}/{2}/{3} in column {4}',
          [this._candidates[0], this._candidates[1], this._candidates[2], this._candidates[3], c]);
      case HintType.NAKED_QUADS_BOX:
        return Common.formatString(
          'Naked quads {0}/{1}/{2}/{3} in box {4}',
          [this._candidates[0], this._candidates[1], this._candidates[2], this._candidates[3], b]);

      case HintType.HIDDEN_PAIRS_ROW:
        return Common.formatString(
          'Hidden pairs {0}/{1} in row {2}',
          [this._candidates[0], this._candidates[1], r]);
      case HintType.HIDDEN_PAIRS_COL:
        return Common.formatString(
          'Hidden pairs {0}/{1} in column {2}',
          [this._candidates[0], this._candidates[1], c]);
      case HintType.HIDDEN_PAIRS_BOX:
        return Common.formatString(
          'Hidden pairs {0}/{1} in box {2}',
          [this._candidates[0], this._candidates[1], b]);

      case HintType.HIDDEN_TRIPLES_ROW:
        return Common.formatString(
          'Hidden triples {0}/{1}/{2} in row {3}',
          [this._candidates[0], this._candidates[1], this._candidates[2], r]);
      case HintType.HIDDEN_TRIPLES_COL:
        return Common.formatString(
          'Hidden triples {0}/{1}/{2} in column {3}',
          [this._candidates[0], this._candidates[1], this._candidates[2], c]);
      case HintType.HIDDEN_TRIPLES_BOX:
        return Common.formatString(
          'Hidden triples {0}/{1}/{2} in box {3}',
          [this._candidates[0], this._candidates[1], this._candidates[2], b]);

      case HintType.HIDDEN_QUADS_ROW:
        return Common.formatString(
          'Hidden quads {0}/{1}/{2}/{3} in row {4}',
          [this._candidates[0], this._candidates[1], this._candidates[2], this._candidates[3], r]);
      case HintType.HIDDEN_QUADS_COL:
        return Common.formatString(
          'Hidden quads {0}/{1}/{2}/{3} in column {4}',
          [this._candidates[0], this._candidates[1], this._candidates[2], this._candidates[3], c]);
      case HintType.HIDDEN_QUADS_BOX:
        return Common.formatString(
          'Hidden quads {0}/{1}/{2}/{3} in box {4}',
          [this._candidates[0], this._candidates[1], this._candidates[2], this._candidates[3], b]);

    } // switch
  } // toString()
}  
