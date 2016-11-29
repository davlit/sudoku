export const TITLE = 'Sudoku Helper';
export const MAJOR_VERSION = '0';
export const VERSION = '12';
export const SUB_VERSION = '0';
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

  /** Get row number 1..9 from cell index 0..80. */ 
  static rowNr(cellIdx: number) : number {
    return Math.floor(cellIdx / 9) + 1;
  }

  /** Get row number 1..9 from cell index 0..80. */ 
  static colNr(cellIdx: number) : number {
    return (cellIdx % 9) + 1;
  }

  /** Get row number 1..9 from cell index 0..80. */ 
  static boxNr(cellIdx: number) : number {
    return (Math.floor(cellIdx / 27) * 3) + Math.floor((cellIdx % 9) / 3) + 1;
  }

  static cellRC(cellIdx: number) : {r: number, c: number} {
    return {r: this.rowNr(cellIdx), c: this.colNr(cellIdx)}
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
      
  static pad(num: number, size: number) {
    let s = num + '';
    while (s.length < size) {
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

  /**
   * Translate cell's row and col (1..9) to cell index (0..80).
   */
  static cellIdx(r: number, c: number) : number {
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

  // Translate view's box & row indexes to model row indexes (0..8)
  static viewToModelRow(br: number, cr: number) : number {
    return (br * 3) + cr + 1;
  } 
  
  // Translate view's box column indexes to model column indexes (0..8)
  static viewToModelCol(bc: number, cc: number) : number {
    return (bc * 3) + cc + 1;
  } 
  
  // Translate view's candidate cell indexes to model candidate (0..8)
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

}
