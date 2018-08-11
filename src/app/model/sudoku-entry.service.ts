import { Puzzle } from './puzzle';
import { SudokuModel } from './sudoku.model';

export class SudokuEntryService {

  private currentSudoku: Puzzle = undefined;
  private sudokuModel: SudokuModel = undefined;

  /**
   * Create and initialize the data model.
   */
  constructor() {
    this.sudokuModel = new SudokuModel();
    // this.initializeModel();
  } // constructor()

  /**
   * Initialize the entire sudoku.
   */
  // public initializeModel() : void {
  //   for (let c of CELLS) {
  //     this.initializeCell(this.sudokuModel.cells[c]);
  //   }
  //   for (let g of GROUPS) {
  //     this.initializeGroup(this.sudokuModel.rows[g]);
  //     this.initializeGroup(this.sudokuModel.cols[g]);
  //     this.initializeGroup(this.sudokuModel.boxs[g]);
  //   }
  // } // initializeModel()

} // sudokuEntryService