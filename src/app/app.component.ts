import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { CELLS,
         TITLE, 
         MAJOR_VERSION, 
         VERSION, 
         SUB_VERSION, 
         COPYRIGHT,
         Common }           from './common/common';
import { Difficulty,
         DIFFICULTY_LABELS } from './model/difficulty';
import { SudokuService }    from './model/sudoku.service';
import { CacheService }     from './model/cache.service';
import { Sudoku }           from './model/sudoku';
import { Hint }             from './hint/hint';
import { HintService }      from './hint/hint.service';
import { ValueHint }        from './hint/hint';
import { CandidatesHint }   from './hint/hint';
import { HintType }         from './hint/hint.type';
import { HintCounts }       from './hint/hintCounts';
import { ActionType }       from './action/action';
import { SetValueAction }      from './action/action';
import { RemoveValueAction }      from './action/action';
import { RemoveCandidateAction }      from './action/action';
import { RestoreCandidateAction }      from './action/action';
import { NakedType }        from './model/naked.type';
import { PseudoSudokuService } from './model/pseudo-sudoku.service';
import { CreationService } from '../././web-workers/creation-worker/creation.service';
import { ActionLogService } from './action/action-log.service';
import { MessageService } from './common/message.service';
 
// test
// import { ROOT_VALUES } from './common/common';

enum PlayStates {
  NEW,
  ENTRY,         // not used currently
  CREATING,      // not used currently
  EXECUTE, 
  SOLVED
}
enum HintStates {
  READY,	       // no hint has been requested
  ACTIVE,	       // a hint exists and has not been applied
  NO_HINT	       // a hint has been requested but no hint is available
};
enum AutoSolveStates {
  READY,        // autoSolve is not running
  RUNNING,      // autoSolve is running
  NO_HINT,      // no hint is available
  PENDING_STOP  // user initiated stop
};	

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit, OnDestroy {
  title = TITLE;
  version = 'v' + MAJOR_VERSION + '.' + VERSION + '.' + SUB_VERSION;
  copyright = COPYRIGHT;
  sudokuService: SudokuService;
  hintService: HintService;
  creationService: CreationService;
  actionLog: ActionLogService;

  // ----- state properties -----
  playState: PlayStates;
  hintStates = HintStates;
  hintState = HintStates.NO_HINT;
  autoSolveStates = AutoSolveStates;
  autoSolveState = AutoSolveStates.NO_HINT;
  autoFinish = false;

  message: any;
  messageSubscription: Subscription;

  constructor(
    private changeDetectorRef: ChangeDetectorRef, 
    private ngZone: NgZone,
    private cacheService: CacheService,

    private messageService: MessageService
  ) {
    this.sudokuService = new SudokuService();
    this.hintService = new HintService(this.sudokuService);
    this.actionLog = new ActionLogService();

    this.desiredDifficulty = Difficulty.MEDIUM;   // default
    this.valuesComplete = new Array(10);
    this.candidatesVisible = new Array(10);

    this.messageSubscription = this.messageService.getMessage()
        .subscribe(message => { 
          this.message = message; 
// console.info('\nMessage received: ' + this.message.text);

          if (this.message.text === 'Cache changed') {
// console.info('\nMessage processed');
            this.easyAvailable = this.cacheService.isSudokuAvailable(Difficulty.EASY);
            this.mediumAvailable = this.cacheService.isSudokuAvailable(Difficulty.MEDIUM);
            this.hardAvailable = this.cacheService.isSudokuAvailable(Difficulty.HARD);
            this.hardestAvailable = this.cacheService.isSudokuAvailable(Difficulty.HARDEST);
            
            this.changeDetectorRef.detectChanges();
          }
        });
    this.creationService = new CreationService(); // used for entry
  }

  // -----------------------------------------------------------------------
  // constants
  // -----------------------------------------------------------------------
  PlayStates = PlayStates;  // need for use in view html
  DEFAULT_DIFFICULTY = Difficulty.MEDIUM;
  AUTO_SOLVE_DELAY = 250;	// msec
  
  // -----------------------------------------------------------------------
  // properties
  // -----------------------------------------------------------------------

  // ----- grid properties -----
  candidatesShowing: boolean;   // also in execute

  // ----- new properties -----
  desiredDifficulty: Difficulty;
  easyAvailable: boolean;
  mediumAvailable: boolean;
  hardAvailable: boolean;
  hardestAvailable: boolean;

  // // ----- enter properties -----
  // maxDifficulty: Difficulty;

  // ----- execute properties -----
  actualDifficulty: string;
  valuesComplete: boolean[];
  candidatesModified: boolean;
  hintMessage: string;
  // autoSolveMessage: string;
  actionsLog: string;
  cluesShowing: boolean;
  solutionClues: string;
  timerSubscription: Subscription;
  elapsedTime: string;
  hintsViewed: number;
  hintsApplied: number;
  
  // ----- solved properties -----
  currentSudoku: Sudoku;
  hint: Hint;
  candidatesVisible: boolean[];
  selectedCell: number;

  subscription: Subscription;

  ngOnInit() {
    // this.desiredDifficulty = Difficulty.MEDIUM;   // default
    // this.valuesComplete = new Array(10);
    // this.candidatesVisible = new Array(10);

    this.initializeUserInterface();
    this.changeDetectorRef.detectChanges();

    let cacheKeys: string[] = this.cacheService.getCacheKeys();

// console.info('\nX. Cache on ngOnInit(): ' 
//     + this.cacheService.activeCachesToString());

// console.info('\nCache keys before replenishment: ' + JSON.stringify(cacheKeys));

    // activate for maintenance
    // this.cacheService.removeCacheItem('undefined');
    // this.cacheService.emptyCache();
    // cacheKeys = this.cacheService.getCacheKeys();
    // console.info('Cache keys after maintenance:  + JSON.stringify(cacheKeys));

    this.easyAvailable = this.cacheService.isSudokuAvailable(Difficulty.EASY);
    this.mediumAvailable = this.cacheService.isSudokuAvailable(Difficulty.MEDIUM);
    this.hardAvailable = this.cacheService.isSudokuAvailable(Difficulty.HARD);
    this.hardestAvailable = this.cacheService.isSudokuAvailable(Difficulty.HARDEST);

    this.cacheService.replenishCache();

  } // ngOnInit()

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  // -----------------------------------------------------------------------
  // methods called from UI
  // -----------------------------------------------------------------------

  /*
  User actions:
    Set cell value from keyboard (no previous value)
    Set cell value from picker (no previous value)
      ActionType.SET_VALUE
    Unset cell value from keyboard (0)
    Unset cell value from picker (Clear)
      ActionType.REMOVE_VALUE
    Set cell replacement value from keyboard (remove previous value)
    Set cell replacement value from picker (remove previous value)
      ActionType.REMOVE_VALUE
      ActionType.SET_VALUE
    Remove a candidate
      ActionType.REMOVE_CANDIDATE
    Restore a candidate
      ActionType.RESTORE_CANDIDATE
    Apply a hint that sets a value
      ActionType.SET_VALUE
    Apply a hint that removes one or more candidates
      ActionType.REMOVE_CANDIDATES
  */

  /**
   * Responds to Generate button. Gets sudoku of desired difficulty
   * from cache. Loads sudoku and switches to Play state.
   */
  generate(difficulty: Difficulty) : void {
    this.currentSudoku = Sudoku.deserialize(this.cacheService.getSudoku(difficulty));

    // bind metadata for ui, load sudoku for user execution
    this.actualDifficulty = 
        // Sudoku.getDifficultyLabel(this.currentSudoku.actualDifficulty);
        DIFFICULTY_LABELS[this.currentSudoku.difficulty].label;
    this.solutionClues = this.createSolutionClues();

    this.sudokuService.loadProvidedSudoku(this.currentSudoku.givens);
    this.actionLog.initialize();
    this.actionsLog = '';
    
console.log('\nSudoku:\n' + this.currentSudoku.toString());

    // go to sudoku execution by user
    this.startUserTimer();
    this.playState = PlayStates.EXECUTE;
  } // generate() 

  /**
   * User keyboard actions.
   */
  handleKeyPress(keyEvent: any) : void {
      
    // console.info('keyEvent: ' + keyEvent.keyCode + ', ' + keyEvent.shiftKey + ', ' + keyEvent.ctrlKey + ', ' + keyEvent.metaKey + ', ' + keyEvent.altKey);
    
    if (this.playState != PlayStates.ENTRY 
        && this.playState != PlayStates.EXECUTE) {
      return;
    }
      
    // console.log('keyEvent: ' + keyEvent.keyCode + ', ' + keyEvent.shiftKey + ', ' + keyEvent.ctrlKey + ', ' + keyEvent.metaKey + ', ' + keyEvent.altKey);
    
    this.initializeHintStates();    // remove any hint

    // key press is meaningless without a selected cell
    if (!this.isCellSelected()) {
      return;
    }

    let keyCode = keyEvent.keyCode;
    let newValue = 0;

    // get currently selected cell's row and column number
    let ur = Common.userRow(this.selectedCell); // user row 1..9
    let uc = Common.userCol(this.selectedCell); // user col 1..9

    // console.info();
    
    switch(keyCode) {
      // diagnostic
      case 192:   //tilde key
        this.emptyCache();
        return;
      case 37:		// left arrow - wrap to previous row
        uc--;
        if (uc < 1) {
          ur--;
          if (ur < 1) { ur = 9; }
          uc = 9;
        }
        // this.setSelectedCell(ur, uc); 
        this.setSelectedCell(Common.urcToCellIdx(ur, uc)); 
        return;
      case 38:		// up arrow - wrap in column
        ur--;
        if (ur < 1) { ur = 9; }
        // this.setSelectedCell(ur, uc); 
        this.setSelectedCell(Common.urcToCellIdx(ur, uc)); 
        return;
      case 39:		// right arrow - wrap to next row
        uc++;
        if (uc > 9) {
          ur++;
          if (ur > 9) { ur = 1; }
          uc = 1;
        }
        // this.setSelectedCell(ur, uc); 
        this.setSelectedCell(Common.urcToCellIdx(ur, uc)); 
        return;
      case 40:		// down arrow - wrap in column
        ur++;
        if (ur > 9) { ur = 1; }
        this.setSelectedCell(Common.urcToCellIdx(ur, uc)); 
        return;
      case 46:		// delete
      case 32:		// space
      case 8:			// backspace
        keyEvent.preventDefault();
        newValue = 0;
        break;
      default:
        if (keyCode >= 96 && keyCode <= 105) {  // keypad codes
          keyCode = keyCode - 48;     // change to number codes
        }
        newValue = parseInt(String.fromCharCode(keyCode));
    }

    // console.info('keycode, newValue, selectedCell: ' + keyCode + ', ' + newValue + ', ' + this.selectedCell);

    if (newValue < 0 || newValue > 9) {
      return;   // not zero and not 1..9, bail
    }

    let oldValue = this.sudokuService.getValue(this.selectedCell);

    if (newValue == oldValue) {
      return;   // nothing to do
    }

    // if replacing value, remove old first
    if (oldValue != 0) {
      this.removeCellValue(this.selectedCell);
    }

    if (newValue != 0) {
      this.setCellValue(this.selectedCell, newValue);
    }

    // step selected cell right (wrap to next row) during entry
    if (this.playState === PlayStates.ENTRY) {
      uc++;
      if (uc > 9) {
        ur++;
        if (ur > 9) { ur = 1; }
        uc = 1;
      }
      this.setSelectedCell(Common.urcToCellIdx(ur, uc)); 
    }
  } // handleKeyPress()

  /**
   * TESTING
   */
  emptyCache() {
    this.cacheService.emptyCache();
  }

  /**
   * Returns true if this cell's value is a given value.
   * Function based on view's cell indexes in html code.
   */
  isGiven_(vb: number, vc: number) : boolean {
    return this.isGiven(this.viewToCellIdx(vb, vc));
  } // isCellLocked()
  
  /**
   * Returns true if the cell's value is a given value.
   */
  isGiven(ci: number) : boolean {
    return this.currentSudoku &&
        this.currentSudoku.givens[ci] > 0
  } // isCellLocked()
  
  /**
   * Returns true if this cell is the currently selected cell.
   */
  isSelectedCell(vb: number, vc: number) : boolean {
    return this.selectedCell === this.viewToCellIdx(vb, vc);
  } // isSelectedCell()
  
  /**
   * Returns true if this cell's value is repeated in the cell's
   * row, column, or box.
   * Function based on view's cell indexes in html code.
   */
  isInvalid_(vb: number, vc: number) : boolean {
    return !this.sudokuService.isCellValid(this.viewToCellIdx(vb, vc));
  } // isInvalid_()
  
  /**
   * Returns true if this cell's value is not the solution's value.
   * Function based on view's cell indexes in html code.
   */
  isIncorrect_(vb: number, vc: number) : boolean {
    if (this.playState != PlayStates.EXECUTE) {
      return false;
    }
    let ci = this.viewToCellIdx(vb, vc);
    return this.sudokuService.isCellValid(ci)
        && this.sudokuService.getValue(ci) != this.currentSudoku.completedSudoku[ci];
  } // isIncorrect_()

  /**
   * 
   */
  isInvisible_(vb: number, vc: number) : boolean {
    return false;
  } // isInvisible_()
  
  /**
   * Function based on view's cell indexes in html code.
   */
  handleCellClick(event, vb: number, vc: number) : void {
    if (this.playState != PlayStates.ENTRY 
        && this.playState != PlayStates.EXECUTE) {
      return;
    }
    
    this.initializeHintStates();    // remove any hint 
    let ci = this.viewToCellIdx(vb, vc);
    if (this.isGiven(ci)) {
      return;         // can't accept click on locked cell
    }

    switch(event.which) {
      case 1:   // left click
        if (this.selectedCell != ci) {
          this.setSelectedCell(ci); 
        } else {
          this.unselectCell();
        }
        return;
      case 2:   // middle click
        return;
      case 3:   // right click
        let nakeds = this.sudokuService.findNakedCandidates(ci, NakedType.SINGLE);
        if (nakeds.length === 1) {
          this.setCellValue(ci, nakeds[0]);
          this.setSelectedCell(ci);
        }
        return;
      default:
        alert("you have a strange mouse");
        return;
    } // switch
  } // handleCellClick()

  /**
   * 
   */
  hasValue(vb: number, vc: number) : boolean {
    return this.sudokuService.hasValue(this.viewToCellIdx(vb, vc));
  }
  
  /**
   * 
   * Function based on view's cell indexes in html code.
   */
  valueToChar_(vb: number, vc: number) : string {
    let value = this.sudokuService.getValue(this.viewToCellIdx(vb, vc));
    return value == 0 ? '' : value.toString(); 
  } // valueToChar_()
  
  /**
   * 
   * Function based on view's cell indexes in html code.
   */
  getValue(vb: number, vc: number) : number {
    return this.sudokuService.getValue(this.viewToCellIdx(vb, vc));
  } // getValue()
  
  /**
   * 
   * Function based on view's cell indexes in html code.
   */
  handleCandidateClick(vb: number, vc: number, k: number) : void {
    if (this.playState != PlayStates.ENTRY 
        && this.playState != PlayStates.EXECUTE) {
      return;
    }
    this.initializeHintStates();    // remove any hint

    if (this.candidatesShowing) {
      let cellIdx = this.viewToCellIdx(vb, vc);
      if (this.sudokuService.isCandidate(cellIdx, k)) {
        // this.sudokuService.removeCandidate(cellIdx, k, undefined);
        this.sudokuService.removeCandidate(cellIdx, k);

        // log action
        this.actionLog.addEntry(new RemoveCandidateAction(cellIdx, k));

      } else {
        this.sudokuService.restoreCandidate(cellIdx, k);

        // log action
        this.actionLog.addEntry(new RestoreCandidateAction(cellIdx, k));
      }
    }
    this.candidatesModified = true;
    this.refreshActionsLog();
  } // handleCandidateClick_()

  /**
   * 
   */
  refreshCandidates() {
    this.sudokuService.refreshAllCandidates();
    this.candidatesModified = false;
  } // refreshCandidates()
  
  /**
   * 
   * @param k 
   */
  candidatesVisible_(k: number) : boolean {
    return this.candidatesVisible[k];
  } // candidatesVisible()
  
  /**
   * 
   * Function based on view's cell indexes in html code.
   */
  candToChar_(vb: number, vc: number, k: number) : string {
    return this.sudokuService.isCandidate(this.viewToCellIdx(vb, vc), k) 
        ? k.toString() : '';
  } // candToChar_()

  /**
   * Button 'Show Candidates', 'Hide Candidates' EXECUTION state
   */
  toggleCandidates() : void {
    this.candidatesShowing = !this.candidatesShowing;
    this.allCandidatesVisible();
  }

  // button '1' .. '9' EXECUTION state
  /**
   * 
   */
  candidateVisible(kand: number) : void {
    for (let k = 1; k <= 9; k++) {
      this.candidatesVisible[k] = false;
    }
    this.candidatesVisible[kand] = true;
  } // candidateVisible()

  /**
   * 
   */
  // button 'All' EXECUTION state
  allCandidatesVisible() : void {
    for (let k = 1; k <= 9; k++) {
      this.candidatesVisible[k] = true;
    }
  }
  
  /**
   * Button 'Show Clues', 'Hide Clues' EXECUTION state
   */
  toggleClues() : void {
    this.cluesShowing = !this.cluesShowing;
  }

  /**
   * Respond to the 'Get/Apply hint' button. If a hint is already displayed,
   * apply the hint, render the board, remove the hint, and toggle the button.
   * 
   * If there is no existing hint, look for one. If one is found, display it and
   * toggle the button. If no hint is found, alert the user and leave the button
   * condition unchanged.
   */
  // button 'Get', 'Apply' EXECUTION state
  handleHintClick() : void {
    switch (this.hintState) {
      case HintStates.READY:
        this.findHint();
        if (this.hint) {
          this.hintsViewed++;
        }
        break;
      case HintStates.ACTIVE:
        this.applyHint(this.hint);
        this.hintsApplied++;
    }
  } // handleHintClick
  
  /**
   * 
   */
  // autoSolveButton() : boolean {
  //   return this.autoSolveState != AutoSolveStates.NO_HINT
  //       && this.hintState != HintStates.NO_HINT; 
  // } // autoSolveButton()
  
  /**
   * 
   */
  handleAutoSolveClick() : void {
    switch (this.autoSolveState) {
      case AutoSolveStates.READY:     // start auto solve
        this.autoSolveState = AutoSolveStates.RUNNING;
        this.autoSolveLoop();
        break;
      case AutoSolveStates.RUNNING:   // stop auto solve
        this.autoSolveState = AutoSolveStates.PENDING_STOP;
        break;
      case AutoSolveStates.NO_HINT:   // no button to click
        // ???
    } // switch      
  } // handleAutoSolveClick()

  /**
   * 
   */
  handleAutoFinishClick() : void {
    if (this.autoFinish) {
      this.autoSolveState = AutoSolveStates.RUNNING;
      this.autoSolveLoop();
    }
  } // handleAutoSolveClick()

  /**
   * 
   */
  isAnySelectedCell() {
    return this.selectedCell >= 0 && this.selectedCell <= 80;
  } // isAnySelectedCell()

  /**
   * 
   */
  isValueComplete(v: number) : boolean {
    return this.valuesComplete[v];
  } // isValueComplete()

  /**
   * 
   */
  handleChoiceClick(v: number) : void {
    this.initializeHintStates();    // remove any hint
    if (this.valuesComplete[v]) {
      return;
    }
    this.setCellValue(this.selectedCell, v);
  } // handleChoiceClick()

  /**
   * This method reponds to the user clicking on "Clear."
   */
  handleChoiceClearClick() : void {
    this.initializeHintStates();    // remove any hint
    this.removeCellValue(this.selectedCell);
  } // handleChoiceClearClick()

  /**
   * button 'Undo Last Action' EXECUTION state
   */
  undoLastAction() : void {
    this.initializeHintStates();    // remove any hint

    let lastAction = this.actionLog.getLastEntry();
    if (lastAction === undefined) {
      return;
    }

    let action = undefined;
    switch (lastAction.type) {
      case ActionType.SET_VALUE:
        action = <SetValueAction>lastAction;
        this.sudokuService.removeValue(action.cell);
        break;
      //case ActionType.GUESS_VALUE:
      //  break;
      case ActionType.REMOVE_VALUE:
        action = <RemoveValueAction>lastAction;
        this.sudokuService.setValue(action.cell, action.value);
        break;
      case ActionType.REMOVE_CANDIDATE:
        action = <RemoveCandidateAction>lastAction;
        this.sudokuService.restoreCandidate(action.cell, action.candidate);
        break;
      case ActionType.RESTORE_CANDIDATE:
        action = <RestoreCandidateAction>lastAction;
        this.sudokuService.removeCandidate(action.cell, action.candidate);
        break;
    } // switch

    // set selected cell to that of last action
    this.setSelectedCell(lastAction.cell);
    this.actionLog.removeLastEntry();
    this.refreshActionsLog();
  } // undoLastAction()
  
  /**
   * button 'Restart Current Sudoku' EXECUTION, SOLVED states
   */
  restartCurrentSudoku() : void {
    this.stopUserTimer();
    this.startUserTimer();
    this.sudokuService.initializeGrid();
    let temp = this.actualDifficulty;   // save
    this.initializeUserInterface();
    this.currentSudoku = this.sudokuService.loadProvidedSudoku(this.currentSudoku.givens);
    this.actualDifficulty = temp;       // restore
    this.playState = PlayStates.EXECUTE;
  } // restartCurrentSudoku()
  
  // button 'Start New Sudoku' EXECUTION, SOLVED state
  startNewSudoku() : void {
    this.stopUserTimer();
    this.initializeUserInterface();
    this.sudokuService.initializeGrid();
    this.playState = PlayStates.NEW;
  } // startNewSudoku()

  /**
   * User button: user will enter some outside sudoku givens.
   */
  enterSudoku() : void {
    this.currentSudoku = Sudoku.getEmptySudoku();
    this.playState = PlayStates.ENTRY;
  } // enterSudoku()

  /**
   * User button: finished givens entry.
           <!--
        button: press when entry complete
        conditons after entry
          is symetric
          is solvable
          difficulty

        capture givens to array
        create a sudoku with givens
        solve the sudoku
        get difficulty
        -->
*/
  entryFinished() : void {

    // check symetry - 180deg rotational
    if (!this.sudokuService.isSymetric()) {
      console.info('Is NOT symetric.')
      // TODO: warn user, correct or accept
    } else {
      console.info('Is symetric.')
    }

    // get givens based on values entered by user before solving
    this.currentSudoku.givens = this.sudokuService.cellValuesToArray();

    // solve the user-entered sudoku
    this.sudokuService.solve();

    // cases:
    // solved, got difficulty
    // could not be solved

    // record solution
    this.currentSudoku.completedSudoku = this.sudokuService.cellValuesToArray();
    this.currentSudoku.difficulty = this.sudokuService.maxDifficulty;

    console.info('Sudoku:\n' + this.currentSudoku.toString());

    // console.info('Grid state:\n' + this.sudokuService.toString());

    // switch to user solving sudoku
    this.sudokuService.blankoutSolution(this.currentSudoku.givens);
    this.sudokuService.refreshAllCandidates();
    this.actionLog.removeAllEntries();
    this.actionsLog = '';
    this.startUserTimer();
    this.playState = PlayStates.EXECUTE;
  } // entryFinished()

  /**
   * 
   */
  printGrid() {
    // this.router.navigate(['/print']);
  } // printGrid()
  
  // ----------------------------------------------------------------------
  // conversion methods
  // -----------------------------------------------------------------------

  /**
   * Convert view box/cell to cell idx
   * @param vb the view box that contains the cell
   * @param vc the position if the cell in the view box
   */
  viewToCellIdx(vb: number, vc: number) : number {
    return (Math.floor(vb / 3) * 18) + (vb * 3) + (Math.floor(vc / 3) * 6) + vc;
  } // viewToCellIdx()

  /**
   * The for choosing a value is 3x3. Row and column coords are 0,1,2.
   * Row/column values are 1..9. Row 0 has values 1,2,3. Row 2 has 7,8,9.
   */
  valueCoordsToValue(r: number, c: number) : number {
    return (r * 3) + c + 1;
  } // valueCoordsToValue()

  // ----------------------------------------------------------------------
  // other methods
  // -----------------------------------------------------------------------

  /**
   * Using sudoku statistics, prepare a solution clues string;
   */
  createSolutionClues() : string {
    let hintCounts : HintCounts = <HintCounts> this.currentSudoku.hintCounts;
    let s: string = '';

    if (hintCounts.getNakedPairs() > 0) {
      s += hintCounts.getNakedPairs() + ' Naked pairs\n';
    }
    if (hintCounts.getPointingRowsCols() > 0) {
        s += hintCounts.getPointingRowsCols() + ' Pointing rows or columns\n';
    }
    if (hintCounts.getBoxReductions() > 0) {
        s += hintCounts.getBoxReductions() + ' Box reductions\n';
    }
    if (hintCounts.getNakedTriples() > 0) {
        s += hintCounts.getNakedTriples() + ' Naked triples\n';
    }
    if (hintCounts.getNakedQuads() > 0) {
        s += hintCounts.getNakedQuads() + ' Naked quads\n';
    }
    if (hintCounts.getHiddenPairs() > 0) {
        s += hintCounts.getHiddenPairs() + ' Hidden pairs\n';
    }
    if (hintCounts.getHiddenTriples() > 0) {
        s += hintCounts.getHiddenTriples() + ' Hidden triples\n';
    }
    if (hintCounts.getHiddenQuads() > 0) {
        s += hintCounts.getHiddenQuads() + ' Hidden quads\n';
    }
    if (hintCounts.getGuesses() > 0) {
        s += hintCounts.getGuesses() + ' Guesses\n';
    }

    s += '*';

    return s;
  } // createSolutionClues()

  autoSolveLoop() : void {
    setTimeout(() => {
      switch (this.hintState) {
        case HintStates.READY:
                
          // stop before getting new hint
          if (this.autoSolveState === AutoSolveStates.PENDING_STOP) {
              this.autoSolveState = AutoSolveStates.READY;
              return;
          }   
              
          this.findHint();
          if (!this.hint) {
              this.autoSolveState = AutoSolveStates.NO_HINT;
              // this.autoSolveMessage = 'Not available';
          }
          break;
        case HintStates.ACTIVE:
          // this.applyHint();
          this.applyHint(this.hint);
              
          // stop after applying hint, before next hint
          if (this.autoSolveState === AutoSolveStates.PENDING_STOP) {
              this.autoSolveState = AutoSolveStates.READY;
              return;
          }   
              
          break;
        case HintStates.NO_HINT:
          this.autoSolveState = AutoSolveStates.NO_HINT;
          // this.autoSolveMessage = 'Not available';
        } // switch

        if (this.autoSolveState === AutoSolveStates.RUNNING) {
          this.autoSolveLoop();    // recursive; continue
        }
    }, this.AUTO_SOLVE_DELAY);
  } // autoSolveLoop()

    // TODO embed this in handleCellClick
  // setGuessCell_(event: any, br: number, bc: number, cr: number, cc: number) {
  //   let r = Common.viewToGridRow(br, cr);
  //   let c = Common.viewToGridCol(bc, cc);
    
  //   console.log('setGuessCell_() r,c:' + r + ',' + c);

  //   event.preventDefault();
  // }

  /**
   * 
   */
  initializeHintStates() : void {
    this.hintState = HintStates.READY;
    this.hintMessage = '';
    this.autoSolveState = AutoSolveStates.READY;
    // this.autoSolveMessage = '';
  }

  /**
   * 
   */
  setSelectedCell(ci: number) : void {
    this.selectedCell = ci;
  } // setSelectedCell()
    
  /**
   * 
   */
  findHint() : void {
    this.hint = this.hintService.getHint(Difficulty.HARDEST);
    if (this.hint) {
      this.hintState = HintStates.ACTIVE
      this.hintMessage = this.hint.toString();
      this.setSelectedCell(this.hint.getCell());
    } else {
      this.hintState = HintStates.NO_HINT;
    }
  } // findHint()
    
  /**
   * Apply a hint toward a solution.
   */
  applyHint(hint: Hint) {
    if (hint == undefined) {
      return;   // no hint to apply
    }
    this.hintMessage = '';
    this.hintState = HintStates.READY

    // WARNING - cannot set autoStartState to READY here
    //    or the auto start loop will stop
    //    therefore cannot call: this.initializeHintStates();

    // do the work
    switch (hint.type) {
      case HintType.NAKED_SINGLE:
      case HintType.HIDDEN_SINGLE_ROW:
      case HintType.HIDDEN_SINGLE_COL:
      case HintType.HIDDEN_SINGLE_BOX:
        let vHint: ValueHint = <ValueHint> hint;
        this.sudokuService.setValue(vHint.cell, vHint.value);
        this.actionLog.addEntry(
            new SetValueAction(vHint.cell, vHint.value, vHint));
        break;
      default:
        let kHint: CandidatesHint = <CandidatesHint> hint;
        let removes = kHint.removes;
        for (let remove of removes) {
          this.sudokuService.removeCandidate(remove.cell, remove.candidate);
        this.actionLog.addEntry(
            new RemoveCandidateAction(remove.cell, remove.candidate, kHint));

        }
    } // switch
    if (this.hint.getActionType() === ActionType.SET_VALUE) {
      let value = this.hint.getValue();
      this.valuesComplete[value] = this.sudokuService.isValueComplete(value);
      if (this.sudokuService.isSolved()) {
        this.handleSudokuComplete();
      }
    }
    this.refreshActionsLog();
    this.hint = undefined;
  } // applyHint()

  /**
   * 
   */
  setCellValue(ci: number, v: number) : void {

// console.info('completedSudoku: ' + this.currentSudoku.completedSudoku);

    // check for new values not that of solution
    if (this.playState == PlayStates.EXECUTE 
          // && this.currentSudoku.completedSudoku
          && v != this.currentSudoku.completedSudoku[ci]) {
      console.warn('Not the solution value');
    }

    if (this.sudokuService.getValue(ci) != v) {
      this.removeCellValue(ci);
    }
    this.sudokuService.setValue(ci, v);
    this.actionLog.addEntry(new SetValueAction(ci, v));
    this.valuesComplete[v] = this.sudokuService.isValueComplete(v);
    this.refreshActionsLog();
    if (this.sudokuService.isSolved()) {
      this.handleSudokuComplete();
    } else {
      let pseudoSudokuService = new PseudoSudokuService(this.sudokuService.copyGrid())
      if (pseudoSudokuService.hasNakedSinglesSolution()) {

        // FLAG
        this.autoFinish = true;
        console.warn('Has nakedSingles solution!');
      }
    }
  } // setCellValue()

  /**
   * 
   */
  removeCellValue(ci: number) : void {
    let oldValue = this.sudokuService.getValue(ci);
    if (oldValue == 0) {
      return;   // nothing to remove
    }
    this.sudokuService.removeValue(ci);
    this.actionLog.addEntry(new RemoveValueAction(ci, oldValue));
    this.valuesComplete[oldValue] = this.sudokuService.isValueComplete(oldValue);
    this.refreshActionsLog();
  } // removeCellValue()
  
  /**
   * 
   */
  unselectCell() : void {
    this.selectedCell = -1;
  } // unselectCell()
    
  /**
   * 
   */
  isCellSelected() : boolean {
    return this.selectedCell >= 0 && this.selectedCell <= 80;
  } // unselectCell()
    
  /**
   * 
   */
  handleSudokuComplete() : void {
    this.unselectCell();
    this.refreshActionsLog();
    this.stopUserTimer();
    this.playState = PlayStates.SOLVED;
  } // handleSudokuComplete()
    
  /**
   * 
   */
  refreshActionsLog() {
    // this.actionsLog = this.sudokuService.getActionLogAsString();
    this.actionsLog = this.getActionLogAsString();
  } // refreshActionsLog()

  /**
   * 
   */
  getActionLogAsString() : string {
    return this.actionLog.toStringLastFirst();
  } // getActionLogAsString()

  /**
   * 
   */
  startUserTimer() : void {
    let elapsedSeconds = 0;
    let timerObservable = Observable.timer(1, 1000);
    this.timerSubscription = timerObservable.subscribe(
        t => {
          elapsedSeconds++;
          this.elapsedTime = Common.toElapsedTimeString(elapsedSeconds);
        });
  } // startUserTimer()

  /**
   * 
   */
  stopUserTimer() : void {
    this.timerSubscription.unsubscribe();
  } // stopUserTimer()

  /**
   * 
   */
  initializeUserInterface() {
    this.sudokuService.initializeGrid();
    this.actionLog.initialize();
    this.actionsLog = '';
    this.actualDifficulty = undefined;
    this.unselectCell();   // no cell selected

    this.candidatesShowing = false;       // master switch
    for (let v = 1; v <= 9; v++) {
      this.candidatesVisible[v] = true;
      this.valuesComplete[v] = false;
    }

    this.candidatesModified = false;

    // this.passCount = undefined;
    this.playState = PlayStates.NEW;
    // this.generating = false;
    this.hint = undefined;
    this.autoFinish = false;
    this.initializeHintStates();    // remove any hint
    this.actionsLog = '';
    this.desiredDifficulty = this.DEFAULT_DIFFICULTY;

    this.cluesShowing = false;

    this.actionsLog = '';
    this.hintsViewed = 0;
    this.hintsApplied = 0;
  } // initializeUserInterface()
  
  // ----------------------------------------------------------------------
  // testing methods
  // -----------------------------------------------------------------------

  loadTestSudoku(givens: string) : void {
    this.currentSudoku = this.sudokuService.loadProvidedSudoku(Common.valuesStringToArray(givens));
    this.sudokuService.transferCellValuesToGivens(this.currentSudoku);

    // this.maxDifficulty = undefined;

    console.info('Testing\n' + this.sudokuService.toGridString());
    // this.solve();
    this.sudokuService.solve();
    // console.info('Difficulty: ' + DIFFICULTY_LABELS[this.maxDifficulty].label);
    console.info('Difficulty: ' + DIFFICULTY_LABELS[this.sudokuService.maxDifficulty].label);
    console.info('Testing\n' + this.sudokuService.toGridString());
    // this.startUserTimer();
    // this.playState = PlayStates.EXECUTE;
  }

  
  testExternal() {
    this.loadTestSudoku(
      // rated 5 stars -- requires 1 guess
      '3...4.81.......7.3..12..........4.7.8.6...1.9.4.1..........73..1.9.......87.2...6'
    );
  }

  testNakedTriple() {
    this.loadTestSudoku(
      // naked triple col 2, 138 in 2,2 2,4 2,7
      // https://www.sudokuoftheday.com/techniques/naked-pairs-triples/
      '6..8.27357.235694.3..4.7.621..975.242..183.79.79624..34..56.2.7.6724.3..92.7384.6'
    );
  }

  testHiddenPair() {
    this.loadTestSudoku(

      // hidden pair col 3 29 7,3 9,3
      '2...3.......8.45...9.65.....23..5.9.9.......8.8.7..34.....47.1...42.3.......1...4'

      // // NOT good test of HPs because other techniques apply first to eliminate both HPs
      // // hidden pair row 3 28 3,2 3,3
      // '9.7....321.32.78.....3967..69.782.433..169..727.534.....967.3..8.6..3.7573....4.6'

      // // NOT good test of HPs because other techniques apply first to eliminate both HPs
      // // hidden pair row 5, 25 in 5,5 5,6
      // // https://www.sudokuoftheday.com/techniques/hidden-pairs-triples/
      // '2...4.1.79.....24.84.2..56.7124983566.....4..5946...2.45.3.79121..9.4.353.9.1...4'

      // // NOT good test of HPs because other techniques apply first to eliminate both HPs
      // // 2 hidden pairs row 2 47 in 2,1 2,2; box 6 45 4,9 5,9
      // // http://www.thonky.com/sudoku/hidden-pairs-triples-quads
      // '.1.7.94....32.1......6.4.712...7..8.....6..1..5..4...968.597......326......4185..'
    );
  }

  testHiddenTriple() {
    this.loadTestSudoku(
      // 3 good tests. Comment all getHint() checks except checkHiddenTriples()

      // // hidden triple col 5, 347 in 1,5 4,5 6,5
      // // https://www.sudokuoftheday.com/techniques/hidden-pairs-triples/
      // '5286...4913649..257942.563....1..2....78263....25.9.6.24.3..9768.97.2413.7.9.4582'
      // // Hint: {"_type":21,"_cells":[4,31,49],"_candidates":[3,4,7],"_removes":[{"c":4,"k":1}]}
      // // Hint: Hidden triples 3/4/7 in column 5

      // // hidden triple col 5, 139 in 4,5 6,5 8,5
      // // https://www.sudokuoftheday.com/techniques/hidden-pairs-triples/ (modified)
      // // '37.4.81.....9.37.494.1...8342......5...5.4...8......46.1..49...5.96..4....42..931'
      // '37.4.81.....9.37.494.1...8342......51..5.43.98......46.1..49...5.96..4....42..931'
      // // Hint: {"_type":21,"_cells":[31,49,67],"_candidates":[1,3,9],
      // // "_removes":[{"c":31,"k":6},{"c":31,"k":7},{"c":31,"k":8},{"c":49,"k":2},
      // //              {"c":49,"k":7},{"c":67,"k":7},{"c":67,"k":8}]}
      // // Hint: Hidden triples 1/3/9 in column 5

      // hidden triple row 5, 126 in 5,1 5,6 5,8
      // https://www.sudokuoftheday.com/techniques/hidden-pairs-triples/ (modified)
      // '9.34..67.712658943.64739..2.3..475.9....9.3....93...8.4...63.9..9.27.4363.69847.1'
      '9.34..67.712658943.64739..2.31.475.9....9.3....93...8.4..163.9..9.27.4363269847.1'
      // Hint: {"_type":20,"_cells":[36,41,43],"_candidates":[1,2,6],
      // "_removes":[{"c":36,"k":5},{"c":36,"k":8},{"c":41,"k":5}]}
      // Hint: Hidden triples 1/2/6 in row 5
    );
  }

  testHiddenQuad() {
    this.loadTestSudoku(

      // hidden quad row 5, 1289 in 5,1 5,2 5,4 5,5
      // https://www.sudokuoftheday.com/techniques/hidden-pairs-triples/
      '.9.7321..2735146984.196....36248.91............7..328.72984.3.11.8.79.2......1879'

    );
  }

  testEasy() {
    this.loadTestSudoku(
      '182....5...7..1..49......6.37.9....1..8...7..6....3.95.5......88..7..4...1....539'
    );
  }

  testMedium_1NP() {
    this.loadTestSudoku(
      '.3.7.4.8.....9.2..8..3.5.....4...9.1.86...52.3.2...7.....6.3..2..3.5.....1.4.2.7.'
    );
  }

  testHard_1NP_3P_1G() {
    this.loadTestSudoku(
      '..9..5...3..2.985..54....2......1..659.....132..3......3....48..756.8..2...1..6..'
    );
  }

  testHard_3NP_1P_4G() {
    this.loadTestSudoku(
      '4.5.9...176..132...2.6.......1........47.13........4.......8.6...257..345...2.7.9'
    );
  }

  testGuess() {
    this.loadTestSudoku(
      '.......132.31......1...79...21.7..4...62.41...9..5.62...47...8......57.173.......'
    );
  }
    
  testNakedPairBoxRow() {
    this.loadTestSudoku(
      '.9....3....8.45.7...6..7....54..69136.......89834..56....7..1...4.28.7....5....9.'
    );
  }
  
  testPointingRow() {
    this.loadTestSudoku(
      '6....3.18..95.....4...7.2...4.7.1....8..2.17.1..8..4....4.8...1.....79..52.6...3.'
    );
  }
  
  testPointingCol() {
    this.loadTestSudoku(
      '6.4..1..5...48...2.9....4...5.7.8..6..7.2.8..3..1...7...2.14.9.1...7...38.....1..'
    );
  }
  
  testRowBoxReduction() {
    this.loadTestSudoku(
      '6....3.18..95.....4...7.2...4.7.1....8..2.17.1..8..4....4.8...1.....79..52.6...3.'
    );
  }
  
  testColBoxReduction() {
    this.loadTestSudoku(
      '6.4..1..5...48...2.9....4...5.7.8..6..7.2.8..3..1...7...2.14.9.1...7...38.....1..'
    );
  }
  
  testHiddenPairsRow() {
    this.loadTestSudoku(
      '9.7....321.32.78.....3967..69.782.433..169..727.534.....967.3..8.6..3.7573....4.6'
    );
  }
    

  // ----- SOLVED state methods ------

} // class PlayComponent
