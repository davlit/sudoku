// import { Injectable } from '@angular/core';

import { Puzzle } from './puzzle';
import { NakedType }  from './naked.type';

import { Action } from '../action/action';
import { GuessAction } from '../action/action';
import { ActionType } from '../action/action.type';
import { RemoveAction } from '../action/action';
import { ValueAction } from '../action/action';
import { ActionLogService } from '../action/action-log.service';
import { ValueHint } from      '../hint/hint';
import { CandidatesHint } from '../hint/hint';

import { Common } from     '../common/common';
import { CELLS } from      '../common/common';
import { VALUES } from     '../common/common';
import { CANDIDATES } from '../common/common';
import { GROUPS } from     '../common/common';
import { ROWS } from       '../common/common';
import { COLS } from       '../common/common';
import { BOXS } from       '../common/common';
import { ROW_CELLS } from  '../common/common';
import { COL_CELLS } from  '../common/common';
import { BOX_CELLS } from  '../common/common';

// @Injectable()
export class SudokuService {

  private currentSudoku: Puzzle = undefined;
  private sudokuModel: SudokuModel = undefined;
  private actionLog: ActionLogService = undefined;

  /**
   * Inject the data model and logs.
   */
  constructor(
      // this.actionLog: ActionLogService,
    actionLog: ActionLogService
  ) {
    this.sudokuModel = new SudokuModel();
    // this.actionLog = new ActionLogService();
    this.actionLog = actionLog;
    this.initializeModel();
  } // constructor()

  /**
   * Initialize the entire sudoku.
   */
  public initializeModel() : void {
    for (let c of CELLS) {
      this.initializeCell(this.sudokuModel.cells[c]);
    }
    for (let g of GROUPS) {
      this.initializeGroup(this.sudokuModel.rows[g]);
      this.initializeGroup(this.sudokuModel.cols[g]);
      this.initializeGroup(this.sudokuModel.boxs[g]);
    }
    this.initializeActionLog();
  } // initializeModel()

  /**
   * Initialize a cell.
   */
  private initializeCell(cell: Cell) : void {
    cell.value = 0;
    cell.locked = false;
    for (let k of CANDIDATES) {
      cell.candidates[k] = true;
    }
  } // initializeCell()

  /**
   * Initialize a group (row, column, or box).
   */
  private initializeGroup(group: Group) : void {
    for (let v of VALUES) {
      group.vOccurrences[v] = 0;
    }
  } // initializeGroup()

  /**
   * 
   */
  public initializeActionLog() : void {
    this.actionLog.initialize();
  }

  /**
   * 
   */
  public getCurrentSudoku() {
    return this.currentSudoku;
  }

  /**
   * Sets up a sudoku puzzle with a set of initial vallues. The initial values
   * will be an array of 81 numbers each 0..9. A zero indicates a blank or
   * empty cell. E.g.
   * [0,0,2,4,0,0,1,0,3,9,1,0,3,0,0,0,6,0,0, ...]
   */
  public loadProvidedSudoku(givenValues: number[]) : Puzzle {
    let puzzle = new Puzzle();
    puzzle.initialValues = givenValues;

    // TODO do the work: solve puzzle, get stats, flesh out puzzle object
    // this.completePuzzle(puzzle);   // step 3

    this.initializeModel();
    for (let c of CELLS) {
      let cell = this.sudokuModel.cells[c];   // cell at [c] in cells array
      let givenValue = givenValues[c];             // givenValue at [c] in givenValues array
      if (givenValue === 0) {
        continue;
      }

      // set cell, update row/col/box, lock cell
      this.setValue(c, givenValue, ActionType.SET_VALUE);
      cell.locked = true;
    } // for

    this.initializeActionLog();
    return puzzle;
  } // loadProvidedSudoku()

  /**
   * Sets a given value in every cell and set all groups to complete.
   */
  public setAllValues(values: number[]) {
    for (let c of CELLS) {    // c is 0..80
      let cell = this.sudokuModel.cells[c];   // cell at [c] in cells array
      cell.locked = false;
      cell.value = values[c];   // value at [c] in values array
      this.removeCandidates(cell);
    }
    for (let g of GROUPS) {
      for (let v of VALUES) {
        this.sudokuModel.rows[g].vOccurrences[v] = 1;
        this.sudokuModel.cols[g].vOccurrences[v] = 1;
        this.sudokuModel.boxs[g].vOccurrences[v] = 1;
      }
    }
  } // setAllValues()

  /**
   * 
   */
  public isCellLocked_(r: number, c: number) : boolean {
    return this.isCellLocked(Common.cellIdx(r, c));
  }

  /**
   * 
   */
  private isCellLocked(c: number) {
    return this.sudokuModel.cells[c].locked;
  }
  
  /**
   * Gets givenValue in cell at given row and column (1..9).
   */
  public getValue_(r: number, c: number) : number {
    return this.getValue(Common.cellIdx(r, c));
  } // getValue_()

  /**
   * Return givenValue of cell. Zero means no givenValue;
   */
  public getValue(c: number) : number {
    return this.sudokuModel.cells[c].value;
  };

  /**
   * Sets givenValue in cell at given row and column (1..9).
   */
  public setValue_(r: number, c: number, newValue: number) : void {
    this.setValue(Common.cellIdx(r, c), newValue, ActionType.SET_VALUE);       
  } // setValue_()

  /**
   * Sets value of a cell to the given value. In the specified cell, all candidates
   * are removed. The candidate, equal to the value being set, is removed from 
   * every cell that shares the row, column, and box of the given cell.
   * 
   * If the cell is locked or already has the new value, no action will be 
   * taken. If the cell has some other value, that old value will be removed
   * first. The new value will be removed as a candidate where it appears in 
   * the cell's row, column, and box.
   * 
   * 
   * 
   * 
   * 
   * Set given givenValue in given cell.
   * - will not affect a locked cell
   * - if cell already has the new givenValue, nothing to do
   * - if cell already has another givenValue, remove it first
   * - set the new givenValue (also removes all candidates from cell)
   * - update givenValues count in cell's row, column, and box
   * - update givenValues used
   * - *TODO* conflict in row, col, box ............. mark invalid
   * - create and log action entry
   * - remove this givenValue as candidate in related cells
   * 
   * Called by
   * - setValue_() user key press or right click (playComponent.ts) setCellValue())
   * - applyHint()
   * - undoAction() REMOVE_VALUE
   * - generatePuzzle() step 2 (pare down)
   * 
   * Undo notes
   * - remove givenValue
   * - restore old previous givenValue? Down thru a removeValue action?
   * - update givenValues count in cell's row, column, and box
   * - update givenValues used
   * - conflict ................
   * - restore candidates in cell
   * - restore candidates in related CELLS
   * - remove log entry, don't create new one
   */     
  public setValue(c: number, newValue: number, actionType: ActionType, 
      guessPossibles? : number[], hint?: ValueHint) : void {
    let cell = this.sudokuModel.cells[c];
    if (cell.locked) {
      return;		// can't change locked cell
    }

    // if cell has givenValue, remove it first
    if (cell.value != 0) {
      if (cell.value === newValue) {
        return;	// same as existing givenValue, nothing to do
      }
      this.removeValue(c);
    }

    // set new value, remove candidates
    cell.value = newValue;   
    this.removeCandidates(cell);

    // increment occurrences in groups
    this.sudokuModel.rows[cell.row].vOccurrences[newValue]++;
    this.sudokuModel.cols[cell.col].vOccurrences[newValue]++;
    this.sudokuModel.boxs[cell.box].vOccurrences[newValue]++;

    // log action
    let action: ValueAction;
    switch (actionType) {
      case ActionType.SET_VALUE:
        action = new ValueAction(ActionType.SET_VALUE, c, newValue, hint);
        break;
      case ActionType.GUESS_VALUE:
        action = new GuessAction(ActionType.GUESS_VALUE, c, newValue,
            guessPossibles, hint);
        break;
    } // switch
    this.actionLog.addEntry(action);

    // remove candidate (this new value) from related cells
    for (let rc of Common.getRelatedCells(c)) {
      if (this.sudokuModel.cells[rc].value != 0) {
        continue;
      }
      this.sudokuModel.cells[rc].candidates[newValue] = false;
    }            
  } // setValue()

  /**
   * Removes givenValue in cell at given row and column (1..9).
   */
  public removeValue_(r: number, c: number) : void {
    this.removeValue(Common.cellIdx(r, c));       
  } // removeValue_()


  /**
   * Removes the givenValue of the specified cell to make it empty. This 
   * function also reestablishes appropriate candidates in the cell and
   * reestablishes the candidate, equal to the givenValue being removed, in
   * other cells in the same row, column, and box of the given cell. For
   * every cell the candidate is only restored if there is no conflict
   * with its row, column, and box.
   * 
   * Remove givenValue from given cell.
   * - will not affect a locked cell
   * - if cell does not have a givenValue, nothing to do
   * - remove old givenValue
   * - update givenValues count in cell's row, column, and box
   * - update givenValues used
   * - create and log action entry
   * - add applicable candidates to cell
   * - add candidate (this cell's old givenValue) to related cells
   * 
   * Called by
   * - removeValue_() user key press (playComponent.ts) removeCellValue())
   * - undoAction() SET_VALUE
   * - setValue() (remove existing givenValue)
   * - generatePuzzle() step 2 (pare down)
   * 
   * Undo notes
   * - replace prior givenValue
   * - update givenValues count in cell's row, column, and box
   * - update givenValues used
   * - remove candidats from cell
   * - remove this prior givenValue as candidate in related cells
   * - remove log entry, don't create new one'
   * 
   * - conflict ................
   */
  public removeValue(c: number) : void {

    let cell = this.sudokuModel.cells[c];
    
    // cannot change locked cell
    if (cell.locked) {
      return;
    }

    // get existing givenValue, exit if no existing givenValue
    // let oldValue = this.getValue(c);
    let oldValue = cell.value;
    if (oldValue === 0) {
      return;			// nothing to remove
    }

    cell.value = 0;
    let row = this.sudokuModel.rows[cell.row];
    let col = this.sudokuModel.cols[cell.col];
    let box = this.sudokuModel.boxs[cell.box];
    row.vOccurrences[oldValue]--;
    col.vOccurrences[oldValue]--;
    box.vOccurrences[oldValue]--;

    // add applicable candidates to cell
    for (let v of VALUES) {
      if (   row.vOccurrences[oldValue] > 0
          || col.vOccurrences[oldValue] > 0
          || box.vOccurrences[oldValue] > 0) {
        continue;
      }
      this.addCandidate(c, v);
    }

    // add candidate (this cell's old givenValue) to related cells
    for (let rc of Common.getRelatedCells(c)) {
      let relatedCell = this.sudokuModel.cells[rc];
      let rcRow = this.sudokuModel.rows[relatedCell.row];
      let rcCol = this.sudokuModel.cols[relatedCell.col];
      let rcBox = this.sudokuModel.boxs[relatedCell.box];
      if (   rcRow.vOccurrences[oldValue] > 0
          || rcCol.vOccurrences[oldValue] > 0
          || rcBox.vOccurrences[oldValue] > 0) {
        continue;
      }
      this.addCandidate(rc, oldValue);
    }
  } // removeValue()

  /**
   * 
   */
  private removeCandidates(cell: Cell) {
    for (let k of CANDIDATES) {
      cell.candidates[k] = false;
    }
  }
        
  /**
   * Removes given candidate from cell at given row and column (1..9).
   */
  public removeCandidate_(r: number, c: number, k: number) : void {
    this.removeCandidate(Common.cellIdx(r, c), k, undefined);  // user action
  } // removeCandidate_()

  /**
   * Remove given candidate from given cell. This method is only
   * used for explicit independent candidate removal. 
   * 
   * THIS METHOD SHOULD NOT BE USED FOR IMPLICIT CANDIDATE REMOVALS RESULTING 
   * FROM SETTING CELL VALUES.
   * 
   * - cannot remove last remaining cell candidate
   * - remove candidate
   * - create and log action entry
   * 
   * Called by
   * - removeCandidate_() user double click (playComponent.ts) removeCandidate())
   * - applyHint()
   * 
   * Undo notes
   * - restore the candidate
   * - remove log entry, don't create new one
   */
  public removeCandidate(c: number, k: number, hint: CandidatesHint) : void {
    this.sudokuModel.cells[c].candidates[k] = false;
    let action = new RemoveAction(ActionType.REMOVE_CANDIDATE, c, k, hint);
    this.actionLog.addEntry(action);
  } // removeCandidate()

  /**
   * Undoes the last logged action. If the last action resulted from a complex
   * hint that caused multiple candidate removals e.g. nakedPairs, etc.
   * - should not have deal with und0 REMOVE_VALUE
   * - only undo SET_VALUE and REMOVE_CANDIDATE
   * 
   * Called by:
   * - user button press (playComponent.ts) undoLastAction())
   * - rollbackRound()
   * - rollbackAllRounds()
   * 
   * Undo notes - set value
   * - remove value
   * - restore old previous value? Down thru a removeValue action?
   * - update values count in cell's row, column, and box
   * - update values used
   * - conflict ................
   * - restore candidates in cell
   * - restore candidates in related CELLS
   * - remove log entry, don't create new one
   * 
   * Undo notes - remove value
   * - replace prior value
   * - update values count in cell's row, column, and box
   * - update values used
   * - remove candidats from cell
   * - remove this prior value as candidate in related cells
   * - remove log entry, don't create new one
   * 
   * Undo notes - remove candidate
   * - restore the candidate
   * - remove log entry, don't create new one
   */
  public undoAction(action: Action) : void {
    let actionType = action.type;
    switch (actionType) {
      case (ActionType.SET_VALUE):
      case (ActionType.GUESS_VALUE):
        this.removeValue(action.cell);
        break;
      case (ActionType.REMOVE_CANDIDATE):
        this.addCandidate(action.cell, (<RemoveAction> action).candidate);
    }
  } // undoAction()

  /**
   * Returns an array of cell's candidates where the number of candidates is
   * is greater than 0 but less than or equal to the number specified by the
   * naked type. For NakedType.SINGLE, PAIR, TRIPLE, QUAD the number of 
   * candidates in the array are 1, 1..2, 1..3, and 1..4.
   */
  public findNakedCandidates(c: number, nakedType: NakedType) : number[] {
    let maxCandidates = 0;
    switch (nakedType) {
      case NakedType.SINGLE:
        maxCandidates = 1;
        break;
      case NakedType.PAIR:
        maxCandidates = 2;
        break;
      case NakedType.TRIPLE:
        maxCandidates = 3;
        break;
      case NakedType.QUAD:
        maxCandidates = 4;
    }
    let nakeds: number[] = [];
    if (this.hasValue(c)) {   // no candidates in cell
      return [];
    }
    for (let k of CANDIDATES) {
      if (this.isCandidate(c, k)) {
        nakeds.push(k);
        if (nakeds.length > maxCandidates) {
          return [];  // to many k's in this cell
        }
      }
    } // next k
    return nakeds;  // cell has maxCandidates or fewer
  }
    
  /**
   * A cell's *state* is valid if has a value and no candidates, 
   * OR has no value and one or more candidates. Conversely, a cell's state is
   * in valid it has no value and no candidates, or has both a value and one 
   * or more candidates.
   * 
   * Cell state validity considers only the cell's internal consistancy. It's
   * state may be valid, but it's value may be in conflict with with the same
   * value occurring in a related group cell.
   */
  private isCellStateValid(c: number) : boolean {
    return ( this.hasValue(c) && !this.hasCandidates(c))
        || (!this.hasValue(c) &&  this.hasCandidates(c));
  }

  /**
   * 
   */
  // private isStateValid() {
  public isStateValid() {
    for (let c of CELLS) {
      if (!this.isCellValid(c)) {
        return false;
      }
    }
    return true;
  } // isValid()
    
  /**
   * A cell is valid if its row, column, and box are all valid. In other words,
   * no value occurs more than once in the cell's row, column, and box.
   */
  private isCellValid(c: number) : boolean {
    if (   this.isGroupValid(this.sudokuModel.rows[Common.rowIdx(c)])
        && this.isGroupValid(this.sudokuModel.cols[Common.colIdx(c)]) 
        && this.isGroupValid(this.sudokuModel.boxs[Common.boxIdx(c)])) {
      return true;
    }
    return false;
  }

  /**
   * A group (row, column, or box) is valid if values 1..9 occur no more than
   * once in the group. 
   */
  private isGroupValid(group: Group) : boolean {
    for (let v of VALUES) {
      if (group.vOccurrences[v] > 1) {
        return false;
      }
    }
    return true;
  }

  /**
   * Return true if every cell is in a valid state, and
   * if every row, column, and box in a valid state.
   */
  private isSolutionPossible() : boolean {
    for (let c of CELLS) {
      if (!this.isCellStateValid(c)) {
        return false;
      }
    }
    for (let g of GROUPS) {
      if (!this.isGroupValid(this.sudokuModel.rows[g])) {
        return false;
      }
      if (!this.isGroupValid(this.sudokuModel.cols[g])) {
        return false;
      }
      if (!this.isGroupValid(this.sudokuModel.boxs[g])) {
        return false;
      }
    }
    return true;
  }

  /**
   * 
   */
  public isImpossible() : boolean {
    return !this.isSolutionPossible();
  } // isImpossible()

  /**
   * Determines if sudoku is fully solved. If every row's every value is used
   * once and only once, the sudoku is completely solved.
   */
  public isSolved() : boolean {
    for (let r of ROWS) {
      for (let v of VALUES) {
        if (this.sudokuModel.rows[r].vOccurrences[v] != 1) {
          return false;
        }
      }
    }
    return true;
  } // isSolved()

  /**
   * Returns true if cell has a value;
   */
  public hasValue(c: number) : boolean {
    return this.sudokuModel.cells[c].value > 0; 
  } // hasValue()

  /**
   * 
   */
  public getRow(r: number) : Group {
    return this.sudokuModel.rows[r];
  }

  /**
   * 
   */
  public getCol(c: number) : Group {
    return this.sudokuModel.cols[c];
  }

  /**
   * 
   */
  public getBox(b: number) : Group {
    return this.sudokuModel.boxs[b];
  }

  /**
   * Returns true if cell has a value;
   */
  private groupContainsValue(group: Group, v: number) : boolean {
    return group.vOccurrences[v] === 1;
  } // groupContainsValue()

  /**
   * Returns true if cell has a value;
   */
  public containsValue(group: Group, v: number) : boolean {
    return group.vOccurrences[v] === 1;
  } // groupContainsValue()

  /**
   * Return the number of cells in the group that have a value. That is cells
   * that are closed or filled. It can be closed by having an initial given 
   * value or by having a value assigned in solving the sudoku. A value cell 
   * cannot have any candidates. Within a group (row, column, or box),
   *    value cells + candidate cells = 9.
   */
  private valueCellsCount(group: Group) : number {
    let count = 0;
    for (let v of VALUES) {
      if (group.vOccurrences[v] > 0) {
        count++;
      }
    }
    return count;
  }

  /**
   * Return the number of cells in the group that do not have a value. That is 
   * cells that are open or not filled. A candidate cell cannot have a value.
   * cannot have any candidates. Within a group (row, column, or box),
   *    value cells + candidate cells = 9.
   */
  public candidateCellsCount(group: Group) : number {
    let count = 0;
    for (let v of VALUES) {
      if (group.vOccurrences[v] === 0) {
        count++;
      }
    }
    return count;
  }

  // /**
  //  * Returns true if cell has a value;
  //  */
  // groupCandidateCounts(group: Group) : number[] {
  //   let candidateCount = 0;
  //   for (let c of group.cells) {
  //     if (this.sudokuModel.cells[c].candidates[k]) {
  //       candidateCount++;
  //     }
  //   }
  //   return candidateCount;
  // } // groupCandidateCount()

  /**
   * Count the occurrences of each candidate in a group (row, column, or box).
   * Return an array of the counts. The array is 10 numbers each element
   * being the count of the corresponding candidate. The zero-th element is
   * not used. E.g. [0, 0,0,2, 3,0,0, 0,2,0] means candidate [3] occurs twice,
   * [4] 3 times, [8] twice, and all other candidate are absent in the group. 
   */
  public getCandidateCounts(group: Group) : number[] {
    let kCounts: number[] = [0,   0, 0, 0,   0, 0, 0,   0, 0, 0];
    for (let k of VALUES) {
      if (this.groupContainsValue(group, k)) {
        continue;   // next candidate
      }
      for (let c of group.cells) {
        if (this.hasValue(c)) {
          continue;   // next cell in group
        }
        if (this.sudokuModel.cells[c].candidates[k]) {
          kCounts[k]++;
        }
      } // for cells in group
    } // for candidates
    return kCounts;
  } // getCandidateCounts()
      
  /**
   * Returns true if cell has one or more candidates.
   */
  private hasCandidates(c: number) : boolean {
    for (let k of CANDIDATES) {
      if (this.sudokuModel.cells[c].candidates[k]) {
        return true;
      }
    }
    return false;
  } // hasCandidates()

  /**
   * Represent the values of the sudoku as an array of 81 values.
   */
  private cellValuesToArray() : number[] {
    let valuesArray: number[] = [];
    for (let c of CELLS) {
      valuesArray.push(this.sudokuModel.cells[c].value);
    }
    return valuesArray;
  } // cellsValuesToArray()

  /**
   * Represent the givenValues of the sudoku as a single-line string.
   */
  private toOneLineString() : string {
    let s = '';
    let v: number;
    for (let c of CELLS) {
      v = this.sudokuModel.cells[c].value;
      s += (v === 0 ? '.' : v);
    }
    return s;
  } // toOneLineString()

  /**
   * Represent the givenValues of the sudoku as a grid string.
   */
  private toGridString() : string {
    return this.arrayToGridString(this.cellValuesToArray());
  } // toGridString()

  /**
   * Represent a givenValues array of sudoku cell givenValues as a grid string.
   */
  public arrayToGridString(valuesArray: number[]) : string {
  // private arrayToGridString(valuesArray: number[]) : string {
    let s = '';
    let i = 0;
    let v: number;
    for (let c of CELLS) {
      v = valuesArray[c];
      if (i > 0 && i % 3 == 0 && i % 9 != 0) {
        s += '| ';
      } 
      if (i > 0 && i % 9 == 0) {
        s += '\n';
      }
      if (i > 0 && i % 27 == 0) {
        s += '------+-------+------\n';
      }
      s += (v === 0 ? '. ' : v + ' ');
      i++;
    }
    return s;
  } // arrayToGridString()

  /**
   * Represent the state of a row as a string.
   */
  private rowToString(r: number) : string {
    let s = 'Row' + ' ' + (r + 1) + ': ';
    return s += this.groupToString(this.sudokuModel.rows[r]);
  } // rowToString()

  /**
   * Represent the state of a column as a string.
   */
  private colToString(c: number) : string {
    let s = 'Col' + ' ' + (c + 1) + ': ';
    return s += this.groupToString(this.sudokuModel.cols[c]);
  } // colToString()

  /**
   * Represent the state of a box as a string.
   */
  private boxToString(b: number) : string {
    let s = 'Box' + ' ' + (b + 1) + ': ';
    return s += this.groupToString(this.sudokuModel.boxs[b]);
  } // boxToString()

  /**
   * Represent the state of a row, column, or box as a string. The "group"
   * parameter is the individual row, column, or box.
   */
  private groupToString(group : Group) : string {
    let s = '';
    for (let v of VALUES) {
      s += (group.vOccurrences[v] === 0) ? '.' : group.vOccurrences[v];
      if (v == 3 || v == 6) {
        s += ' ';
      }
    }
    s += ' ';
    for (let i = 0; i < group.cells.length; i++) {
      s += Common.pad(group.cells[i], 2) + ' ';
      if (i == 2 || i == 5) {
        s += ' ';
      }
    }
    return s;
  }

  /**
   * Represent the state of a cell as a string.
   */
  private cellToString(c: number) : string {
    let cell = this.sudokuModel.cells[c];
    let s = '' + Common.toRowColString(c) + ': '; 
    s += 'v:' + (cell.value != 0 ? cell.value : '.');
    s += ' k:';
    for (let k of CANDIDATES) {
      s += (cell.candidates[k]) ? k : '.';
    }
    s += ' r' + (cell.row + 1) + ' c' + (cell.col + 1) + ' b' + (cell.box + 1);
    // if (!this.isValid()) {
    //   s += ' * * *';
    // }
    return s;
  }

  /**
   * Represent the state of the sudoku as a string.
   */
  private toString() : string {
    let s = '';
    for (let r of ROWS) {
      s += this.rowToString(r) + '\n';
    }
    for (let c of COLS) {
      s += this.colToString(c) + '\n';
    }
    for (let b of BOXS) {
      s += this.boxToString(b) + '\n';
    }
    for (let c of CELLS) {
      s += this.cellToString(c) + '\n';
    }
    return s;
  }

  /**
   * Represent the state of the sudoku as a string.
   */
  private toStringRow(r: number) : string {
    let s = '';
    s += this.rowToString(r) + '\n';
    for (let c of ROW_CELLS[r]) {
      s += this.cellToString(c) + '\n';
    }
    return s;
  }

  /**
   * 
   */
  private getCandidates_(r: number, c: number) : number[] {
    return this.getCandidates(Common.cellIdx(r, c));
  }
        
  /**
   * 
   */
  public getCandidates(c: number) : number[] {
    if (this.hasValue(c)) {
      return [];
    }
    let candidates: number[] = [];
    for (let k of CANDIDATES) {
      if (this.sudokuModel.cells[c].candidates[k]) {
        candidates.push(k);
      }
    }
    return candidates;
  }
        
  /**
   * 
   */
  public isCandidate_(r: number, c: number, k: number) : boolean {
    return this.isCandidate(Common.cellIdx(r, c), k);
  }
  
  /**
   * Returns true if cell contains the candidate.
   */
  public isCandidate(c: number, k: number) : boolean {
    return this.sudokuModel.cells[c].candidates[k];
  }
  
  /**
   * 
   */
  public isCellInvalid_(r: number, c: number) : boolean {
    return !this.isCellValid(Common.cellIdx(r, c));
  } // isCellInvalid_()

  /**
   * Determines if the given givenValue appears 9 times.
   */
  public isValueComplete(v: number) : boolean {
    let valueCount = 0;
    for (let c of CELLS) {
      if (this.sudokuModel.cells[c].value === v) {
        valueCount++;
      }
    }
    return valueCount === 9;
  } // isValueComplete()

  /**
   * 
   */
  public getNumberOfCandidates(c: number) : number {
    let count = 0;
    let cell = this.sudokuModel.cells[c];
    for (let k of CANDIDATES) {
      if (cell.candidates[k]) {
        count++;
      }
    }
    return count;
  }

  /**
   * Add given candidate to given cell.
   * - cannot add candidate to cell that has a givenValue
   * - cannot add candidate if a related cell has that givenValue
   * 
   * Called by:
   * - undoAction() - undo REMOVE_CANDIDATE
   * - removeValue()
   */
  private addCandidate(c: number, k: number) : void {

    // do not add if givenValue exists
    if (this.sudokuModel.cells[c].value > 0) {
      // console.error('Cannot add candidate to cell with a givenValue.');
      return;
    }

    // do not add if any related cell has that givenValue
    for (let rc of Common.getRelatedCells(c)) {
      if (this.sudokuModel.cells[rc].value === k) {
        return;
      }
    }

    // add candidate
    this.sudokuModel.cells[c].candidates[k] = true;
  } // addCandidate()

  /**
   * Used by SudokoCreationService.
   */
  public removeLastActionLogEntry() : void {
    this.actionLog.removeLastEntry();
  }

  /**
   * Represent the values of the sudoku as an array of 81 values.
   */
  public cellsToValuesArray() : number[] {
    let v: number[] = [];
    for (let c of CELLS) {
      v.push(this.sudokuModel.cells[c].value);
    }
    return v;
  } // cellsToValuesArray()

  /**
   * 
   */
  public getNakedCandidates_(r: number, c: number, maxCandidates: NakedType) {
    return this.findNakedCandidates(Common.cellIdx(r, c), maxCandidates);
  }

  /**
   * 
   */
  public getLastAction() {
    return this.actionLog.getLastEntry();
  }

  /**
   * Called by user button press (playComponent.ts) undoLastAction())
   */
  public undoLastAction() : void {    // called by user button
    let lastAction = this.actionLog.getLastEntry();
    this.undoAction(lastAction);
    this.actionLog.removeLastEntry();
  } // undoLastAction()

  /**
   * 
   */
  public getActionLogAsString() {
    return this.actionLog.toStringLastFirst();
  } // getActionLogAsString()

  /**
   * Swap values of two given cells.
   */
  public swapCellValues(c1: number, c2: number) {
    let v1 = this.sudokuModel.cells[c1].value;
    this.sudokuModel.cells[c1].value = this.sudokuModel.cells[c2].value;
    this.sudokuModel.cells[c2].value = v1;
  } // swapCellValues()
  
}

class SudokuModel {
  cells: Cell[]
  rows: Group[];
  cols: Group[];
  boxs: Group[];
  
  constructor() {
console.info('SudokuModel constructor() cp1-1');
    this.cells = new Array(81);
    this.rows = new Array(9);
    this.cols = new Array(9);
    this.boxs = new Array(9);

    for (let g of GROUPS) {
      this.rows[g] = new Group(ROW_CELLS[g]);
      this.cols[g] = new Group(COL_CELLS[g]);
      this.boxs[g] = new Group(BOX_CELLS[g]);
    }

    for (let c of CELLS) {
      this.cells[c] = new Cell(
          Common.rowIdx(c), Common.colIdx(c), Common.boxIdx(c));
    }
  }
} // class SudokuModel

class Cell {
  value: number;
  candidates: boolean[];
  locked: boolean;
  row: number;
  col: number;
  box: number;

  constructor(r: number, c:number, b:number) {
    this.value = 0;
    this.candidates = new Array(10);
    for (let k of CANDIDATES) {
      this.candidates[k] = true;
    }
    this.row = r;
    this.col = c;
    this.box = b;
  }

} // class Cell

export class Group {
  vOccurrences: number[];
  cells: number[]

  constructor(groupCells: number[]) {
    this.vOccurrences = new Array(10);
    for (let v of VALUES) {
      this.vOccurrences[v] = 0;
    }
    this.cells = groupCells;
  }

} // class Group