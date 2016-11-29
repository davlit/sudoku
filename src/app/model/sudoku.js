"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
// ***** observable version *****
var Observable_1 = require('rxjs/Observable');
var group_1 = require('./group');
var cell_1 = require('./cell');
var common_1 = require('../common/common');
var difficulty_1 = require('./difficulty');
var difficulty_2 = require('./difficulty');
var puzzle_1 = require('./puzzle');
var action_1 = require('../action/action');
var action_2 = require('../action/action');
var action_3 = require('../action/action');
var actionLog_1 = require('../action/actionLog');
var hint_1 = require('../hint/hint');
var hint_2 = require('../hint/hint');
var hintLog_1 = require('../hint/hintLog');
var common_2 = require('../common/common');
var common_3 = require('../common/common');
var common_4 = require('../common/common');
var common_5 = require('../common/common');
var common_6 = require('../common/common');
var common_7 = require('../common/common');
var common_8 = require('../common/common');
var common_9 = require('../common/common');
var common_10 = require('../common/common');
var common_11 = require('../common/common');
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
var Sudoku = (function () {
    // private puzzle: Puzzle;
    function Sudoku(actionLog, hintLog) {
        this.actionLog = actionLog;
        this.hintLog = hintLog;
        // ***** observable version *****
        this.currentSudoku = null;
        this.pass = 0;
        this.rows = new Array(9);
        this.cols = new Array(9);
        this.boxs = new Array(9);
        this.cells = new Array(81);
        this.hint = null;
        this.valuesSet = new Array(10);
        // this.actionLog = new ActionLog();
        // private actionLog: ActionLog;
        this.hintLog = new hintLog_1.HintLog();
        // every row, column, and box is instance of Group
        for (var _i = 0, GROUPS_1 = common_4.GROUPS; _i < GROUPS_1.length; _i++) {
            var i = GROUPS_1[_i];
            this.rows[i] = new group_1.Group(common_9.ROW_CELLS[i]);
            this.cols[i] = new group_1.Group(common_10.COL_CELLS[i]);
            this.boxs[i] = new group_1.Group(common_11.BOX_CELLS[i]);
        }
        // instantiate each cell; assign its row, column, and box objects
        for (var _a = 0, CELLS_1 = common_8.CELLS; _a < CELLS_1.length; _a++) {
            var c = CELLS_1[_a];
            this.cells[c] = new cell_1.Cell();
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
    Sudoku.getRelatedCells = function (idx) {
        var relatedCells = [];
        var r = common_1.Common.rowIdx(idx);
        var c = common_1.Common.colIdx(idx);
        var b = common_1.Common.boxIdx(idx);
        for (var _i = 0, _a = common_9.ROW_CELLS[common_1.Common.rowIdx(idx)]; _i < _a.length; _i++) {
            var r_1 = _a[_i];
            if (r_1 === idx) {
                continue;
            }
            relatedCells.push(r_1);
        }
        for (var _b = 0, _c = common_10.COL_CELLS[common_1.Common.colIdx(idx)]; _b < _c.length; _b++) {
            var c_1 = _c[_b];
            if (c_1 === idx) {
                continue;
            }
            relatedCells.push(c_1);
        }
        for (var _d = 0, _e = common_11.BOX_CELLS[common_1.Common.boxIdx(idx)]; _d < _e.length; _d++) {
            var b_1 = _e[_d];
            if (relatedCells.indexOf(b_1) < 0) {
                relatedCells.push(b_1);
            }
        }
        return relatedCells;
    }; // getRelatedCells()
    /**
     * Return an array of pair combinations of items in a list.
     */
    Sudoku.pairwise = function (list) {
        var pairs = [];
        var pos = 0;
        for (var i = 0; i < list.length; i++) {
            for (var j = i + 1; j < list.length; j++) {
                pairs[pos++] = [list[i], list[j]];
            }
        }
        return pairs;
    };
    /**
     * Return an array of triple combinations of items in a list.
     */
    Sudoku.tripwise = function (list) {
        var trips = [];
        var pos = 0;
        for (var i = 0; i < list.length; i++) {
            for (var j = i + 1; j < list.length; j++) {
                for (var k = j + 1; k < list.length; k++) {
                    trips[pos++] = [list[i], list[j], list[k]];
                }
            }
        }
        return trips;
    };
    /**
     * Return an array of quad combinations of items in a list.
     */
    Sudoku.quadwise = function (list) {
        var quads = [];
        var pos = 0;
        for (var i = 0; i < list.length; i++) {
            for (var j = i + 1; j < list.length; j++) {
                for (var k = j + 1; k < list.length; k++) {
                    for (var l = k + 1; l < list.length; l++) {
                        quads[pos++] = [list[i], list[j], list[k], list[l]];
                    }
                }
            }
        }
        return quads;
    };
    //------------------------------------------------------------------------
    // public functions
    //------------------------------------------------------------------------
    Sudoku.prototype.getCurrentSudoku = function () {
        return this.currentSudoku;
    };
    /**
     * Clears all cells, logs, and related data.
     */
    Sudoku.prototype.initialize = function () {
        for (var _i = 0, CELLS_2 = common_8.CELLS; _i < CELLS_2.length; _i++) {
            var c = CELLS_2[_i];
            this.cells[c].initialize();
        }
        for (var _a = 0, GROUPS_2 = common_4.GROUPS; _a < GROUPS_2.length; _a++) {
            var g = GROUPS_2[_a];
            this.rows[g].initialize();
            this.cols[g].initialize();
            this.boxs[g].initialize();
        }
        this.solutionsCount = 0;
        this.hint = null;
        this.hintLog.initialize();
        this.actionLog.initialize();
        for (var _b = 0, VALUES_1 = common_2.VALUES; _b < VALUES_1.length; _b++) {
            var v = VALUES_1[_b];
            this.valuesSet[v] = 0;
        }
    }; // initialize()
    /**
     * Gets value in cell at given row and column (1..9).
     */
    Sudoku.prototype.getValue_ = function (r, c) {
        return this.getValue(common_1.Common.cellIdx(r, c));
    };
    ;
    /**
     * Sets value in cell at given row and column (1..9).
     */
    Sudoku.prototype.setValue_ = function (r, c, newValue) {
        this.setValue(common_1.Common.cellIdx(r, c), newValue, 0 /* SET_VALUE */);
    };
    Sudoku.prototype.getHint_ = function () {
        return this.getHint(difficulty_2.DifficultyType.ANY);
    };
    /**
     * Removes value in cell at given row and column (1..9).
     */
    Sudoku.prototype.removeValue_ = function (r, c) {
        this.removeValue(common_1.Common.cellIdx(r, c));
    };
    ;
    /**
     * Removes given candidate from cell at given row and column (1..9).
     */
    Sudoku.prototype.removeCandidate_ = function (r, c, k) {
        this.removeCandidate(common_1.Common.cellIdx(r, c), k, null); // user action
    }; // removeCandidate_()
    /**
     *
     */
    Sudoku.prototype.getHint = function (maxDifficultyRating) {
        this.hint = null;
        if (maxDifficultyRating === difficulty_2.DifficultyType.EASY) {
            if (this.checkNakedSingles()
                || this.checkHiddenSingles()) {
                return this.hint;
            }
            return null;
        }
        if (this.checkNakedSingles()
            || this.checkHiddenSingles()
            || this.checkNakedPairs()
            || this.checkPointingRowCol()
            || this.checkRowBoxReductions()
            || this.checkColBoxReductions()
            || this.checkNakedTriples()
            || this.checkNakedQuads()
            || this.checkHiddenPairs()
            || this.checkHiddenTriples()) {
            return this.hint;
        }
        return null;
    }; // getHint()
    /**
     * Apply hint toward solution.
     */
    Sudoku.prototype.applyHint = function () {
        // let args = hint.removals;
        if (this.hint == null) {
            return; // no hunt to apply
        }
        this.hintLog.addEntry(this.hint);
        // switch (hint.action) {
        switch (this.hint.type) {
            case 0 /* NAKED_SINGLE */:
            case 1 /* HIDDEN_SINGLE_ROW */:
            case 2 /* HIDDEN_SINGLE_COL */:
            case 3 /* HIDDEN_SINGLE_BOX */:
                var vHint = this.hint;
                this.setValue(vHint.cell, vHint.value, 0 /* SET_VALUE */, null, vHint);
                break;
            default:
                var kHint = this.hint;
                var removals = kHint.removals;
                for (var _i = 0, removals_1 = removals; _i < removals_1.length; _i++) {
                    var removal = removals_1[_i];
                    this.removeCandidate(removal.c, removal.k, kHint);
                }
        } // switch
        this.hint = null;
    }; // applyHint()
    /**
     *
     */
    Sudoku.prototype.isValid = function () {
        for (var _i = 0, GROUPS_3 = common_4.GROUPS; _i < GROUPS_3.length; _i++) {
            var g = GROUPS_3[_i];
            if (!this.rows[g].isValid()
                || !this.cols[g].isValid()
                || !this.boxs[g].isValid()) {
                return false;
            }
        }
        for (var _a = 0, CELLS_3 = common_8.CELLS; _a < CELLS_3.length; _a++) {
            var c = CELLS_3[_a];
            if (!this.cells[c].isValid()) {
                return false;
            }
        }
        return true;
    }; // isValid()
    /**
     *
     */
    Sudoku.prototype.isCellInvalid = function (r, c) {
        var cell = common_1.Common.cellIdx(r, c);
        return !this.rows[common_1.Common.rowIdx(cell)].isValid()
            || !this.cols[common_1.Common.colIdx(cell)].isValid()
            || !this.boxs[common_1.Common.boxIdx(cell)].isValid();
    };
    /**
     *
     */
    Sudoku.prototype.isCellLocked = function (r, c) {
        // return this.cells[r][c].isLocked();
        return this.cells[common_1.Common.cellIdx(r, c)].isLocked();
    };
    /**
     * TODO Determines if sudoku is fully solved. If
     */
    Sudoku.prototype.isSolved = function () {
        for (var _i = 0, ROWS_1 = common_5.ROWS; _i < ROWS_1.length; _i++) {
            var r = ROWS_1[_i];
            if (!this.rows[r].isComplete()) {
                return false;
            }
        }
        return true;
    };
    /**
     * Determines if the given value appears 9 times.
     */
    Sudoku.prototype.isValueComplete = function (value) {
        return this.valuesSet[value] >= 9;
    };
    /**
     *
     */
    Sudoku.prototype.isCandidate_ = function (r, c, k) {
        return this.isCandidate(common_1.Common.cellIdx(r, c), k);
    };
    /**
     *
     */
    Sudoku.prototype.getNakedCandidates = function (r, c, maxCandidates) {
        return this.cells[common_1.Common.cellIdx(r, c)].findNakedCandidates(maxCandidates);
    };
    /**
     *
     */
    Sudoku.prototype.gen = function (desiredDifficultyType) {
        return this.generatePuzzle(desiredDifficultyType);
    }; // gen()
    /**
     *
     */
    Sudoku.prototype.getLastAction = function () {
        return this.actionLog.getLastEntry();
    };
    /**
     *
     */
    Sudoku.prototype.getActionLogAsString = function () {
        return this.actionLog.toStringLastFirst();
    };
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
    Sudoku.prototype.undoAction = function (action) {
        var actionType = action.type;
        switch (actionType) {
            case (0 /* SET_VALUE */):
            case (1 /* GUESS_VALUE */):
                this.removeValue(action.cell);
                break;
            case (2 /* REMOVE_CANDIDATE */):
                this.addCandidate(action.cell, action.candidate);
        }
    }; // undoAction()
    /**
     * Called by user button press (playComponent.ts) undoLastAction())
     */
    Sudoku.prototype.undoLastAction = function () {
        var lastAction = this.actionLog.getLastEntry();
        this.undoAction(lastAction);
        this.actionLog.removeLastEntry();
    }; // undoLastAction()
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
    Sudoku.prototype.loadProvidedSudoku = function (initialValues) {
        var puzzle = new puzzle_1.Puzzle();
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
    }; // loadProvidedSudoku()
    /**
     * Sets up sudoku model with a set of initial vallues.
     */
    Sudoku.prototype.initializeModel = function (initialValues) {
        this.initialize();
        for (var _i = 0, CELLS_4 = common_8.CELLS; _i < CELLS_4.length; _i++) {
            var c = CELLS_4[_i];
            var cell = this.cells[c]; // cell at [c] in cells array
            var v = initialValues[c]; // value at [c] in values array
            cell.initialize();
            if (v === 0) {
                continue;
            }
            cell.setInitialValue(v); // clears candidates, locks cell
            this.rows[common_1.Common.rowIdx(c)].addValue(v);
            this.cols[common_1.Common.colIdx(c)].addValue(v);
            this.boxs[common_1.Common.boxIdx(c)].addValue(v);
            this.valuesSet[v]++;
        } // for
        this.refreshAllCellsCandidates(); // set candidates in non-value cells 
    }; // initializeModel()
    /**
     * Generating a puzzle is a 3 step process.
     * Step 1: construct a random complete sudoku solution.
     * Step 2: Remove values selected cells maintaining a unique solution.
     * Step 3: Rate the difficulty of the sudoku solution
     * The end result is a puzzle with only one possible solution using
     * solving techniques appropriate to the difficulty desired.
     */
    Sudoku.prototype.generatePuzzle = function (desiredDifficulty) {
        // gen(desiredDifficulty: DifficultyType) : Puzzle {
        this.pass = 0;
        var puzzle = new puzzle_1.Puzzle();
        puzzle.difficultyRequested = desiredDifficulty;
        // loop until we get sudoku of desired difficulty
        while (puzzle.difficultyDelivered != desiredDifficulty && this.pass < 300) {
            // step 1 - generate random finished sudoku
            puzzle.completedPuzzle = this.makeRandomSolution();
            // step 2 - create starting values by paring cells
            this.getStartingValues(puzzle);
            // step 3 - solve puzzle to get stats and actual difficulty
            this.completePuzzle(puzzle);
            this.pass++;
        } // while not getting desired difficulty
        // console.log('Sudoku generated');
        puzzle.generatePasses = this.pass;
        this.initializeModel(puzzle.initialValues);
        console.log('Puzzle:\n' + puzzle.toString());
        return puzzle;
    }; // generatePuzzle()
    Sudoku.prototype.getPass = function () {
        return this.pass;
    };
    // ***** observable version *****
    Sudoku.prototype.generatePuzzleOV = function (desiredDifficulty) {
        // gen(desiredDifficulty: DifficultyType) : Puzzle {
        this.pass = 0;
        var puzzle = new puzzle_1.Puzzle();
        puzzle.difficultyRequested = desiredDifficulty;
        // loop until we get sudoku of desired difficulty
        while (puzzle.difficultyDelivered != desiredDifficulty && this.pass < 300) {
            // step 1 - generate random finished sudoku
            puzzle.completedPuzzle = this.makeRandomSolution();
            // step 2 - create starting values by paring cells
            this.getStartingValues(puzzle);
            // step 3 - solve puzzle to get stats and actual difficulty
            this.completePuzzle(puzzle);
            this.pass++;
        } // while not getting desired difficulty
        // console.log('Sudoku generated');
        puzzle.generatePasses = this.pass;
        this.initializeModel(puzzle.initialValues);
        console.log('Puzzle:\n' + puzzle.toString());
        return new Observable_1.Observable();
    }; // generatePuzzle()OV
    // ***** observable version *****
    // ***** observable version begin *****
    // private desiredDifficulty: DifficultyType;
    // //private pass:number = 0;
    // //private currentSudoku: Puzzle = null
    // // generateObservableSudoku: Observable<number>;
    // setDesiredDifficulty(difficulty: DifficultyType) : void {
    //   this.desiredDifficulty = difficulty;
    // }
    // generateSudoku() {
    // }
    // generateObservableSudoku: Observable<number> = new Observable(observer: Observable<number> => {
    //         setTimeout(() => {
    //             observer.next(42);
    //         }, 1000);
    //         setTimeout(() => {
    //             observer.next(43);
    //         }, 2000);
    //         setTimeout(() => {
    //             observer.complete();
    //         }, 3000);
    // });
    // getCurrentSudoku() : Puzzle {
    //   return this.currentSudoku;
    // }
    // ***** observable version end   *****
    // ***** observable version *****
    //   generateSudoku(desiredDifficulty: DifficultyType) : Observable<number> {
    //   // gen(desiredDifficulty: DifficultyType) : Puzzle {
    //     let observer: Observer<number>;
    //     let observable: Observable<number> = new Observable<number>(observer: Observer<number>);
    //     let pass = 0;
    //     let puzzle = new Puzzle();
    //     puzzle.difficultyRequested = desiredDifficulty;
    //     // loop until we get sudoku of desired difficulty
    //     while (puzzle.difficultyDelivered != desiredDifficulty && pass < 300) {
    //       // step 1 - generate random finished sudoku
    //       puzzle.completedPuzzle = this.makeRandomSolution();
    //       // step 2 - create starting values by paring cells
    //       this.getStartingValues(puzzle);
    //       // step 3 - solve puzzle to get stats and actual difficulty
    //       this.completePuzzle(puzzle);
    //       pass++;
    //       observer.next(pass);
    // console.log('Pass: ' + pass);
    //     } // while not getting desired difficulty
    //       observer.complete();
    // // console.log('Sudoku generated');
    //     puzzle.generatePasses = pass;
    //     this.initializeModel(puzzle.initialValues);
    // console.log('Puzzle:\n' + puzzle.toString());
    //     this.currentSudoku = puzzle;
    //       // observer.complete();
    //     }); // new Observable
    //     return observable;
    //   } // generateSudoku()
    //   // ***** observable version *****
    //   getCurrentSudoku() {
    //     return this.currentSudoku;
    //   }
    //*********************************************
    // private data: Observable<Array<number>> = 
    //   data = Observable.create(observer => {
    //   // data = new Observable(function(observer) {
    //     setTimeout(() => {
    //       observer.next(42);
    //     }, 1000);
    //     setTimeout(() => {
    //       observer.next(43);
    //     }, 2000);
    //     setTimeout(() => {
    //       observer.complete();
    //     }, 3000);
    //   });
    //   gen(desiredDifficulty: DifficultyType) : Puzzle {
    //     let pass = 0;
    //     let puzzle = new Puzzle();
    //     puzzle.difficultyRequested = desiredDifficulty;
    //     // loop until we get sudoku of desired difficulty
    //     while (puzzle.difficultyDelivered != desiredDifficulty && pass < 300) {
    //       // step 1 - generate random finished sudoku
    //       puzzle.completedPuzzle = this.makeRandomSolution();
    //       // step 2 - create starting values by paring cells
    //       this.getStartingValues(puzzle);
    //       // step 3 - solve puzzle to get stats and actual difficulty
    //       this.completePuzzle(puzzle);
    //       pass++;
    // // console.log('Pass: ' + pass);
    //     } // while not getting desired difficulty
    // // console.log('Sudoku generated');
    //     puzzle.generatePasses = pass;
    //     this.initializeModel(puzzle.initialValues);
    // console.log('Puzzle:\n' + puzzle.toString());
    //     return puzzle;
    //   } // generatePuzzle()
    // onNext(p: number) : number {
    //   return p;
    // }
    // onError(message: string) : string {
    //   return message;
    // }
    // onCompleted(puzzle: Puzzle) : Puzzle {
    //   return puzzle;
    // }
    // this.myObservable.subscribe(myOnNext, myError, myComplete);
    // subscriber: Observable = 
    //*********************************************
    /**
     * [Step 1]
     * Start by seeding values 1..9 in 9 random cells. Then using standard
     * solving and guessing techniques create a random, consistent, fully
     * filled-in solution. Return the full solution as a cell values array.
     */
    Sudoku.prototype.makeRandomSolution = function () {
        this.initialize();
        this.randomCellIndexes = common_1.Common.shuffleArray(common_8.CELLS.slice());
        this.randomValues = common_1.Common.shuffleArray(common_2.VALUES.slice());
        for (var _i = 0, VALUES_2 = common_2.VALUES; _i < VALUES_2.length; _i++) {
            var v = VALUES_2[_i];
            this.setValue(this.randomCellIndexes[v], v, 1 /* GUESS_VALUE */);
        }
        this.solve();
        return this.cellsToValuesArray();
    }; // makeRandomSolution()
    /**
     * [Step 2]
     */
    Sudoku.prototype.getStartingValues = function (puzzle) {
        this.actionLog.initialize();
        this.hintLog.initialize();
        this.randomCellIndexes = common_1.Common.shuffleArray(common_8.CELLS.slice());
        this.randomValues = common_1.Common.shuffleArray(common_2.VALUES.slice());
        // just scan half (plus center) cells (0..40); symC is in other half
        NEXT_CELL: for (var _i = 0, _a = common_1.Common.shuffleArray(common_8.CELLS.slice(0, 41)); _i < _a.length; _i++) {
            var c = _a[_i];
            // cell & sym cell are 180deg rotationally symmetric
            var symC = 80 - c;
            // save then remove values of symmetric twins 
            var savedValue = this.getValue(c);
            var savedSymValue = this.getValue(symC);
            this.removeValue(c);
            this.removeValue(symC);
            switch (puzzle.difficultyRequested) {
                // no guessing cases
                case difficulty_2.DifficultyType.EASY:
                case difficulty_2.DifficultyType.MEDIUM:
                case difficulty_2.DifficultyType.HARD:
                    while (this.getHint(puzzle.difficultyRequested)) {
                        this.applyHint();
                    }
                    var solved = this.isSolved();
                    this.rollbackAll();
                    if (solved) {
                        continue NEXT_CELL; // don't restore sym cells
                    } // if not solved, fall through to restore pared cells
                // guess when no hints available
                case difficulty_2.DifficultyType.HARDEST:
                    var localSolutionsCount = this.countSolutions();
                    this.rollbackAll();
                    if (localSolutionsCount <= 1) {
                        continue NEXT_CELL; // don't restore sym cells
                    } // if multiple solutions, fall through to restore pared cells
            } // switch
            this.setValue(c, savedValue, 0 /* SET_VALUE */);
            this.setValue(symC, savedSymValue, 0 /* SET_VALUE */);
            this.actionLog.removeLastEntry(); // keep restores out of action log
            this.actionLog.removeLastEntry();
        } // for next random symmetric pairs of cells to pare
        puzzle.initialValues = this.cellsToValuesArray();
    }; // getStartingValues() [step 2 - no guesses]
    /**
     * [Step 3]
     * Now having a full solution and initial values, solve the sudoku using
     * hints and guessing. While doing this, count the specific solution
     * tehcniques (types of hints, and guesses) to properly determine the
     * actual, delivered difficulty rating.
     */
    Sudoku.prototype.completePuzzle = function (puzzle) {
        this.hintLog.initialize();
        this.actionLog.initialize();
        this.randomCellIndexes = common_1.Common.shuffleArray(common_8.CELLS.slice());
        this.randomValues = common_1.Common.shuffleArray(common_2.VALUES.slice());
        this.solve();
        puzzle.completedPuzzle = this.cellsToValuesArray();
        puzzle.stats = this.hintLog.getHintCounts();
        puzzle.difficultyDelivered = difficulty_1.Difficulty.getDifficulty(puzzle.stats);
    }; // completePuzzle() [step 3]
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
    Sudoku.prototype.solve = function () {
        while (this.getHint(0) != null) {
            this.applyHint();
            if (this.isSolved()) {
                return true; // done
            }
            if (this.isImpossible()) {
                return false; // no value, no candidate cell exists
            }
        } // while -- no hint, try guess
        // now we have to resort to guessing
        var lastGuess = null;
        while (this.guess(lastGuess)) {
            if (this.solve()) {
                // recursive call returned true -> solved!
                return true;
            }
            else {
                // recursive call returned false -> (1) impossible. (2) no guesses left
                lastGuess = this.rollbackToLastGuess();
            }
        } // while guess()
        return false;
    }; // solve()
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
    Sudoku.prototype.countSolutions = function () {
        while (this.getHint(0) != null) {
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
        var localSolutionsCount = 0;
        var lastGuess = null;
        while (this.guess(lastGuess)) {
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
    }; // countSolutions()
    /**
     * Makes a guess for a cell value. If a lastGuess is not provided, a cell
     * with the fewest number is selected. The first guess in a cell is the
     * first available candidate. If rollbacks dictate a subsequent guess, the
     * next available candidate is used.
     */
    Sudoku.prototype.guess = function (lastGuess) {
        var guessCell = null;
        var possibleValues = [];
        var guessValue = null;
        if (lastGuess == null) {
            guessCell = this.findFewestCandidatesCell();
            possibleValues = this.cells[guessCell].getCandidates();
        }
        else {
            guessCell = lastGuess.cell;
            possibleValues = lastGuess.possibleValues;
            this.actionLog.removeLastEntry(); // remove previous action
            if (possibleValues.length === 0) {
                return false;
            }
        }
        guessValue = possibleValues[0]; // try 1st available candidate
        possibleValues = possibleValues.slice(1); // remove guess value
        this.hintLog.addEntry(new hint_1.ValueHint(26 /* GUESS */, guessCell, guessValue));
        this.setValue(guessCell, guessValue, 1 /* GUESS_VALUE */, possibleValues);
        return true;
    }; // guess()
    /**
     * Find and return the cell index that has the fewest candidates. The cound
     * cell should never have less than two candidates because zero would mean
     * the cell has a value, and one would have been earlier identified as a
     * naked single. Most of the time the fewest candidate cell will have only
     * two candidates. The cells are searched randomly.
     */
    Sudoku.prototype.findFewestCandidatesCell = function () {
        var minCands = 10;
        var minCandsCell = -1;
        var currentCellCands;
        for (var _i = 0, _a = this.randomCellIndexes; _i < _a.length; _i++) {
            var c = _a[_i];
            currentCellCands = this.cells[c].getNumberOfCandidates();
            if (currentCellCands === 0) {
                continue; // cell has value
            }
            if (currentCellCands < minCands) {
                minCands = currentCellCands;
                minCandsCell = c;
            }
            if (minCands <= 2) {
                break; // 0 --> value, 1 --> naked single
            }
        }
        return minCandsCell;
    }; // findFewestCandidatesCell()
    /**
     * Return value of cell. Zero means no value;
     */
    Sudoku.prototype.getValue = function (idx) {
        return this.cells[idx].getValue();
    };
    ;
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
    Sudoku.prototype.setValue = function (idx, newValue, actionType, guessPossibles, hint) {
        // cannot change locked cell
        if (this.cells[idx].isLocked()) {
            return; // can't change locked cell
        }
        // if cell has value, remove it first
        if (this.cells[idx].hasValue()) {
            if (this.cells[idx].getValue() === newValue) {
                return; // same as existing value, nothing to do
            }
            this.removeValue(idx);
        }
        // set value, update groups and values used; log action
        this.cells[idx].setValue(newValue); // cell removes any candidates
        this.rows[common_1.Common.rowIdx(idx)].addValue(newValue);
        this.cols[common_1.Common.colIdx(idx)].addValue(newValue);
        this.boxs[common_1.Common.boxIdx(idx)].addValue(newValue);
        this.valuesSet[newValue]++;
        var action;
        switch (actionType) {
            case 0 /* SET_VALUE */:
                action = new action_1.ValueAction(0 /* SET_VALUE */, idx, newValue, hint);
                break;
            case 1 /* GUESS_VALUE */:
                action = new action_2.GuessAction(1 /* GUESS_VALUE */, idx, newValue, guessPossibles, hint);
                break;
        } // switch
        this.actionLog.addEntry(action);
        // remove candidate (this value) from related cells
        for (var _i = 0, _a = Sudoku.getRelatedCells(idx); _i < _a.length; _i++) {
            var rc = _a[_i];
            if (this.cells[rc].hasValue()) {
                continue;
            }
            this.cells[rc].removeCandidate(newValue);
        }
    }; // setValue()
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
    Sudoku.prototype.removeValue = function (idx) {
        // cannot change locked cell
        if (this.cells[idx].isLocked()) {
            return; // can't change locked cell
        }
        // get existing value, exit if no existing value
        var oldValue = this.getValue(idx);
        if (oldValue === 0) {
            return; // nothing to remove
        }
        // remove value, update groups and values used; log action
        this.cells[idx].removeValue();
        this.rows[common_1.Common.rowIdx(idx)].removeValue(oldValue);
        this.cols[common_1.Common.colIdx(idx)].removeValue(oldValue);
        this.boxs[common_1.Common.boxIdx(idx)].removeValue(oldValue);
        this.valuesSet[oldValue]--;
        // add applicable candidates to cell
        for (var _i = 0, VALUES_3 = common_2.VALUES; _i < VALUES_3.length; _i++) {
            var v = VALUES_3[_i];
            if (this.rows[common_1.Common.rowIdx(idx)].containsValue(v)
                || this.cols[common_1.Common.colIdx(idx)].containsValue(v)
                || this.boxs[common_1.Common.boxIdx(idx)].containsValue(v)) {
                continue;
            }
            this.addCandidate(idx, v);
        }
        // add candidate (this cell's old value) to related cells
        for (var _a = 0, _b = Sudoku.getRelatedCells(idx); _a < _b.length; _a++) {
            var rc = _b[_a];
            if (this.rows[common_1.Common.rowIdx(rc)].containsValue(oldValue)
                || this.cols[common_1.Common.colIdx(rc)].containsValue(oldValue)
                || this.boxs[common_1.Common.boxIdx(rc)].containsValue(oldValue)) {
                continue;
            }
            this.addCandidate(rc, oldValue);
        }
    }; // removeValue()
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
    Sudoku.prototype.removeCandidate = function (idx, k, hint) {
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
        var action = new action_3.RemoveAction(2 /* REMOVE_CANDIDATE */, idx, k, hint);
        this.actionLog.addEntry(action);
    }; // removeCandidate()
    /**
     * Add given candidate to given cell.
     * - cannot add candidate to cell that has a value
     * - cannot add candidate if a related cell has that value
     *
     * Called by:
     * - undoAction() - undo REMOVE_CANDIDATE
     * - removeValue()
     */
    Sudoku.prototype.addCandidate = function (idx, k) {
        // do not add if value exists
        if (this.cells[idx].hasValue()) {
            // console.error('Cannot add candidate to cell with a value.');
            return;
        }
        // do not add if any related cell has that value
        for (var _i = 0, _a = Sudoku.getRelatedCells(idx); _i < _a.length; _i++) {
            var rc = _a[_i];
            if (this.cells[rc].getValue() === k) {
                return;
            }
        }
        // add candidate
        this.cells[idx].addCandidate(k);
    }; // addCandidate()
    /**
     *
     */
    Sudoku.prototype.isCandidate = function (idx, k) {
        return this.cells[idx].isCandidate(k);
    };
    /**
     * Sets all cells' candidates based on surrounding values. This will
     * overwrite any candidate removals that resulted from naked pairs, etc.
     */
    Sudoku.prototype.refreshAllCellsCandidates = function () {
        for (var _i = 0, CELLS_5 = common_8.CELLS; _i < CELLS_5.length; _i++) {
            var c = CELLS_5[_i];
            this.refreshCellCandidates(c);
        }
    }; // refreshAllCellsCandidates()
    /**
     * Sets a cell's candidates based on surrounding values. This will overwrite
     * any candidate removals that resulted from naked pairs, etc.
     */
    Sudoku.prototype.refreshCellCandidates = function (idx) {
        var cell = this.cells[idx];
        if (cell.hasValue()) {
            cell.unsetAllCandidates(); // extra safeguard; also in cell set value
            return;
        }
        cell.initializeCandidates(); // set all candidates
        for (var _i = 0, _a = Sudoku.getRelatedCells(idx); _i < _a.length; _i++) {
            var relatedCell = _a[_i];
            var rcValue = this.cells[relatedCell].getValue();
            if (rcValue > 0) {
                cell.removeCandidate(rcValue); // remove selected
            }
        }
        if (cell.getNumberOfCandidates() === 0) {
            console.error('Invalid cell: ' + cell.toString());
        }
    }; // refreshCellCandidates()
    /**
     * Returns true if given cell has a value;
     */
    Sudoku.prototype.hasValue = function (idx) {
        return this.cells[idx].hasValue();
    };
    /**
     *
     */
    Sudoku.prototype.isImpossible = function () {
        for (var _i = 0, CELLS_6 = common_8.CELLS; _i < CELLS_6.length; _i++) {
            var i = CELLS_6[_i];
            if (this.cells[i].isImpossible()) {
                return true;
            }
        }
        return false;
    }; // isImpossible()
    /**
     * Working backwards undo every action until a guess action
     */
    Sudoku.prototype.rollbackToLastGuess = function () {
        // undo entries that are not guesses
        var lastAction = this.actionLog.getLastEntry();
        while (lastAction && lastAction.type != 1 /* GUESS_VALUE */) {
            this.undoAction(lastAction);
            this.actionLog.removeLastEntry();
            lastAction = this.actionLog.getLastEntry();
        }
        if (this.actionLog.getLastEntry() &&
            this.actionLog.getLastEntry().type === 1 /* GUESS_VALUE */) {
            this.undoAction(this.actionLog.getLastEntry());
            return this.actionLog.getLastEntry(); // last GUESS_VALUE action
        }
        return null;
    }; // rollbackToLastGuess()
    /**
     * Called in step 3 to clear everything except initial (given) values
     */
    Sudoku.prototype.rollbackAll = function () {
        while (this.actionLog.getLastEntry()) {
            this.undoAction(this.actionLog.getLastEntry());
            this.actionLog.removeLastEntry();
        }
    }; // rollbackAll()
    /**
     * Randomly look for cells with a single candidate. If found, create a hint
     * and return true. If none found, return false.
     */
    Sudoku.prototype.checkNakedSingles = function () {
        for (var _i = 0, _a = common_1.Common.shuffleArray(common_8.CELLS.slice()); _i < _a.length; _i++) {
            var c = _a[_i];
            var nakedCells = this.cells[c].findNakedCandidates(0 /* SINGLE */);
            if (nakedCells.length > 0) {
                this.hint = new hint_1.ValueHint(0 /* NAKED_SINGLE */, c, nakedCells[0]);
                return true;
            }
        } // next random cell
        return false;
    }; // checkNakedSingles()
    /**
     * Check for hidden singles in rows, columns, and boxes. If found, create
     * a hint and return true, otherwise return false.
     */
    Sudoku.prototype.checkHiddenSingles = function () {
        if (this.checkGroupHiddenSingles(common_9.ROW_CELLS, 1 /* HIDDEN_SINGLE_ROW */)
            || this.checkGroupHiddenSingles(common_10.COL_CELLS, 2 /* HIDDEN_SINGLE_COL */)
            || this.checkGroupHiddenSingles(common_11.BOX_CELLS, 3 /* HIDDEN_SINGLE_BOX */)) {
            return true;
        }
        return false;
    }; // checkHiddenSingles()
    /**
     * Check for hidden singles in rows, columns, or boxes. If found, create
     * a hint and return true, otherwise return false. The parameters determine
     * which type of groups will be searched.
     */
    Sudoku.prototype.checkGroupHiddenSingles = function (cellsArray, hintType) {
        var singleCell = -1;
        for (var _i = 0, GROUPS_4 = common_4.GROUPS; _i < GROUPS_4.length; _i++) {
            var gIdx = GROUPS_4[_i];
            for (var _a = 0, CANDIDATES_1 = common_3.CANDIDATES; _a < CANDIDATES_1.length; _a++) {
                var k = CANDIDATES_1[_a];
                var kCount = 0;
                for (var _b = 0, _c = cellsArray[gIdx]; _b < _c.length; _b++) {
                    var c = _c[_b];
                    if (this.isCandidate(c, k)) {
                        kCount++;
                        if (kCount > 1) {
                            break; // value not single
                        }
                        singleCell = c;
                    }
                } // cells within value loop
                if (kCount === 1) {
                    this.hint = new hint_1.ValueHint(hintType, singleCell, k);
                    return true;
                }
            } // values within group loop
        } // groups loop
        return false;
    }; // checkGroupHiddenSingles()
    /**
     * Check for naked pairs in rows, columns, and boxes. If found, create a hint
     * and return true, otherwise return false.
     */
    Sudoku.prototype.checkNakedPairs = function () {
        // get array of cells with 2 and only 2 candidates
        var nakedCells = [];
        for (var _i = 0, CELLS_7 = common_8.CELLS; _i < CELLS_7.length; _i++) {
            var c = CELLS_7[_i];
            var nakedCands = this.cells[c].findNakedCandidates(1 /* PAIR */);
            if (nakedCands.length > 0) {
                nakedCells.push({ idx: c, cands: nakedCands });
            }
        }
        if (nakedCells.length == 0) {
            return false;
        }
        // find 2 cells that have same 2 candidates
        for (var i1 = 0; i1 < nakedCells.length; i1++) {
            for (var i2 = i1 + 1; i2 < nakedCells.length; i2++) {
                var candidates = [];
                candidates = nakedCells[i1].cands.slice();
                // add unique candidates from nakedCells[i2].candidates
                for (var _a = 0, _b = nakedCells[i2].cands; _a < _b.length; _a++) {
                    var i = _b[_a];
                    if (candidates.indexOf(i) === -1) {
                        candidates.push(i);
                    }
                }
                if (candidates.length != 2) {
                    continue; // must be 2 for naked pair
                }
                // see if cells with common candidates are in same group
                var cells = [nakedCells[i1].idx,
                    nakedCells[i2].idx];
                var sameRow = common_1.Common.areCellsInSameRow(cells);
                var sameCol = common_1.Common.areCellsInSameCol(cells);
                var sameBox = common_1.Common.areCellsInSameBox(cells);
                // if no common group, move on
                if (!sameRow && !sameCol && !sameBox) {
                    continue;
                }
                // look for actions; if none, move on
                if (sameRow) {
                    if (this.checkNakedsRemovals(common_9.ROW_CELLS[common_1.Common.rowIdx(cells[0])], cells, candidates, 4 /* NAKED_PAIRS_ROW */)) {
                        return true;
                    }
                    continue;
                }
                if (sameCol) {
                    if (this.checkNakedsRemovals(common_10.COL_CELLS[common_1.Common.colIdx(cells[0])], cells, candidates, 5 /* NAKED_PAIRS_COL */)) {
                        return true;
                    }
                    continue;
                }
                if (sameBox) {
                    if (this.checkNakedsRemovals(common_11.BOX_CELLS[common_1.Common.boxIdx(cells[0])], cells, candidates, 6 /* NAKED_PAIRS_BOX */)) {
                        return true;
                    }
                    continue;
                }
            } // for i2
        } // for i1
        return false;
    }; // checkNakedPairs()
    /**
     * Check for naked triples in rows, columns, and boxes. If found, create a hint
     * and return true, otherwise return false.
     */
    Sudoku.prototype.checkNakedTriples = function () {
        // get array of cells with 2 or 3 candidates
        var nakedCells = [];
        for (var _i = 0, CELLS_8 = common_8.CELLS; _i < CELLS_8.length; _i++) {
            var c = CELLS_8[_i];
            var nakedCands = this.cells[c].findNakedCandidates(2 /* TRIPLE */);
            if (nakedCands.length > 0) {
                nakedCells.push({ idx: c, cands: nakedCands });
            }
        }
        if (nakedCells.length == 0) {
            return false;
        }
        // find 3 cells that have same 2 or 3 candidates
        for (var i1 = 0; i1 < nakedCells.length; i1++) {
            for (var i2 = i1 + 1; i2 < nakedCells.length; i2++) {
                for (var i3 = i2 + 1; i3 < nakedCells.length; i3++) {
                    var candidates = [];
                    candidates = nakedCells[i1].cands.slice();
                    // add unique candidates from nakedCells[i2].candidates
                    for (var _a = 0, _b = nakedCells[i2].cands; _a < _b.length; _a++) {
                        var i = _b[_a];
                        if (candidates.indexOf(i) === -1) {
                            candidates.push(i);
                        }
                    }
                    if (candidates.length > 3) {
                        continue; // must be 3 for naked triple
                    }
                    // add unique candidates from nakedCells[i3].candidates
                    for (var _c = 0, _d = nakedCells[i3].cands; _c < _d.length; _c++) {
                        var i = _d[_c];
                        if (candidates.indexOf(i) === -1) {
                            candidates.push(i);
                        }
                    }
                    if (candidates.length != 3) {
                        continue; // must be 3 for naked triple
                    }
                    // see if cells with common candidates are in same group
                    var cells = [nakedCells[i1].idx,
                        nakedCells[i2].idx, nakedCells[i3].idx];
                    var sameRow = common_1.Common.areCellsInSameRow(cells);
                    var sameCol = common_1.Common.areCellsInSameCol(cells);
                    var sameBox = common_1.Common.areCellsInSameBox(cells);
                    // if no common group, move on
                    if (!sameRow && !sameCol && !sameBox) {
                        continue;
                    }
                    // look for actions; if none, move on
                    if (sameRow) {
                        if (this.checkNakedsRemovals(common_9.ROW_CELLS[common_1.Common.rowIdx(cells[0])], cells, candidates, 11 /* NAKED_TRIPLES_ROW */)) {
                            return true;
                        }
                        continue;
                    }
                    if (sameCol) {
                        if (this.checkNakedsRemovals(common_10.COL_CELLS[common_1.Common.colIdx(cells[0])], cells, candidates, 12 /* NAKED_TRIPLES_COL */)) {
                            return true;
                        }
                        continue;
                    }
                    if (sameBox) {
                        if (this.checkNakedsRemovals(common_11.BOX_CELLS[common_1.Common.boxIdx(cells[0])], cells, candidates, 13 /* NAKED_TRIPLES_BOX */)) {
                            return true;
                        }
                        continue;
                    }
                } // for i3
            } // for i2
        } // for i1
        return false;
    }; // checkNakedTriples()
    /**
     * Check for naked triples in rows, columns, and boxes. If found, create a hint
     * and return true, otherwise return false.
     */
    Sudoku.prototype.checkNakedQuads = function () {
        // get array of cells with 2, 3, or 4 candidates
        var nakedCells = [];
        for (var _i = 0, CELLS_9 = common_8.CELLS; _i < CELLS_9.length; _i++) {
            var c = CELLS_9[_i];
            var nakedCands = this.cells[c].findNakedCandidates(3 /* QUAD */);
            if (nakedCands.length > 0) {
                nakedCells.push({ idx: c, cands: nakedCands });
            }
        }
        if (nakedCells.length == 0) {
            return false;
        }
        // find 4 cells that have same 2, 3, or 4 candidates
        for (var i1 = 0; i1 < nakedCells.length; i1++) {
            for (var i2 = i1 + 1; i2 < nakedCells.length; i2++) {
                for (var i3 = i2 + 1; i3 < nakedCells.length; i3++) {
                    for (var i4 = i3 + 1; i4 < nakedCells.length; i4++) {
                        var candidates = [];
                        candidates = nakedCells[i1].cands.slice();
                        // add unique candidates from nakedCells[i2].cands
                        for (var _a = 0, _b = nakedCells[i2].cands; _a < _b.length; _a++) {
                            var i = _b[_a];
                            if (candidates.indexOf(i) === -1) {
                                candidates.push(i);
                            }
                        }
                        if (candidates.length > 4) {
                            continue; // must be 4 for naked quad
                        }
                        // add unique candidates from nakedCells[i3].cands
                        for (var _c = 0, _d = nakedCells[i3].cands; _c < _d.length; _c++) {
                            var i = _d[_c];
                            if (candidates.indexOf(i) === -1) {
                                candidates.push(i);
                            }
                        }
                        if (candidates.length > 4) {
                            continue; // must be 4 for naked quad
                        }
                        // add unique candidates from nakedCells[i4].cands
                        for (var _e = 0, _f = nakedCells[i4].cands; _e < _f.length; _e++) {
                            var i = _f[_e];
                            if (candidates.indexOf(i) === -1) {
                                candidates.push(i);
                            }
                        }
                        if (candidates.length != 4) {
                            continue; // must be 4 for naked quad
                        }
                        // see if cells with common candidates are in same group
                        var cells = [nakedCells[i1].idx,
                            nakedCells[i2].idx, nakedCells[i3].idx, nakedCells[i4].idx];
                        var sameRow = common_1.Common.areCellsInSameRow(cells);
                        var sameCol = common_1.Common.areCellsInSameCol(cells);
                        var sameBox = common_1.Common.areCellsInSameBox(cells);
                        // if no common group, move on
                        if (!sameRow && !sameCol && !sameBox) {
                            continue;
                        }
                        // look for actions; if none, move on
                        if (sameRow) {
                            if (this.checkNakedsRemovals(common_9.ROW_CELLS[common_1.Common.rowIdx(cells[0])], cells, candidates, 17 /* NAKED_QUADS_ROW */)) {
                                return true;
                            }
                            continue;
                        }
                        if (sameCol) {
                            if (this.checkNakedsRemovals(common_10.COL_CELLS[common_1.Common.colIdx(cells[0])], cells, candidates, 18 /* NAKED_QUADS_COL */)) {
                                return true;
                            }
                            continue;
                        }
                        if (sameBox) {
                            if (this.checkNakedsRemovals(common_11.BOX_CELLS[common_1.Common.boxIdx(cells[0])], cells, candidates, 19 /* NAKED_QUADS_BOX */)) {
                                return true;
                            }
                            continue;
                        }
                    } // for i4
                } // for i3
            } // for i2
        } // for i1
        return false;
    }; // checkNakedQuads()
    /**
     * Having cells with common candidates and common group, determine if
     * candidate removals are possible. If so, lodge a hint and return true.
     * Return false to signal that no removal action is possible.
     */
    Sudoku.prototype.checkNakedsRemovals = function (groupCells, cells, candidates, hintType) {
        // look for removals
        var removals = [];
        for (var _i = 0, groupCells_1 = groupCells; _i < groupCells_1.length; _i++) {
            var c = groupCells_1[_i];
            if (this.cells[c].hasValue() || cells.indexOf(c) > -1) {
                continue;
            }
            for (var _a = 0, candidates_1 = candidates; _a < candidates_1.length; _a++) {
                var k = candidates_1[_a];
                if (this.cells[c].isCandidate(k)) {
                    removals.push({ c: c, k: k });
                }
            } // for k
        } // for c
        // return true and hint if there are actions
        if (removals.length > 0) {
            this.hint = new hint_2.CandidatesHint(hintType, cells, candidates, removals);
            return true;
        }
        return false;
    }; // checkNakedsRemovals()
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
    Sudoku.prototype.checkHiddenPairs = function () {
        for (var _i = 0, ROWS_2 = common_5.ROWS; _i < ROWS_2.length; _i++) {
            var r = ROWS_2[_i];
            if (this.checkHiddenPairsGroup(this.rows[r], 14 /* HIDDEN_PAIRS_ROW */)) {
                return true;
            }
        }
        for (var _a = 0, COLS_1 = common_6.COLS; _a < COLS_1.length; _a++) {
            var c = COLS_1[_a];
            if (this.checkHiddenPairsGroup(this.cols[c], 15 /* HIDDEN_PAIRS_COL */)) {
                return true;
            }
        }
        for (var _b = 0, BOXS_1 = common_7.BOXS; _b < BOXS_1.length; _b++) {
            var b = BOXS_1[_b];
            if (this.checkHiddenPairsGroup(this.boxs[b], 16 /* HIDDEN_PAIRS_BOX */)) {
                return true;
            }
        }
        return false;
    }; // checkHiddenPairs()
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
    Sudoku.prototype.checkHiddenTriples = function () {
        for (var _i = 0, ROWS_3 = common_5.ROWS; _i < ROWS_3.length; _i++) {
            var r = ROWS_3[_i];
            if (this.checkHiddenTriplesGroup(this.rows[r], 20 /* HIDDEN_TRIPLES_ROW */)) {
                return true;
            }
        }
        for (var _a = 0, COLS_2 = common_6.COLS; _a < COLS_2.length; _a++) {
            var c = COLS_2[_a];
            if (this.checkHiddenTriplesGroup(this.cols[c], 21 /* HIDDEN_TRIPLES_COL */)) {
                return true;
            }
        }
        for (var _b = 0, BOXS_2 = common_7.BOXS; _b < BOXS_2.length; _b++) {
            var b = BOXS_2[_b];
            if (this.checkHiddenTriplesGroup(this.boxs[b], 22 /* HIDDEN_TRIPLES_BOX */)) {
                return true;
            }
        }
        return false;
    }; // checkHiddenTriples()
    /**
     * Check for hidden triples in rows, columns, and boxes. If found, create a hint
     * and return true, otherwise return false.
     *
     * Hidden quads are pretty rare, and they can be difficult to spot
     * unless you are specifically looking for them.
     *
     * http://www.thonky.com/sudoku/hidden-pairs-triples-quads/
     */
    Sudoku.prototype.checkHiddenQuads = function () {
        for (var _i = 0, ROWS_4 = common_5.ROWS; _i < ROWS_4.length; _i++) {
            var r = ROWS_4[_i];
            console.log('checkHiddenQuadsGroup() row ' + (r + 1));
            if (this.checkHiddenQuadsGroup(this.rows[r], 23 /* HIDDEN_QUADS_ROW */)) {
                return true;
            }
        }
        for (var _a = 0, COLS_3 = common_6.COLS; _a < COLS_3.length; _a++) {
            var c = COLS_3[_a];
            console.log('checkHiddenQuadsGroup() col ' + (c + 1));
            if (this.checkHiddenQuadsGroup(this.cols[c], 24 /* HIDDEN_QUADS_COL */)) {
                return true;
            }
        }
        for (var _b = 0, BOXS_3 = common_7.BOXS; _b < BOXS_3.length; _b++) {
            var b = BOXS_3[_b];
            console.log('checkHiddenQuadsGroup() box ' + (b + 1));
            if (this.checkHiddenQuadsGroup(this.boxs[b], 25 /* HIDDEN_QUADS_BOX */)) {
                return true;
            }
        }
        return false;
    }; // checkHiddenTriples()
    /**
     * Check for hidden pairs in a given row, column, or box.
     *
     * (1) Candidates that appear exactly 2 times in group, and
     * (2) 2 times appearing candidates are confined to 2 cells, and,
     * as usual, there are candidate removal actions available.
     */
    Sudoku.prototype.checkHiddenPairsGroup = function (group, hintType) {
        // number of occurrences of each candidate in group
        var kCounts = [];
        // candidates occurring no more than 3 times in group
        var pairCandidates = [];
        // group cells containing a triple candidate
        var pairCells = [];
        // look for 2 candidates occurring 2 times in group
        kCounts = this.getCandidateCounts(group);
        for (var _i = 0, CANDIDATES_2 = common_3.CANDIDATES; _i < CANDIDATES_2.length; _i++) {
            var k = CANDIDATES_2[_i];
            if (kCounts[k] === 2) {
                pairCandidates.push(k);
            }
        }
        if (pairCandidates.length < 2) {
            return false; // no 2 candidates appear 2 times in group
        }
        // find group cells that contain potential pair candidate
        NEXT_CELL: for (var _a = 0, _b = group.groupCells; _a < _b.length; _a++) {
            var c = _b[_a];
            for (var _c = 0, pairCandidates_1 = pairCandidates; _c < pairCandidates_1.length; _c++) {
                var k = pairCandidates_1[_c];
                if (this.cells[c].isCandidate(k)) {
                    pairCells.push(c);
                    continue NEXT_CELL; // only push cell once
                }
            }
        }
        // examine all combinations of 2 pair cells containing pair candidates
        var pairCellCombinations = Sudoku.pairwise(pairCells);
        for (var _d = 0, pairCellCombinations_1 = pairCellCombinations; _d < pairCellCombinations_1.length; _d++) {
            var pairCellCombination = pairCellCombinations_1[_d];
            // this set of pair cells
            var _2pairCells = pairCellCombination;
            // candidates in 1 or more of these set of cells
            var _2cands = [];
            // number of occurrences of each candidate in this set of cells
            var _2kCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            // cands in set of cells that match occurrences in full group
            var _2matchedCands = [];
            // get unique pair candidates from pair cells
            for (var _e = 0, pairCandidates_2 = pairCandidates; _e < pairCandidates_2.length; _e++) {
                var k = pairCandidates_2[_e];
                for (var j = 0; j < 2; j++) {
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
                continue; // next combination of pair cells
            }
            // make sure pair candidates don't appear outside pair cells
            for (var _f = 0, _2cands_1 = _2cands; _f < _2cands_1.length; _f++) {
                var k = _2cands_1[_f];
                if (_2kCounts[k] == kCounts[k]) {
                    _2matchedCands.push(k);
                }
            }
            if (_2matchedCands.length != 2) {
                continue; // next combination of pair cells
            }
            // look for removals: other candidates in pair cells
            var removals = this.findHiddenRemovals(pairCellCombination, _2matchedCands);
            // need at least 1 candidate to remove or it's not hidden pair
            if (removals.length > 0) {
                this.hint = new hint_2.CandidatesHint(hintType, pairCellCombination, _2matchedCands, removals);
                return true;
            }
        } // for pairCellCombinations
        return false;
    }; // checkHiddenPairsGroup()
    /**
     * Check for hidden triples in a given row, column, or box.
     *
     * (1) Candidates that appear exactly 2 or 3 times in group, and
     * (2) 2 or 3 times appearing candidates are confined to 3 cells, and,
     * as usual, there are candidate removal actions available.
     */
    Sudoku.prototype.checkHiddenTriplesGroup = function (group, hintType) {
        // number of occurrences of each candidate in group
        var kCounts = [];
        // candidates occurring no more than 3 times in group
        var tripCandidates = [];
        // group cells containing a triple candidate
        var tripCells = [];
        // look for at least 3 candidates occurring 2 or 3 times in group
        kCounts = this.getCandidateCounts(group);
        for (var _i = 0, CANDIDATES_3 = common_3.CANDIDATES; _i < CANDIDATES_3.length; _i++) {
            var k = CANDIDATES_3[_i];
            if (kCounts[k] >= 2 && kCounts[k] <= 3) {
                tripCandidates.push(k);
            }
        }
        if (tripCandidates.length < 3) {
            return false; // no 3 candidates appear 2 or 3 times in group
        }
        // find group cells contain a potential triple candidate
        NEXT_CELL: for (var _a = 0, _b = group.groupCells; _a < _b.length; _a++) {
            var c = _b[_a];
            for (var _c = 0, tripCandidates_1 = tripCandidates; _c < tripCandidates_1.length; _c++) {
                var k = tripCandidates_1[_c];
                if (this.cells[c].isCandidate(k)) {
                    tripCells.push(c);
                    continue NEXT_CELL; // only push cell once
                }
            }
        }
        // examine all combinations of 3 triple cells containing triple candidates
        var tripCellCombinations = Sudoku.tripwise(tripCells);
        for (var _d = 0, tripCellCombinations_1 = tripCellCombinations; _d < tripCellCombinations_1.length; _d++) {
            var tripCellCombination = tripCellCombinations_1[_d];
            // this set of triple cells
            var _3tripCells = tripCellCombination;
            // candidates in 1 or more of these set of cells
            var _3cands = [];
            // number of occurrences of each candidate in this set of cells
            var _3kCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            // cands in set of cells that match occurrences in full group
            var _3matchedCands = [];
            // get unique triple candidates from triple cells
            for (var _e = 0, tripCandidates_2 = tripCandidates; _e < tripCandidates_2.length; _e++) {
                var k = tripCandidates_2[_e];
                for (var j = 0; j < 3; j++) {
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
                continue; // next combination of triple cells
            }
            // make sure triple candidates don't appear outside triple cells
            for (var _f = 0, _3cands_1 = _3cands; _f < _3cands_1.length; _f++) {
                var k = _3cands_1[_f];
                if (_3kCounts[k] == kCounts[k]) {
                    _3matchedCands.push(k);
                }
            }
            if (_3matchedCands.length != 3) {
                continue; // next combination of triple cells
            }
            // look for removals: other candidates in triple cellsToValuesArray
            var removals = this.findHiddenRemovals(tripCellCombination, _3matchedCands);
            // need at least 1 candidate to remove or it's not hidden triple
            if (removals.length > 0) {
                this.hint = new hint_2.CandidatesHint(hintType, tripCellCombination, _3matchedCands, removals);
                return true;
            }
        } // for tripCellCombinations
        return false;
    }; // checkHiddenTriplesGroup()
    /**
     * Check for hidden quads in a given row, column, or box.
     *
     * (1) Candidates that appear exactly 2, 3, or 4 times in group, and
     * (2) 2, 3, or 4 times appearing candidates are confined to 34 cells, and,
     * as usual, there are candidate removal actions available.
     */
    Sudoku.prototype.checkHiddenQuadsGroup = function (group, hintType) {
        // number of occurrences of each candidate in group
        var kCounts = [];
        // candidates occurring no more than 4 times in group
        var quadCandidates = [];
        // group cells containing a quad candidate
        var quadCells = [];
        kCounts = this.getCandidateCounts(group);
        for (var _i = 0, CANDIDATES_4 = common_3.CANDIDATES; _i < CANDIDATES_4.length; _i++) {
            var k = CANDIDATES_4[_i];
            if (kCounts[k] >= 2 && kCounts[k] <= 4) {
                quadCandidates.push(k);
            }
        }
        console.log('kCounts       : ' + JSON.stringify(kCounts));
        console.log('quadCandidates: ' + JSON.stringify(quadCandidates) + ' (need at least 4)');
        // we need at least 4 candidates
        if (quadCandidates.length < 4) {
            return false; // no 4 candidates appear 2, 3, or 4 times in group
        }
        // find group cells that contain a quad candidate
        NEXT_CELL: for (var _a = 0, _b = group.groupCells; _a < _b.length; _a++) {
            var c = _b[_a];
            for (var _c = 0, quadCandidates_1 = quadCandidates; _c < quadCandidates_1.length; _c++) {
                var k = quadCandidates_1[_c];
                if (this.cells[c].isCandidate(k)) {
                    quadCells.push(c);
                    continue NEXT_CELL; // only push cell once
                }
            }
        }
        console.log('quadCells     : ' + JSON.stringify(quadCells));
        // examine all combinations of 4 quad cells containing quad candidates
        var ln = quadCells.length;
        for (var i1 = 0; i1 < (ln - 3); i1++) {
            for (var i2 = i1 + 1; i2 < (ln - 2); i2++) {
                for (var i3 = i2 + 1; i3 < (ln - 1); i3++) {
                    I4: for (var i4 = i3 + 1; i4 < (ln - 0); i4++) {
                        // this set of quad cells
                        var _4quadCells = [quadCells[i1], quadCells[i2], quadCells[i3], quadCells[i4]];
                        // candidates in 1 or more of these set of cells
                        var _4cands = [];
                        // number of occurrences of each candidate in this set of cells
                        var _4kCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        // cands in set of cells that match occurrences in full group
                        var _4matchedCands = [];
                        // get unique quad candidates from quad cells
                        for (var _d = 0, quadCandidates_2 = quadCandidates; _d < quadCandidates_2.length; _d++) {
                            var k = quadCandidates_2[_d];
                            for (var _e = 0, _f = [i1, i2, i3, i4]; _e < _f.length; _e++) {
                                var i = _f[_e];
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
                        for (var _g = 0, _4cands_1 = _4cands; _g < _4cands_1.length; _g++) {
                            var k = _4cands_1[_g];
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
                        var removals = this.findHiddenRemovals([quadCells[i1], quadCells[i2], quadCells[i3], quadCells[i4]], 
                        // quadCandidates);
                        _4matchedCands);
                        console.log('removals      : ' + removals.length + ' (need at least 1)');
                        // no candidates to remove, so no hidden quad
                        if (removals.length > 0) {
                            this.hint = new hint_2.CandidatesHint(hintType, [quadCells[i1], quadCells[i2], quadCells[i3], quadCells[i4]], _4matchedCands, removals);
                            console.log('hint: ' + JSON.stringify(this.hint));
                            return true;
                        }
                    } // for i4
                } // for i3
            } // for i2
        } // for i1
        return false;
    }; // checkHiddenQuadsGroup()
    /**
     * Count the occurrences of each candidate in a group (row, column, or box).
     * Return an array of the counts. The array is 10 numbers each element
     * being the count of the corresponding candidate. The zero-th element is
     * not used. E.g. [0, 0,0,2, 3,0,0, 0,2,0] means candidate [3] occurs twice,
     * [4] 3 times, [8] twice, and all other candidate are absent in the group.
     */
    Sudoku.prototype.getCandidateCounts = function (group) {
        var kCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var _i = 0, VALUES_4 = common_2.VALUES; _i < VALUES_4.length; _i++) {
            var k = VALUES_4[_i];
            if (group.containsValue(k)) {
                continue; // next candidate
            }
            for (var _a = 0, _b = group.groupCells; _a < _b.length; _a++) {
                var c = _b[_a];
                if (this.cells[c].hasValue()) {
                    continue; // next cell in group
                }
                if (this.cells[c].isCandidate(k)) {
                    kCounts[k]++;
                }
            } // for cells in group
        } // for candidates
        return kCounts;
    }; // getCandidateCounts()
    /**
     * Helper method to find candidate removals from hidden pairs, triples, quads.
     */
    Sudoku.prototype.findHiddenRemovals = function (hiddenCells, hiddenCands) {
        var removals = [];
        for (var _i = 0, hiddenCells_1 = hiddenCells; _i < hiddenCells_1.length; _i++) {
            var hiddenCell = hiddenCells_1[_i];
            var hiddenCellCands = this.cells[hiddenCell].getCandidates().slice();
            for (var _a = 0, hiddenCellCands_1 = hiddenCellCands; _a < hiddenCellCands_1.length; _a++) {
                var hiddenCellCand = hiddenCellCands_1[_a];
                if (hiddenCands.indexOf(hiddenCellCand) === -1) {
                    removals.push({ c: hiddenCell, k: hiddenCellCand });
                }
            }
        }
        return removals;
    }; // findHiddenRemovals()
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
    Sudoku.prototype.checkPointingRowCol = function () {
        for (var _i = 0, BOXS_4 = common_7.BOXS; _i < BOXS_4.length; _i++) {
            var b = BOXS_4[_i];
            CANDS: for (var _a = 0, CANDIDATES_5 = common_3.CANDIDATES; _a < CANDIDATES_5.length; _a++) {
                var k = CANDIDATES_5[_a];
                var boxCandOccurrences = []; // [idx, ...]
                if (this.boxs[b].containsValue(k)) {
                    continue CANDS; // k cannot be candidate in box
                }
                for (var _b = 0, _c = common_11.BOX_CELLS[b]; _b < _c.length; _b++) {
                    var c = _c[_b];
                    if (this.isCandidate(c, k)) {
                        boxCandOccurrences.push(c);
                        if (boxCandOccurrences.length > 3) {
                            continue CANDS; // too many for candidate
                        }
                    }
                } // for
                if (boxCandOccurrences.length < 2) {
                    continue CANDS; // too few for candidate
                }
                // we have 2 or 3 occurances of k in b
                // determine if in same row or col
                var sameRow = common_1.Common.areCellsInSameRow(boxCandOccurrences);
                var sameCol = common_1.Common.areCellsInSameCol(boxCandOccurrences);
                if (!sameRow && !sameCol) {
                    continue CANDS; // try next candidate in box
                }
                // look for actions
                var removals = [];
                if (sameRow) {
                    // scan other cells in row outside box
                    for (var _d = 0, _e = common_9.ROW_CELLS[common_1.Common.rowIdx(boxCandOccurrences[0])]; _d < _e.length; _d++) {
                        var c = _e[_d];
                        if (common_1.Common.boxIdx(c) === b) {
                            continue; // cell in same box
                        }
                        if (this.isCandidate(c, k)) {
                            removals.push({ c: c, k: k });
                        }
                    } // for
                    // if there are removals, we have hint
                    if (removals.length > 0) {
                        this.hint = new hint_2.CandidatesHint(7 /* POINTING_ROW */, [boxCandOccurrences[0]], [k], removals);
                        return true;
                    }
                }
                else {
                    // scan other cells in col outside box
                    for (var _f = 0, _g = common_10.COL_CELLS[common_1.Common.colIdx(boxCandOccurrences[0])]; _f < _g.length; _f++) {
                        var c = _g[_f];
                        if (common_1.Common.boxIdx(c) === b) {
                            continue; // cell in same box
                        }
                        if (this.isCandidate(c, k)) {
                            removals.push({ c: c, k: k });
                        }
                    } // for
                    // if there are removals, we have hint
                    if (removals.length > 0) {
                        this.hint = new hint_2.CandidatesHint(8 /* POINTING_COL */, [boxCandOccurrences[0]], [k], removals);
                        return true;
                    }
                } // else same col
            } // for CANDS
        } // for BOXS
        return false;
    }; // checkPointingRowCol()
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
    Sudoku.prototype.checkRowBoxReductions = function () {
        //ROWS:
        for (var _i = 0, ROWS_5 = common_5.ROWS; _i < ROWS_5.length; _i++) {
            var row = ROWS_5[_i];
            CANDS: for (var _a = 0, CANDIDATES_6 = common_3.CANDIDATES; _a < CANDIDATES_6.length; _a++) {
                var k = CANDIDATES_6[_a];
                if (this.rows[row].containsValue(k)) {
                    continue CANDS; // not candidate in row
                }
                var rowCandOccurrences = [];
                //CELLS:
                for (var _b = 0, _c = common_9.ROW_CELLS[row]; _b < _c.length; _b++) {
                    var c = _c[_b];
                    // if (this.cells[c].hasValue[k]) {   REDUNDANT
                    //   continue CELLS;	// k cannot be candidate in col
                    // }
                    if (this.isCandidate(c, k)) {
                        rowCandOccurrences.push(c);
                        if (rowCandOccurrences.length > 3) {
                            continue CANDS; // too many for candidate
                        }
                    }
                } // for CELLS
                if (rowCandOccurrences.length < 2) {
                    continue CANDS; // too few for candidate
                }
                // determine if in same box
                if (!common_1.Common.areCellsInSameBox(rowCandOccurrences)) {
                    continue CANDS; // not in same box, next cand
                }
                // must be same box, different row; look for removals
                var removals = [];
                // look for k's in other rows in box 
                // this row is row, this box is box
                for (var _d = 0, _e = common_11.BOX_CELLS[common_1.Common.boxIdx(rowCandOccurrences[0])]; _d < _e.length; _d++) {
                    var c = _e[_d];
                    // if c in row, continue next c
                    if (common_9.ROW_CELLS[row].indexOf(c) >= 0) {
                        continue; // box cell in same row, next c
                    }
                    // if isCandidate, push to removals
                    if (this.isCandidate(c, k)) {
                        removals.push({ c: c, k: k });
                    }
                } // for
                if (removals.length > 0) {
                    this.hint = new hint_2.CandidatesHint(9 /* ROW_BOX_REDUCTION */, [rowCandOccurrences[0]], [k], removals);
                    return true;
                }
            } // for CANDS
        } // for ROWS
        return false;
    }; // checkRowBoxReductions()
    /**
     * Check for column box reductions. If found, create a hint and return
     * true, otherwise return false.
     */
    Sudoku.prototype.checkColBoxReductions = function () {
        //COLS:
        for (var _i = 0, COLS_4 = common_6.COLS; _i < COLS_4.length; _i++) {
            var col = COLS_4[_i];
            CANDS: for (var _a = 0, CANDIDATES_7 = common_3.CANDIDATES; _a < CANDIDATES_7.length; _a++) {
                var k = CANDIDATES_7[_a];
                if (this.cols[col].containsValue(k)) {
                    continue CANDS; // not candidate in col
                }
                var colCandOccurrences = [];
                //CELLS:
                for (var _b = 0, _c = common_10.COL_CELLS[col]; _b < _c.length; _b++) {
                    var c = _c[_b];
                    // if (this.cells[c].hasValue[k]) {   REDUNDANT!
                    //   continue CELLS;	// k cannot be candidate in row
                    // }
                    if (this.isCandidate(c, k)) {
                        colCandOccurrences.push(c);
                        if (colCandOccurrences.length > 3) {
                            continue CANDS; // too many for candidate
                        }
                    }
                } // for CELLS
                if (colCandOccurrences.length < 2) {
                    continue CANDS; // too few for candidate
                }
                // determine if in same box
                if (!common_1.Common.areCellsInSameBox(colCandOccurrences)) {
                    continue CANDS; // not in same box, next cand
                }
                // must be same box, different col; look for removals
                var removals = [];
                // look for k's in other cols in box
                // this col is col, this box is box
                for (var _d = 0, _e = common_11.BOX_CELLS[common_1.Common.boxIdx(colCandOccurrences[0])]; _d < _e.length; _d++) {
                    var c = _e[_d];
                    // if c in col, continue next c
                    if (common_10.COL_CELLS[col].indexOf(c) >= 0) {
                        continue; // box cell in same col, next c
                    }
                    // if isCandidate, push to removals
                    if (this.isCandidate(c, k)) {
                        removals.push({ c: c, k: k });
                    }
                } // for
                if (removals.length > 0) {
                    this.hint = new hint_2.CandidatesHint(10 /* COL_BOX_REDUCTION */, [colCandOccurrences[0]], [k], removals);
                    return true;
                }
            } // for CANDS
        } // for COLS
        return false;
    }; // checkColBoxReductions()
    /**
     * Are the puzzle's cell values 180deg rotationally symmetric?
     */
    Sudoku.prototype.isSymmetric = function () {
        for (var _i = 0, _a = (common_8.CELLS.slice(0, 41)); _i < _a.length; _i++) {
            var c = _a[_i];
            if ((this.cells[c].hasValue() && !this.cells[80 - c].hasValue())
                || (!this.cells[c].hasValue() && this.cells[80 - c].hasValue())) {
                return false;
            }
        }
        return true;
    }; // is symetric()
    /**
     * Represent the values of the sudoku as an array of 81 values.
     */
    Sudoku.prototype.cellsToValuesArray = function () {
        var v = [];
        for (var _i = 0, CELLS_10 = common_8.CELLS; _i < CELLS_10.length; _i++) {
            var c = CELLS_10[_i];
            v.push(this.cells[c].getValue());
        }
        return v;
    }; // cellsToValuesArray()
    /**
     * Represent the values of the sudoku as a single-line string.
     */
    Sudoku.prototype.toOneLineString = function () {
        var s = '';
        var value;
        for (var _i = 0, CELLS_11 = common_8.CELLS; _i < CELLS_11.length; _i++) {
            var i = CELLS_11[_i];
            value = this.getValue(i);
            if (value === 0) {
                s += '.';
            }
            else {
                s += value;
            }
        }
        return s;
    }; // toOneLineString()
    /**
     * Represent the values of the sudoku as a grid string.
     */
    Sudoku.prototype.toGridString = function () {
        return this.arrayToGridString(this.cellsToValuesArray());
    }; // toGridString()
    /**
     * Represent a values array of sudoku cell values as a grid string.
     */
    Sudoku.prototype.arrayToGridString = function (valuesArray) {
        var s = '';
        var i = 0;
        var value;
        for (var _i = 0, CELLS_12 = common_8.CELLS; _i < CELLS_12.length; _i++) {
            var c = CELLS_12[_i];
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
            }
            else {
                s += value + ' ';
            }
            i++;
        }
        return s;
    }; // arrayToGridString()
    /**
     * Represent the state of a row as a string.
     */
    Sudoku.prototype.rowToString = function (r) {
        return this.groupToString(this.rows[r], r, 'Row');
    }; // rowToString()
    /**
     * Represent the state of a column as a string.
     */
    Sudoku.prototype.colToString = function (c) {
        return this.groupToString(this.cols[c], c, 'Col');
    }; // colToString()
    /**
     * Represent the state of a box as a string.
     */
    Sudoku.prototype.boxToString = function (b) {
        return this.groupToString(this.boxs[b], b, 'Box');
    }; // boxToString()
    /**
     * Represent the state of a row, column, or box as a string. The "group"
     * parameter is the individual row, column, or box; he "idx" is the group's
     * index (0..8); and "label" is 'Row', 'Col', or 'Box'.
     */
    Sudoku.prototype.groupToString = function (group, idx, label) {
        return label + ' ' + (idx + 1) + ': ' + group.toString();
    };
    /**
     * Represent the state of a cell as a string.
     */
    Sudoku.prototype.cellToString = function (c) {
        return '' + common_1.Common.toRowColString(c) + ': ' + this.cells[c].toString();
    };
    /**
     * Represent the state of the sudoku as a string.
     */
    Sudoku.prototype.toString = function () {
        var s = '';
        for (var _i = 0, ROWS_6 = common_5.ROWS; _i < ROWS_6.length; _i++) {
            var r = ROWS_6[_i];
            s += this.rowToString(r) + '\n';
        }
        for (var _a = 0, COLS_5 = common_6.COLS; _a < COLS_5.length; _a++) {
            var c = COLS_5[_a];
            s += this.colToString(c) + '\n';
        }
        for (var _b = 0, BOXS_5 = common_7.BOXS; _b < BOXS_5.length; _b++) {
            var b = BOXS_5[_b];
            s += this.boxToString(b) + '\n';
        }
        for (var _c = 0, CELLS_13 = common_8.CELLS; _c < CELLS_13.length; _c++) {
            var c = CELLS_13[_c];
            s += this.cellToString(c) + '\n';
        }
        return s;
    };
    /**
     * Represent the state of the sudoku as a string.
     */
    Sudoku.prototype.toStringRow = function (r) {
        var s = '';
        s += this.rowToString(r) + '\n';
        for (var _i = 0, _a = common_9.ROW_CELLS[r]; _i < _a.length; _i++) {
            var c = _a[_i];
            s += this.cellToString(c) + '\n';
        }
        return s;
    };
    Sudoku = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [actionLog_1.ActionLog, hintLog_1.HintLog])
    ], Sudoku);
    return Sudoku;
}());
exports.Sudoku = Sudoku;
//# sourceMappingURL=sudoku.js.map