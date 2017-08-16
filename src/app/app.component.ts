import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { TITLE, MAJOR_VERSION, VERSION, SUB_VERSION, COPYRIGHT } from './common/common'; 
import { Common }           from './common/common';
import { Difficulty }       from './model/difficulty';
import { SudokuService }    from './model/sudoku.service';
import { CacheService }     from './model/cache.service';
import { Puzzle }           from './model/puzzle';
import { Hint }             from './hint/hint';
import { HintService }      from './hint/hint.service';
import { ValueHint }        from './hint/hint';
import { CandidatesHint }   from './hint/hint';
import { HintType }         from './hint/hint.type';
import { HintCounts }       from './hint/hintCounts';
import { ActionType }       from './action/action';
import { Action }           from './action/action';
import { ValueAction }      from './action/action';
import { NakedType }        from './model/naked.type';
import { CombinationIterator } from './common/combination.iterator';

import { ActionLogService } from './action/action-log.service';

import { MessageService } from './common/message.service';
 
// test
// import { ROOT_VALUES } from './common/common';

enum PlayStates {
  NEW,
  ENTRY,    // not used currently
  CREATING, // not used currently
  EXECUTE, 
  SOLVED
}
enum HintStates {
  READY,	// no hint has been requested
  ACTIVE,	// a hint exists and has not been applied
  NO_HINT	// a hint has been requested but no hint is available
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

  // ----- state properties -----
  playState: PlayStates;
  hintStates = HintStates;
  hintState = HintStates.NO_HINT;
  autoSolveStates = AutoSolveStates;
  autoSolveState = AutoSolveStates.NO_HINT;

  message: any;
  messageSubscription: Subscription;

  constructor(
    private changeDetectorRef: ChangeDetectorRef, 
    private ngZone: NgZone,

    /** */
    // sudokuService: SudokuService,
    // hintService: HintService,
    private cacheService: CacheService,

    private messageService: MessageService
  ) {
    this.sudokuService = new SudokuService(new ActionLogService());
    this.hintService = new HintService(this.sudokuService);

    this.messageSubscription = this.messageService.getMessage()
        .subscribe(message => { 
          this.message = message; 
          // console.info('\nMessage received: ' + this.message.text);

          if (this.message.text === 'Cache changed') {
            this.easyAvailable = this.cacheService.isSudokuAvailable(Difficulty.EASY);
            this.mediumAvailable = this.cacheService.isSudokuAvailable(Difficulty.MEDIUM);
            this.hardAvailable = this.cacheService.isSudokuAvailable(Difficulty.HARD);
            this.hardestAvailable = this.cacheService.isSudokuAvailable(Difficulty.HARDEST);
            
            this.changeDetectorRef.detectChanges();
          }
        });
  }

  // -----------------------------------------------------------------------
  // constants
  // -----------------------------------------------------------------------
  PlayStates = PlayStates;  // need for use in view html
  DEFAULT_DIFFICULTY = Difficulty.MEDIUM;
  AUTO_SOLVE_DELAY = 250;	// msec
  
  difficulties = [
    { value: Difficulty.EASY,    label: 'Easy' },
    { value: Difficulty.MEDIUM,  label: 'Medium' },
    { value: Difficulty.HARD,    label: 'Hard' },
    { value: Difficulty.HARDEST, label: 'Hardest' },
  ];

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

  // ----- execute properties -----
  actualDifficulty: string;
  valuesComplete: boolean[];
  candidatesModified: boolean;
  hintMessage: string;
  // autoSolveMessage: string;
  actionLog: string;
  cluesShowing: boolean;
  solutionClues: string;
  timerSubscription: Subscription;
  elapsedTime: string;
  hintsViewed: number;
  hintsApplied: number;
  
  // ----- solved properties -----
  currentPuzzle: Puzzle;
  hint: Hint;
  candidatesVisible: boolean[];
  selectedCell: number;

  subscription: Subscription;

  ngOnInit() {
    this.desiredDifficulty = Difficulty.MEDIUM;   // default
    this.valuesComplete = new Array(10);
    this.candidatesVisible = new Array(10);

    this.initializeUserInterface();
    this.changeDetectorRef.detectChanges();

    let cacheKeys: string[] = this.cacheService.getCacheKeys();

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

  /**
   * User keyboard actions.
   */
  handleKeyPress(keyEvent: any) : void {
    if (this.playState != PlayStates.ENTRY 
        && this.playState != PlayStates.EXECUTE) {
      return;
    }
      
    // console.log('keyEvent: ' + keyEvent.keyCode + ', ' + keyEvent.shiftKey + ', ' + keyEvent.ctrlKey + ', ' + keyEvent.metaKey + ', ' + keyEvent.altKey);
    
    let keyCode = keyEvent.keyCode;
    let value = 0;

    // get currently selected cell's row and column number
    // let ur = this.xselectedCell.r;
    // let uc = this.xselectedCell.c;
    let ur = Common.userRow(this.selectedCell);
    let uc = Common.userCol(this.selectedCell);
    
    // no key action if no cell selected
    if (ur == 0 && uc == 0) {
      return;
    }

    switch(keyCode) {
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
        // this.setSelectedCell(ur, uc); 
        this.setSelectedCell(Common.urcToCellIdx(ur, uc)); 
        return;
      case 46:		// delete
      case 32:		// space
      case 8:			// backspace
        keyEvent.preventDefault();
        value = 0;
        break;
      default:
        if (keyCode >= 96 && keyCode <= 105) {  // keypad codes
          keyCode = keyCode - 48;     // change to number codes
        }
        value = parseInt(String.fromCharCode(keyCode));
    }

    if (value >= 0 && value <= 9) {
      if (value > 0) {
        // this.setCellValue(ur, uc, value);
        this.setCellValue(Common.urcToCellIdx(ur, uc), value);
      } else {
        // this.removeCellValue(ur, uc);
        this.removeCellValue(Common.urcToCellIdx(ur, uc));
      }

      this.initializeHintStates();
      
      // step selected cell right (wrap to next row) during entry
      if (this.playState === PlayStates.ENTRY) {
        uc++;
        if (uc > 9) {
          ur++;
          if (ur > 9) { ur = 1; }
          uc = 1;
        }
        // this.setSelectedCell(ur, uc); 
        this.setSelectedCell(Common.urcToCellIdx(ur, uc)); 
      }
    } // if value 0..9
  } // handleKeyPress()

  /**
   * TESTING
   */
  emptyCache() {
    this.cacheService.emptyCache();
  }

  /**
   * 
   * Function based on view's cell indexes in html code.
   */
  isCellLocked_(vb: number, vc: number) : boolean {
    return this.isCellLocked(this.viewToCellIdx(vb, vc));
  } // isCellLocked()
  
  /**
   * 
   * Function based on view's cell indexes in html code.
   */
  isCellLocked(ci: number) : boolean {
    return this.currentPuzzle &&
        this.currentPuzzle.initialValues[ci] > 0
  } // isCellLocked()
  
  /**
   * 
   */
  isSelectedCell(vb: number, vc: number) : boolean {
    return this.selectedCell === this.viewToCellIdx(vb, vc);
  }
  
  /**
   * 
   * Function based on view's cell indexes in html code.
   */
  isCellInvalid(vb: number, vc: number) : boolean {
    return !this.sudokuService.isCellValid(this.viewToCellIdx(vb, vc));
  } // isCellInvalid_()
  
  /**
   * 
   * Function based on view's cell indexes in html code.
   */
  handleCellClick(event, vb: number, vc: number) : void {
    if (this.playState != PlayStates.ENTRY 
        && this.playState != PlayStates.EXECUTE) {
      return;
    }
    
    let ci = this.viewToCellIdx(vb, vc);
    if (this.isCellLocked(ci)) {
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
        // let nakeds = this.sudokuService.getNakedCandidates_(zr, zc, NakedType.SINGLE);
        let nakeds = this.sudokuService.findNakedCandidates(ci, NakedType.SINGLE);
        if (nakeds.length === 1) {
          // this.setCellValue(zr, zc, nakeds[0]);
          // this.setSelectedCell(zr, zc);
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
    // return value.toString(); 
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
    this.initializeHintStates();

    if (this.candidatesShowing) {
      let cellIdx = this.viewToCellIdx(vb, vc);
      if (this.sudokuService.isCandidate(cellIdx, k)) {
        // this.removeCandidate(cellIdx, k);
        this.sudokuService.removeCandidate(cellIdx, k, undefined);
      } else {
        // this.restoreCandidate(cellIdx, k);
        this.sudokuService.restoreCandidate(cellIdx, k);
      }
    }
    // // else restore if cand viable

    // this.removeCandidate(this.viewToCellIdx(vb, vc), k);

    this.candidatesModified = true;
    this.refreshActionLog();
  } // handleCandidateClick_()

  refreshCandidates() {
    this.sudokuService.refreshAllCandidates();
    this.candidatesModified = false;
  }
  
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
   * Responds to Generate button. Gets sudoku puzzle of desired difficulty
   * from cache. Loads sudoku and switches to Play state.
   */
  generate(difficulty: Difficulty) : void {
    this.currentPuzzle = Puzzle.deserialize(this.cacheService.getSudoku(difficulty));

    // bind metadata for ui, load sudoku for user execution
    this.actualDifficulty = 
        Puzzle.getDifficultyLabel(this.currentPuzzle.actualDifficulty);
    this.solutionClues = this.createSolutionClues();

    this.sudokuService.loadProvidedSudoku(this.currentPuzzle.initialValues);
    
console.log('Sudoku:\n' + this.currentPuzzle.toString());

    // go to sudoku execution by user
    this.startUserTimer();
    this.playState = PlayStates.EXECUTE;
  } // generate() 

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
  }

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
      break;
    case HintStates.ACTIVE:
      this.applyHint();
    }
  }
  
  /**
   * 
   */
  autoSolveButton() : boolean {
    return this.autoSolveState != AutoSolveStates.NO_HINT
        && this.hintState != HintStates.NO_HINT; 
  }
  
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
  isAnySelectedCell() {
    return this.selectedCell >= 0 && this.selectedCell <= 80;
  } // isAnySelectedCell()

  /**
   * 
   */
  isValueComplete_(vr: number, vc: number) : boolean {
    return this.valuesComplete[this.valueCoordsToValue(vr, vc)];
  }

  /**
   * 
   */
  handleChoiceClick_(vr: number, vc: number) : void {
    let choice = this.valueCoordsToValue(vr, vc);
    if (this.valuesComplete[choice]) {
      return;
    }
    this.initializeHintStates();
    this.setCellValue(this.selectedCell, choice);
  } // handleChoiceClick_()

  /**
   * Function based on view's cell indexes in html code.
   */
  choiceToChar_(vr: number, vc: number) : string {
    return '' + this.valueCoordsToValue(vr, vc);
  } // choiceToChar_()

  /**
   * 
   */
  handleChoiceClearClick() : void {
    this.initializeHintStates();

    // get currently selected cell's row and column number
    // let r = this.xselectedCell.r;
    // let c = this.xselectedCell.c;
    
    // this.removeCellValue(r, c);
    this.removeCellValue(this.selectedCell);
  } // handleChoiceClearClick_()

  /**
   * button 'Undo Last Action' EXECUTION state
   */
  undoLastAction() : void {
    this.initializeHintStates();

    // capture before it's removed from log
    let lastAction = this.sudokuService.getLastAction();

    this.sudokuService.undoLastAction();

    // update values complete
    if (lastAction.type === ActionType.SET_VALUE) {
      let v = (<ValueAction> lastAction).value;
      this.valuesComplete[v] = this.sudokuService.isValueComplete(v);
    }

    // set selected cell to that of last action
    this.setSelectedCell(lastAction.cell);
    this.refreshActionLog();
  } // undoLastAction()
  
  /**
   * button 'Restart Current Puzzle' EXECUTION, SOLVED states
   */
  restartCurrentPuzzle() : void {
    this.stopUserTimer();
    this.startUserTimer();
    this.sudokuService.initializeModel();
    let temp = this.actualDifficulty;   // save
    this.initializeUserInterface();
    this.currentPuzzle = this.sudokuService.loadProvidedSudoku(this.currentPuzzle.initialValues);
    this.actualDifficulty = temp;       // restore
    this.playState = PlayStates.EXECUTE;
  }
  
  // button 'Start New Puzzle' EXECUTION, SOLVED state
  startNewPuzzle() : void {
    this.stopUserTimer();
    this.initializeUserInterface();
    this.sudokuService.initializeModel();
    this.playState = PlayStates.NEW;
  }

  printGrid() {
    // this.router.navigate(['/print']);
  }
  
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
  }

  // ----------------------------------------------------------------------
  // other methods
  // -----------------------------------------------------------------------

  /**
   * Using puzzle statistics, prepare a solution clues string;
   */
  createSolutionClues() : string {
    let stats : HintCounts = <HintCounts> this.currentPuzzle.stats;
    let s: string = '';

    if (stats.getNakedPairs() > 0) {
      s += stats.getNakedPairs() + ' Naked pairs\n';
    }
    if (stats.getPointingRowsCols() > 0) {
        s += stats.getPointingRowsCols() + ' Pointing rows or columns\n';
    }
    if (stats.getBoxReductions() > 0) {
        s += stats.getBoxReductions() + ' Box reductions\n';
    }
    if (stats.getNakedTriples() > 0) {
        s += stats.getNakedTriples() + ' Naked triples\n';
    }
    if (stats.getNakedQuads() > 0) {
        s += stats.getNakedQuads() + ' Naked quads\n';
    }
    if (stats.getHiddenPairs() > 0) {
        s += stats.getHiddenPairs() + ' Hidden pairs\n';
    }
    if (stats.getHiddenTriples() > 0) {
        s += stats.getHiddenTriples() + ' Hidden triples\n';
    }
    if (stats.getHiddenQuads() > 0) {
        s += stats.getHiddenQuads() + ' Hidden quads\n';
    }
    if (stats.getGuesses() > 0) {
        s += stats.getGuesses() + ' Guesses\n';
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
          this.applyHint();
              
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
  //   let r = Common.viewToModelRow(br, cr);
  //   let c = Common.viewToModelCol(bc, cc);
    
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
  }
    
  // /**
  //  * 
  //  */
  // removeCandidate(cell: number, k: number) : void {
  //   this.initializeHintStates();
  //   if (this.candidatesShowing) {
  //     this.sudokuService.removeCandidate(cell, k, undefined);
  //   }
  //   this.refreshActionLog();
  // }
  
  // /**
  //  * 
  //  */
  // restoreCandidate(cell: number, k: number) : void {
  //   this.initializeHintStates();
  //   if (this.candidatesShowing) {
  //     this.sudokuService.restoreCandidate(cell, k);
  //   }
  //   this.refreshActionLog();
  // }
  
  /**
   * 
   */
  findHint() : void {
    this.hint = this.hintService.getHint(Difficulty.HARDEST);
    if (this.hint) {
      this.hintState = HintStates.ACTIVE
      this.hintsViewed++;
      this.hintMessage = this.hint.toString();
      this.setSelectedCell(this.hint.getCell());
    } else {
      this.hintState = HintStates.NO_HINT;
    }
  }
    
  /**
   * 
   */
  // apply hint toward solution
  applyHint() : void {
    this.hintMessage = '';
    this.hintState = HintStates.READY
    // WARNING - cannot set autoStartState to READY here
    //    or the auto start loop will stop
    //    therefore cannot call: this.initializeHintStates();
    this.hintService.applyHint();
    this.hintsApplied++;
    if (this.hint.getActionType() === ActionType.SET_VALUE) {
      let value = this.hint.getValue();
      this.valuesComplete[value] = this.sudokuService.isValueComplete(value);
      if (this.sudokuService.isSolved()) {
        this.handlePuzzleComplete();
      }
    }
    this.refreshActionLog();
    this.hint = undefined;
  } // applyHint()
    
  /**
   * 
   */
  setCellValue(ci: number, v: number) : void {

    // check for new values not that of solution
    if (v != this.currentPuzzle.completedPuzzle[ci]) {
      console.warn('Not the solution value');
    }

    this.sudokuService.setValue(ci, v, ActionType.SET_VALUE);
    this.valuesComplete[v] = this.sudokuService.isValueComplete(v);
    if (this.sudokuService.isSolved()) {
      this.handlePuzzleComplete();
    }
      this.refreshActionLog();
  }

  /**
   * 
   */
  removeCellValue(ci: number) : void {
    let oldValue = this.sudokuService.getValue(ci);
    if (oldValue >= 1) {
      this.sudokuService.removeValue(ci);
      this.valuesComplete[oldValue] = this.sudokuService.isValueComplete(oldValue);
      this.refreshActionLog();
    }
  }
  
  /**
   * 
   */
  unselectCell() : void {
    this.selectedCell = -1;
  }
    
  /**
   * 
   */
  handlePuzzleComplete() : void {
    this.unselectCell();
    this.refreshActionLog();
    this.stopUserTimer();
    this.playState = PlayStates.SOLVED;
  }
    
  /**
   * 
   */
  refreshActionLog() {
    this.actionLog = this.sudokuService.getActionLogAsString();
  }

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
  }

  /**
   * 
   */
  stopUserTimer() : void {
    this.timerSubscription.unsubscribe();
  }

  /**
   * 
   */
  initializeUserInterface() {
    this.sudokuService.initializeModel();
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
    this.initializeHintStates();
    this.actionLog = '';
    this.desiredDifficulty = this.DEFAULT_DIFFICULTY;

    this.cluesShowing = false;

    this.actionLog = '';
    this.hintsViewed = 0;
    this.hintsApplied = 0;
  } // initializeUserInterface()
  
  // ----------------------------------------------------------------------
  // testing methods
  // -----------------------------------------------------------------------

  loadTestPuzzle(initialValues: string) : void {
    this.currentPuzzle = this.sudokuService.loadProvidedSudoku(Common.valuesStringToArray(initialValues));
    this.playState = PlayStates.EXECUTE;
  }

  
  testNakedTriple() {
    this.loadTestPuzzle(
      // naked triple col 2, 138 in 2,2 2,4 2,7
      // https://www.sudokuoftheday.com/techniques/naked-pairs-triples/
      '6..8.27357.235694.3..4.7.621..975.242..183.79.79624..34..56.2.7.6724.3..92.7384.6'
    );
  }

  testHiddenPair() {
    this.loadTestPuzzle(

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
    this.loadTestPuzzle(
      // 3 good tests. Comment all getHint() checks except checkHiddenTriples()

      // // hidden triple col 5, 347 in 1,5 4,5 6,5
      // // https://www.sudokuoftheday.com/techniques/hidden-pairs-triples/
      // '5286...4913649..257942.563....1..2....78263....25.9.6.24.3..9768.97.2413.7.9.4582'
      // // Hint: {"_type":21,"_cells":[4,31,49],"_candidates":[3,4,7],"_removals":[{"c":4,"k":1}]}
      // // Hint: Hidden triples 3/4/7 in column 5

      // // hidden triple col 5, 139 in 4,5 6,5 8,5
      // // https://www.sudokuoftheday.com/techniques/hidden-pairs-triples/ (modified)
      // // '37.4.81.....9.37.494.1...8342......5...5.4...8......46.1..49...5.96..4....42..931'
      // '37.4.81.....9.37.494.1...8342......51..5.43.98......46.1..49...5.96..4....42..931'
      // // Hint: {"_type":21,"_cells":[31,49,67],"_candidates":[1,3,9],
      // // "_removals":[{"c":31,"k":6},{"c":31,"k":7},{"c":31,"k":8},{"c":49,"k":2},
      // //              {"c":49,"k":7},{"c":67,"k":7},{"c":67,"k":8}]}
      // // Hint: Hidden triples 1/3/9 in column 5

      // hidden triple row 5, 126 in 5,1 5,6 5,8
      // https://www.sudokuoftheday.com/techniques/hidden-pairs-triples/ (modified)
      // '9.34..67.712658943.64739..2.3..475.9....9.3....93...8.4...63.9..9.27.4363.69847.1'
      '9.34..67.712658943.64739..2.31.475.9....9.3....93...8.4..163.9..9.27.4363269847.1'
      // Hint: {"_type":20,"_cells":[36,41,43],"_candidates":[1,2,6],
      // "_removals":[{"c":36,"k":5},{"c":36,"k":8},{"c":41,"k":5}]}
      // Hint: Hidden triples 1/2/6 in row 5
    );
  }

  testHiddenQuad() {
    this.loadTestPuzzle(

      // hidden quad row 5, 1289 in 5,1 5,2 5,4 5,5
      // https://www.sudokuoftheday.com/techniques/hidden-pairs-triples/
      '.9.7321..2735146984.196....36248.91............7..328.72984.3.11.8.79.2......1879'

    );
  }

  testEasy() {
    this.loadTestPuzzle(
      '182....5...7..1..49......6.37.9....1..8...7..6....3.95.5......88..7..4...1....539'
    );
  }

  testMedium_1NP() {
    this.loadTestPuzzle(
      '.3.7.4.8.....9.2..8..3.5.....4...9.1.86...52.3.2...7.....6.3..2..3.5.....1.4.2.7.'
    );
  }

  testHard_1NP_3P_1G() {
    this.loadTestPuzzle(
      '..9..5...3..2.985..54....2......1..659.....132..3......3....48..756.8..2...1..6..'
    );
  }

  testHard_3NP_1P_4G() {
    this.loadTestPuzzle(
      '4.5.9...176..132...2.6.......1........47.13........4.......8.6...257..345...2.7.9'
    );
  }

  testGuess() {
    this.loadTestPuzzle(
      '.......132.31......1...79...21.7..4...62.41...9..5.62...47...8......57.173.......'
    );
  }
    
  testNakedPairBoxRow() {
    this.loadTestPuzzle(
      '.9....3....8.45.7...6..7....54..69136.......89834..56....7..1...4.28.7....5....9.'
    );
  }
  
  testPointingRow() {
    this.loadTestPuzzle(
      '6....3.18..95.....4...7.2...4.7.1....8..2.17.1..8..4....4.8...1.....79..52.6...3.'
    );
  }
  
  testPointingCol() {
    this.loadTestPuzzle(
      '6.4..1..5...48...2.9....4...5.7.8..6..7.2.8..3..1...7...2.14.9.1...7...38.....1..'
    );
  }
  
  testRowBoxReduction() {
    this.loadTestPuzzle(
      '6....3.18..95.....4...7.2...4.7.1....8..2.17.1..8..4....4.8...1.....79..52.6...3.'
    );
  }
  
  testColBoxReduction() {
    this.loadTestPuzzle(
      '6.4..1..5...48...2.9....4...5.7.8..6..7.2.8..3..1...7...2.14.9.1...7...38.....1..'
    );
  }
  
  testHiddenPairsRow() {
    this.loadTestPuzzle(
      '9.7....321.32.78.....3967..69.782.433..169..727.534.....967.3..8.6..3.7573....4.6'
    );
  }
    

  // ----- SOLVED state methods ------

} // class PlayComponent
