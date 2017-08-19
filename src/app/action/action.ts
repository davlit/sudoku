// import { ActionType } from './action.type';
import { Hint } from '../hint/hint';
import { ValueHint } from '../hint/hint';
import { CandidatesHint } from '../hint/hint';
import { Common } from '../common/common';

export const enum ActionType {
  SET_VALUE,
  GUESS_VALUE,
  REMOVE_VALUE,
  // SET_INITIAL,
  REMOVE_CANDIDATE,
  RESTORE_CANDIDATE
}

export abstract class Action {
  private _type: ActionType;
  private _cell: number;
  private _hint: Hint;

  constructor(type: ActionType, cell: number, hint?: Hint) {
    this._type = type;
    this._cell = cell;
    this._hint = hint;
  }

  get type() : number {
    return this._type;
  }
  
  get cell() : number {
    return this._cell;
  }

  get hint() : Hint {
    return this._hint;
  }

  toString() {
    return '';
  }

} // class Action

abstract class BaseValueAction extends Action {
  private _value: number;

  constructor(type: ActionType, cell: number, value: number, hint?: ValueHint) {
    super(type, cell, hint);
    this._value = value;
  }

  get value() : number {
    return this._value;
  }

} // class BaseValueAction

export class ValueAction extends BaseValueAction {

  constructor(type: ActionType, cell: number, value: number, hint?: ValueHint) {
    super(type, cell, value, hint);
  }

  toString() {
    let s = super.toString() 
        + Common.formatString('Set value {0} in {1},{2}',
        [this.value, Common.userRow(this.cell), Common.userCol(this.cell)]);
    if (this.hint) {
      s += ' (' + this.hint.toString() + ')';
    } else {
      s += ' (User action)';
    }
    return s;
  }

} // class ValueAction

export class GuessAction extends BaseValueAction {
  private _possibleValues: number[];

  constructor(type: ActionType, cell: number, value: number,
      possibleValues: number[]) {
    super(type, cell, value);
    this._possibleValues = possibleValues;
  }

  get possibleValues() : number[] {
    return this._possibleValues;
  }

  toString() : string {
    let s = super.toString()
        + Common.formatString(
        'Guess value {0} in {1},{2} with possibles {3} (User action)',
        [this.value, Common.userRow(this.cell), Common.userCol(this.cell),
           JSON.stringify(this._possibleValues)]);
    return s;
  }
    
} // class GuessAction

export class RemoveValueAction extends BaseValueAction {

  constructor(type: ActionType, cell: number, value: number) {
    super(type, cell, value);
  }

  toString() : string {
    let s = super.toString()
        + Common.formatString(
        'Remove value {0} in {1},{2} (User action)',
        [this.value, Common.userRow(this.cell), Common.userCol(this.cell)]);
    return s;
  }
    
} // class GuessAction

abstract class BaseCandidateAction extends Action {
  private _candidate: number;

  constructor(type: ActionType, cell: number, candidate: number, hint?: Hint) {
    super(type, cell, hint);
    this._candidate = candidate;
  }

  get candidate() : number {
    return this._candidate;
  }

} // class BaseCandidateAction

export class RemoveAction extends BaseCandidateAction {

  constructor(type: ActionType, cell: number, candidate: number, hint?: CandidatesHint) {
    super(type, cell, candidate, hint);
  }

  toString() {
    let s = super.toString() 
        + Common.formatString('Remove candidate {0} in {1},{2}',
            [this.candidate, Common.userRow(this.cell), Common.userCol(this.cell)]);
    if (this.hint) {
      s += ' (' + this.hint.toString() + ')';
    } else {
      s += ' (User action)';
    }
    return s;
  }
    
} // class RemoveAction

export class RestoreAction extends BaseCandidateAction {

  constructor(type: ActionType, cell: number, candidate: number) {
    super(type, cell, candidate);
  }

  toString() {
    return super.toString() 
        + Common.formatString('Restore candidate {0} in {1},{2} (User action)',
            [this.candidate, Common.userRow(this.cell), Common.userCol(this.cell)]);
  }
    
} // class RestoreAction
