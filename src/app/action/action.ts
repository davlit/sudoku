// import { ActionType } from './action.type';
import { Hint } from '../hint/hint';
import { ValueHint } from '../hint/hint';
import { CandidatesHint } from '../hint/hint';
import { Common } from '../common/common';

export const enum ActionType {
  SET_VALUE,
  GUESS_VALUE,
  // SET_INITIAL,
  REMOVE_CANDIDATE
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

}

abstract class BaseValueAction extends Action {
  private _value: number;

  constructor(type: ActionType, cell: number, value: number, hint?: ValueHint) {
    super(type, cell, hint);
    this._value = value;
  }

  get value() : number {
    return this._value;
  }

}

export class ValueAction extends BaseValueAction {

  constructor(type: ActionType, cell: number, value: number, hint?: ValueHint) {
    super(type, cell, value, hint);
  }

  toString() {
    let s = super.toString() 
        + Common.formatString('Set {0} in {1},{2}',
        [this.value, Common.rowNr(this.cell), Common.colNr(this.cell)]);
    if (this.hint) {
      s += ' (' + this.hint.toString() + ')';
    } else {
      s += ' (User action)';
    }
    return s;
  }

}

export class GuessAction extends BaseValueAction {
  private _possibleValues: number[];

  constructor(type: ActionType, cell: number, value: number,
      possibleValues: number[], hint?: ValueHint) {
    super(type, cell, value, hint);
    this._possibleValues = possibleValues;
  }

  get possibleValues() : number[] {
    return this._possibleValues;
  }

  toString() : string {
    let s = super.toString()
        + Common.formatString(
        'Guess {0} in {1},{2} with possibles {3}',
        [this.value, Common.rowNr(this.cell), Common.colNr(this.cell),
           JSON.stringify(this._possibleValues)]);
    if (this.hint) {
      s += ' (' + this.hint.toString() + ')';
    } else {
      s += ' (User action)';
    }
    return s;
  }
    
}

export class RemoveAction extends Action {
  private _candidate: number;

  constructor(type: ActionType, cell: number, candidate: number, hint?: CandidatesHint) {
    super(type, cell, hint);
    this._candidate = candidate;
  }

  get candidate() {
    return this._candidate;
  }

  toString() {
    let s = super.toString() 
        + Common.formatString('Remove candidate {0} in {1},{2}',
            [this._candidate, Common.rowNr(this.cell), Common.colNr(this.cell)]);
    if (this.hint) {
      s += ' (' + this.hint.toString() + ')';
    } else {
      s += ' (User action)';
    }
    return s;
  }
    
}
