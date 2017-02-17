import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Common } from '../common/common';
import { Difficulty } from '../model/difficulty';
import { Puzzle } from '../model/puzzle';

import { GuessAction } from '../action/action';
import { ActionType } from '../action/action.type';
import { ActionLogService } from '../action/action-log.service';
import { ValueHint } from '../hint/hint';
import { HintType } from '../hint/hint.type';
import { HintService } from '../hint/hint.service';

import { SudokuService } from '../model/sudoku.service';

import { VALUES } from     '../common/common';
import { CELLS } from      '../common/common';

@Injectable()
export class CreationService {

  private randomCellIndexes: number[];
  private randomValues: number[];

  constructor(
    private actionLog: ActionLogService, 
    private sudokuService: SudokuService,
    private hintService: HintService
  ) {}

  /**
   * 
   */
  private initializeLogs() {
    this.sudokuService.initializeActionLog();
    this.hintService.initializeHintLog();
  }

  /**
   * 
   */
  // createSudoku(difficulty: Difficulty) : Puzzle {
  createSudoku(difficulty: Difficulty) : string {

    let sudoku = new Puzzle();
    sudoku.desiredDifficulty = difficulty;

    // step 1 - generate random finished sudoku
    sudoku.completedPuzzle = this.makeRandomSolution();

    let pass = 0;

    // loop until we get sudoku of desired difficulty
    let desiredDifficulty = sudoku.desiredDifficulty;
    while (sudoku.actualDifficulty != desiredDifficulty) {
      pass++;

      // step 2 - create starting values by paring cells
console.log('Pass: ' + pass);
      this.getStartingValues(sudoku);

      if (sudoku.initialValues === undefined) {
        continue;   // desired difficulty has not been attained
      }

      // step 3 - solve puzzle to get stats and actual difficulty
      this.completePuzzle(sudoku);

      console.log('Diff: ' + sudoku.actualDifficulty);

    } // while not getting desired difficulty

    sudoku.generatePasses = pass;
    return sudoku.serialize();
  } // createSudoku()

  // testing
  // observable = new Observable(observer => {
  //   setTimeout(() => {
  //     observer.next(1);
  //   }, 1000);
  //   setTimeout(() => {
  //     observer.next(2);
  //   }, 2000);
  //   setTimeout(() => {
  //     observer.next(3);
  //   }, 3000);
  //   setTimeout(() => {
  //     observer.next(4);
  //     observer.complete();
  //   }, 4000);
  // }); // observable

  /**
   * [Step 1]
   * Start by seeding values 1..9 in 9 random cells. Then using standard 
   * solving and guessing techniques create a random, consistent, fully 
   * filled-in solution. Return the full solution as a cell values array.
   */
  private makeRandomSolution() : number[] {

    let start: number = Date.now();   // for elapsed time

    this.sudokuService.initializeModel();
    this.initializeLogs();
    this.randomCellIndexes = Common.shuffleArray(CELLS.slice());
    this.randomValues = Common.shuffleArray(VALUES.slice());
    // testing
    // this.randomCellIndexes = Common.RANDOM_CELLS_1;
    // this.randomValues = Common.RANDOM_VALUES_1;
   for (let v of VALUES) {
      this.sudokuService.setValue(this.randomCellIndexes[v], v, ActionType.GUESS_VALUE);
    }
    this.solve();

    let elapsed: number = Date.now() - start;
    // console.log('Step 1 elapsed: ' + elapsed + 'ms');

    return this.sudokuService.cellsToValuesArray();
  } // makeRandomSolution()

  /**
   * [Step 2]
   */
  private getStartingValues(puzzle: Puzzle) : void {

    let start: number = Date.now();   // for elapsed time

    this.sudokuService.setAllValues(puzzle.completedPuzzle);
    this.initializeLogs();
    this.randomCellIndexes = Common.shuffleArray(CELLS.slice());
    this.randomValues = Common.shuffleArray(VALUES.slice());
    let randomParingCells = Common.shuffleArray(CELLS.slice(0, 41));
    // testing
    // this.randomCellIndexes = Common.RANDOM_CELLS_2;
    // this.randomValues = Common.RANDOM_VALUES_2;
    // let randomParingCells = Common.RANDOM_PARING_CELLS_2;
    let hardCount: number = 0;

    // just scan half (plus center) cells (0..40); symC is in other half
    let pairsRemoved = 0;
    NEXT_CELL:
    for (let c of randomParingCells) {

      // cell & sym cell are 180deg rotationally symmetric
      let symC = 80 - c;
  
      // save then remove values of symmetric twins 
      let savedValue = this.sudokuService.getValue(c)
      let savedSymValue = this.sudokuService.getValue(symC);
      this.sudokuService.removeValue(c);
      this.sudokuService.removeValue(symC);
      
      // pare first 9 pairs without solving (for speed)
      if (++pairsRemoved <= 9) {
        continue NEXT_CELL;
      }

      switch (puzzle.desiredDifficulty) {

        // no guessing cases
        case Difficulty.EASY:
        case Difficulty.MEDIUM:
        case Difficulty.HARD:
          let hard: boolean = false;
          while (this.hintService.getHint(puzzle.desiredDifficulty)) {

            // count difficulty hard hints
            if (this.hintService.getActiveHint().getDifficultyRating() === Difficulty.HARD) {
              hard = true;
            }

            this.hintService.applyHint();
          }
          let solved = this.sudokuService.isSolved();
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

      this.sudokuService.setValue(c, savedValue, ActionType.SET_VALUE);
      this.sudokuService.setValue(symC, savedSymValue, ActionType.SET_VALUE);
      this.sudokuService.removeLastActionLogEntry(); // keep restores out of action log
      this.sudokuService.removeLastActionLogEntry(); // keep restores out of action log
    } // for next random symmetric pairs of cells to pare

    // TODO
    // at end of step 2 no initial values is a signal that desired difficulty
    // is not being attained, so no use going on to step 3
    if (puzzle.desiredDifficulty === Difficulty.HARD
        && hardCount === 0) {
      puzzle.initialValues = undefined;
    } else {
      puzzle.initialValues = this.sudokuService.cellsToValuesArray();
    }

    let elapsed: number = Date.now() - start;
    // console.log('Step 2 elapsed: ' + elapsed + 'ms');

  } // getStartingValues() [step 2 - no guesses]
  
  /**
   * [Step 3]
   * Now having a full solution and initial values, solve the sudoku using
   * hints and guessing. While doing this, count the specific solution 
   * tehcniques (types of hints, and guesses) to properly determine the
   * actual difficulty rating.
   */
  private completePuzzle(puzzle: Puzzle) : void {

    let start: number = Date.now();   // for elapsed time

    this.initializeLogs();

    this.randomCellIndexes = Common.shuffleArray(CELLS.slice());
    this.randomValues =  Common.shuffleArray(VALUES.slice());
    // testing
    // this.randomCellIndexes = Common.RANDOM_CELLS_3;
    // this.randomValues = Common.RANDOM_VALUES_3;
    
    this.solve();

    puzzle.completedPuzzle = this.sudokuService.cellsToValuesArray();
    puzzle.stats = this.hintService.getHintCounts();
    puzzle.actualDifficulty = puzzle.stats.getActualDifficulty();

    let elapsed: number = Date.now() - start;
    // console.log('Step 3 elapsed: ' + elapsed + 'ms');

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
    while (this.hintService.getHint(Difficulty.HARDEST) != undefined) {
      this.hintService.applyHint();
      if (this.sudokuService.isSolved()) {
        return true;		// done
      }
      if (this.sudokuService.isImpossible()) {
        return false;		// no value, no candidate cell exists
      }
    } // while -- no hint, try guess

    // now we have to resort to guessing
    let lastGuess: GuessAction = undefined;
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
    while (this.hintService.getHint(Difficulty.HARDEST) != undefined) {
      this.hintService.applyHint();
      if (this.sudokuService.isSolved()) {
        this.rollbackToLastGuess();
        return 1;
      }
      if (this.sudokuService.isImpossible()) {
        this.rollbackToLastGuess();
        return 0;
      }
    } // while getHint() -- no hint, try guess

    // now we have to resort to guessing
    let localSolutionsCount = 0;
    let lastGuess: GuessAction = undefined;
    while (this.guess(lastGuess)) {	// while guess made
      localSolutionsCount += this.countSolutions(); // recursive call
      if (localSolutionsCount >= 2) {
        this.rollbackToLastGuess();
        return localSolutionsCount;
      } else {
         lastGuess = this.rollbackToLastGuess();
      }

    } // while guess()
    this.rollbackToLastGuess();
    return localSolutionsCount;
  } // countSolutions()

  /**
   * Makes a guess for a cell value. If a lastGuess is not provided, a cell 
   * with the fewest number is selected. The first guess in a cell is the 
   * first available candidate. If rollbacks dictate a subsequent guess, the 
   * next available candidate is used. 
   */
  private guess(lastGuess: GuessAction) : boolean {
    let guessCell: number = undefined;
    let possibleValues: number[] = [];
    let guessValue: number = undefined;
    if (lastGuess == undefined) {
      guessCell = this.findFewestCandidatesCell();
      possibleValues = this.sudokuService.getCandidates(guessCell);
    } else {
      guessCell = lastGuess.cell;
      possibleValues = lastGuess.possibleValues;
      this.sudokuService.removeLastActionLogEntry(); // remove previous action
      if (possibleValues.length === 0) {
        return false;
      }
    }
    guessValue = possibleValues[0];   // try 1st available candidate
    possibleValues = possibleValues.slice(1);   // remove guess value
    this.hintService.addHintLogEntry(new ValueHint(HintType.GUESS, guessCell, guessValue));
    this.sudokuService.setValue(guessCell, guessValue, ActionType.GUESS_VALUE, possibleValues);
    return true;
  } // guess()

  /**
   * Find and return the cell index that has the fewest candidates. The cound
   * cell should never have less than two candidates because zero would mean
   * the cell has a value, and one would have been earlier identified as a
   * naked single. Most of the time the fewest candidate cell will have only
   * two candidates. The cells are searched randomly.
   */
  private findFewestCandidatesCell() : number {
    let minCands = 10;
    let minCandsCell: number = -1;
    let currentCellCands: number;
    for (let c of this.randomCellIndexes) {

      if (this.sudokuService.hasValue(c)) {
        continue;
      }

      currentCellCands = this.sudokuService.getNumberOfCandidates(c);
      if (currentCellCands === 2) {
        return c;   // can't get lower than 2
      }

      if (currentCellCands < minCands) {
        minCands = currentCellCands;
        minCandsCell = c;
      }

      // needed?
      if (minCands <= 2) {
        break;	// 0 --> value, 1 --> naked single
      }
    }
    return minCandsCell;
  } // findFewestCandidatesCell()

  /**
   * Working backwards undo every action until a guess action 
   */
  private rollbackToLastGuess() : GuessAction {

    // undo entries that are not guesses
    let lastAction = this.actionLog.getLastEntry();
    while (lastAction && lastAction.type != ActionType.GUESS_VALUE) {
      this.sudokuService.undoAction(lastAction);
      this.actionLog.removeLastEntry();
      lastAction = this.actionLog.getLastEntry();
    }

    if (this.actionLog.getLastEntry() &&
        this.actionLog.getLastEntry().type === ActionType.GUESS_VALUE) {
      this.sudokuService.undoAction(this.actionLog.getLastEntry());

      return <GuessAction> this.actionLog.getLastEntry();   // last GUESS_VALUE action
    }
    return undefined;
  } // rollbackToLastGuess()

  /**
   * Called in step 3 to clear everything except initial (given) values
   */
  private rollbackAll() : void {
    while (this.actionLog.getLastEntry()) {
      this.sudokuService.undoAction(this.actionLog.getLastEntry());
      this.actionLog.removeLastEntry();
    }
  } // rollbackAll()

}
