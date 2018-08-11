import { Cell } from './cell';
import { Group } from './group';
import { Common,
         CELLS,
         GROUPS,
         ROW_CELLS,
         COL_CELLS,
         BOX_CELLS } from  '../common/common';

export class SudokuModel {
  private _cells: Cell[]
  private _rows: Group[];
  private _cols: Group[];
  private _boxs: Group[];
  
  constructor() {
    this._cells = new Array(81);
    this._rows = new Array(9);
    this._cols = new Array(9);
    this._boxs = new Array(9);

    for (let g of GROUPS) {
      this._rows[g] = new Group(ROW_CELLS[g]);
      this._cols[g] = new Group(COL_CELLS[g]);
      this._boxs[g] = new Group(BOX_CELLS[g]);
    }

    for (let c of CELLS) {
      this._cells[c] = new Cell(
          Common.rowIdx(c), Common.colIdx(c), Common.boxIdx(c));
    }
  } // constructor

  // public initializeModel() : void {
  public initialize() : void {
    for (let ci of CELLS) {
      // this.initializeCell(this.sudokuModel.cells[c]);
      this._cells[ci].initialize();
    }
    for (let g of GROUPS) {
      this._rows[g].initialize();
      this._cols[g].initialize();
      this._boxs[g].initialize();
    }
  } // initializeModel()

  get cells() {
    return this._cells;
  }

  get rows() {
    return this._rows;
  }

  get cols() {
    return this._cols;
  }

  get boxs() {
    return this._boxs;
  }

  /**
   * Make a copy of the entire model.
   */
  public copyModel() : SudokuModel {
    let copiedModel = new SudokuModel;
    for (let c of CELLS) {
      copiedModel._cells[c] = this._cells[c].copyCell();
    }
    for (let g of GROUPS) {
      copiedModel._rows[g] = this._rows[g].copyGroup();
      copiedModel._cols[g] = this._cols[g].copyGroup();
      copiedModel._boxs[g] = this._boxs[g].copyGroup();
    }
    return copiedModel;
  } // copyModel()

} // class SudokuModel
