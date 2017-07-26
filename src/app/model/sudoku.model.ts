import { Cell } from './cell';
import { Group } from './group';
import { Common,
         CELLS,
        //  VALUES,
        //  CANDIDATES,
         GROUPS,
        //  ROWS,
        //  COLS,
        //  BOXS,
         ROW_CELLS,
         COL_CELLS,
         BOX_CELLS } from  '../common/common';

export class SudokuModel {
  cells: Cell[]
  rows: Group[];
  cols: Group[];
  boxs: Group[];
  
  constructor() {
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

  public isCellLocked(c: number) : boolean {
    // return this.cells[c].isLocked();
    return this.cells[c].locked;
  }
} // class SudokuModel

