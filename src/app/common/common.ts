export const TITLE = 'Sudoku Helper';
export const MAJOR_VERSION = '0';
export const VERSION = '16';
export const SUB_VERSION = '9';
export const COPYRIGHT = 
    'Copyright © 2016-2017 by David Little. All Rights Reserved.';

export const VALUES: number[] =       [ 1,  2,  3,  4,  5,  6,  7,  8,  9];
export const CANDIDATES: number[] = VALUES;

export const GROUPS: number[] =       [ 0,  1,  2,  3,  4,  5,  6,  7,  8];
export const ROWS: number[] = GROUPS;
export const COLS: number[] = GROUPS;
export const BOXS: number[] = GROUPS;

export const CELLS: number[] =        [ 0,  1,  2,  3,  4,  5,  6,  7,  8,
                                        9, 10, 11, 12, 13, 14, 15, 16, 17,
                                       18, 19, 20, 21, 22, 23, 24, 25, 26,
                                       27, 28, 29, 30, 31, 32, 33, 34, 35,
                                       36, 37, 38, 39, 40, 41, 42, 43, 44,
                                       45, 46, 47, 48, 49, 50, 51, 52, 53,
                                       54, 55, 56, 57, 58, 59, 60, 61, 62,
                                       63, 64, 65, 66, 67, 68, 69, 70, 71,
                                       72, 73, 74, 75, 76, 77, 78, 79, 80];

export const ROW_CELLS: number[][] = [[ 0,  1,  2,  3,  4,  5,  6,  7,  8],
                                      [ 9, 10, 11, 12, 13, 14, 15, 16, 17],
                                      [18, 19, 20, 21, 22, 23, 24, 25, 26],
                                      [27, 28, 29, 30, 31, 32, 33, 34, 35],
                                      [36, 37, 38, 39, 40, 41, 42, 43, 44],
                                      [45, 46, 47, 48, 49, 50, 51, 52, 53],
                                      [54, 55, 56, 57, 58, 59, 60, 61, 62],
                                      [63, 64, 65, 66, 67, 68, 69, 70, 71],
                                      [72, 73, 74, 75, 76, 77, 78, 79, 80]];

export const COL_CELLS: number[][] = [[ 0,  9, 18, 27, 36, 45, 54, 63, 72],
                                      [ 1, 10, 19, 28, 37, 46, 55, 64, 73],
                                      [ 2, 11, 20, 29, 38, 47, 56, 65, 74],
                                      [ 3, 12, 21, 30, 39, 48, 57, 66, 75],
                                      [ 4, 13, 22, 31, 40, 49, 58, 67, 76],
                                      [ 5, 14, 23, 32, 41, 50, 59, 68, 77],
                                      [ 6, 15, 24, 33, 42, 51, 60, 69, 78],
                                      [ 7, 16, 25, 34, 43, 52, 61, 70, 79],
                                      [ 8, 17, 26, 35, 44, 53, 62, 71, 80]];

export const BOX_CELLS: number[][] = [[ 0,  1,  2,  9, 10, 11, 18, 19, 20],
                                      [ 3,  4,  5, 12, 13, 14, 21, 22, 23],
                                      [ 6,  7,  8, 15, 16, 17, 24, 25, 26],

                                      [27, 28, 29, 36, 37, 38, 45, 46, 47],
                                      [30, 31, 32, 39, 40, 41, 48, 49, 50],
                                      [33, 34, 35, 42, 43, 44, 51, 52, 53],

                                      [54, 55, 56, 63, 64, 65, 72, 73, 74],
                                      [57, 58, 59, 66, 67, 68, 75, 76, 77],
                                      [60, 61, 62, 69, 70, 71, 78, 79, 80]];

// a completely valid sudoku
export const ROOT_VALUES: number[] =  [ 1, 2, 3, 4, 5, 6, 7, 8, 9,
                                        4, 5, 6, 7, 8, 9, 1, 2, 3,
                                        7, 8, 9, 1, 2, 3, 4, 5, 6, 
                                        2, 3, 4, 5, 6, 7, 8, 9, 1,
                                        5, 6, 7, 8, 9, 1, 2, 3, 4,
                                        8, 9, 1, 2, 3, 4, 5, 6, 7, 
                                        3, 4, 5, 6, 7, 8, 9, 1, 2, 
                                        6, 7, 8, 9, 1, 2, 3, 4, 5, 
                                        9, 1, 2, 3, 4, 5, 6, 7, 8];
/**
 * randomize:
 * of rows 0, 1, 2, randomly select 2, swap the 2 rows
 * of rows 5, 5, 6, randomly select 2, swap the 2 rows
 * of rows 7, 8, 9, randomly select 2, swap the 2 rows
 * of cols 0, 1, 2, randomly select 2, swap the 2 cols
 * of cols 5, 5, 6, randomly select 2, swap the 2 cols
 * of cols 7, 8, 9, randomly select 2, swap the 2 cols
 * of a blocks of 3 rows (1,2,3) (4,5,6) (7,8,9),
 *   rendomly select 2, swap them
 * of a blocks of 3 cols (1,2,3) (4,5,6) (7,8,9),
 *   rendomly select 2, swap them
 */

const enum SequenceType {
  SEQUENTIAL,
  RANDOM
}

export class Common {

  // static calcBoxNumber(row: number, col: number) {
  //   return (Math.floor((row - 1) / 3) * 3) + Math.floor((col - 1) / 3) + 1;
  // };
    
  // row, col, box 1..9
  // static calcBoxNumber(row: number, col: number) : number {
  //   return (Math.floor((row - 1) / 3) * 3) + Math.floor((col - 1) / 3) + 1;
  // };
    
  // return 1st row number (1..9) in box (1..9)
  // static firstRowInBox(boxNr: number) : number {
  //   return Math.ceil(boxNr / 3) + (Math.floor((boxNr - 1) / 3)) * 2;
  // };
  
  // return 1st col number (1..9) in box (1..9)
  // static firstColInBox(boxNr: number) : number {
  //   return (((boxNr - 1) % 3) * 3) + 1;
  // };
  
  // return RC of box (1..9) and cell (1..9) within box
//   static cellRCInBox(boxNr: number, cellNr: number) : {r: number, c: number} {

// // console.log('boxNr, cellNr: ' + boxNr +', ' + cellNr);
    
//     let r = Common.firstRowInBox(boxNr) + Math.floor((cellNr - 1) / 3);
//     let c = Common.firstColInBox(boxNr) + ((cellNr - 1) % 3);

// // console.log('boxNr, cellNr, r, c: ' + boxNr +', ' + cellNr + ', ' + r + ', ' + c);

//     return {'r': r, 'c': c};
//   };

  /**
   * LEGEND
   * vb, vc - view (template/html) box, cell within box (zero-based 0..8)
   * ur, uc, ub - user row, col, box (one-based 1..9)
   * ci - cell index (zero-based 0..80)
   * v - value (one-based 1..9, but zero --> no value)
   * zr, zc, zb - internal row, col, box index (zero-based 0..8)
   * 
   * CONVERSIONS
   * vb, vc --> ci
   * ci --> ur, uc, ub -- userRow, ...
   * ci --> zr, zc, zb
   */

  /**
   * Convert view box/cell to cell idx
   * @param vb the view box that contains the cell
   * @param vc the position if the cell in the view box
   */
  // static cellIdx(vb: number, vc: number) : number {
  //   return (Math.floor(vb / 3) * 18) + (vb * 3) + (Math.floor(vc / 3) * 6) + vc;
  // } // cellIdx()

  /** Get row number 1..9 from cell index 0..80. */ 
  static userRow(cellIdx: number) : number {
    return Math.floor(cellIdx / 9) + 1;
  }

  /** Get row number 1..9 from cell index 0..80. */ 
  static userCol(cellIdx: number) : number {
    return (cellIdx % 9) + 1;
  }

  /** Get row number 1..9 from cell index 0..80. */ 
  static userBox(cellIdx: number) : number {
    return (Math.floor(cellIdx / 27) * 3) + Math.floor((cellIdx % 9) / 3) + 1;
  }

  // static cellRC(cellIdx: number) : {r: number, c: number} {
  //   return {r: this.userRow(cellIdx), c: this.userCol(cellIdx)}
  // }

    /**
   * Translate cell's row and col (1..9) to cell index (0..80).
   */
  // static cellIdx(r: number, c: number) : number {
  //   return 9 * r + c - 10;    // ((r - 1) * 9) + (c - 1)
  // }
static urcToCellIdx(r: number, c: number) : number {
    return 9 * r + c - 10;    // ((r - 1) * 9) + (c - 1)
  }

  /**
   * Translate cell index (0..80) to row index (0..8).
   */
  static rowIdx(cellIdx: number) : number {
    return Math.floor(cellIdx / 9);
  }

  /**
   * Translate cell index (0..80) to col index (0..8).
   */
  static colIdx(cellIdx: number) : number {
    return cellIdx % 9;
  }

  /** 
   * Translate cell index (0..80) to box index (0..8).
   */
  static boxIdx(cellIdx: number) : number {
    return (Math.floor(cellIdx / 27) * 3) + Math.floor((cellIdx % 9) / 3);
  }

/**
   * Related cells share the same row, column, or box of the given cell. The 
   * given cell is not in the list of related cells. Any cell has 20 related 
   * cells: 8 from the row, 8 from the column and 4 from the box that are not 
   * in the row or column of the given cell.
   */
  static getRelatedCells(idx: number) : number[] {
    let relatedCells: number[] = [];
    let r = Common.rowIdx(idx);
    let c = Common.colIdx(idx);
    let b = Common.boxIdx(idx);
    for (let r of ROW_CELLS[Common.rowIdx(idx)]) {
      if (r === idx) {
        continue;
      }
      relatedCells.push(r);
    }
    for (let c of COL_CELLS[Common.colIdx(idx)]) {
      if (c === idx) {
        continue;
      }
      relatedCells.push(c);
    }
    for (let b of BOX_CELLS[Common.boxIdx(idx)]) {
      if (relatedCells.indexOf(b) < 0) {
        relatedCells.push(b);
      }
    }
    return relatedCells;
  } // getRelatedCells()
        
  /**
   * Return an array of pair combinations of items in a list.
   */
  static pairwise(list: any[]) : any[] {
    let pairs: any[] = [];
    let pos = 0;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        pairs[pos++] = [list[i], list[j]];
      }
    }
    return pairs;
  }

  /**
   * Return an array of triple combinations of items in a list.
   */
  static tripwise(list: any[]) : any[] {
    let trips: any[] = [];
    let pos = 0;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        for (let k = j + 1; k < list.length; k++) {
          trips[pos++] = [list[i], list[j], list[k]];
        }
      }
    }
    return trips;
  }

  /**
   * Return an array of quad combinations of items in a list.
   */
  static quadwise(list: any[]) : any[] {
    let quads: any[] = [];
    let pos = 0;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        for (let k = j + 1; k < list.length; k++) {
          for (let l = k + 1; l < list.length; l++) {
            quads[pos++] = [list[i], list[j], list[k], list[l]];
          }
        }
      }
    }
    return quads;
  }

  // static rowIdx(cellIdx: number) : number {
  //   return Math.floor(cellIdx / 9);
  // }

  // static colIdx(cellIdx: number) : number {
  //   return cellIdx % 9;
  // }

  // static boxIdx(cellIdx: number) : number {
  //   return (Math.floor(cellIdx / 27) * 3) + Math.floor((cellIdx % 9) / 3);
  // }

  // use: formatString('{0} is dead, but {1} is alive!', ['ASP', 'ASP.NET']);
  static formatString(format: string, args: any[]) {
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  }

  /**
   * Right justify, space pad to field size; 
   */  
  static pad(num: number, fieldSize: number) {
    let s = num + '';
    while (s.length < fieldSize) {
      s = ' ' + s;
    }
    return s;
  }

  // fill an integer array with values 0, 1, 2, ..., size - 1
  // randomize if random is specified
  static makeIndexArray(size: number, sequenceType: SequenceType) : number[] {
    let array: number[] = [];
    for (let i = 0; i < size; i++) {
      array[i] = i; 	// make it integer
    }
    if (sequenceType === SequenceType.RANDOM) {
      Common.shuffleArray(array);
    }
    return array;
  };
  
  static generateCellIndexesArray(sequenceType: SequenceType) 
      : {r: number, c: number}[] {
    let cellIndexes: {r: number, c: number}[] = [];
    for (let r = 1; r <= 9; r++) {
      for (let c = 1; c <= 9; c++) {
        cellIndexes.push({r: r, c: c});
      }
    }
    if (sequenceType === SequenceType.RANDOM) {
      Common.shuffleArray(cellIndexes);
    }
    return cellIndexes;
  }

  // shuffle array elements
  static shuffleArray(array: any[]) : any[] {
    let i: number, j: number, temp: any;
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  /**
   * Represent the values of the sudoku as a single-line string.
   * The string should be a 81-character string representing with each 
   * character representing a cell value. A blank cell is indicated by a 
   * period character ('.'). E.g.
   * '..24..1.391.3...6......928......5..6..3.9.8..5..2......245......7...3.283.5..84..'
  */
  static valuesArrayToString(valuesArray: number[] ) : string {
    let s = '';
    let value: number;
    for (let v of valuesArray) {
      if (v === 0) {
        s += '.';
      } else {
        s += v;
      }
    }
    return s;
  } // valuesArrayToString()

  /**
   * Convert an 80-length values string to a numeric array. E.g.
   * '..24..1.391.3...6.. ...' produces 
   * [0,0,2,4,0,0,1,0,3,9,1,0,3,0,0,0,6,0,0, ...].
   */
  static valuesStringToArray(valuesString: string) : number[] {
  //..24..1.391.3...6......928......5..6..3.9.8..5..2......245......7...3.283.5..84..
    let v: number[] = [];
    let sValue: string;
    for (let i of CELLS) {
      sValue = valuesString.charAt(i);
      if (sValue === '.') {
        v.push(0);
        continue;
      }
      v.push(+sValue);
    }
    return v;
  }

  /**
   * Translate cell index (0..80) as a row,col string, e.g '2,4'.
   */
  static toRowColString(idx: number) : string {
    return (Common.rowIdx(idx) + 1) + ',' + (Common.colIdx(idx) + 1);
  } // toRowColString()

  // Translate view's box & row indexes to model row indexes (0..8)
  // XXX
  static viewToModelRow(br: number, cr: number) : number {
    return (br * 3) + cr + 1;
  } 
  
  // Translate view's box column indexes to model column indexes (0..8)
  // XXX
  static viewToModelCol(bc: number, cc: number) : number {
    return (bc * 3) + cc + 1;
  } 
  
  // Translate view's candidate cell indexes to model candidate (0..8)
  // XXX
  static viewToModelCand(kr: number, kc: number) : number {
    return ((kr % 3) * 3) + kc + 1;
  }
  
  /**
   * Determine if an array of cell indexes are in the same row.
   */
  static areCellsInSameRow(cells: number[]) : boolean {
    let row: number = Common.rowIdx(cells[0]);
    for (let i = 1; i < cells.length; i++) {
      if (Common.rowIdx(cells[i]) != row) {
        return false;
      }
    }
    return true;
  }

  /**
   * Determine if an array of cell indexes are in the same column.
   */
  static areCellsInSameCol(cells: number[]) : boolean {
    let col: number = Common.colIdx(cells[0]);
    for (let i = 1; i < cells.length; i++) {
      if (Common.colIdx(cells[i]) != col) {
        return false;
      }
    }
    return true;
  }

  /**
   * Determine if an array of cell indexes are in the same box.
   */
  static areCellsInSameBox(cells: number[]) : boolean {
    let box: number = Common.boxIdx(cells[0]);
    for (let i = 1; i < cells.length; i++) {
      if (Common.boxIdx(cells[i]) != box) {
        return false;
      }
    }
    return true;
  }

  /**
   * Determine if two arrays are the same.
   */
  static isArraySame(array1: any[], array2: any[]) {
    return array1.length == array2.length 
        && array1.every(function(element, index) {
      return element === array2[index];
    });
  }

  /**
   * Convert elapsed seconds to hours, minutes, and seconds string.
   */
  static toElapsedTimeString(seconds: number) : string {
    let secs = Math.floor(seconds % 60);
    let mins = Math.floor((seconds / 60) % 60);
    let hrs  = Math.floor((seconds / (60 * 60)) % 24);
    let ss = (secs < 10) ? ('0' + secs) : (secs);
    let mm = (mins <  1) ? ('0')        : (mins);
    let hh = (hrs  <  1) ? ('')         : (hrs + ':');
    return hh + mm + ":" + ss;
  }


  // testing
  static RANDOM_VALUES_1 = [8,3,1,2,9,7,4,5,6];
  static RANDOM_VALUES_2 = [1,6,2,9,5,8,7,4,3];
  static RANDOM_VALUES_3 = [2,6,8,7,5,1,9,3,4];
  static RANDOM_VALUES_4 = [3,2,4,8,7,9,6,5,1];
  static RANDOM_VALUES_5 = [7,8,2,1,5,6,9,3,4];

  static RANDOM_CELLS_1 = [66,21,53,29,65,30,39,25,6,61,0,1,79,26,42,38,5,43,33,11,19,57,63,56,22,28,36,27,75,78,35,51,72,10,31,4,8,54,18,24,46,34,64,68,52,69,58,16,77,70,40,14,41,37,62,49,20,74,17,80,76,47,60,67,73,55,71,3,13,7,2,44,12,59,50,15,9,32,23,45,48];
  static RANDOM_CELLS_2 = [6,27,53,49,10,9,46,71,40,44,36,67,75,30,74,63,77,21,12,58,51,72,55,29,56,15,22,13,39,28,52,57,65,19,66,3,7,59,62,54,4,11,17,70,50,14,25,24,48,20,18,35,69,76,68,0,43,45,38,26,60,47,61,80,32,5,2,31,79,37,8,23,73,42,1,41,64,33,34,16,78];
  static RANDOM_CELLS_3 = [13,66,36,14,5,42,23,34,51,2,9,1,67,60,6,31,64,38,63,32,28,45,47,20,80,58,12,35,59,33,17,4,73,69,11,41,37,72,16,79,40,26,70,0,19,27,29,43,10,54,39,65,8,21,3,74,53,50,44,57,15,78,24,7,55,30,49,56,62,25,76,48,18,61,68,22,46,71,52,77,75];
  static RANDOM_CELLS_4 = [43,7,16,34,67,2,46,20,17,55,6,71,48,11,60,27,66,52,14,70,73,63,41,53,30,25,47,31,1,61,32,57,18,51,59,40,29,74,78,39,68,19,58,4,54,79,13,65,77,45,44,56,10,35,24,36,5,23,37,9,28,8,62,15,49,22,33,76,26,75,80,69,21,50,3,64,0,12,38,72,42];
  static RANDOM_CELLS_5 = [77,43,32,17,49,33,0,24,48,63,58,44,78,4,2,67,20,29,46,7,21,65,53,14,54,61,41,60,50,47,27,30,9,38,37,19,71,62,34,45,31,56,66,51,26,52,5,10,70,16,36,80,55,3,73,28,69,35,11,76,8,23,12,42,13,39,64,74,18,68,22,40,6,57,15,59,75,25,79,1,72];

  static RANDOM_PARING_CELLS_1 = [31,13,16,25,2,21,38,7,1,40,17,28,8,9,23,12,19,14,26,34,6,20,39,0,32,22,10,18,36,37,27,15,30,4,29,5,33,3,24,11,35];
  static RANDOM_PARING_CELLS_2 = [5,11,7,38,25,4,31,28,16,39,3,17,40,22,20,23,12,37,36,13,35,18,0,6,32,33,21,30,29,19,27,10,34,1,26,15,24,9,2,14,8];
  static RANDOM_PARING_CELLS_3 = [34,35,24,36,19,39,22,20,16,28,13,2,33,11,0,5,10,29,21,25,4,23,14,1,32,37,9,38,7,27,30,15,8,40,3,31,26,12,6,18,17];
  static RANDOM_PARING_CELLS_4 = [6,3,11,28,25,27,35,10,17,33,7,2,23,16,5,12,14,4,20,1,37,36,31,29,39,30,26,9,40,38,21,0,8,34,18,24,22,15,13,32,19];
  static RANDOM_PARING_CELLS_5 = [8,7,22,24,34,39,19,18,13,23,32,17,14,9,35,10,28,21,6,31,16,11,29,36,38,25,0,12,15,4,2,33,30,26,20,5,1,3,37,40,27];

}
