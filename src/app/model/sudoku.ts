import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Group } from './group';
import { Cell }  from './cell';
import { Common } from '../common/common';
import { CombinationIterator } from '../common/combination.iterator';
import { NakedType }  from './naked.type';
import { Difficulty }  from './difficulty';
import { Puzzle }  from './puzzle';
import { Action } from '../action/action';
import { ValueAction } from '../action/action';
import { GuessAction } from '../action/action';
import { RemoveAction } from '../action/action';
import { ActionType } from '../action/action.type';
import { ActionLog } from '../action/actionLog';
import { Hint } from '../hint/hint';
import { ValueHint } from '../hint/hint';
import { CandidatesHint } from '../hint/hint';
import { HintType } from '../hint/hint.type';
import { HintLog } from '../hint/hintLog';
import { HintCounts } from '../hint/hintCounts';

import { VERSION } from    '../common/common';
import { VALUES } from     '../common/common';
import { CANDIDATES } from '../common/common';
import { GROUPS } from     '../common/common';
import { ROWS } from       '../common/common';
import { COLS } from       '../common/common';
import { BOXS } from       '../common/common';
import { CELLS } from      '../common/common';
import { ROW_CELLS } from  '../common/common';
import { COL_CELLS } from  '../common/common';
import { BOX_CELLS } from  '../common/common';

/**
 * State:
 * - state of every cell
 * - state of every group (can be derived from cells)
 * - values set (can be derived)
 * - currentSudoku (initial sudoku) -- ?
 * - hint log -- ?
 * - action log -- ?
 * - hint
 * - randomCellIndexes
 * - randomValues
 * 
 * Initial state
 * - initial state of every cell (no values, every candidate
 * - initial state of every group (zero counts)
 * - no currentSudoku
 * - no hint
 * - no randomCellIndexes
 * - no randomValues
 * - empty hint log
 * - empty action log
 * 
 * Restore state
 * - restore state of every cell
 * - restore state of every group
 * - 
 */

@Injectable()
export class Sudoku {

  private id: string;
  setId(id: string) {
    this.id = id;
  }
  getId() : string {
    return this.id;
  }

  private rows: Group[];
  private cols: Group[];
  private boxs: Group[];
  private cells: Cell[];
  private hint: Hint;
  
  private valuesSet: number[];  // count of each value used
      
  private randomCellIndexes: number[];
  private randomValues: number[];

    // ***** observable version *****
  private currentSudoku: Puzzle = null;
      
  // private actionLog: ActionLog;
  // private hintLog: HintLog;
  
  private solutionsCount: number;
  // private puzzle: Puzzle;

  constructor(
      public actionLog: ActionLog,
      public hintLog: HintLog) {
    this.rows = new Array(9);
    this.cols = new Array(9);
    this.boxs = new Array(9);
    this.cells = new Array(81);
    this.hint = null;

    this.valuesSet = new Array(10);
      
    // this.actionLog = new ActionLog();
    // private actionLog: ActionLog;
    this.hintLog = new HintLog();

    // every row, column, and box is instance of Group
    for (let i of GROUPS) {
      this.rows[i] = new Group(ROW_CELLS[i]);
      this.cols[i] = new Group(COL_CELLS[i]);
      this.boxs[i] = new Group(BOX_CELLS[i]);
    }

    // instantiate each cell; assign its row, column, and box objects
    for (let c of CELLS) {
      this.cells[c] = new Cell();
    }

    this.initialize();


    // TEST
    // this.checkHiddenTriplesGroup(HintType.HIDDEN_TRIPLES_ROW);

  } // constructor()

  //------------------------------------------------------------------------
  // static functions
  //------------------------------------------------------------------------
  
  /**
   * Related cells share the same row, column, or box of the given cell. The 
   * given cell is not in the list of related cells. Any cell has 20 related 
   * cells: 8 from the row, 8 from the column and 4 from the box that are not 
   * in the row or column of the given cell.
   */
  private static getRelatedCells(idx: number) : number[] {
    let relatedCells: number[] = [];
    let r = Common.rowIdx(idx);
    let c = Common.colIdx(idx);
    let b = Common.boxIdx(idx);
    for (let r of ROW_CELLS[Common.rowIdx(idx)]) {
      if (r === idx) {
        continue;
      }
      relatedCells.push(r);
    }
    for (let c of COL_CELLS[Common.colIdx(idx)]) {
      if (c === idx) {
        continue;
      }
      relatedCells.push(c);
    }
    for (let b of BOX_CELLS[Common.boxIdx(idx)]) {
      if (relatedCells.indexOf(b) < 0) {
        relatedCells.push(b);
      }
    }
    return relatedCells;
  } // getRelatedCells()
        
  /**
   * Return an array of pair combinations of items in a list.
   */
  private static pairwise(list: any[]) : any[] {
    let pairs: any[] = [];
    let pos = 0;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        pairs[pos++] = [list[i], list[j]];
      }
    }
    return pairs;
  }

  /**
   * Return an array of triple combinations of items in a list.
   */
  private static tripwise(list: any[]) : any[] {
    let trips: any[] = [];
    let pos = 0;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        for (let k = j + 1; k < list.length; k++) {
          trips[pos++] = [list[i], list[j], list[k]];
        }
      }
    }
    return trips;
  }

  /**
   * Return an array of quad combinations of items in a list.
   */
  private static quadwise(list: any[]) : any[] {
    let quads: any[] = [];
    let pos = 0;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        for (let k = j + 1; k < list.length; k++) {
          for (let l = k + 1; l < list.length; l++) {
            quads[pos++] = [list[i], list[j], list[k], list[l]];
          }
        }
      }
    }
    return quads;
  }

  /**
   * Determine the difficulty of a sudoku based on the techniques required to
   * achieve the solution.
   */
  static getActualDifficulty(hintCounts: HintCounts) : Difficulty {

    // HARDEST
    if (hintCounts.guesses > 0) {
      return Difficulty.HARDEST;
    } 
    
    // HARD
    if (   hintCounts.getNakedTriples()  > 0
        || hintCounts.getNakedQuads()    > 0
        || hintCounts.getHiddenPairs()   > 0
        || hintCounts.getHiddenTriples() > 0
        || hintCounts.getHiddenQuads()   > 0) {
      return Difficulty.HARD;
    }
    
    // MEDIUM
    if (   hintCounts.getNakedPairs()       > 0
        || hintCounts.getPointingRowsCols() > 0
        || hintCounts.getBoxReductions()    > 0) {
      return Difficulty.MEDIUM;
    }
    
    // EASY
    if (   hintCounts.getHiddenSingles() > 0
        || hintCounts.nakedSingles       > 0) {
      return Difficulty.EASY;
    }

    return  Difficulty.EASY;
  } // getDifficultyType()

  //------------------------------------------------------------------------
  // public functions
  //------------------------------------------------------------------------

  getActiveHint() {
    return this.hint;
  }

  // getCurrentSudoku() {
  //   return this.currentSudoku;
  // }
  
  /**
   * Clears all cells, logs, and related data.
   */
  initialize() : void {
    for (let c of CELLS) {
      this.cells[c].initialize();
    }
    for (let g of GROUPS) {
      this.rows[g].initialize();
      this.cols[g].initialize();
      this.boxs[g].initialize();
    }
    this.solutionsCount = 0;
    this.hint = null;
    this.hintLog.initialize();
    this.actionLog.initialize();
    for (let v of VALUES) {
      this.valuesSet[v] = 0;
    }
  } // initialize()

  /**
   * 
   */
  initializeLogs() : void {
    this.hintLog.initialize();
    this.actionLog.initialize();
  }
      
  /**
   * Gets value in cell at given row and column (1..9).
   */
  getValue_(r: number, c: number) : number {
    return this.getValue(Common.cellIdx(r, c));
  };

  /**
   * Sets value in cell at given row and column (1..9).
   */
  setValue_(r: number, c: number, newValue: number) : void {
    this.setValue(Common.cellIdx(r, c), newValue, ActionType.SET_VALUE);       
  }

  getHint_() : Hint {
    return this.getHint(Difficulty.HARDEST);
  }

  /**
   * Removes value in cell at given row and column (1..9).
   */
  removeValue_(r: number, c: number) : void {
    this.removeValue(Common.cellIdx(r, c));       
  };

  /**
   * Removes given candidate from cell at given row and column (1..9).
   */
  removeCandidate_(r: number, c: number, k: number) : void {
    this.removeCandidate(Common.cellIdx(r, c), k, null);  // user action
  } // removeCandidate_()

  /**
   * Check for any hints at this state of the sudoku solution progress. If
   * maxDifficulty is set to EASY only the easy solution techniques will be
   * sought for a hint. Similarly for MEDIUM and HARD.
   */
  getHint(maxDifficulty : Difficulty) : Hint {
    this.hint = null;
    
    // first, easy techniques
    if (   this.checkNakedSingles()
        || this.checkHiddenSingles()) {
      return this.hint;
    }
    if (maxDifficulty === Difficulty.EASY) {
      return null;  // no hints using easy techniques
    }

    // next, medium techniques
    if (   this.checkNakedPairs()
        || this.checkPointingRowCol()
        || this.checkRowBoxReductions()
        || this.checkColBoxReductions()) {
      return this.hint;
    }
    if (maxDifficulty === Difficulty.MEDIUM) {
      return null;  // no hints using easy and medium techniques
    }

    // finally, hard techniques
    if (   this.checkNakedTriples()
        || this.checkNakedQuads()
        || this.checkHiddenPairs()
        || this.checkHiddenTriples()
        // || this.checkHiddenQuads()
        ) {
      return this.hint;
    }
    return null;  // no hints using any techniques without guessing
  } // getHint()

  /**
   * Apply hint toward solution.
   */
  applyHint() : void {
    // let args = hint.removals;
    if (this.hint == null) {
      return;   // no hunt to apply
    }
    this.hintLog.addEntry(this.hint);

    // switch (hint.action) {
    switch (this.hint.type) {
      case HintType.NAKED_SINGLE:
      case HintType.HIDDEN_SINGLE_ROW:
      case HintType.HIDDEN_SINGLE_COL:
      case HintType.HIDDEN_SINGLE_BOX:
        let vHint: ValueHint = <ValueHint> this.hint;
        this.setValue(vHint.cell, vHint.value, ActionType.SET_VALUE, null, 
            vHint);
        break;
      default:
        let kHint: CandidatesHint = <CandidatesHint> this.hint;
        let removals = kHint.removals;
        for (let removal of removals) {
          this.removeCandidate(removal.c, removal.k, kHint);
        }
    } // switch
    this.hint = null;
  } // applyHint()

  /**
   * Apply hint toward solution.
   */
  applyGivenHint(hint: Hint) : void {
    // let args = hint.removals;
    if (hint == null) {
      return;   // no hunt to apply
    }
    this.hintLog.addEntry(hint);

    // switch (hint.action) {
    switch (hint.type) {
      case HintType.NAKED_SINGLE:
      case HintType.HIDDEN_SINGLE_ROW:
      case HintType.HIDDEN_SINGLE_COL:
      case HintType.HIDDEN_SINGLE_BOX:
        let vHint: ValueHint = <ValueHint> hint;
        this.setValue(vHint.cell, vHint.value, ActionType.SET_VALUE, null, 
            vHint);
        break;
      default:
        let kHint: CandidatesHint = <CandidatesHint> hint;
        let removals = kHint.removals;
        for (let removal of removals) {
          this.removeCandidate(removal.c, removal.k, kHint);
        }
    } // switch
    hint = null;
  } // applyHint()

  /**
   * 
   */
  isValid() {
    for (let g of GROUPS) {
      if (   !this.rows[g].isValid()
          || !this.cols[g].isValid()
          || !this.boxs[g].isValid()) {
        return false;
      }
    }
    for (let c of CELLS) {
      if (!this.cells[c].isValid()) {
        return false;
      }
    }
    return true;
  } // isValid()
    
  /**
   * 
   */
  isCellInvalid(r: number, c: number) : boolean {
    let cell = Common.cellIdx(r, c);
    return !this.rows[Common.rowIdx(cell)].isValid()
        || !this.cols[Common.colIdx(cell)].isValid()
        || !this.boxs[Common.boxIdx(cell)].isValid();
  }
      
  /**
   * 
   */
  isCellLocked(r: number, c: number) : boolean {
    // return this.cells[r][c].isLocked();
    return this.cells[Common.cellIdx(r, c)].isLocked();
  }
  
  /**
   * TODO Determines if sudoku is fully solved. If 
   */
  isSolved() : boolean {
    for (let r of ROWS) {
      if (!this.rows[r].isComplete()) {
        return false;
      }
    }
    return true;
  }

  /**
   * Determines if the given value appears 9 times.
   */
  isValueComplete(value: number) : boolean {
    return this.valuesSet[value] >= 9;
  }
      
  /**
   * 
   */
  isCandidate_(r: number, c: number, k: number) : boolean {
    return this.isCandidate(Common.cellIdx(r, c), k);
  }
  
  /**
   * 
   */
  getNakedCandidates(r: number, c: number, maxCandidates: NakedType) {
    return this.cells[Common.cellIdx(r, c)].findNakedCandidates(maxCandidates);
  }

  getCandidates(c: number) : number[] {
    return this.cells[c].getCandidates();
  }
        
  /**
   * 
   */
  getLastAction() {
    return this.actionLog.getLastEntry();
  }

  /**
   * 
   */
  getActionLogAsString() {
    return this.actionLog.toStringLastFirst();
  }
  
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
  undoAction(action: Action) : void {
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
   * Called by user button press (playComponent.ts) undoLastAction())
   */
  undoLastAction() : void {    // called by user button
    let lastAction = this.actionLog.getLastEntry();
    this.undoAction(lastAction);
    this.actionLog.removeLastEntry();
  } // undoLastAction()
          
  //------------------------------------------------------------------------
  // private functions
  //------------------------------------------------------------------------

  /**
   * A provided puzzle should be a 81-character string representing cell
   * values with blank cells indicated by a period character ('.'). E.g.
   * '..24..1.391.3...6......928......5..6..3.9.8..5..2......245......7...3.283.5..84..'
   * This method will 
   * - install the puzzle setting all appropriate model vaiables
   * - get solution stats and rate the difficulty
   * - return a Puzzle object
   */
  loadProvidedSudoku(initialValues: number[]) : Puzzle {
    let puzzle = new Puzzle();
    puzzle.initialValues = initialValues;

    // set given initial values
    // this.initializeModel(initialValues);

    // do the work: solve puzzle, get stats, flesh out puzzle object
    // this.completePuzzle(puzzle);   // step 3

    // re-set given initial values after getting stats
    this.initializeModel(initialValues);

// console.log('Initial values:\n' + JSON.stringify(initialValues));
console.log('Puzzle:\n' + puzzle.toString());
// console.log('Sudoku:\n' + this.toString());

    return puzzle;
  } // loadProvidedSudoku()

  /**
   * Sets up sudoku model with a set of initial vallues.
   */
  private initializeModel(initialValues: number[]) : void {
    this.initialize();
    for (let c of CELLS) {
      let cell = this.cells[c];   // cell at [c] in cells array
      let v = initialValues[c];   // value at [c] in values array
      cell.initialize();
      if (v === 0) {
        continue;
      }
      cell.setInitialValue(v);    // clears candidates, locks cell
      this.rows[Common.rowIdx(c)].addValue(v);
      this.cols[Common.colIdx(c)].addValue(v);
      this.boxs[Common.boxIdx(c)].addValue(v);
      this.valuesSet[v]++;
    } // for
    this.refreshAllCellsCandidates();  // set candidates in non-value cells 
  } // initializeModel()

  /**
   * Sets a given value in every cell and set all groups to complete.
   */
  setAllValues(values: number[]) {
    for (let c of CELLS) {    // c is 0..80
      let cell = this.cells[c];   // cell at [c] in cells array
      let v = values[c];   // value at [c] in values array
      this.cells[c].setRawValue(values[c]);    // clears candidates, does not lock cell
    }
    for (let g of GROUPS) {
      this.rows[g].setComplete();
      this.cols[g].setComplete();
      this.boxs[g].setComplete();
    }
  }

  setDesiredDifficulty(desiredDifficulty) {
// console.log('sudoku:\n' + this.toString());
    this.currentSudoku = new Puzzle();
    this.currentSudoku.desiredDifficulty = desiredDifficulty;
  }

  getCurrentSudoku() {
    return this.currentSudoku;
  }

  generatePuzzle$ = new Observable(observer => {

    // step 1 - generate random finished sudoku
    this.currentSudoku.completedPuzzle = this.makeRandomSolution();
console.log(this.getId() + ' ' + this.toOneLineString());

    let pass = 0;

    // loop until we get sudoku of desired difficulty
    let desiredDifficulty = this.currentSudoku.desiredDifficulty;
    while (this.currentSudoku.actualDifficulty != desiredDifficulty) {
      pass++;
      observer.next(pass);

      // step 2 - create starting values by paring cells
      this.getStartingValues(this.currentSudoku);

      if (this.currentSudoku.initialValues === null) {
        continue;   // desired difficulty has not been attained
      }

      // step 3 - solve puzzle to get stats and actual difficulty
      this.completePuzzle(this.currentSudoku);

      console.log('Diff: ' + this.currentSudoku.actualDifficulty);

    } // while not getting desired difficulty

    this.currentSudoku.generatePasses = pass;
    this.initializeModel(this.currentSudoku.initialValues);
    observer.complete();
  });


observable = new Observable(observer => {
  setTimeout(() => {
    observer.next(1);
  }, 1000);
  setTimeout(() => {
    observer.next(2);
  }, 2000);
  setTimeout(() => {
    observer.next(3);
  }, 3000);
  setTimeout(() => {
    observer.next(4);
    observer.complete();
  }, 4000);
});

  /**
   * [Step 1]
   * Start by seeding values 1..9 in 9 random cells. Then using standard 
   * solving and guessing techniques create a random, consistent, fully 
   * filled-in solution. Return the full solution as a cell values array.
   */
  private makeRandomSolution() : number[] {

    let start: number = Date.now();

    this.initialize();
    // this.randomCellIndexes = Common.shuffleArray(CELLS.slice());
    // this.randomValues = Common.shuffleArray(VALUES.slice());
    this.randomCellIndexes = Common.RANDOM_CELLS_1;
    this.randomValues = Common.RANDOM_VALUES_1;
    for (let v of VALUES) {
      this.setValue(this.randomCellIndexes[v], v, ActionType.GUESS_VALUE);
    }
    this.solve();

    let elapsed: number = Date.now() - start;
    console.log('Step 1 elapsed: ' + elapsed + 'ms');

console.log(JSON.stringify(this.cellsToValuesArray()));
    return this.cellsToValuesArray();
  } // makeRandomSolution()

  /**
   * [Step 2]
   */
  private getStartingValues(puzzle: Puzzle) : void {

    let start: number = Date.now();

    this.setAllValues(puzzle.completedPuzzle);
    // this.actionLog.initialize();
    // this.hintLog.initialize();
    this.initializeLogs();
    // this.randomCellIndexes = Common.shuffleArray(CELLS.slice());
    // this.randomValues = Common.shuffleArray(VALUES.slice());
    // let randomParingCells = Common.shuffleArray(CELLS.slice(0, 41));
    this.randomCellIndexes = Common.RANDOM_CELLS_2;
    this.randomValues = Common.RANDOM_VALUES_2;
    let randomParingCells = Common.RANDOM_PARING_CELLS_2;
    let hardCount: number = 0;

    // just scan half (plus center) cells (0..40); symC is in other half
    let pairsRemoved = 0;
    NEXT_CELL:
    for (let c of randomParingCells) {

      // cell & sym cell are 180deg rotationally symmetric
      let symC = 80 - c;
  
      // save then remove values of symmetric twins 
      let savedValue = this.getValue(c)
      let savedSymValue = this.getValue(symC);
      this.removeValue(c);
      this.removeValue(symC);
      
      // pare first 9 pairs without solving
      if (++pairsRemoved <= 9) {
        continue NEXT_CELL;
      }

      switch (puzzle.desiredDifficulty) {

        // no guessing cases
        case Difficulty.EASY:
        case Difficulty.MEDIUM:
        case Difficulty.HARD:
          let hard: boolean = false;
          while (this.getHint(puzzle.desiredDifficulty)) {

            // count difficulty hard hints
            if (this.hint.getDifficultyRating() === Difficulty.HARD) {
              hard = true;
            }

            this.applyHint();
          }
          let solved = this.isSolved();
          this.rollbackAll();
          if (solved) {
            if (hard) {
              hardCount++;  // a hard hint was used
            }
            continue NEXT_CELL;    // don't restore sym cells
          } // if not solved, fall through to restore pared cells

        // guess when no hints available
        case Difficulty.HARDEST:
          let localSolutionsCount = this.countSolutions();
          this.rollbackAll();
          if (localSolutionsCount <= 1) {
            continue NEXT_CELL;    // don't restore sym cells
          } // if multiple solutions, fall through to restore pared cells
      } // switch

      this.setValue(c, savedValue, ActionType.SET_VALUE);
      this.setValue(symC, savedSymValue, ActionType.SET_VALUE);
      this.actionLog.removeLastEntry(); // keep restores out of action log
      this.actionLog.removeLastEntry();
    } // for next random symmetric pairs of cells to pare

    // TODO
    // at end of step 2 no initial values is a signal that desired difficulty
    // is not being attained, so no use going on to step 3
    if (puzzle.desiredDifficulty === Difficulty.HARD
        && hardCount === 0) {
      puzzle.initialValues = null;
    } else {
      puzzle.initialValues = this.cellsToValuesArray();
    }
// console.log(puzzle.initialValues);

    let elapsed: number = Date.now() - start;
    console.log('Step 2 elapsed: ' + elapsed + 'ms');

  } // getStartingValues() [step 2 - no guesses]
  
  /**
   * [Step 3]
   * Now having a full solution and initial values, solve the sudoku using
   * hints and guessing. While doing this, count the specific solution 
   * tehcniques (types of hints, and guesses) to properly determine the
   * actual difficulty rating.
   */
  private completePuzzle(puzzle: Puzzle) : void {

    let start: number = Date.now();

    // this.hintLog.initialize();
    // this.actionLog.initialize();
    this.initializeLogs();

    // this.randomCellIndexes = Common.shuffleArray(CELLS.slice());
    // this.randomValues =  Common.shuffleArray(VALUES.slice());
    this.randomCellIndexes = Common.RANDOM_CELLS_3;
    this.randomValues = Common.RANDOM_VALUES_3;
     
    this.solve();

    puzzle.completedPuzzle = this.cellsToValuesArray();
    puzzle.stats = this.getHintCounts();
    puzzle.actualDifficulty = Sudoku.getActualDifficulty(puzzle.stats);

    let elapsed: number = Date.now() - start;
    console.log('Step 3 elapsed: ' + elapsed + 'ms');

  } // completePuzzle() [step 3]

  /**
   * The basic solving "machine". From any point of an incomplete or empty
   * sudoku, this recursive method will (1) produce a solution, or 
   * (2) conclude that a solution is impossible. This method will not look for
   * multiple solutions.
   * 
   * At every step the method first looks for hints and applies them. If no 
   * hint is found, it falls back on making a guess in a random cell that has
   * the fewest number of candidates. After a guess, it goes back to the 
   * hint/apply loop until (1) a solution, (2) an impasse, or (3) another guess
   * is required. When an impasse is reached, the method will unwind back to
   * the last guess and try an alternative guess in that cell. When all
   * alternatives are exhausted, it will unwind further to any previous guess
   * and repeat the process until a solution is obtained or it determines that
   * there is no possible solution.
   * 
   * In the recursions, whenever true is returned it means a solution has been.
   * Whenever false is returned it means any guesses have to be unwound or 
   * finally there is no possible solution.
   */
  private solve() : boolean {
    while (this.getHint(Difficulty.HARDEST) != null) {
      this.applyHint();
      if (this.isSolved()) {
        return true;		// done
      }
      if (this.isImpossible()) {
        return false;		// no value, no candidate cell exists
      }
    } // while -- no hint, try guess

    // now we have to resort to guessing
    let lastGuess: GuessAction = null;
    while (this.guess(lastGuess)) {	// while guess made
      if (this.solve()) {		// recursive call -- try new hint
        // recursive call returned true -> solved!
        return true;
      } else {
        // recursive call returned false -> (1) impossible. (2) no guesses left
        lastGuess = this.rollbackToLastGuess();
      }
    } // while guess()

    return false;
  } // solve()

  /**
   * This method is a close parallel with the solve() method except that this
   * method will look for alternative solutions. The goal is to assure that
   * there is only one possible solution. If two possible solutions are found,
   * this is enough to conclude that there is no *unique* solution since a
   * sudoku requirement that a proper sudoku has only a single unique solution.
   * 
   * In contrast to the parallel recursive solve() method, at each step this
   * method returns 1 if a solution is found. A return of 0 implies an impasse
   * at the recursion step or that there is no possible solution. The recustion
   * cycle will stop when 2 solutions are found ...............
   * 
   * This method is used in step 2 in which a starting sudoku is produced from
   * step 1's full random solution. Step 2 and this method assure a unique 
   * solution using hint and guess techniques appropriate to the target
   * difficulty rating desired.
   */
  private countSolutions() : number {
    while (this.getHint(Difficulty.HARDEST) != null) {
      this.applyHint();
      if (this.isSolved()) {
        this.rollbackToLastGuess();
        // this.actionLog.removeLastEntry(); // 1***************************************
        return 1;
      }
      if (this.isImpossible()) {
        this.rollbackToLastGuess();
        // this.actionLog.removeLastEntry(); // 2***************************************
        return 0;
      }
    } // while getHint() -- no hint, try guess

    // now we have to resort to guessing
    let localSolutionsCount = 0;
    let lastGuess: GuessAction = null;
    while (this.guess(lastGuess)) {	// while guess made
      localSolutionsCount += this.countSolutions(); // recursive call
      if (localSolutionsCount >= 2) {
        this.rollbackToLastGuess();
        // this.actionLog.removeLastEntry(); // 3***************************************

        return localSolutionsCount;
      }

        else {
         lastGuess = this.rollbackToLastGuess();
      }

    } // while guess()
    this.rollbackToLastGuess();
    // this.actionLog.removeLastEntry(); // 4***************************************
    return localSolutionsCount;
  } // countSolutions()

  /**
   * Makes a guess for a cell value. If a lastGuess is not provided, a cell 
   * with the fewest number is selected. The first guess in a cell is the 
   * first available candidate. If rollbacks dictate a subsequent guess, the 
   * next available candidate is used. 
   */
  private guess(lastGuess: GuessAction) : boolean {
    let guessCell: number = null;
    let possibleValues: number[] = [];
    let guessValue: number = null;
    if (lastGuess == null) {
      guessCell = this.findFewestCandidatesCell();
      possibleValues = this.cells[guessCell].getCandidates();
    } else {
      guessCell = lastGuess.cell;
      possibleValues = lastGuess.possibleValues;
      this.actionLog.removeLastEntry(); // remove previous action
      if (possibleValues.length === 0) {
        return false;
      }
    }
    guessValue = possibleValues[0];   // try 1st available candidate
    possibleValues = possibleValues.slice(1);   // remove guess value
    this.hintLog.addEntry(new ValueHint(HintType.GUESS, guessCell, guessValue));
    this.setValue(guessCell, guessValue, ActionType.GUESS_VALUE, possibleValues);
    return true;
  } // guess()

  /**
   * Find and return the cell index that has the fewest candidates. The cound
   * cell should never have less than two candidates because zero would mean
   * the cell has a value, and one would have been earlier identified as a
   * naked single. Most of the time the fewest candidate cell will have only
   * two candidates. The cells are searched randomly.
   */
  findFewestCandidatesCell() : number {
    let minCands = 10;
    let minCandsCell: number = -1;
    let currentCellCands: number;
    for (let c of this.randomCellIndexes) {
      currentCellCands = this.cells[c].getNumberOfCandidates();
      if (currentCellCands === 0) {
        continue;       // cell has value
      }
      if (currentCellCands < minCands) {
        minCands = currentCellCands;
        minCandsCell = c;
      }
      if (minCands <= 2) {
        break;	// 0 --> value, 1 --> naked single
      }
    }
    return minCandsCell;
  } // findFewestCandidatesCell()

  /**
   * Return value of cell. Zero means no value;
   */
  getValue(idx: number) : number {
    return this.cells[idx].getValue();
  };

  /**
   * Sets value of a cell to given value. In the specified cell, all candidates
   * are removed. The candidate, equal to the value being set, is removed from 
   * every cell that shares the row, column, and box of the given cell.
   * 
   * Set given value in given cell.
   * - will not affect a locked cell
   * - if cell already has the new value, nothing to do
   * - if cell already has another value, remove it first
   * - set the new value (also removes all candidates from cell)
   * - update values count in cell's row, column, and box
   * - update values used
   * - *TODO* conflict in row, col, box ............. mark invalid
   * - create and log action entry
   * - remove this value as candidate in related cells
   * 
   * Called by
   * - setValue_() user key press or right click (playComponent.ts) setCellValue())
   * - applyHint()
   * - undoAction() REMOVE_VALUE
   * - generatePuzzle() step 2 (pare down)
   * 
   * Undo notes
   * - remove value
   * - restore old previous value? Down thru a removeValue action?
   * - update values count in cell's row, column, and box
   * - update values used
   * - conflict ................
   * - restore candidates in cell
   * - restore candidates in related CELLS
   * - remove log entry, don't create new one
   */     
  setValue(idx: number, newValue: number, actionType: ActionType, 
      guessPossibles? : number[], hint?: ValueHint) : void {

    // cannot change locked cell
    if (this.cells[idx].isLocked()) {
      return;		// can't change locked cell
    }

    // if cell has value, remove it first
    if (this.cells[idx].hasValue()) {
      if (this.cells[idx].getValue() === newValue) {
        return;	// same as existing value, nothing to do
      }
      this.removeValue(idx);
    }

    // set value, update groups and values used; log action
    this.cells[idx].setValue(newValue);   // cell removes any candidates
    this.rows[Common.rowIdx(idx)].addValue(newValue);
    this.cols[Common.colIdx(idx)].addValue(newValue);
    this.boxs[Common.boxIdx(idx)].addValue(newValue);
    this.valuesSet[newValue]++;

    let action: Action;
    switch (actionType) {
      case ActionType.SET_VALUE:
        action = new ValueAction(ActionType.SET_VALUE, idx, newValue, hint);
        break;
      case ActionType.GUESS_VALUE:
        action = new GuessAction(ActionType.GUESS_VALUE, idx, newValue,
            guessPossibles, hint);
        break;
    } // switch
    this.actionLog.addEntry(action);

    // remove candidate (this value) from related cells
    for (let rc of Sudoku.getRelatedCells(idx)) {
      if (this.cells[rc].hasValue()) {
        continue;
      }
      this.cells[rc].removeCandidate(newValue);
    }            
  } // setValue()
        
  /**
   * Removes the value of the specified cell to make it empty. This 
   * function also reestablishes appropriate candidates in the cell and
   * reestablishes the candidate, equal to the value being removed, in
   * other cells in the same row, column, and box of the given cell. For
   * every cell the candidate is only restored if there is no conflict
   * with its row, column, and box.
   * 
   * Remove value from given cell.
   * - will not affect a locked cell
   * - if cell does not have a value, nothing to do
   * - remove old value
   * - update values count in cell's row, column, and box
   * - update values used
   * - create and log action entry
   * - add applicable candidates to cell
   * - add candidate (this cell's old value) to related cells
   * 
   * Called by
   * - removeValue_() user key press (playComponent.ts) removeCellValue())
   * - undoAction() SET_VALUE
   * - setValue() (remove existing value)
   * - generatePuzzle() step 2 (pare down)
   * 
   * Undo notes
   * - replace prior value
   * - update values count in cell's row, column, and box
   * - update values used
   * - remove candidats from cell
   * - remove this prior value as candidate in related cells
   * - remove log entry, don't create new one'
   * 
   * - conflict ................
   */
  removeValue(idx: number) : void {
    
    // cannot change locked cell
    if (this.cells[idx].isLocked()) {
      return;		// can't change locked cell
    }

    // get existing value, exit if no existing value
    let oldValue = this.getValue(idx);
    if (oldValue === 0) {
      return;			// nothing to remove
    }

    // remove value, update groups and values used; log action
    this.cells[idx].removeValue();
    this.rows[Common.rowIdx(idx)].removeValue(oldValue);
    this.cols[Common.colIdx(idx)].removeValue(oldValue);
    this.boxs[Common.boxIdx(idx)].removeValue(oldValue);
    this.valuesSet[oldValue]--;

    // add applicable candidates to cell
    for (let v of VALUES) {
      if (   this.rows[Common.rowIdx(idx)].containsValue(v)
          || this.cols[Common.colIdx(idx)].containsValue(v)
          || this.boxs[Common.boxIdx(idx)].containsValue(v)) {
        continue;
      }
      this.addCandidate(idx, v);
    }

    // add candidate (this cell's old value) to related cells
    for (let rc of Sudoku.getRelatedCells(idx)) {
      if (   this.rows[Common.rowIdx(rc)].containsValue(oldValue)
          || this.cols[Common.colIdx(rc)].containsValue(oldValue)
          || this.boxs[Common.boxIdx(rc)].containsValue(oldValue)) {
        continue;
      }
      this.addCandidate(rc, oldValue);
    }
  } // removeValue()

  getNumberOfCandidates(c: number) : number {
    return this.cells[c].getNumberOfCandidates();
  }

  /**
   * Remove given candidate from given cell. This method is only
   * used for explicit independent candidate removal. This method should not be
   * used for implicit candidate removals resulting from setting cell values.
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
  private removeCandidate(idx: number, k: number,
      hint: CandidatesHint) : void {

    // cannot remove last candidate until a value is set
    // if no candidates, nothing to remove
    // if (this.cells[idx].getNumberOfCandidates() <= 1) {
    //   console.log('idx, k: ' + this.toRowColString(idx) + ' ' + k);
    //   console.error('Cannot remove candidate')
    //   console.log('Hint: ' + hint.toString());
    //   console.log('Row:\n' + this.toStringRow(Common.rowIdx(idx)));
    //   console.log('Action log:\n' + this.actionLog.toStringFirstFirst());
    //   return;
    // }

    // remove candidate
    this.cells[idx].removeCandidate(k);
    let action = new RemoveAction(ActionType.REMOVE_CANDIDATE, idx, k, hint);
    this.actionLog.addEntry(action);
  } // removeCandidate()

  /**
   * Add given candidate to given cell.
   * - cannot add candidate to cell that has a value
   * - cannot add candidate if a related cell has that value
   * 
   * Called by:
   * - undoAction() - undo REMOVE_CANDIDATE
   * - removeValue()
   */
  private addCandidate(idx: number, k: number) : void {

    // do not add if value exists
    if (this.cells[idx].hasValue()) {
      // console.error('Cannot add candidate to cell with a value.');
      return;
    }

    // do not add if any related cell has that value
    for (let rc of Sudoku.getRelatedCells(idx)) {
      if (this.cells[rc].getValue() === k) {
        return;
      }
    }

    // add candidate
    this.cells[idx].addCandidate(k);
  } // addCandidate()

  /**
   * 
   */
  private isCandidate(idx: number, k: number) : boolean {
    return this.cells[idx].isCandidate(k);
  }
  
  /**
   * Sets all cells' candidates based on surrounding values. This will 
   * overwrite any candidate removals that resulted from naked pairs, etc.
   */
  private refreshAllCellsCandidates() : void {
    for (let c of CELLS) {
      this.refreshCellCandidates(c);
    }
  } // refreshAllCellsCandidates()

  /**
   * Sets a cell's candidates based on surrounding values. This will overwrite
   * any candidate removals that resulted from naked pairs, etc.
   */
  private refreshCellCandidates(idx: number) : void {
    let cell = this.cells[idx];
    if (cell.hasValue()) {
      cell.unsetAllCandidates();  // extra safeguard; also in cell set value
      return;
    }
    cell.initializeCandidates();   // set all candidates
    for (let relatedCell of Sudoku.getRelatedCells(idx)) {
      let rcValue = this.cells[relatedCell].getValue();
      if (rcValue > 0) {
        cell.removeCandidate(rcValue); // remove selected
      }
    }
    if (cell.getNumberOfCandidates() === 0) {
      console.error('Invalid cell: ' + cell.toString());
    }
  } // refreshCellCandidates()

  /**
   * Returns true if given cell has a value;
   */
  hasValue(idx: number) {
    return this.cells[idx].hasValue();
  }
    
  /**
   * 
   */
  isImpossible() : boolean {
    for (let i of CELLS) {
      if (this.cells[i].isImpossible()) {
        return true;
      }
    }
    return false;
  } // isImpossible()

  /**
   * Working backwards undo every action until a guess action 
   */
  rollbackToLastGuess() : GuessAction {

    // undo entries that are not guesses
    let lastAction = this.actionLog.getLastEntry();
    while (lastAction && lastAction.type != ActionType.GUESS_VALUE) {
      this.undoAction(lastAction);
      this.actionLog.removeLastEntry();
      lastAction = this.actionLog.getLastEntry();
    }

    if (this.actionLog.getLastEntry() &&
        this.actionLog.getLastEntry().type === ActionType.GUESS_VALUE) {
      this.undoAction(this.actionLog.getLastEntry());

      return <GuessAction> this.actionLog.getLastEntry();   // last GUESS_VALUE action
    }
    return null;
  } // rollbackToLastGuess()

  /**
   * Called in step 3 to clear everything except initial (given) values
   */
  rollbackAll() : void {
    while (this.actionLog.getLastEntry()) {
      this.undoAction(this.actionLog.getLastEntry());
      this.actionLog.removeLastEntry();
    }
  } // rollbackAll()

  /**
   * Randomly look for cells with a single candidate. If found, create a hint
   * and return true. If none found, return false.
   */
  private checkNakedSingles() : boolean {
    for (let c of Common.shuffleArray(CELLS.slice())) {
      let nakedCells = this.cells[c].findNakedCandidates(NakedType.SINGLE);
      if (nakedCells.length > 0) {
        this.hint = new ValueHint(HintType.NAKED_SINGLE, c, nakedCells[0]);
        return true;
      }
    } // next random cell
    return false;
  } // checkNakedSingles()

  /**
   * Check for hidden singles in rows, columns, and boxes. If found, create
   * a hint and return true, otherwise return false.
   */
  private checkHiddenSingles() : boolean {
    for (let r of ROWS) {
      if (this.checkHiddenSinglesGroup(this.rows[r], HintType.HIDDEN_SINGLE_ROW)) {
        return true;
      }
    }
    for (let c of COLS) {
      if (this.checkHiddenSinglesGroup(this.cols[c], HintType.HIDDEN_SINGLE_COL)) {
        return true;
      }
    }
    for (let b of BOXS) {
      if (this.checkHiddenSinglesGroup(this.boxs[b], HintType.HIDDEN_SINGLE_BOX)) {
        return true;
      }
    }
    return false;
  } // checkHiddenSingles()

  /**
   * Check for hidden singles in a group (row, column, or box). If found, 
   * create a hint and return true, otherwise return false. 
   */
  private checkHiddenSinglesGroup(group: Group, hintType: HintType) : boolean {
    let singleCell = -1;
    NEXT_CANDIDATE:
    for (let k of CANDIDATES) {
      if (group.containsValue(k)) {
        continue NEXT_CANDIDATE;  // candidate cannot be single
      }
      let kCountInGroup = 0;
      for (let c of group.groupCells) {
        if (this.isCandidate(c, k)) {
          kCountInGroup++;
          if (kCountInGroup > 1) {
            continue NEXT_CANDIDATE;  // not single
          }
          singleCell = c;
        }
      } // for cells in group
      if (kCountInGroup === 1) {  // candidate occurs once in group
        this.hint = new ValueHint(hintType, singleCell, k);
        return true;
      }
    } // for candidates
    return false;
  } // checkGroupHiddenSingles()
        
  /**
   * Check for naked pairs in rows, columns, and boxes. If found, create a hint
   * and return true, otherwise return false.
   */
  private checkNakedPairs() : boolean {
      
    // get array of cells with 2 and only 2 candidates
    let nakedCells: {idx: number, cands: number[]}[] = [];
    for (let c of CELLS) {
      let nakedCands= this.cells[c].findNakedCandidates(NakedType.PAIR);
      if (nakedCands.length > 0) {
        nakedCells.push({idx: c, cands: nakedCands});
      }
    }
    if (nakedCells.length == 0) {
        return false;
    }
          
    // find 2 cells that have same 2 candidates
    for (let i1 = 0; i1 < nakedCells.length; i1++) {
      for (let i2 = i1 + 1; i2 < nakedCells.length; i2++) {

        let candidates: number[] = [];
        candidates = nakedCells[i1].cands.slice();

        // add unique candidates from nakedCells[i2].candidates
        for (let i of nakedCells[i2].cands) {
          if (candidates.indexOf(i) === -1) {
            candidates.push(i);
          }
        }
        if (candidates.length != 2) {
          continue;   // must be 2 for naked pair
        }

        // see if cells with common candidates are in same group
        let cells: number[] = [nakedCells[i1].idx, nakedCells[i2].idx]

        // look for actions; if none, move on
        if (Common.areCellsInSameRow(cells)) {
          if (this.checkNakedsRemovals(ROW_CELLS[Common.rowIdx(cells[0])],
              cells, candidates, HintType.NAKED_PAIRS_ROW)) {
            return true;    
          }
        }
        if (Common.areCellsInSameCol(cells)) {
          if (this.checkNakedsRemovals(COL_CELLS[Common.colIdx(cells[0])],
              cells, candidates, HintType.NAKED_PAIRS_COL)) {
            return true;
          }
        }
        if (Common.areCellsInSameBox(cells)) {
          if (this.checkNakedsRemovals(BOX_CELLS[Common.boxIdx(cells[0])],
              cells, candidates, HintType.NAKED_PAIRS_BOX)) {
            return true;
          }
        }

      } // for i2
    } // for i1
    return false;
  } // checkNakedPairs()

  /**
   * Check for naked triples in rows, columns, and boxes. If found, create a 
   * hint and return true, otherwise return false. A group must have at least 
   * 5 open cells to allow a naked triple.
   */
  private checkNakedTriples() : boolean {

    // get array of cells with 2 or 3 candidates
    let nakedCells: {idx: number, cands: number[]}[] = [];
    for (let c of CELLS) {
      let nakedCands: number[] = this.cells[c].findNakedCandidates(NakedType.TRIPLE);
      if (nakedCands.length > 0) {
        nakedCells.push({idx: c, cands: nakedCands});
      }
    }
    if (nakedCells.length == 0) {
        return false;
    }

    // find 3 cells that have same 2 or 3 candidates
    for (let i1 = 0; i1 < nakedCells.length; i1++) {
      for (let i2 = i1 + 1; i2 < nakedCells.length; i2++) {
        for (let i3 = i2 + 1; i3 < nakedCells.length; i3++) {

          let candidates: number[] = [];
          candidates = nakedCells[i1].cands.slice();

          // add unique candidates from nakedCells[i2].candidates
          for (let i of nakedCells[i2].cands) {
            if (candidates.indexOf(i) === -1) {
              candidates.push(i);
            }
          }
          if (candidates.length > 3) {
            continue;   // must be 3 for naked triple
          }

          // add unique candidates from nakedCells[i3].candidates
          for (let i of nakedCells[i3].cands) {
            if (candidates.indexOf(i) === -1) {
              candidates.push(i);
            }
          }
          if (candidates.length != 3) {
            continue;   // must be 3 for naked triple
          }

          // see if cells with common candidates are in same group
          let cells: number[] = [nakedCells[i1].idx, 
              nakedCells[i2].idx, nakedCells[i3].idx]

          // look for actions; if none, move on
          if (Common.areCellsInSameRow(cells)) {
            if (this.checkNakedsRemovals(ROW_CELLS[Common.rowIdx(cells[0])],
                cells, candidates, HintType.NAKED_TRIPLES_ROW)) {
              return true;    
            }
          }
          if (Common.areCellsInSameCol(cells)) {
            if (this.checkNakedsRemovals(COL_CELLS[Common.colIdx(cells[0])],
                cells, candidates, HintType.NAKED_TRIPLES_COL)) {
              return true;
            }
          }
          if (Common.areCellsInSameBox(cells)) {
            if (this.checkNakedsRemovals(BOX_CELLS[Common.boxIdx(cells[0])],
                cells, candidates, HintType.NAKED_TRIPLES_BOX)) {
              return true;
            }
          }

        } // for i3
      } // for i2
    } // for i1
    return false;
  } // checkNakedTriples()

  /**
   * TODO
   * Check for naked triples in rows, columns, and boxes. If found, create a 
   * hint and return true, otherwise return false. A group must have  
   * 5 or more open (4 or fewer closed) cells to allow a naked triple. 
   * 
   * If only 4 open cells then 5 value
   * cells means only 4 candidates in group. A naked triple takes 3 cells,
   * therefore the 4th cell must be a naked single which would have been 
   * already found.
   */
  private checkNakedTriplesGroup(group: Group, hintType: HintType) : boolean {
    if (group.getOpenCellsCount() < 5) {
      return false;   // see method comment 
    }

    // approach 1 TODO
    // find cells in group with 2 or 3 (<= 3) cands -- cells23 [a, b, c, d, ...]
    // must have at least 3 cells (may be 3, 4, 5, 6, 7, 8, or 9)
    // for cells23, get cands cells23Cands [i, j, k, l, ...]

    // get group cells 2 or 3 candidates; 
    // there can't be any with 1 which would be naked single

    // let cells = []; // cells with 2-3 candidates
    // for (let c of group.groupCells) {
    //   let cell = this.cells[c];
    //   if (!cell.hasValue() && cell.getNumberOfCandidates() <= 3) {
    //     cells.push(cell);
    //   }
    // }
    // if (cells.length < 3) {
    //   return false;   // need at least 3 for naked triple
    // }

    let nakedCells: [{ c: number, ks: number[] }];
    for (let c of group.groupCells) {
      let cands = this.cells[c].getCandidates()
      if (cands.length <= 3) {
        nakedCells.push({c: c, ks: cands});
      }
    }
    if (nakedCells.length < 3) {
      return false;   // need at least 3 for naked triple
    }

    // does a combo of cells have only 3 cands?
    let it = new CombinationIterator(nakedCells, 3);
    let cands: number[] = [];
    while (it.hasNext()) {
      let combination = it.next();
      for (let c of combination) {
        for (let k of c.ks) {
          if (cands.indexOf(k) == -1) {
            cands.push(k);
          }
        }
      }
      if (cands.length == 3) {
        // 3 cells w/3 cands
        // check for removals
      }
    }



    // get candidates that appear in cells with 2-3 candidates
    // let cands = [];
    // for (let cell of nakedCells) {
    //   for (let k of cell.getCandiates()) {
    //     if (cands.indexOf(k) == -1) {
    //       cands.push(k);
    //     }
    //   }
    // }

    // check for 3 cell combinations

    // approach 2
    // find cands in group occurring 2 or 3 (<= 3) times -- cands23 [k1, k2, k3, k4, ... ]
    // must have at least 3 cands

    return false
  } // checkNakedTriplesGroup()

  /**
   * Check for naked triples in rows, columns, and boxes. If found, create a hint
   * and return true, otherwise return false.
   */
  private checkNakedQuads() : boolean {

    // get array of cells with 2, 3, or 4 candidates
    let nakedCells: {idx: number, cands: number[]}[] = [];
    for (let c of CELLS) {
      let nakedCands: number[] = 
          this.cells[c].findNakedCandidates(NakedType.QUAD);
      if (nakedCands.length > 0) {
        nakedCells.push({idx: c, cands: nakedCands});
      }
    }
    if (nakedCells.length == 0) {
        return false;
    }

    // find 4 cells that have same 2, 3, or 4 candidates
    for (let i1 = 0; i1 < nakedCells.length; i1++) {
      for (let i2 = i1 + 1; i2 < nakedCells.length; i2++) {
        for (let i3 = i2 + 1; i3 < nakedCells.length; i3++) {
          for (let i4 = i3 + 1; i4 < nakedCells.length; i4++) {

            let candidates: number[] = [];
            candidates = nakedCells[i1].cands.slice();

            // add unique candidates from nakedCells[i2].cands
            for (let i of nakedCells[i2].cands) {
              if (candidates.indexOf(i) === -1) {
                candidates.push(i);
              }
            }
            if (candidates.length > 4) {
              continue;   // must be 4 for naked quad
            }

            // add unique candidates from nakedCells[i3].cands
            for (let i of nakedCells[i3].cands) {
              if (candidates.indexOf(i) === -1) {
                candidates.push(i);
              }
            }
            if (candidates.length > 4) {
              continue;   // must be 4 for naked quad
            }

            // add unique candidates from nakedCells[i4].cands
            for (let i of nakedCells[i4].cands) {
              if (candidates.indexOf(i) === -1) {
                candidates.push(i);
              }
            }
            if (candidates.length != 4) {
              continue;   // must be 4 for naked quad
            }

            // see if cells with common candidates are in same group
            let cells: number[] = [nakedCells[i1].idx, 
                nakedCells[i2].idx, nakedCells[i3].idx, nakedCells[i4].idx]

            // look for actions; if none, move on
            if (Common.areCellsInSameRow(cells)) {
              if (this.checkNakedsRemovals(ROW_CELLS[Common.rowIdx(cells[0])],
                  cells, candidates, HintType.NAKED_QUADS_ROW)) {
                return true;    
              }
            }
            if (Common.areCellsInSameCol(cells)) {
              if (this.checkNakedsRemovals(COL_CELLS[Common.colIdx(cells[0])],
                  cells, candidates, HintType.NAKED_QUADS_COL)) {
                return true;
              }
            }
            if (Common.areCellsInSameBox(cells)) {
              if (this.checkNakedsRemovals(BOX_CELLS[Common.boxIdx(cells[0])],
                  cells, candidates, HintType.NAKED_QUADS_BOX)) {
                return true;
              }
            }

          } // for i4
        } // for i3
      } // for i2
    } // for i1
    return false;
  } // checkNakedQuads()

  /**
   * Having cells with common candidates and common group, determine if
   * candidate removals are possible. If so, lodge a hint and return true.
   * Return false to signal that no removal action is possible.
   */
  private checkNakedsRemovals(groupCells: number[], cells: number[], 
      candidates: number[], hintType: HintType) : boolean {

    // look for removals
    let removals: {c: number, k: number}[] = [];

    for (let c of groupCells) {
      if (this.cells[c].hasValue() || cells.indexOf(c) > -1) {
        continue;
      }
      for (let k of candidates) {
        if (this.cells[c].isCandidate(k)) {
            removals.push({c: c, k: k});
        }
      } // for k
    } // for c

    // return true and hint if there are actions
    if (removals.length > 0) {
      this.hint = new CandidatesHint(hintType, cells, candidates, removals);
      return true;
    }
    return false;
  } // checkNakedsRemovals()

  /**
   * Check for hidden pairs in rows, columns, and boxes. If found, create a hint
   * and return true, otherwise return false.
   * 
   * A hidden pair occurs when a pair of numbers appears in exactly two 
   * squares in a row, column, or box, but those two numbers aren't 
   * the only ones in their squares.
   * 
   * http://www.thonky.com/sudoku/hidden-pairs-triples-quads/
   */
  private checkHiddenPairs() : boolean {
    for (let r of ROWS) {
      if (this.checkHiddenPairsGroup(this.rows[r], HintType.HIDDEN_PAIRS_ROW)) {
        return true;
      }
    }
    for (let c of COLS) {
      if (this.checkHiddenPairsGroup(this.cols[c], HintType.HIDDEN_PAIRS_COL)) {
        return true;
      }
    }
    for (let b of BOXS) {
      if (this.checkHiddenPairsGroup(this.boxs[b], HintType.HIDDEN_PAIRS_BOX)) {
        return true;
      }
    }
    return false;
  } // checkHiddenPairs()

  /**
   * Check for hidden triples in rows, columns, and boxes. If found, create a hint
   * and return true, otherwise return false.
   * 
   * A hidden triple occurs when three cells in a row, column, or box 
   * contain the same three numbers, or a subset of those three. The 
   * three cells also contain other candidates.
   * 
   * http://www.thonky.com/sudoku/hidden-pairs-triples-quads/
   */
  private checkHiddenTriples() : boolean {
    for (let r of ROWS) {
      if (this.checkHiddenTriplesGroup(this.rows[r], HintType.HIDDEN_TRIPLES_ROW)) {
        return true;
      }
    }
    for (let c of COLS) {
      if (this.checkHiddenTriplesGroup(this.cols[c], HintType.HIDDEN_TRIPLES_COL)) {
        return true;
      }
    }
    for (let b of BOXS) {
      if (this.checkHiddenTriplesGroup(this.boxs[b], HintType.HIDDEN_TRIPLES_BOX)) {
        return true;
      }
    }
    return false;
  } // checkHiddenTriples()

  /**
   * Check for hidden triples in rows, columns, and boxes. If found, create a hint
   * and return true, otherwise return false.
   * 
   * Hidden quads are pretty rare, and they can be difficult to spot 
   * unless you are specifically looking for them.
   * 
   * http://www.thonky.com/sudoku/hidden-pairs-triples-quads/
   */
  private checkHiddenQuads() : boolean {
    for (let r of ROWS) {
      if (this.checkHiddenQuadsGroup(this.rows[r], HintType.HIDDEN_QUADS_ROW)) {
        return true;
      }
    }
    for (let c of COLS) {
      if (this.checkHiddenQuadsGroup(this.cols[c], HintType.HIDDEN_QUADS_COL)) {
        return true;
      }
    }
    for (let b of BOXS) {
      if (this.checkHiddenQuadsGroup(this.boxs[b], HintType.HIDDEN_QUADS_BOX)) {
        return true;
      }
    }
    return false;
  } // checkHiddenTriples()

  /**
   * Check for hidden pairs in a given row, column, or box.
   * 
   * (1) Candidates that appear exactly 2 times in group, and
   * (2) 2 times appearing candidates are confined to 2 cells, and,
   * as usual, there are candidate removal actions available.
   */
  private checkHiddenPairsGroup(group: Group, hintType: HintType) : boolean {

    // number of occurrences of each candidate in group
    let kCounts: number[] = [];

    // candidates occurring no more than 3 times in group
    let pairCandidates: number[] = [];   

    // group cells containing a triple candidate
    let pairCells: number[] = [];

    // look for 2 candidates occurring 2 times in group
    kCounts = this.getCandidateCounts(group);
    for (let k of CANDIDATES) {
      if (kCounts[k] === 2) {
        pairCandidates.push(k);
      }
    }
    if (pairCandidates.length < 2) {
      return false;   // no 2 candidates appear 2 times in group
    }

    // find group cells that contain potential pair candidate
    NEXT_CELL:
    for (let c of group.groupCells) {
      for (let k of pairCandidates) {
        if (this.cells[c].isCandidate(k)) {
          pairCells.push(c);
          continue NEXT_CELL;   // only push cell once
        }
      }
    }

    // examine all combinations of 2 pair cells containing pair candidates
    let pairCellCombinations: number[][] = Sudoku.pairwise(pairCells);
    for (let pairCellCombination of pairCellCombinations) {

      // this set of pair cells
      let _2pairCells: number[] = pairCellCombination;

      // candidates in 1 or more of these set of cells
      let _2cands: number[] = [];

      // number of occurrences of each candidate in this set of cells
      let _2kCounts: number[] = [0,   0, 0, 0,   0, 0, 0,   0, 0, 0];

      // cands in set of cells that match occurrences in full group
      let _2matchedCands: number[] = [];

      // get unique pair candidates from pair cells
      for (let k of pairCandidates) {
        for (let j = 0; j < 2; j++) {
          if (this.isCandidate(_2pairCells[j], k)) {
            _2kCounts[k]++;
            if (_2cands.indexOf(k) === -1) {
              _2cands.push(k);
            }
          }
        }
      }

      // if not 2 candidates, try next combination of pair cells 
      if (_2cands.length < 2) {
        continue;  // next combination of pair cells
      }

      // make sure pair candidates don't appear outside pair cells
      for (let k of _2cands) {
        if (_2kCounts[k] == kCounts[k]) {
          _2matchedCands.push(k);
        }
      }
      if (_2matchedCands.length != 2) {
        continue;  // next combination of pair cells
      }

      // look for removals: other candidates in pair cells
      let removals: {c: number, k: number}[] = this.findHiddenRemovals(
          pairCellCombination, _2matchedCands);

      // need at least 1 candidate to remove or it's not hidden pair
      if (removals.length > 0) {
        this.hint = new CandidatesHint(hintType, pairCellCombination, 
            _2matchedCands, removals);
        return true;
      }
          
    } // for pairCellCombinations

    return false;
  } // checkHiddenPairsGroup()

  /**
   * Check for hidden triples in a given row, column, or box.
   * 
   * (1) Candidates that appear exactly 2 or 3 times in group, and
   * (2) 2 or 3 times appearing candidates are confined to 3 cells, and,
   * as usual, there are candidate removal actions available.
   */
  private checkHiddenTriplesGroup(group: Group, hintType: HintType) : boolean {

    // number of occurrences of each candidate in group
    let kCounts: number[] = [];

    // candidates occurring no more than 3 times in group
    let tripCandidates: number[] = [];   

    // group cells containing a triple candidate
    let tripCells: number[] = [];

    // look for at least 3 candidates occurring 2 or 3 times in group
    kCounts = this.getCandidateCounts(group);
    for (let k of CANDIDATES) {
      if (kCounts[k] >= 2 && kCounts[k] <= 3) {
        tripCandidates.push(k);
      }
    }
    if (tripCandidates.length < 3) {
      return false;   // no 3 candidates appear 2 or 3 times in group
    }

    // find group cells contain a potential triple candidate
    NEXT_CELL:
    for (let c of group.groupCells) {
      for (let k of tripCandidates) {
        if (this.cells[c].isCandidate(k)) {
          tripCells.push(c);
          continue NEXT_CELL;   // only push cell once
        }
      }
    }

    // examine all combinations of 3 triple cells containing triple candidates
    let tripCellCombinations: number[][] = Sudoku.tripwise(tripCells);
    for (let tripCellCombination of tripCellCombinations) {

      // this set of triple cells
      let _3tripCells: number[] = tripCellCombination;

      // candidates in 1 or more of these set of cells
      let _3cands: number[] = [];

      // number of occurrences of each candidate in this set of cells
      let _3kCounts: number[] = [0,   0, 0, 0,   0, 0, 0,   0, 0, 0];

      // cands in set of cells that match occurrences in full group
      let _3matchedCands: number[] = [];

      // get unique triple candidates from triple cells
      for (let k of tripCandidates) {
        for (let j = 0; j < 3; j++) {
          if (this.isCandidate(_3tripCells[j], k)) {
            _3kCounts[k]++;
            if (_3cands.indexOf(k) === -1) {
              _3cands.push(k);
            }
          }
        }
      }

      // if not at least 3 candidates, try next combination of triple cells 
      if (_3cands.length < 3) {
        continue;  // next combination of triple cells
      }

      // make sure triple candidates don't appear outside triple cells
      for (let k of _3cands) {
        if (_3kCounts[k] == kCounts[k]) {
          _3matchedCands.push(k);
        }
      }
      if (_3matchedCands.length != 3) {
        continue;  // next combination of triple cells
      }

      // look for removals: other candidates in triple cellsToValuesArray
      let removals: {c: number, k: number}[] = this.findHiddenRemovals(
          tripCellCombination, _3matchedCands);

      // need at least 1 candidate to remove or it's not hidden triple
      if (removals.length > 0) {
        this.hint = new CandidatesHint(hintType, tripCellCombination, 
            _3matchedCands, removals);
        return true;
      }
          
    } // for tripCellCombinations

    return false;
  } // checkHiddenTriplesGroup()

  /**
   * Check for hidden quads in a given row, column, or box.
   * 
   * (1) Candidates that appear exactly 2, 3, or 4 times in group, and
   * (2) 2, 3, or 4 times appearing candidates are confined to 34 cells, and,
   * as usual, there are candidate removal actions available.
   */
  private checkHiddenQuadsGroup(group: Group, hintType: HintType) : boolean {

    // number of occurrences of each candidate in group
    let kCounts: number[] = [];

    // candidates occurring no more than 4 times in group
    let quadCandidates: number[] = [];   

    // group cells containing a quad candidate
    let quadCells: number[] = [];

    kCounts = this.getCandidateCounts(group);
    for (let k of CANDIDATES) {
      if (kCounts[k] >= 2 && kCounts[k] <= 4) {
        quadCandidates.push(k);
      }
    }

    console.log('kCounts       : ' + JSON.stringify(kCounts));            
    console.log('quadCandidates: ' + JSON.stringify(quadCandidates) + ' (need at least 4)');            

    // we need at least 4 candidates
    if (quadCandidates.length < 4) {
      return false;   // no 4 candidates appear 2, 3, or 4 times in group
    }

    // find group cells that contain a quad candidate
    NEXT_CELL:
    for (let c of group.groupCells) {
      for (let k of quadCandidates) {
        if (this.cells[c].isCandidate(k)) {
          quadCells.push(c);
          continue NEXT_CELL;   // only push cell once
        }
      }
    }

    console.log('quadCells     : ' + JSON.stringify(quadCells));            

    // examine all combinations of 4 quad cells containing quad candidates
    let ln = quadCells.length
    for (let     i1 = 0;      i1 < (ln - 3); i1++) {
      for (let   i2 = i1 + 1; i2 < (ln - 2); i2++) {
        for (let i3 = i2 + 1; i3 < (ln - 1); i3++) {
          I4:
          for (let i4 = i3 + 1; i4 < (ln - 0); i4++) {

            // this set of quad cells
            let _4quadCells = [quadCells[i1], quadCells[i2], quadCells[i3], quadCells[i4]];

            // candidates in 1 or more of these set of cells
            let _4cands: number[] = [];

            // number of occurrences of each candidate in this set of cells
            let _4kCounts: number[] = [0,   0, 0, 0,   0, 0, 0,   0, 0, 0];

            // cands in set of cells that match occurrences in full group
            let _4matchedCands: number[] = [];

            // get unique quad candidates from quad cells
            for (let k of quadCandidates) {
              for (let i of [i1, i2, i3, i4]) {
                if (this.isCandidate(quadCells[i], k)) {
                  _4kCounts[k]++;
                  if (_4cands.indexOf(k) === -1) {
                    _4cands.push(k);
                  }
                }
              }
            }

    console.log('_4quadCells   : ' + JSON.stringify(_4quadCells));            
    console.log('_4cands       : ' + JSON.stringify(_4cands) + ' (need at least 4)');            

            // make sure quad candidates don't appear outside quad cells -- NO!
            // for (let k of cands) {
            //   if (kCounts1[k] != kCounts[k]) {
            //     continue I4;   // candidate k appears outside of quad cells
            //   }
            // }

            // if not 4 candidates, try next combination of quad cells
            // if (cands.length != 4) {
            if (_4cands.length < 4) {
              continue I4;
            }

            // let _4matchedCands: number[] = [];
            for (let k of _4cands) {
              if (_4kCounts[k] == kCounts[k]) {
                _4matchedCands.push(k);
              }
            }

    console.log('_4kCounts1    : ' + JSON.stringify(_4kCounts));            
    console.log('_4matchedCands: ' + JSON.stringify(_4matchedCands) + ' (need exactly 4)');  

            if (_4matchedCands.length != 4) {
              continue I4;
            }

            // look for removals: other candidates in quad cellsToValuesArray
            let removals: {c: number, k: number}[] = this.findHiddenRemovals(
                [quadCells[i1], quadCells[i2], quadCells[i3], quadCells[i4]],
                // quadCandidates);
                _4matchedCands);

    console.log('removals      : ' + removals.length + ' (need at least 1)');  

            // no candidates to remove, so no hidden quad
            if (removals.length > 0) {
              this.hint = new CandidatesHint(hintType, 
                  [quadCells[i1], quadCells[i2], quadCells[i3], quadCells[i4]], 
                  _4matchedCands, removals);
    console.log('hint: ' + JSON.stringify(this.hint));
              return true;
            }
          
          } // for i4
        } // for i3
      } // for i2
    } // for i1
    return false;
  } // checkHiddenQuadsGroup()

  /**
   * Count the occurrences of each candidate in a group (row, column, or box).
   * Return an array of the counts. The array is 10 numbers each element
   * being the count of the corresponding candidate. The zero-th element is
   * not used. E.g. [0, 0,0,2, 3,0,0, 0,2,0] means candidate [3] occurs twice,
   * [4] 3 times, [8] twice, and all other candidate are absent in the group. 
   */
  private getCandidateCounts(group: Group) : number[] {
    let kCounts: number[] = [0,   0, 0, 0,   0, 0, 0,   0, 0, 0];
    for (let k of VALUES) {
      if (group.containsValue(k)) {
        continue;   // next candidate
      }
      for (let c of group.groupCells) {
        if (this.cells[c].hasValue()) {
          continue;   // next cell in group
        }
        if (this.cells[c].isCandidate(k)) {
          kCounts[k]++;
        }
      } // for cells in group
    } // for candidates
    return kCounts;
  } // getCandidateCounts()
      
  /**
   * Helper method to find candidate removals from hidden pairs, triples, quads.
   */
  private findHiddenRemovals(hiddenCells: number[], hiddenCands: number[]) 
      : {c: number, k: number}[] {
    let removals: {c: number, k: number}[] = [];
    for (let hiddenCell of hiddenCells) {
      let hiddenCellCands: number[] = this.cells[hiddenCell].getCandidates().slice();
      for (let hiddenCellCand of hiddenCellCands) {
        if (hiddenCands.indexOf(hiddenCellCand) === -1) {
          removals.push({c: hiddenCell, k: hiddenCellCand});
        }
      }
    }
    return removals;
  } // findHiddenRemovals()

  /**
   * Check for pointing rows and columns. If found, create a hint and return 
   * true, otherwise return false.
   * 
   * A pointing row (col) occurs when a candidate appears twice or three 
   * times in a box, and those occurrences are in the same row (col).
   * This means the candidate MUST occur in one of the two or three cells 
   * in the box, and because of that, you can remove that candidate from 
   * any other cells in the same row (col) but outside the box.
   * 
   * http://www.thonky.com/sudoku/pointing-pairs-triples/
   */
  private checkPointingRowCol() : boolean {
    for (let b of BOXS) {
  
      CANDS:		// within box, iterate over 9 candidate values
      for (let k of CANDIDATES) {
        let boxCandOccurrences: number[] = []; 	// [idx, ...]
        if (this.boxs[b].containsValue(k)) {  
          continue CANDS;	// k cannot be candidate in box
        }
        for (let c of BOX_CELLS[b]) {   // for each cell in box
          if (this.isCandidate(c, k)) {
            boxCandOccurrences.push(c);
            if (boxCandOccurrences.length > 3) {
              continue CANDS;	// too many for candidate
            }
          }
        } // for
        if (boxCandOccurrences.length < 2) {
          continue CANDS;			// too few for candidate
        }
        
        // we have 2 or 3 occurances of k in b
        // determine if in same row or col
        let sameRow = Common.areCellsInSameRow(boxCandOccurrences);
        let sameCol = Common.areCellsInSameCol(boxCandOccurrences);
        if (!sameRow && !sameCol) {
          continue CANDS;		// try next candidate in box
        }

        // look for actions
        let removals: {c: number, k: number}[] = [];
        if (sameRow) {
            
          // scan other cells in row outside box
          for (let c of ROW_CELLS[Common.rowIdx(boxCandOccurrences[0])]) {
            if (Common.boxIdx(c) === b) {
              continue; // cell in same box
            }
            if (this.isCandidate(c, k)) {
              removals.push({c: c, k: k});
            }
          } // for

          // if there are removals, we have hint
          if (removals.length > 0) {
            this.hint = new CandidatesHint(HintType.POINTING_ROW, 
                [boxCandOccurrences[0]], [k], removals);
            return true;
          }
        } else {	// same column
            
          // scan other cells in col outside box
          for (let c of COL_CELLS[Common.colIdx(boxCandOccurrences[0])]) {
            if (Common.boxIdx(c) === b) {
              continue; // cell in same box
            }
            if (this.isCandidate(c, k)) {
              removals.push({c: c, k: k});
            }
          } // for

          // if there are removals, we have hint
          if (removals.length > 0) {
            this.hint = new CandidatesHint(HintType.POINTING_COL, 
                [boxCandOccurrences[0]], [k], removals);
            return true;
          }
        } // else same col

      } // for CANDS
    } // for BOXS
    return false;
  } // checkPointingRowCol()

  /*
   * Check for row box reductions. If found, create a hint and return 
   * true, otherwise return false.
   * 
   * In box/line reduction, two or three of the same candidate appear on 
   * the same row or column, and that candidate happens to be restricted 
   * to a single box. When this happens, you know that the candidate 
   * MUST occur in that row or column, so you can eliminate it from other 
   * cells in that box.
   * 
   * http://www.thonky.com/sudoku/box-line-reduction/
   */
  private checkRowBoxReductions() : boolean {
          
    //ROWS:
    for (let row of ROWS) {
        
      CANDS:
      for (let k of CANDIDATES) {
        if (this.rows[row].containsValue(k)) {
          continue CANDS;		// not candidate in row
        }
        
        let rowCandOccurrences: number[] = [];
    
        //CELLS:
        for (let c of ROW_CELLS[row]) {
          // if (this.cells[c].hasValue[k]) {   REDUNDANT
          //   continue CELLS;	// k cannot be candidate in col
          // }
          if (this.isCandidate(c, k)) {
            rowCandOccurrences.push(c);
            if (rowCandOccurrences.length > 3) {
              continue CANDS;	// too many for candidate
            }
          }
        } // for CELLS
        
        if (rowCandOccurrences.length < 2) {
          continue CANDS;			// too few for candidate
        }
        
        // determine if in same box
        if (!Common.areCellsInSameBox(rowCandOccurrences)) {
          continue CANDS;   // not in same box, next cand
        }
        
        // must be same box, different row; look for removals
        let removals: {c: number, k: number}[] = [];

        // look for k's in other rows in box 
        // this row is row, this box is box
        for (let c of BOX_CELLS[Common.boxIdx(rowCandOccurrences[0])]) {

          // if c in row, continue next c
          if (ROW_CELLS[row].indexOf(c) >= 0) {
            continue;   // box cell in same row, next c
          }

          // if isCandidate, push to removals
          if (this.isCandidate(c, k)) {
            removals.push({c: c, k: k});
          }
        } // for
        if (removals.length > 0) {
          this.hint = new CandidatesHint(HintType.ROW_BOX_REDUCTION, 
              [rowCandOccurrences[0]], [k], removals);
          return true;
        }
      } // for CANDS
    } // for ROWS
    return false;    	
  } // checkRowBoxReductions()

  /**
   * Check for column box reductions. If found, create a hint and return 
   * true, otherwise return false.
   */
  private checkColBoxReductions() : boolean {
          
    //COLS:
    for (let col of COLS) {
        
      CANDS:
      for (let k of CANDIDATES) {
        if (this.cols[col].containsValue(k)) {
          continue CANDS;		// not candidate in col
        }
        
        let colCandOccurrences: number[] = [];

        //CELLS:
        for (let c of COL_CELLS[col]) {
          // if (this.cells[c].hasValue[k]) {   REDUNDANT!
          //   continue CELLS;	// k cannot be candidate in row
          // }
          if (this.isCandidate(c, k)) {
            colCandOccurrences.push(c);
            if (colCandOccurrences.length > 3) {
              continue CANDS;	// too many for candidate
            }
          }
        } // for CELLS
        
        if (colCandOccurrences.length < 2) {
            continue CANDS;			// too few for candidate
        }
        
        // determine if in same box
        if (!Common.areCellsInSameBox(colCandOccurrences)) {
          continue CANDS;   // not in same box, next cand
        }
        
        // must be same box, different col; look for removals
        let removals: {c: number, k: number}[] = [];

        // look for k's in other cols in box
        // this col is col, this box is box
        for (let c of BOX_CELLS[Common.boxIdx(colCandOccurrences[0])]) {

          // if c in col, continue next c
          if (COL_CELLS[col].indexOf(c) >= 0) {
            continue;   // box cell in same col, next c
          }

          // if isCandidate, push to removals
          if (this.isCandidate(c, k)) {
            removals.push({c: c, k: k});
          }
        } // for
        if (removals.length > 0) {
          this.hint = new CandidatesHint(HintType.COL_BOX_REDUCTION, 
              [colCandOccurrences[0]], [k], removals);
          return true;
        }
      } // for CANDS
    } // for COLS
    return false;    	
  } // checkColBoxReductions()
        
  /**
   * Are the puzzle's cell values 180deg rotationally symmetric?
   */
  private isSymmetric() : boolean {
    for (let c of (CELLS.slice(0, 41))) {
      if ((this.cells[c].hasValue() && !this.cells[80 - c].hasValue())
          || (!this.cells[c].hasValue() && this.cells[80 - c].hasValue())) {
        return false;
      }
    }
    return true;   
  } // is symetric()

  /**
   * Represent the values of the sudoku as an array of 81 values.
   */
  cellsToValuesArray() : number[] {
    let v: number[] = [];
    for (let c of CELLS) {
      v.push(this.cells[c].getValue());
    }
    return v;
  } // cellsToValuesArray()

  /**
   * 
   */
  getHintCounts() : HintCounts {
    return this.hintLog.getHintCounts();
  }

  /**
   * Represent the values of the sudoku as a single-line string.
   */
  toOneLineString() : string {
    let s = '';
    let value: number;
    for (let i of CELLS) {
      value = this.getValue(i);
      if (value === 0) {
        s += '.';
      } else {
        s += value;
      }
    }
    return s;
  } // toOneLineString()

  /**
   * Represent the values of the sudoku as a grid string.
   */
  toGridString() : string {
    return this.arrayToGridString(this.cellsToValuesArray());
  } // toGridString()

  /**
   * Represent a values array of sudoku cell values as a grid string.
   */
  private arrayToGridString(valuesArray: number[]) : string {
    let s = '';
    let i = 0;
    let value: number;
    for (let c of CELLS) {
      value = valuesArray[c];
      if (i > 0 && i % 3 == 0 && i % 9 != 0) {
        s += '| ';
      } 
      if (i > 0 && i % 9 == 0) {
        s += '\n';
      }
      if (i > 0 && i % 27 == 0) {
        s += '------+-------+------\n';
      }
      if (value === 0) {
        s += '. ';
      } else {
        s += value + ' ';
      }
      i++;
    }
    return s;
  } // arrayToGridString()

  /**
   * Represent the state of a row as a string.
   */
  private rowToString(r: number) : string {
    return this.groupToString(this.rows[r], r, 'Row');
  } // rowToString()

  /**
   * Represent the state of a column as a string.
   */
  private colToString(c: number) : string {
    return this.groupToString(this.cols[c], c, 'Col');
  } // colToString()

  /**
   * Represent the state of a box as a string.
   */
  private boxToString(b: number) : string {
    return this.groupToString(this.boxs[b], b, 'Box');
  } // boxToString()

  /**
   * Represent the state of a row, column, or box as a string. The "group"
   * parameter is the individual row, column, or box; he "idx" is the group's
   * index (0..8); and "label" is 'Row', 'Col', or 'Box'.
   */
  private groupToString(group : Group, idx : number, label: string) : string {
    return label + ' ' + (idx + 1) + ': ' + group.toString();
  }

  /**
   * Represent the state of a cell as a string.
   */
  private cellToString(c: number) : string {
    return '' + Common.toRowColString(c) + ': ' + this.cells[c].toString();
  }

  /**
   * Represent the state of the sudoku as a string.
   */
  toString() : string {
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

}
