import { Hint,
         ValueHint,
         CandidatesHint } from '../hint/hint';
import { Common }         from '../common/common';

export const enum ActionType {
  SET_VALUE,
  GUESS_VALUE,
  REMOVE_VALUE,
  REMOVE_CANDIDATE,
  REMOVE_CANDIDATES,
  RESTORE_CANDIDATE,
  RESTORE_CANDIDATES
}

/*
Action (A)
  BaseValueAction (A)
    SetValueAction
    GuessValueAction
    RemoveValueAction
  BaseCandidateAction (A)
    RemoveCandidateAction
    RestoreCandidateAction
  BaseCandidatesAction (A)
    RemoveCandidatesAction
    RestoreCandidatesAction
*/

export abstract class Action {
  private _type: ActionType;
  private _hint: Hint;

  // constructor(type: ActionType, cell: number, hint?: Hint) {
  constructor(type: ActionType, hint?: Hint) {
    this._type = type;
    this._hint = hint;
  }

  get type() : number {
    return this._type;
  }
  
  abstract get cell(): number;

  get hint() : Hint {
    return this._hint;
  }

  toString() {
    return '';
  }

} // class Action

abstract class BaseValueAction extends Action {
  private _cell: number;
  private _value: number;

  constructor(type: ActionType, cell: number, value: number, hint?: ValueHint) {
    super(type, hint);
    this._cell = cell;
    this._value = value;
  }

  get cell() : number {
    return this._cell;
  }

  get value() : number {
    return this._value;
  }

} // class BaseValueAction

export class SetValueAction extends BaseValueAction {

  constructor(cell: number, value: number, hint?: ValueHint) {
    super(ActionType.SET_VALUE, cell, value, hint);
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

} // class SetValueAction

export class GuessValueAction extends BaseValueAction {
  private _possibleValues: number[];

  constructor(cell: number, value: number,
      possibleValues: number[]) {
    super(ActionType.GUESS_VALUE, cell, value);
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
    
} // class GuessValueAction

export class RemoveValueAction extends BaseValueAction {

  constructor(cell: number, value: number) {
    super(ActionType.REMOVE_VALUE, cell, value);
  }

  toString() : string {
    let s = super.toString()
        + Common.formatString(
        'Remove value {0} in {1},{2} (User action)',
        [this.value, Common.userRow(this.cell), Common.userCol(this.cell)]);
    return s;
  }
    
} // class RemoveValueAction

abstract class BaseCandidateAction extends Action {
  private _cell: number;
  private _candidate: number;

  constructor(type: ActionType, cell: number, candidate: number, hint?: Hint) {
    // super(type, cell, hint);
    super(type, hint);
    this._cell = cell;
    this._candidate = candidate;
  }

  get cell() : number {
    return this._cell;
  }

  get candidate() : number {
    return this._candidate;
  }

} // class BaseCandidateAction

export class RemoveCandidateAction extends BaseCandidateAction {

  constructor(cell: number, candidate: number, hint?: CandidatesHint) {
    super(ActionType.REMOVE_CANDIDATE, cell, candidate, hint);
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
    
} // class RemoveCandidateAction

export class RestoreCandidateAction extends BaseCandidateAction {

  constructor(cell: number, candidate: number) {
    super(ActionType.RESTORE_CANDIDATE, cell, candidate);
  }

  toString() {
    return super.toString() 
        + Common.formatString('Restore candidate {0} in {1},{2} (User action)',
            [this.candidate, Common.userRow(this.cell), Common.userCol(this.cell)]);
  }
    
} // class RestoreCandidateAction

abstract class BaseCandidatesAction extends Action {
  private _candidates: {cell: number, candidate: number}[];

  constructor(type: ActionType, candidates: {cell: number, candidate: number}[], hint?: Hint) {
    super(type, hint);
    this._candidates = candidates;
  }

  get cell() {
    return undefined;
  }

  get candidates() : {cell: number, candidate: number}[] {
    return this._candidates;
  }

} // class BaseCandidatesAction

export class RemoveCandidatesAction extends BaseCandidatesAction {

  constructor(cell: number, candidate: number, candidates: {cell: number, candidate: number}[], hint?: CandidatesHint) {
    super(ActionType.REMOVE_CANDIDATES, candidates, hint);
  }

  /* e.g.: Remove candidates 7 in (4,3), 4 in (7,5), 9 in (3,1) */
  toString() {
    let s = 'Remove candidates ';
    for (let candidate of this.candidates) {
      s += Common.formatString('{0} in ({1},{2}), ', [this.candidates[candidate.candidate, Common.userRow(candidate.cell), Common.userCol(candidate.cell)]]);
    }
    if (this.hint) {
      s += ' (' + this.hint.toString() + ')';
    } else {
      s += ' (User action)';
    }
    return s;
  }
    
} // class RemoveCandidatesAction

export class RestoreCandidatesAction extends BaseCandidatesAction {

  constructor(cell: number, candidate: number, candidates: {cell: number, candidate: number}[], hint?: CandidatesHint) {
    super(ActionType.REMOVE_CANDIDATES, candidates, hint);
  }

  /* e.g.: Restores candidates 7 in (4,3), 4 in (7,5), 9 in (3,1) */
  toString() {
    let s = 'Restore candidates ';
    for (let candidate of this.candidates) {
      s += Common.formatString('{0} in ({1},{2}), ', [this.candidates[candidate.candidate, Common.userRow(candidate.cell), Common.userCol(candidate.cell)]]);
    }
    if (this.hint) {
      s += ' (' + this.hint.toString() + ')';
    } else {
      s += ' (User action)';
    }
    return s;
  }
    
} // class RestoreCandidatesAction

