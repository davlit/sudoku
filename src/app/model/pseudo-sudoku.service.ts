import { 
         Common,
         CELLS,
         VALUES,
         CANDIDATES,
         ROWS
       } from  '../common/common';
import { SudokuGrid } from './sudoku.grid';

/**
 * This service looks ahead after any value has been set to see if the sudoku
 * can be solved with only naked singles. It does this by taking a copy or 
 * snapshot of the current grid, a "pseudo" grid, and attempts to solve the 
 * sudoko just using naked singles. By using this pseudo grid, the state of 
 * the sudoku being played remains intact.
 */
export class PseudoSudokuService {

  private pseudoGrid: SudokuGrid = undefined;

  /**
   * Create this service by providing a copy of the current sudoku state.
   */
  constructor(pseudoGrid) {
    this.pseudoGrid = pseudoGrid;
  } // constructor()

  /**
   * This single public method determines if the sudoku at its current state
   * can be solved by only using naked singes.
   */
  public hasNakedSinglesSolution() : boolean {
    let nextNakedSingle : {ci: number, value: number} = this.findNextNakedSingle();
    while (nextNakedSingle != undefined) {

      // console.info('Next naked single found');
      
      this.setValue(nextNakedSingle.ci, nextNakedSingle.value);
      if (this.isSolved()) {

        // console.info('Naked single solution found');
      
        return true;  // the sudoku can be solved with only naked singles
      }
      nextNakedSingle = this.findNextNakedSingle();
    }

    // console.info('No naked single solution');
      
    return false; // no naked singles solution is possible.
  } // hasNakedSinglesSolution() {

  /**
   * Using a copy of the current grid state, look for a cell with a naked 
   * single. If found, return the cell and the naked single value, otherwise
   * return null. 
   */
  private findNextNakedSingle() : {ci: number, value: number} {
    for (let c of CELLS) {
      if (this.pseudoGrid.cells[c].hasValue()) {
        continue;
      }
      let single = this.findNakedSingleInCell(c);
      if (single != null) {
        return {ci: c, value: single};
      }
    } // for next cell
    return null;
  } // findNextNakedSingle()

  /**
   * Using a copy of the current grid state and a given cell index, look for
   * a naked single in the cell. If found, return the naked single value,
   * otherwise return null;
   * 
   * @param ci the cell index
   */
  private findNakedSingleInCell(ci: number) : number {
    let kandidates: number[] = [];
    for (let k of CANDIDATES) {
      if (this.pseudoGrid.cells[ci].candidates[k]) {
        kandidates.push(k);
        if (kandidates.length > 1) {
          return null; // no naked single in cell
        }
      }
    } // for next candidate
    if (kandidates.length != 1) {
      return null;
    }
    return kandidates[0];
  } // findNextNakedSingle()

  /**
   * Using a copy of the current grid state and a given cell index, set value 
   * of a cell to the given value. In the specified cell, all 
   * candidates are removed. The candidate, equal to the value being set, is 
   * removed from every cell that shares the row, column, and box of the given
   * cell.
   * 
   * The cell should contain only a naked single. 
   * 
   * @param ci the cell index
   * @param value the value to be set
   */ 
  private setValue(ci: number, value: number) : void {
    let cell = this.pseudoGrid.cells[ci];

    // set new value, remove candidates from cell
    cell.value = value;   
    this.removeAllCellCandidates(ci);

    // increment occurrences in cell's groups (row, column, box)
    this.incrementGroupOccurrences(ci, value);

    // remove candidate (i.e. new value) from related cells (rc)
    for (let rc of Common.getRelatedCells(ci)) {
      if (!this.hasValue(rc)) {
        this.removeCandidate(rc, value);
      }
    }
  } // setValue()

  /**
   * Remove all candidates from a cell.
   * 
   * @param ci cell index
   */
  private removeAllCellCandidates(ci: number) : void {
    this.pseudoGrid.cells[ci].unsetAllCandidates();
  } // removeAllCellCandidates()

  /**
   * Increment the occurrences of a vlues in a cell's group (row, column, and
   * box).
   * 
   * @param ci cell index
   * @param value cell value
   */
  private incrementGroupOccurrences(ci: number, value: number) : void {
    let cell = this.pseudoGrid.cells[ci];
    this.pseudoGrid.rows[cell.rowIndex].vOccurrences[value]++;
    this.pseudoGrid.cols[cell.colIndex].vOccurrences[value]++;
    this.pseudoGrid.boxs[cell.boxIndex].vOccurrences[value]++;
  }

  /**
   * Returns true if cell has a value.
   * 
   * @param ci cell index
   */
  private hasValue(ci: number) : boolean {
    return this.pseudoGrid.cells[ci].value > 0; 
  } // hasValue()

  /**
   * Remove given candidate from given cell.
   * 
   * @param ci cell index
   * @param k candidate to be removed
   */
  private removeCandidate(ci: number, k: number) : void {
    this.pseudoGrid.cells[ci].candidates[k] = false;
  } // removeCandidate()

  /**
   * Determines if sudoku is fully solved. If every row's every value is used
   * once and only once, the sudoku is completely solved.
   */
  private isSolved() : boolean {
    for (let r of ROWS) {
      for (let v of VALUES) {
        if (this.pseudoGrid.rows[r].vOccurrences[v] != 1) {
          return false;
        }
      }
    }
    return true;
  } // isSolved()

} // class PseudoSudokuService
