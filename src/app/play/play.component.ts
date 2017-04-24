import { Component, OnInit, Input } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Common }           from '../common/common';
import { Difficulty }       from '../model/difficulty';
import { SudokuService }    from '../model/sudoku.service';
import { CacheService }     from '../model/cache.service';
import { Puzzle }           from '../model/puzzle';
import { Hint }             from '../hint/hint';
import { HintService }      from '../hint/hint.service';
import { ValueHint }        from '../hint/hint';
import { CandidatesHint }   from '../hint/hint';
import { HintType }         from '../hint/hint.type';
import { HintCounts }       from '../hint/hintCounts';
import { ActionType }       from '../action/action.type';
import { Action }           from '../action/action';
import { ValueAction }      from '../action/action';
import { NakedType }        from '../model/naked.type';
import { CounterComponent } from './counter/counter.component';
import { CombinationIterator } from '../common/combination.iterator';

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
  selector: 'play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PlayComponent implements OnInit {

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef, 
    private ngZone: NgZone,

    /** */
    private sudokuService: SudokuService,
    private hintService: HintService,
    private cacheService: CacheService
  ) {}

  // -----------------------------------------------------------------------
  // constants
  // -----------------------------------------------------------------------
  PlayStates = PlayStates;  // need for use in view html
  DEFAULT_DIFFICULTY = Difficulty.MEDIUM;
  AUTO_SOLVE_DELAY = 250;	// msec
  
  private difficulties = [
    { value: Difficulty.EASY,    label: 'Easy' },
    { value: Difficulty.MEDIUM,  label: 'Medium' },
    { value: Difficulty.HARD,    label: 'Hard' },
    { value: Difficulty.HARDEST, label: 'Hardest' },
  ];

  // -----------------------------------------------------------------------
  // properties
  // -----------------------------------------------------------------------

  // ----- state properties -----
  playState: PlayStates;
  hintState: HintStates;
  autoSolveState: AutoSolveStates;

  // ----- grid properties -----
  candidatesShowing: boolean;   // also in execute

  // ----- new properties -----
  passCount: string;
  desiredDifficulty: Difficulty;

  // ----- execute properties -----
  actualDifficulty: string;
  valuesComplete: boolean[];
  hintMessage: string;
  autoSolveMessage: string;
  actionLog: string;
  solutionClues: string;
  // busy: Subscription;
  timerSubscription: Subscription;
  elapsedTime: string;
  hintsViewed: number;
  hintsApplied: number;
  
  // ----- solved properties -----
  currentPuzzle: Puzzle;
  hint: Hint;
  candidatesVisible: boolean[];
  selectedCell: {r: number, c: number};

  ngOnInit() {
    this.desiredDifficulty = Difficulty.MEDIUM;   // default
    this.valuesComplete = new Array(10);
    this.candidatesVisible = new Array(10);

    this.initializeUserInterface();
    this.changeDetectorRef.detectChanges();

    // test
    // let comboIt = new CombinationIterator([1,2,3], 3);
    // // let comboIt = new CombinationIterator([1,2,3,4,5,6], 3);
    // let i = 0;
    // while (comboIt.hasNext()) {
    //   i++
    //   console.log(i + ' ' + JSON.stringify(comboIt.next()));
    // }
  }

  // -----------------------------------------------------------------------
  // public methods
  // -----------------------------------------------------------------------

  // ----- grid methods ------

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
    let r = this.selectedCell.r;
    let c = this.selectedCell.c;
    
    // no key action if no cell selected
    if (r == 0 && c == 0) {
      return;
    }

    switch(keyCode) {
      case 37:		// left arrow - wrap to previous row
        c--;
        if (c < 1) {
          r--;
          if (r < 1) { r = 9; }
          c = 9;
        }
        this.setSelectedCell(r, c); 
        return;
      case 38:		// up arrow - wrap in column
        r--;
        if (r < 1) { r = 9; }
        this.setSelectedCell(r, c); 
        return;
      case 39:		// right arrow - wrap to next row
        c++;
        if (c > 9) {
          r++;
          if (r > 9) { r = 1; }
          c = 1;
        }
        this.setSelectedCell(r, c); 
        return;
      case 40:		// down arrow - wrap in column
        r++;
        if (r > 9) { r = 1; }
        this.setSelectedCell(r, c); 
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
        this.setCellValue(r, c, value);
      } else {
        this.removeCellValue(r, c);
      }

      this.initializeHintStates();
      
      // step selected cell right (wrap to next row) during entry
      if (this.playState === PlayStates.ENTRY) {
        c++;
        if (c > 9) {
          r++;
          if (r > 9) { r = 1; }
          c = 1;
        }
        this.setSelectedCell(r, c); 
      }
    } // if value 0..9
  } // handleKeyPress()

  /**
   * Function based on view's cell indexes in html code.
   */
  isCellLocked_(br: number, bc: number, cr: number, cc: number) {
    return this.isCellLocked(Common.viewToModelRow(br, cr), Common.viewToModelCol(bc, cc));
  }
  
  /**
   * Function based on view's cell indexes in html code.
   */
  isSelectedCell_(br: number, bc: number, cr: number, cc: number) {
      return this.isSelectedCell(Common.viewToModelRow(br, cr), 
          Common.viewToModelCol(bc, cc));
  }

  /**
   * Function based on view's cell indexes in html code.
   */
  isCellInvalid_(br: number, bc: number, cr: number, cc: number) {
    return this.sudokuService.isCellInvalid_(Common.viewToModelRow(br, cr), Common.viewToModelCol(bc, cc));
  }

  /**
   * Process (1) single clicks (select cell), (2) double clicks (remove candidate)
   * Function based on view's cell indexes in html code.
   */
  handleCellClick_(event: any, br: number, bc: number, cr: number, cc: number) {
    if (this.playState != PlayStates.ENTRY 
        && this.playState != PlayStates.EXECUTE) {
      return;
    }
    let r = Common.viewToModelRow(br, cr);
    let c = Common.viewToModelCol(bc, cc);
    
    if (this.isCellLocked(r, c)) {
      return;         // can't accept click on locked cell
    }

    switch(event.which) {
      case 1:   // left click
        if (this.selectedCell.r != r || this.selectedCell.c != c) {
          this.setSelectedCell(r, c); 
        } else {
          this.unselectCell();
        }
        return;
      case 2:   // middle click
        return;
      case 3:   // right click
        let nakeds = this.sudokuService.getNakedCandidates_(r, c, NakedType.SINGLE);
        if (nakeds.length === 1) {
          this.setCellValue(r, c, nakeds[0]);
          this.setSelectedCell(r, c);
        }
        return;
      default:
        alert("you have a strange mouse");
        return;
    } // switch
  } //handleCellClick_()
    
  /**
   * Function based on view's cell indexes in html code.
   */
  valueToChar_(br: number, bc: number, cr: number, cc: number) {
    let value = this.getValue_(br, bc, cr, cc);
    return value == 0 ? '' : value.toString(); 
  } //valueToChar_()

  /**
   * Function based on view's cell indexes in html code.
   */
  getValue_(br: number, bc: number, cr: number, cc: number) {
      return this.sudokuService.getValue_(Common.viewToModelRow(br, cr), 
          Common.viewToModelCol(bc, cc));
  } // getValue_()
  
  /**
   * Mmanually remove by user double-click.
   * Function based on view's cell indexes in html code.
   */
  handleCandidateClick_(br: number, bc: number, cr: number, cc: number, 
        kr: number, kc: number) {
    if (this.playState != PlayStates.ENTRY 
        && this.playState != PlayStates.EXECUTE) {
      return;
    }
    this.initializeHintStates();
    this.removeCandidate(Common.viewToModelRow(br, cr), 
        Common.viewToModelCol(bc, cc), Common.viewToModelCand(kr, kc));
  } // handleCandidateClick_()
  
  /**
   * Function based on view's cell indexes in html code.
   */
  candidatesVisible_(kr: number, kc: number) {
    return this.candidatesVisible[Common.viewToModelCand(kr, kc)];
  } // candidatesVisible_()
  
  /**
   * Function based on view's cell indexes in html code.
   */
  candToChar_(br: number, bc: number, cr: number, cc: number, 
          kr: number, kc: number) {
    let candidate = Common.viewToModelCand(kr, kc);
    return this.sudokuService.isCandidate_(Common.viewToModelRow(br, cr), 
        Common.viewToModelCol(bc, cc), 
            candidate) ? candidate.toString() : '';
  } // candToChar_()

  /**
   * 
   */
  isAnySelectedCell() {
    return this.selectedCell.r != 0;
  } // isAnySelectedCell()

  /**
   * Function based on view's cell indexes in html code.
   */
  choiceToChar_(vr: number, vc: number) : string {
    return '' + this.valueCoordsToValue(vr, vc);
  } // choiceToChar_()

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

    // get currently selected cell's row and column number
    let r = this.selectedCell.r;
    let c = this.selectedCell.c;
    
    this.setCellValue(r, c, choice);
  } // handleChoiceClick_()

  /**
   * 
   */
  handleChoiceClearClick_() {
    this.initializeHintStates();

    // get currently selected cell's row and column number
    let r = this.selectedCell.r;
    let c = this.selectedCell.c;
    
    this.removeCellValue(r, c);
  } // handleChoiceClearClick_()

  /**
   * Responds to Generate button. Gets sudoku puzzle of desired difficulty
   * from cache. Loads sudoku and switches to Play state.
   */
  generate(difficulty: Difficulty) {
    this.currentPuzzle = this.cacheService.getSudoku(difficulty);

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

  // ----- EXECUTE state methods ------

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
    return s;
  } // createSolutionClues()

  /**
   * Button 'Show Candidates', 'Hide Candidates' EXECUTION state
   */
  toggleCandidates() {
    this.candidatesShowing = !this.candidatesShowing;
    this.allCandidatesVisible();
  }

  // button '1' .. '9' EXECUTION state
  candidateVisible(kand: number) {
    for (let k = 1; k <= 9; k++) {
      this.candidatesVisible[k] = false;
    }
    this.candidatesVisible[kand] = true;
  }

  // button 'All' EXECUTION state
  allCandidatesVisible() {
    for (let k = 1; k <= 9; k++) {
      this.candidatesVisible[k] = true;
    }
  }
  
  // true if hintState ACTIVE or READY
  hintButton() {
    return this.hintState != HintStates.NO_HINT; 
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
  handleHintClick() {
    switch (this.hintState) {
    case HintStates.READY:
      this.findHint();
      break;
    case HintStates.ACTIVE:
      this.applyHint();
    }
  }
  
  hintButtonLabel() {
    switch (this.hintState) {
    case HintStates.READY:
      return 'Get Hint';
    case HintStates.ACTIVE:
      return 'Apply Hint';
    }
    return 
  }
  
  autoSolveButton() {
    return this.autoSolveState != AutoSolveStates.NO_HINT
        && this.hintState != HintStates.NO_HINT; 
  }
  
  handleAutoSolveClick() {
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

  autoSolveLoop() {
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
              this.autoSolveMessage = 'Not available';
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
          this.autoSolveMessage = 'Not available';
        } // switch

        if (this.autoSolveState === AutoSolveStates.RUNNING) {
          this.autoSolveLoop();    // recursive; continue
        }
    }, this.AUTO_SOLVE_DELAY);
  } // autoSolveLoop()

  autoSolveButtonLabel() {
    return this.autoSolveState === AutoSolveStates.RUNNING ? 'Stop' : 'Start';
  }
  
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
    let lastCell = lastAction.cell;
    let rc = Common.cellRC(lastCell);
    this.setSelectedCell(rc.r, rc.c);
    this.refreshActionLog();
  } // undoLastAction()
  
  /**
   * button 'Restart Current Puzzle' EXECUTION, SOLVED states
   * TODO wipe non-locked cells (rollback?), refresh cands,
   */
  restartCurrentPuzzle() {
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
  startNewPuzzle() {
    this.stopUserTimer();
    this.initializeUserInterface();
    this.sudokuService.initializeModel();
    this.playState = PlayStates.NEW;
  }

  printGrid() {
    this.router.navigate(['/print']);
  }
  
  private loadTestPuzzle(initialValues: string) : void {
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

    // TODO embed this in handleCellClick
  setGuessCell_(event: any, br: number, bc: number, cr: number, cc: number) {
    let r = Common.viewToModelRow(br, cr);
    let c = Common.viewToModelCol(bc, cc);
    
    console.log('setGuessCell_() r,c:' + r + ',' + c);

    event.preventDefault();
  }

  // -----------------------------------------------------------------------
  // private methods
  // -----------------------------------------------------------------------

  /**
   * The for choosing a value is 3x3. Row and column coords are 0,1,2.
   * Row/column values are 1..9. Row 0 has values 1,2,3. Row 2 has 7,8,9.
   */
  private valueCoordsToValue(r: number, c: number) : number {
    return (r * 3) + c + 1;
  }


  private initializeHintStates() {
    this.hintState = HintStates.READY;
    this.hintMessage = '';
    this.autoSolveState = AutoSolveStates.READY;
    this.autoSolveMessage = '';
  }

  private setSelectedCell(r: number, c: number) {
    if (!this.sudokuService.isCellInvalid_(r, c)) {
      this.selectedCell.r = r;
      this.selectedCell.c = c;
      // this.focus('grid');
    } else {
      this.unselectCell();
    }
  }
    
  private isSelectedCell(r: number, c: number) : boolean {
    return this.selectedCell.r === r && this.selectedCell.c === c;
  }
  
  private isCellLocked(r: number, c: number) : boolean {
    return this.sudokuService.isCellLocked_(r, c);
  }
  
  // ng-dblclick candidate in grid EXECUTION state
  private removeCandidate(r: number, c: number, k: number) {
    this.initializeHintStates();
    if (this.candidatesShowing) {
      this.sudokuService.removeCandidate_(r, c, k);
    }
    this.refreshActionLog();
  }
  
  private findHint() : void {
    this.hint = this.hintService.getHint(Difficulty.HARDEST);
    if (this.hint) {
      this.hintState = HintStates.ACTIVE
      this.hintsViewed++;
      this.hintMessage = this.hint.toString();
      this.setSelectedCell(Common.rowNr(this.hint.getCell()), 
          Common.colNr(this.hint.getCell()));
    } else {
      this.hintState = HintStates.NO_HINT;
      this.hintMessage = 'No hint available';
    }
  }
    
  // apply hint toward solution
  private applyHint() {
    this.hintMessage = '';
    this.hintState = HintStates.READY
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
    
  // can be set by key press, apply hint
  private setCellValue(r: number, c: number, v: number) {
    this.sudokuService.setValue_(r, c, v);
    this.valuesComplete[v] = this.sudokuService.isValueComplete(v);
    if (this.sudokuService.isSolved()) {
      this.handlePuzzleComplete();
    }
      this.refreshActionLog();
  }
  
  private removeCellValue(r: number, c: number) {
    let oldValue = this.sudokuService.getValue_(r, c);
    if (oldValue >= 1) {
      this.sudokuService.removeValue_(r, c);
      this.valuesComplete[oldValue] = this.sudokuService.isValueComplete(oldValue);
      this.refreshActionLog();
    }
  }
  
  private unselectCell() {
    this.selectedCell.r = 0;
    this.selectedCell.c = 0;
  }
    
  private handlePuzzleComplete() {
    this.refreshActionLog();
    this.stopUserTimer();
    this.playState = PlayStates.SOLVED;
  }
    
  private refreshActionLog() {
    this.actionLog = this.sudokuService.getActionLogAsString();
  }

  private startUserTimer() : void {
    let elapsedSeconds = 0;
    let timerObservable = Observable.timer(1, 1000);
    this.timerSubscription = timerObservable.subscribe(
        t => {
          elapsedSeconds++;
          this.elapsedTime = Common.toElapsedTimeString(elapsedSeconds);
        });
  }

  private stopUserTimer() : void {
    this.timerSubscription.unsubscribe();
  }

  private initializeUserInterface() {
    this.sudokuService.initializeModel();
    this.actualDifficulty = undefined;
    this.selectedCell = {r: 0, c: 0};

    this.candidatesShowing = false;       // master switch
    for (let v = 1; v <= 9; v++) {
      this.candidatesVisible[v] = true;
      this.valuesComplete[v] = false;
    }

    this.passCount = undefined;
    this.playState = PlayStates.NEW;
    // this.generating = false;
    this.hint = undefined;
    this.initializeHintStates();
    this.actionLog = '';
    this.desiredDifficulty = this.DEFAULT_DIFFICULTY;

    this.actionLog = '';
    this.hintsViewed = 0;
    this.hintsApplied = 0;
  } // initializeUserInterface()
  
} // class PlayComponent



