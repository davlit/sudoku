import { Common } from     '../common/common';
import { VALUES } from     '../common/common';
import { CANDIDATES } from '../common/common';
import { GROUPS } from     '../common/common';
import { ROWS } from       '../common/common';
import { COLS } from       '../common/common';
import { BOXS } from       '../common/common';
import { CELLS } from      '../common/common';
import { ROW_CELLS } from  '../common/common';
import { COL_CELLS } from  '../common/common';
import { BOX_CELLS } from  '../common/common';

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
}

export class Cell {
  value: number;
  candidates: boolean[];
  locked: boolean;
  row: number;
  col: number;
  box: number;

  constructor(r: number, c:number, b:number) {
    this.candidates = new Array(10);
    for (let k of CANDIDATES) {
      this.candidates[k] = false;
    }
    this.row = r;
    this.col = c;
    this.box = b;
  }

}

export class Group {
  vOccurrences: number[];
  cells: number[]

  constructor(groupCells: number[]) {
    this.vOccurrences = new Array(10);
    for (let v of VALUES) {
      this.vOccurrences[v] = 0;
    }
    this.cells = groupCells;
  }

}