import { Sudoku } from            './sudoku';
import { NakedType } from         './naked.type';
import { Action,
         ActionType,
         GuessValueAction,
         RemoveCandidateAction,
         RemoveCandidatesAction,
         RestoreCandidateAction,
         SetValueAction } from    '../action/action';
import { Common,
         CELLS,
         VALUES,
         CANDIDATES,
         GROUPS,
         ROWS,
         COLS,
         BOXS,
         ROW_CELLS,
         COL_CELLS,
         BOX_CELLS } from         '../common/common';
import { CellCandidate } from     '../common/cell.candidate';
import { Difficulty,
         DIFFICULTY_LABELS } from '../model/difficulty';
import { Hint,
         ValueHint,
         CandidatesHint } from    '../hint/hint';
import { HintService } from       '../hint/hint.service';
import { HintType } from          '../hint/hint.type';
import { SudokuGrid } from        './sudoku.grid';
import { Cell } from              './cell';
import { Group } from             './group';

/**
 * This service maintains the sudoku's state: essentially cell values and
 * cell candidates. This class's public methods provide the only access to
 * this state.
 * 
 * This application runs (1) a user interface in the foreground (browser)
 * and (2) a web worker (background) that creates and caches sudokus. 
 * Therefore there are two instances of this SudokuService: one to provide
 * the user interactive experience in solving a sudoku, and another instance
 * to build sudokus in the background to be instantly available when the user
 * wants a new sudoku.
 */
export class SudokuService {

  // private currentSudoku: Sudoku = undefined;
  private sudokuGrid: SudokuGrid = undefined;
  private hintService: HintService = undefined;
  // ----- enter properties -----
  maxDifficulty: Difficulty;


  /**
   * Create and initialize the data grid.
   */
  constructor() {
    this.sudokuGrid = new SudokuGrid();
    this.hintService = new HintService(this);
    this.initializeGrid();
  } // constructor()

  /**
   * Initialize the entire sudoku.
   */
  public initializeGrid() : void {
    for (let c of CELLS) {
      this.initializeCell(this.sudokuGrid.cells[c]);
    }
    for (let g of GROUPS) {
      this.initializeGroup(this.sudokuGrid.rows[g]);
      this.initializeGroup(this.sudokuGrid.cols[g]);
      this.initializeGroup(this.sudokuGrid.boxs[g]);
    }
  } // initializeGrid()

  /**
   * TODO not sure this is needed. Used by Print sudoku.
   */
  // public getCurrentSudoku() : Sudoku {
  //   return this.currentSudoku;
  // } // getCurrentSudoku()

  /**
   * Sets up a sudoku with a set of given values. The given values
   * will be an array of 81 numbers each 0..9. A zero indicates a blank or
   * empty cell. E.g.
   * [0,0,2,4,0,0,1,0,3,9,1,0,3,0,0,0,6,0,0, ...]
   */
  public loadProvidedSudoku(values: number[]) : Sudoku {
    let sudoku = new Sudoku();
    sudoku.givens = values;
    this.initializeGrid();
    for (let ci of CELLS) {
      let cell = this.sudokuGrid.cells[ci];   // cell at [c] in cells array
      let value = values[ci];        // givenValue at [c] in givenValues array
      if (value === 0) {
        continue;
      }

      // set cell, update row/col/box
      this.setValue(ci, value);
    } // for

    return sudoku;
  } // loadProvidedSudoku()

  /**
   * Returns the curren state of the grid.
   */
  // public takeGridSnapshot() : SudokuGrid {
  //   return this.sudokuGrid.copyGrid();
  // } // takeGridSnapshot()

  /**
   * Replace the current grid state with another. This is used in conjucntion
   * with copy grid which delivers a snapshot of the grid state. This method
   * replaces the current grid which could be an earlier snapshot.
   * 
   * @param newGrid
   */
  // public restoreGrid(snapshotGrid: SudokuGrid) {
  //   this.sudokuGrid.restoreGrid(snapshotGrid);
  // }

  /**
   * Sets a given value in every cell and set all groups to complete.
   * Used by CreationService to set a full grid of values.
   */
  public setAllValues(values: number[]) : void {
    for (let ci of CELLS) {    // ci is 0..80
      let cell = this.sudokuGrid.cells[ci];
      cell.value = values[ci];
      this.removeAllCellCandidates(ci);
    }
    for (let g of GROUPS) {
      for (let v of VALUES) {
        this.sudokuGrid.rows[g].vOccurrences[v] = 1;
        this.sudokuGrid.cols[g].vOccurrences[v] = 1;
        this.sudokuGrid.boxs[g].vOccurrences[v] = 1;
      }
    }
  } // setAllValues()

  /**
   * Return givenValue of cell. Zero means no givenValue;
   */
  public getValue(ci: number) : number {
    return this.sudokuGrid.cells[ci].value;
  } // getValue()

  /**
   * 
   * @param sudoku 
   */
  public transferCellValuesToGivens(sudoku) : void {
    let givens: number[] = [];
    for (let ci of CELLS) {
      givens.push(this.sudokuGrid.cells[ci].value);
    }
    sudoku.givens = givens;
    sudoku.completedSudoku = givens;
  }

  /**
   * Sets value of a cell to the given value. In the specified cell, all 
   * candidates are removed. The candidate, equal to the value being set, is 
   * removed from every cell that shares the row, column, and box of the given
   * cell.
   * 
   * If the cell already has the new value, no action will be 
   * taken. If the cell has some other value, that old value will be removed
   * first. 
   * 
   * @param ci the cell index
   * @param newValue 
   */
  public setValue(ci: number, newValue: number) : void {
    let cell = this.sudokuGrid.cells[ci];

    // if cell has value, remove it first
    if (cell.hasValue()) {
      if (cell.value == newValue) {
        return;	// same as existing givenValue, nothing to do
      }
      this.removeValue(ci);
    }

    // set new value, remove candidates from cell
    cell.value = newValue;   
    this.removeAllCellCandidates(ci);

    // increment occurrences in cell's groups (row, column, box)
    this.incrementGroupOccurrences(ci, newValue);

    // remove candidate (i.e. new value) from related cells (rc)
    for (let rc of Common.getRelatedCells(ci)) {
      if (!this.hasValue(rc)) {
        this.removeCandidate(rc, newValue);
      }
    }
  } // setValue()

  /**
   * Removes the givenValue of the specified cell to make it empty. This 
   * function also reestablishes appropriate candidates in the cell and
   * reestablishes the candidate, equal to the value being removed, in
   * other cells in the same row, column, and box of the given cell. For
   * every cell the candidate is only restored if there is no conflict
   * with its row, column, and box.
   */
  public removeValue(ci: number) : void {
    let cell = this.sudokuGrid.cells[ci];
    
    if (!cell.hasValue()) {
      return;			// nothing to remove
    }

    let oldValue = cell.value;

    cell.value = 0;   // remove value
    
    // decrement occurrences in cell's groups (row, column, box)
    this.decrementGroupOccurrences(ci, oldValue);

    let row = this.sudokuGrid.rows[cell.rowIndex];
    let col = this.sudokuGrid.cols[cell.colIndex];
    let box = this.sudokuGrid.boxs[cell.boxIndex];

    // add applicable candidates to cell
    for (let v of VALUES) {
      if (   row.vOccurrences[oldValue] > 0
          || col.vOccurrences[oldValue] > 0
          || box.vOccurrences[oldValue] > 0) {
        continue;
      }
      this.addCandidate(ci, v);
    }

    // add candidate (this cell's old givenValue) to related cells
    for (let rc of Common.getRelatedCells(ci)) {
      let relatedCell = this.sudokuGrid.cells[rc];
      let rcRow = this.sudokuGrid.rows[relatedCell.rowIndex];
      let rcCol = this.sudokuGrid.cols[relatedCell.colIndex];
      let rcBox = this.sudokuGrid.boxs[relatedCell.boxIndex];
      if (   rcRow.vOccurrences[oldValue] > 0
          || rcCol.vOccurrences[oldValue] > 0
          || rcBox.vOccurrences[oldValue] > 0) {
        continue;
      }
      this.addCandidate(rc, oldValue);
    }
  } // removeValue()

  /**
   * TODO update this documentation
   * 
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
  public removeCandidate(c: number, k: number) : void {
    this.sudokuGrid.cells[c].candidates[k] = false;
  } // removeCandidate()

  // TODO future use?
  // public removeCandidates(cellCandidates: CellCandidate[], hint: Rem) : void {
  //   for (let cellCandidate of cellCandidates) {
  //     this.sudokuGrid.cells[cellCandidate.cell].candidates[cellCandidate.candidate] = false;
  //   }
  //   this.actionLog.addEntry(
  //     new RemoveCandidatesAction(ActionType.REMOVE_CANDIDATES, cellCandidates, )
  //   )
  // } // removeCandidates()

  public restoreCandidate(c: number, k: number) : void {
    if (this.isPossibleCandidate(c, k)) {
      this.sudokuGrid.cells[c].candidates[k] = true;
    }
  }

  /**
   * TODO update this documentation
   * 
   * Undoes the last logged action. If the last action resulted from a complex
   * hint that caused multiple candidate removes e.g. nakedPairs, etc.
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
      case ActionType.SET_VALUE:
      case ActionType.GUESS_VALUE:
        this.removeValue(action.cell);
        break;
      case ActionType.REMOVE_CANDIDATE:
        this.addCandidate(action.cell, (<RemoveCandidateAction> action).candidate);
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
  } // findNakedCandidates()
    
  /**
   * Determines if sudoku is fully solved. If every row's every value is used
   * once and only once, the sudoku is completely solved.
   */
  public isSolved() : boolean {
    for (let r of ROWS) {
      for (let v of VALUES) {
        if (this.sudokuGrid.rows[r].vOccurrences[v] != 1) {
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
    return this.sudokuGrid.cells[c].value > 0; 
  } // hasValue()

  /**
   * Get the row object from the row index.
   */
  public getRow(r: number) : Group {
    return this.sudokuGrid.rows[r];
  } // getRow()

  /**
   * Get the column object from the column index.
   */
  public getCol(c: number) : Group {
    return this.sudokuGrid.cols[c];
  } // getCol()

  /**
   * Get the box object from the box index.
   */
  public getBox(b: number) : Group {
    return this.sudokuGrid.boxs[b];
  } // getBox()

  /**
   * Returns true if any cell in a group has a specific value;
   */
  public containsValue(group: Group, v: number) : boolean {
    return group.vOccurrences[v] === 1;
  } // groupContainsValue()

  /**
   * Return the number of cells in the group that do not have a value. That is 
   * cells that are open or not filled. A candidate cell cannot have a value.
   * cannot have any candidates. Within a group (row, column, or box),
   * value cells + candidate cells = 9.
   */
  public candidateCellsCount(group: Group) : number {
    let count = 0;
    for (let v of VALUES) {
      if (group.vOccurrences[v] === 0) {
        count++;
      }
    }
    return count;
  } // candidateCellsCount()

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
        if (this.sudokuGrid.cells[c].candidates[k]) {
          kCounts[k]++;
        }
      } // for cells in group
    } // for candidates
    return kCounts;
  } // getCandidateCounts()
      
  /**
   * 
   */
  public isImpossible() : boolean {
    return !this.isSolutionPossible();
  } // isImpossible()

  /**
   * 
   */
  public getCandidates(c: number) : number[] {
    if (this.hasValue(c)) {
      return [];
    }
    let candidates: number[] = [];
    for (let k of CANDIDATES) {
      if (this.sudokuGrid.cells[c].candidates[k]) {
        candidates.push(k);
      }
    }
    return candidates;
  } // getCandidates()
        
  /**
   * Returns true if cell contains the candidate.
   */
  public isCandidate(c: number, k: number) : boolean {
    return this.sudokuGrid.cells[c].candidates[k];
  } // isCandidate()
  
  /**
   * A cell is valid if its row, column, and box are all valid. In other words,
   * no value occurs more than once in the cell's row, column, and box.
   */
  public isCellValid(c: number) : boolean {
try {
    if (   this.isGroupValid(this.sudokuGrid.rows[Common.rowIdx(c)])
        && this.isGroupValid(this.sudokuGrid.cols[Common.colIdx(c)]) 
        && this.isGroupValid(this.sudokuGrid.boxs[Common.boxIdx(c)])) {
      return true;
    }
} catch (e) {
  console.info('c: ' + c);
  console.info('r: ' + Common.rowIdx(c));
  console.info('c: ' + Common.colIdx(c));
  console.info('b: ' + Common.boxIdx(c));
}
    return false;
  }

  /**
   * Determines if the given givenValue appears 9 times.
   */
  public isValueComplete(v: number) : boolean {
    let valueCount = 0;
    for (let c of CELLS) {
      if (this.sudokuGrid.cells[c].value === v) {
        valueCount++;
      }
    }
    return valueCount === 9;
  } // isValueComplete()

  /**
   * Return the number of candidates in a cell.
   */
  public getNumberOfCandidates(c: number) : number {
    let count = 0;
    let cell = this.sudokuGrid.cells[c];
    for (let k of CANDIDATES) {
      if (cell.candidates[k]) {
        count++;
      }
    }
    return count;
  } // getNumberOfCandidates()

  /**
   * Represent the values of the sudoku as an array of 81 values.
   */
  public cellsToValuesArray() : number[] {
    let v: number[] = [];
    for (let c of CELLS) {
      v.push(this.sudokuGrid.cells[c].value);
    }
    return v;
  } // cellsToValuesArray()

  /**
   * Refresh all cells candidates by first clearing all then seting 
   * appropriate candidates in all cells that do not have a value.
   */
  public refreshAllCandidates() : void {
    for (let c of CELLS) {
      this.removeAllCellCandidates(c);
      if (!this.hasValue(c)) {
        // this.removeAllCellCandidates(c);
        this.setCellCandidates(c);
      }
    }
  } // refreshCandidates()

  /**
   * Add given candidate to given cell.
   * - cannot add candidate to cell that has a givenValue
   * - cannot add candidate if a related cell has that givenValue
   * 
   * Called by:
   * - undoAction() - undo REMOVE_CANDIDATE
   * - removeValue()
   */
  public addCandidate(c: number, k: number) : void {

    // do not add if givenValue exists
    if (this.sudokuGrid.cells[c].value > 0) {
      // console.error('Cannot add candidate to cell with a givenValue.');
      return;
    }

    // do not add if any related cell has that givenValue
    for (let rc of Common.getRelatedCells(c)) {
      if (this.sudokuGrid.cells[rc].value === k) {
        return;
      }
    }

    // add candidate
    this.sudokuGrid.cells[c].candidates[k] = true;
  } // addCandidate()

  /**
   * 
   */
  public blankoutSolution(givens: number[]) : void {
    for (let ci of CELLS) {
      if (givens[ci] == 0) {
        this.removeValue(ci);
      }
    }
  } // blankoutSolution()

  /**
   * Returns a copy of the current grid state.
   */
  public copyGrid() : SudokuGrid {
    return this.sudokuGrid.copyGrid();
  }

  /**
   * Represent the givenValues of the sudoku as a grid string.
   */
  public toGridString() : string {
    return this.arrayToGridString(this.cellValuesToArray());
  } // toGridString()

  /**
   * Represent the values of the sudoku as an array of 81 values.
   */
  public cellValuesToArray() : number[] {
    let cellValues: number[] = [];
    for (let ci of CELLS) {
      cellValues.push( this.sudokuGrid.cells[ci].value);
    }
    return cellValues;
  } // cellsValuesToArray()

  /**
   * Represent the givenValues of the sudoku as a single line string.
   */
  public toLineString() : string {
    let s = '';
    let v: number;
    for (let c of CELLS) {
      v = this.sudokuGrid.cells[c].value;
      s += (v === 0 ? '.' : v);
    }
    return s;
  } // toLineString()

  /**
   * Checks if sudoku givens are 180deg rotationally symetric.
   */
  public isSymetric() : boolean {
    for (let ci = 0; ci < 40; ci++) {
      if (this.hasValue(ci) && !this.hasValue(80 - ci)) {
        return false;
      }
    }
    return true;
  }
  
  /**
   * Part of solving sudoku by brute force. see Solve()
   */
  private applyAvailableHints() {
    let hint: Hint = undefined;
    let difficultyRating = undefined;

    console.info(this.toLineString());

    // get hint of any difficulty; loop until no hints
    while (hint = this.hintService.getHint(Difficulty.HARDEST)) {

      difficultyRating = hint.getDifficultyRating();

      // this will ratchet up with sucsessive interations
      if (!this.maxDifficulty || difficultyRating > this.maxDifficulty) {
        this.maxDifficulty = difficultyRating;
      }

      switch (hint.type) {

        // value hints (easy)
        case HintType.NAKED_SINGLE:
        case HintType.HIDDEN_SINGLE_ROW:
        case HintType.HIDDEN_SINGLE_COL:
        case HintType.HIDDEN_SINGLE_BOX:
          let vHint: ValueHint = <ValueHint> hint;
          this.setValue(vHint.cell, vHint.value);
          break;

        // candidate hints (medium/hard)
        default:
          let kHint: CandidatesHint = <CandidatesHint> hint;
          let removes = kHint.removes;
          for (let remove of removes) {
            this.removeCandidate(remove.cell, remove.candidate);
          }
      } // switch

      // console.info(this.toLineString());

    } // while
  } // applyAvailableHints()

  /**
   * See https://www.youtube.com/watch?v=y1ahOBeyM40 (3min in)
   * 
   * If true returned -> sudoku is solved (is it unique???)
   * If false returned -> there is no solution
   */
  public solve() : boolean {

    console.info('Using hints');

    // fill in "obvious" cells until we run out; if the sudoku is solved,
    // return true
    this.applyAvailableHints();
    if (this.isSolved()) {
      return true;
    }

    // see if there is a contradiction
    if (this.isImpossible()) {
      console.info('*** Contradiction ***');
      return false;
    }

    // being here means we need to guess; did not completely solve, but not
    // impossible at this point

    // take snapshot of grid state before guessing
    let snapshot: SudokuGrid = this.sudokuGrid.copyGrid();

    console.info('Guessing -- Snapshot taken:\n' + this.toLineString());
    
    this.maxDifficulty = Difficulty.HARDEST;

    // find first empty cell (has candidates)
    let emptyCell: number = undefined;
    for (let ci of CELLS) {
      if (this.getValue(ci) == 0) {
        emptyCell = ci;
        break;
      }
    }

    // get all candidates for the emoty cell
    let candidates: number[] = this.getCandidates(emptyCell);

    // loop through candidates, try each
    for (let candidate of candidates) {

      console.info('Guess cell: ' + emptyCell + ', candidate: ' + candidate);

      this.setValue(emptyCell, candidate);

      // recursively call this function; if the lower call retruns true,
      // return true from this level
      if (this.solve() == true) {     // recursive call
        return true;                  // this unwinds the recursion

      // lower level returned false -> contridiction/impossible
      } else {

        // restore SNAPSHOT here?
        // this.restoreGrid(snapshot);
        this.sudokuGrid.restoreGrid(snapshot);

        console.info('Snapshot restored:\n' + this.toLineString());
        // undo all changes: 
        // remove cell value, 
        // restore cell candidates
        // restore affiliated cells' candidates
        //this.........
      }
    } // for - fall out of this loop when all candidates have been tried
  
    return false;
  } // solve()
  

  // -------------------------------------------------------------------------
  // private methods
  // -------------------------------------------------------------------------

  /**
   * Initialize a cell.
   */
  private initializeCell(cell: Cell) : void {
    cell.value = 0;
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
   * Set the appropriate candidates in a cell based on values that exist in
   * the cell's row, column, and box. 
   */
  private setCellCandidates(c: number) : void {

    // skip cells that have value
    if (this.hasValue(c)) {
      return;
    }

    let cell = this.sudokuGrid.cells[c];
    let row = this.sudokuGrid.rows[cell.rowIndex];
    let col = this.sudokuGrid.cols[cell.colIndex];
    let box = this.sudokuGrid.boxs[cell.boxIndex];
    
    // add candidates to cell when value
    for (let v of VALUES) {
      if (   row.vOccurrences[v] == 0
          && col.vOccurrences[v] == 0
          && box.vOccurrences[v] == 0) {
      this.addCandidate(c, v);
      }
    }
  } // setCellCandidates()

  /**
   * Increment the occurrences of a vlues in a cell's group (row, column, and
   * box).
   * 
   * @param ci cell index
   * @param value cell value
   */
  private incrementGroupOccurrences(ci: number, value: number) : void {
    let cell = this.sudokuGrid.cells[ci];
    this.sudokuGrid.rows[cell.rowIndex].vOccurrences[value]++;
    this.sudokuGrid.cols[cell.colIndex].vOccurrences[value]++;
    this.sudokuGrid.boxs[cell.boxIndex].vOccurrences[value]++;
  }

  /**
   * Decrement the occurrences of a vlues in a cell's group (row, column, and
   * box).
   * 
   * @param ci cell index
   * @param value cell value
   */
  private decrementGroupOccurrences(ci: number, value: number) : void {
    let cell = this.sudokuGrid.cells[ci];
    this.sudokuGrid.rows[cell.rowIndex].vOccurrences[value]--;
    this.sudokuGrid.cols[cell.colIndex].vOccurrences[value]--;
    this.sudokuGrid.boxs[cell.boxIndex].vOccurrences[value]--;
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
  } // isCellStateValid()

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
      if (!this.isGroupValid(this.sudokuGrid.rows[g])) {
        return false;
      }
      if (!this.isGroupValid(this.sudokuGrid.cols[g])) {
        return false;
      }
      if (!this.isGroupValid(this.sudokuGrid.boxs[g])) {
        return false;
      }
    }
    return true;
  }

  /**
   * Returns true if cell has a value;
   */
  private groupContainsValue(group: Group, v: number) : boolean {
    return group.vOccurrences[v] === 1;
  } // groupContainsValue()

  /**
   * Return the number of cells in the group that have a value. That is cells
   * that are closed or filled. It can be closed by having a given value or 
   * by having a value assigned in solving the sudoku. A value cell cannot 
   * have any candidates. Within a group (row, column, or box),
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
   * Returns true if cell has one or more candidates.
   */
  private hasCandidates(c: number) : boolean {
    for (let k of CANDIDATES) {
      if (this.sudokuGrid.cells[c].candidates[k]) {
        return true;
      }
    }
    return false;
  } // hasCandidates()

  /**
   * Represent the state of a row as a string.
   */
  private rowToString(r: number) : string {
    let s = 'Row' + ' ' + (r + 1) + ': ';
    return s += this.groupToString(this.sudokuGrid.rows[r]);
  } // rowToString()

  /**
   * Represent the state of a column as a string.
   */
  private colToString(c: number) : string {
    let s = 'Col' + ' ' + (c + 1) + ': ';
    return s += this.groupToString(this.sudokuGrid.cols[c]);
  } // colToString()

  /**
   * Represent the state of a box as a string.
   */
  private boxToString(b: number) : string {
    let s = 'Box' + ' ' + (b + 1) + ': ';
    return s += this.groupToString(this.sudokuGrid.boxs[b]);
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
    let cell = this.sudokuGrid.cells[c];
    let s = '' + Common.toRowColString(c) + ': '; 
    s += 'v:' + (cell.value != 0 ? cell.value : '.');
    s += ' k:';
    for (let k of CANDIDATES) {
      s += (cell.candidates[k]) ? k : '.';
    }
    s += ' r' + (cell.rowIndex + 1) + ' c' + (cell.colIndex + 1) + ' b' + (cell.boxIndex + 1);
    // if (!this.isValid()) {
    //   s += ' * * *';
    // }
    return s;
  }

  /**
   * Represent the state of the sudoku as a string.
   */
  public toString() : string {
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
    return this.getCandidates(Common.urcToCellIdx(r, c));
  }
        
  /**
   * 
   */
  private isPossibleCandidate(c: number, k: number) : boolean {
    for (let rc of Common.getRelatedCells(c)) {
      if (this.sudokuGrid.cells[rc].value === k) {
        return false;
      }
    }
    return true;
  } // isPossilbleCandidate()

  /**
   * Make every value a candidate because all initialized cells do not have
   * values.
   */
  private setAllCellCandidates(c: number) : void {
    this.sudokuGrid.cells[c].setAllCandidates();
  } // setAllCellCandidates()

  /**
   * Remove all candidates from a cell.
   */
  private removeAllCellCandidates(c: number) : void {
    this.sudokuGrid.cells[c].removeAllCandidates();
  } // removeAllCellCandidates()

  private sudokuValuesToString() : string {
    let s: string = '';
    for (let ci of CELLS) {
      s += this.sudokuGrid.cells[ci].value;
    }
    return s;
  }

  /**
   * Represent a givenValues array of sudoku cell givenValues as a grid string.
   */
  private arrayToGridString(valuesArray: number[]) : string {
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

} // class SudokuService
