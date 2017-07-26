/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export TITLE */
/* unused harmony export MAJOR_VERSION */
/* unused harmony export VERSION */
/* unused harmony export SUB_VERSION */
/* unused harmony export COPYRIGHT */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return VALUES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return CANDIDATES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return GROUPS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return ROWS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return COLS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return BOXS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return CELLS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return ROW_CELLS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return COL_CELLS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return BOX_CELLS; });
/* unused harmony export ROOT_VALUES */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Common; });
var TITLE = 'Sudoku Helper';
var MAJOR_VERSION = '0';
var VERSION = '16';
var SUB_VERSION = '4';
var COPYRIGHT = 'Copyright © 2016-2017 by David Little. All Rights Reserved.';
var VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var CANDIDATES = VALUES;
var GROUPS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var ROWS = GROUPS;
var COLS = GROUPS;
var BOXS = GROUPS;
var CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8,
    9, 10, 11, 12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31, 32, 33, 34, 35,
    36, 37, 38, 39, 40, 41, 42, 43, 44,
    45, 46, 47, 48, 49, 50, 51, 52, 53,
    54, 55, 56, 57, 58, 59, 60, 61, 62,
    63, 64, 65, 66, 67, 68, 69, 70, 71,
    72, 73, 74, 75, 76, 77, 78, 79, 80];
var ROW_CELLS = [[0, 1, 2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, 32, 33, 34, 35],
    [36, 37, 38, 39, 40, 41, 42, 43, 44],
    [45, 46, 47, 48, 49, 50, 51, 52, 53],
    [54, 55, 56, 57, 58, 59, 60, 61, 62],
    [63, 64, 65, 66, 67, 68, 69, 70, 71],
    [72, 73, 74, 75, 76, 77, 78, 79, 80]];
var COL_CELLS = [[0, 9, 18, 27, 36, 45, 54, 63, 72],
    [1, 10, 19, 28, 37, 46, 55, 64, 73],
    [2, 11, 20, 29, 38, 47, 56, 65, 74],
    [3, 12, 21, 30, 39, 48, 57, 66, 75],
    [4, 13, 22, 31, 40, 49, 58, 67, 76],
    [5, 14, 23, 32, 41, 50, 59, 68, 77],
    [6, 15, 24, 33, 42, 51, 60, 69, 78],
    [7, 16, 25, 34, 43, 52, 61, 70, 79],
    [8, 17, 26, 35, 44, 53, 62, 71, 80]];
var BOX_CELLS = [[0, 1, 2, 9, 10, 11, 18, 19, 20],
    [3, 4, 5, 12, 13, 14, 21, 22, 23],
    [6, 7, 8, 15, 16, 17, 24, 25, 26],
    [27, 28, 29, 36, 37, 38, 45, 46, 47],
    [30, 31, 32, 39, 40, 41, 48, 49, 50],
    [33, 34, 35, 42, 43, 44, 51, 52, 53],
    [54, 55, 56, 63, 64, 65, 72, 73, 74],
    [57, 58, 59, 66, 67, 68, 75, 76, 77],
    [60, 61, 62, 69, 70, 71, 78, 79, 80]];
// a completely valid sudoku
var ROOT_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9,
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
var SequenceType;
(function (SequenceType) {
    SequenceType[SequenceType["SEQUENTIAL"] = 0] = "SEQUENTIAL";
    SequenceType[SequenceType["RANDOM"] = 1] = "RANDOM";
})(SequenceType || (SequenceType = {}));
var Common = (function () {
    function Common() {
    }
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
    Common.userRow = function (cellIdx) {
        return Math.floor(cellIdx / 9) + 1;
    };
    /** Get row number 1..9 from cell index 0..80. */
    Common.userCol = function (cellIdx) {
        return (cellIdx % 9) + 1;
    };
    /** Get row number 1..9 from cell index 0..80. */
    Common.userBox = function (cellIdx) {
        return (Math.floor(cellIdx / 27) * 3) + Math.floor((cellIdx % 9) / 3) + 1;
    };
    // static cellRC(cellIdx: number) : {r: number, c: number} {
    //   return {r: this.userRow(cellIdx), c: this.userCol(cellIdx)}
    // }
    /**
   * Translate cell's row and col (1..9) to cell index (0..80).
   */
    // static cellIdx(r: number, c: number) : number {
    //   return 9 * r + c - 10;    // ((r - 1) * 9) + (c - 1)
    // }
    Common.urcToCellIdx = function (r, c) {
        return 9 * r + c - 10; // ((r - 1) * 9) + (c - 1)
    };
    /**
     * Translate cell index (0..80) to row index (0..8).
     */
    Common.rowIdx = function (cellIdx) {
        return Math.floor(cellIdx / 9);
    };
    /**
     * Translate cell index (0..80) to col index (0..8).
     */
    Common.colIdx = function (cellIdx) {
        return cellIdx % 9;
    };
    /**
     * Translate cell index (0..80) to box index (0..8).
     */
    Common.boxIdx = function (cellIdx) {
        return (Math.floor(cellIdx / 27) * 3) + Math.floor((cellIdx % 9) / 3);
    };
    /**
       * Related cells share the same row, column, or box of the given cell. The
       * given cell is not in the list of related cells. Any cell has 20 related
       * cells: 8 from the row, 8 from the column and 4 from the box that are not
       * in the row or column of the given cell.
       */
    Common.getRelatedCells = function (idx) {
        var relatedCells = [];
        var r = Common.rowIdx(idx);
        var c = Common.colIdx(idx);
        var b = Common.boxIdx(idx);
        for (var _i = 0, _a = ROW_CELLS[Common.rowIdx(idx)]; _i < _a.length; _i++) {
            var r_1 = _a[_i];
            if (r_1 === idx) {
                continue;
            }
            relatedCells.push(r_1);
        }
        for (var _b = 0, _c = COL_CELLS[Common.colIdx(idx)]; _b < _c.length; _b++) {
            var c_1 = _c[_b];
            if (c_1 === idx) {
                continue;
            }
            relatedCells.push(c_1);
        }
        for (var _d = 0, _e = BOX_CELLS[Common.boxIdx(idx)]; _d < _e.length; _d++) {
            var b_1 = _e[_d];
            if (relatedCells.indexOf(b_1) < 0) {
                relatedCells.push(b_1);
            }
        }
        return relatedCells;
    }; // getRelatedCells()
    /**
     * Return an array of pair combinations of items in a list.
     */
    Common.pairwise = function (list) {
        var pairs = [];
        var pos = 0;
        for (var i = 0; i < list.length; i++) {
            for (var j = i + 1; j < list.length; j++) {
                pairs[pos++] = [list[i], list[j]];
            }
        }
        return pairs;
    };
    /**
     * Return an array of triple combinations of items in a list.
     */
    Common.tripwise = function (list) {
        var trips = [];
        var pos = 0;
        for (var i = 0; i < list.length; i++) {
            for (var j = i + 1; j < list.length; j++) {
                for (var k = j + 1; k < list.length; k++) {
                    trips[pos++] = [list[i], list[j], list[k]];
                }
            }
        }
        return trips;
    };
    /**
     * Return an array of quad combinations of items in a list.
     */
    Common.quadwise = function (list) {
        var quads = [];
        var pos = 0;
        for (var i = 0; i < list.length; i++) {
            for (var j = i + 1; j < list.length; j++) {
                for (var k = j + 1; k < list.length; k++) {
                    for (var l = k + 1; l < list.length; l++) {
                        quads[pos++] = [list[i], list[j], list[k], list[l]];
                    }
                }
            }
        }
        return quads;
    };
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
    Common.formatString = function (format, args) {
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
    /**
     * Right justify, space pad to field size;
     */
    Common.pad = function (num, fieldSize) {
        var s = num + '';
        while (s.length < fieldSize) {
            s = ' ' + s;
        }
        return s;
    };
    // fill an integer array with values 0, 1, 2, ..., size - 1
    // randomize if random is specified
    Common.makeIndexArray = function (size, sequenceType) {
        var array = [];
        for (var i = 0; i < size; i++) {
            array[i] = i; // make it integer
        }
        if (sequenceType === SequenceType.RANDOM) {
            Common.shuffleArray(array);
        }
        return array;
    };
    ;
    Common.generateCellIndexesArray = function (sequenceType) {
        var cellIndexes = [];
        for (var r = 1; r <= 9; r++) {
            for (var c = 1; c <= 9; c++) {
                cellIndexes.push({ r: r, c: c });
            }
        }
        if (sequenceType === SequenceType.RANDOM) {
            Common.shuffleArray(cellIndexes);
        }
        return cellIndexes;
    };
    // shuffle array elements
    Common.shuffleArray = function (array) {
        var i, j, temp;
        for (i = array.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };
    /**
     * Represent the values of the sudoku as a single-line string.
     * The string should be a 81-character string representing with each
     * character representing a cell value. A blank cell is indicated by a
     * period character ('.'). E.g.
     * '..24..1.391.3...6......928......5..6..3.9.8..5..2......245......7...3.283.5..84..'
    */
    Common.valuesArrayToString = function (valuesArray) {
        var s = '';
        var value;
        for (var _i = 0, valuesArray_1 = valuesArray; _i < valuesArray_1.length; _i++) {
            var v = valuesArray_1[_i];
            if (v === 0) {
                s += '.';
            }
            else {
                s += v;
            }
        }
        return s;
    }; // valuesArrayToString()
    /**
     * Convert an 80-length values string to a numeric array. E.g.
     * '..24..1.391.3...6.. ...' produces
     * [0,0,2,4,0,0,1,0,3,9,1,0,3,0,0,0,6,0,0, ...].
     */
    Common.valuesStringToArray = function (valuesString) {
        //..24..1.391.3...6......928......5..6..3.9.8..5..2......245......7...3.283.5..84..
        var v = [];
        var sValue;
        for (var _i = 0, CELLS_1 = CELLS; _i < CELLS_1.length; _i++) {
            var i = CELLS_1[_i];
            sValue = valuesString.charAt(i);
            if (sValue === '.') {
                v.push(0);
                continue;
            }
            v.push(+sValue);
        }
        return v;
    };
    /**
     * Translate cell index (0..80) as a row,col string, e.g '2,4'.
     */
    Common.toRowColString = function (idx) {
        return (Common.rowIdx(idx) + 1) + ',' + (Common.colIdx(idx) + 1);
    }; // toRowColString()
    // Translate view's box & row indexes to model row indexes (0..8)
    // XXX
    Common.viewToModelRow = function (br, cr) {
        return (br * 3) + cr + 1;
    };
    // Translate view's box column indexes to model column indexes (0..8)
    // XXX
    Common.viewToModelCol = function (bc, cc) {
        return (bc * 3) + cc + 1;
    };
    // Translate view's candidate cell indexes to model candidate (0..8)
    // XXX
    Common.viewToModelCand = function (kr, kc) {
        return ((kr % 3) * 3) + kc + 1;
    };
    /**
     * Determine if an array of cell indexes are in the same row.
     */
    Common.areCellsInSameRow = function (cells) {
        var row = Common.rowIdx(cells[0]);
        for (var i = 1; i < cells.length; i++) {
            if (Common.rowIdx(cells[i]) != row) {
                return false;
            }
        }
        return true;
    };
    /**
     * Determine if an array of cell indexes are in the same column.
     */
    Common.areCellsInSameCol = function (cells) {
        var col = Common.colIdx(cells[0]);
        for (var i = 1; i < cells.length; i++) {
            if (Common.colIdx(cells[i]) != col) {
                return false;
            }
        }
        return true;
    };
    /**
     * Determine if an array of cell indexes are in the same box.
     */
    Common.areCellsInSameBox = function (cells) {
        var box = Common.boxIdx(cells[0]);
        for (var i = 1; i < cells.length; i++) {
            if (Common.boxIdx(cells[i]) != box) {
                return false;
            }
        }
        return true;
    };
    /**
     * Determine if two arrays are the same.
     */
    Common.isArraySame = function (array1, array2) {
        return array1.length == array2.length
            && array1.every(function (element, index) {
                return element === array2[index];
            });
    };
    /**
     * Convert elapsed seconds to hours, minutes, and seconds string.
     */
    Common.toElapsedTimeString = function (seconds) {
        var secs = Math.floor(seconds % 60);
        var mins = Math.floor((seconds / 60) % 60);
        var hrs = Math.floor((seconds / (60 * 60)) % 24);
        var ss = (secs < 10) ? ('0' + secs) : (secs);
        var mm = (mins < 1) ? ('0') : (mins);
        var hh = (hrs < 1) ? ('') : (hrs + ':');
        return hh + mm + ":" + ss;
    };
    return Common;
}());

// testing
Common.RANDOM_VALUES_1 = [8, 3, 1, 2, 9, 7, 4, 5, 6];
Common.RANDOM_VALUES_2 = [1, 6, 2, 9, 5, 8, 7, 4, 3];
Common.RANDOM_VALUES_3 = [2, 6, 8, 7, 5, 1, 9, 3, 4];
Common.RANDOM_VALUES_4 = [3, 2, 4, 8, 7, 9, 6, 5, 1];
Common.RANDOM_VALUES_5 = [7, 8, 2, 1, 5, 6, 9, 3, 4];
Common.RANDOM_CELLS_1 = [66, 21, 53, 29, 65, 30, 39, 25, 6, 61, 0, 1, 79, 26, 42, 38, 5, 43, 33, 11, 19, 57, 63, 56, 22, 28, 36, 27, 75, 78, 35, 51, 72, 10, 31, 4, 8, 54, 18, 24, 46, 34, 64, 68, 52, 69, 58, 16, 77, 70, 40, 14, 41, 37, 62, 49, 20, 74, 17, 80, 76, 47, 60, 67, 73, 55, 71, 3, 13, 7, 2, 44, 12, 59, 50, 15, 9, 32, 23, 45, 48];
Common.RANDOM_CELLS_2 = [6, 27, 53, 49, 10, 9, 46, 71, 40, 44, 36, 67, 75, 30, 74, 63, 77, 21, 12, 58, 51, 72, 55, 29, 56, 15, 22, 13, 39, 28, 52, 57, 65, 19, 66, 3, 7, 59, 62, 54, 4, 11, 17, 70, 50, 14, 25, 24, 48, 20, 18, 35, 69, 76, 68, 0, 43, 45, 38, 26, 60, 47, 61, 80, 32, 5, 2, 31, 79, 37, 8, 23, 73, 42, 1, 41, 64, 33, 34, 16, 78];
Common.RANDOM_CELLS_3 = [13, 66, 36, 14, 5, 42, 23, 34, 51, 2, 9, 1, 67, 60, 6, 31, 64, 38, 63, 32, 28, 45, 47, 20, 80, 58, 12, 35, 59, 33, 17, 4, 73, 69, 11, 41, 37, 72, 16, 79, 40, 26, 70, 0, 19, 27, 29, 43, 10, 54, 39, 65, 8, 21, 3, 74, 53, 50, 44, 57, 15, 78, 24, 7, 55, 30, 49, 56, 62, 25, 76, 48, 18, 61, 68, 22, 46, 71, 52, 77, 75];
Common.RANDOM_CELLS_4 = [43, 7, 16, 34, 67, 2, 46, 20, 17, 55, 6, 71, 48, 11, 60, 27, 66, 52, 14, 70, 73, 63, 41, 53, 30, 25, 47, 31, 1, 61, 32, 57, 18, 51, 59, 40, 29, 74, 78, 39, 68, 19, 58, 4, 54, 79, 13, 65, 77, 45, 44, 56, 10, 35, 24, 36, 5, 23, 37, 9, 28, 8, 62, 15, 49, 22, 33, 76, 26, 75, 80, 69, 21, 50, 3, 64, 0, 12, 38, 72, 42];
Common.RANDOM_CELLS_5 = [77, 43, 32, 17, 49, 33, 0, 24, 48, 63, 58, 44, 78, 4, 2, 67, 20, 29, 46, 7, 21, 65, 53, 14, 54, 61, 41, 60, 50, 47, 27, 30, 9, 38, 37, 19, 71, 62, 34, 45, 31, 56, 66, 51, 26, 52, 5, 10, 70, 16, 36, 80, 55, 3, 73, 28, 69, 35, 11, 76, 8, 23, 12, 42, 13, 39, 64, 74, 18, 68, 22, 40, 6, 57, 15, 59, 75, 25, 79, 1, 72];
Common.RANDOM_PARING_CELLS_1 = [31, 13, 16, 25, 2, 21, 38, 7, 1, 40, 17, 28, 8, 9, 23, 12, 19, 14, 26, 34, 6, 20, 39, 0, 32, 22, 10, 18, 36, 37, 27, 15, 30, 4, 29, 5, 33, 3, 24, 11, 35];
Common.RANDOM_PARING_CELLS_2 = [5, 11, 7, 38, 25, 4, 31, 28, 16, 39, 3, 17, 40, 22, 20, 23, 12, 37, 36, 13, 35, 18, 0, 6, 32, 33, 21, 30, 29, 19, 27, 10, 34, 1, 26, 15, 24, 9, 2, 14, 8];
Common.RANDOM_PARING_CELLS_3 = [34, 35, 24, 36, 19, 39, 22, 20, 16, 28, 13, 2, 33, 11, 0, 5, 10, 29, 21, 25, 4, 23, 14, 1, 32, 37, 9, 38, 7, 27, 30, 15, 8, 40, 3, 31, 26, 12, 6, 18, 17];
Common.RANDOM_PARING_CELLS_4 = [6, 3, 11, 28, 25, 27, 35, 10, 17, 33, 7, 2, 23, 16, 5, 12, 14, 4, 20, 1, 37, 36, 31, 29, 39, 30, 26, 9, 40, 38, 21, 0, 8, 34, 18, 24, 22, 15, 13, 32, 19];
Common.RANDOM_PARING_CELLS_5 = [8, 7, 22, 24, 34, 39, 19, 18, 13, 23, 32, 17, 14, 9, 35, 10, 28, 21, 6, 31, 16, 11, 29, 36, 38, 25, 0, 12, 15, 4, 2, 33, 30, 26, 20, 5, 1, 3, 37, 40, 27];
//# sourceMappingURL=common.js.map

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HintType; });
var HintType;
(function (HintType) {
    // INITIAL_VALUE,
    // easy
    HintType[HintType["NAKED_SINGLE"] = 0] = "NAKED_SINGLE";
    HintType[HintType["HIDDEN_SINGLE_ROW"] = 1] = "HIDDEN_SINGLE_ROW";
    HintType[HintType["HIDDEN_SINGLE_COL"] = 2] = "HIDDEN_SINGLE_COL";
    HintType[HintType["HIDDEN_SINGLE_BOX"] = 3] = "HIDDEN_SINGLE_BOX";
    // medium
    HintType[HintType["NAKED_PAIRS_ROW"] = 4] = "NAKED_PAIRS_ROW";
    HintType[HintType["NAKED_PAIRS_COL"] = 5] = "NAKED_PAIRS_COL";
    HintType[HintType["NAKED_PAIRS_BOX"] = 6] = "NAKED_PAIRS_BOX";
    HintType[HintType["POINTING_ROW"] = 7] = "POINTING_ROW";
    HintType[HintType["POINTING_COL"] = 8] = "POINTING_COL";
    HintType[HintType["ROW_BOX_REDUCTION"] = 9] = "ROW_BOX_REDUCTION";
    HintType[HintType["COL_BOX_REDUCTION"] = 10] = "COL_BOX_REDUCTION";
    // hard
    HintType[HintType["NAKED_TRIPLES_ROW"] = 11] = "NAKED_TRIPLES_ROW";
    HintType[HintType["NAKED_TRIPLES_COL"] = 12] = "NAKED_TRIPLES_COL";
    HintType[HintType["NAKED_TRIPLES_BOX"] = 13] = "NAKED_TRIPLES_BOX";
    HintType[HintType["HIDDEN_PAIRS_ROW"] = 14] = "HIDDEN_PAIRS_ROW";
    HintType[HintType["HIDDEN_PAIRS_COL"] = 15] = "HIDDEN_PAIRS_COL";
    HintType[HintType["HIDDEN_PAIRS_BOX"] = 16] = "HIDDEN_PAIRS_BOX";
    HintType[HintType["NAKED_QUADS_ROW"] = 17] = "NAKED_QUADS_ROW";
    HintType[HintType["NAKED_QUADS_COL"] = 18] = "NAKED_QUADS_COL";
    HintType[HintType["NAKED_QUADS_BOX"] = 19] = "NAKED_QUADS_BOX";
    HintType[HintType["HIDDEN_TRIPLES_ROW"] = 20] = "HIDDEN_TRIPLES_ROW";
    HintType[HintType["HIDDEN_TRIPLES_COL"] = 21] = "HIDDEN_TRIPLES_COL";
    HintType[HintType["HIDDEN_TRIPLES_BOX"] = 22] = "HIDDEN_TRIPLES_BOX";
    HintType[HintType["HIDDEN_QUADS_ROW"] = 23] = "HIDDEN_QUADS_ROW";
    HintType[HintType["HIDDEN_QUADS_COL"] = 24] = "HIDDEN_QUADS_COL";
    HintType[HintType["HIDDEN_QUADS_BOX"] = 25] = "HIDDEN_QUADS_BOX";
    // hardest
    HintType[HintType["GUESS"] = 26] = "GUESS"; // 26
})(HintType || (HintType = {}));
//# sourceMappingURL=hint.type.js.map

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Difficulty; });
var Difficulty;
(function (Difficulty) {
    Difficulty[Difficulty["EASY"] = 0] = "EASY";
    Difficulty[Difficulty["MEDIUM"] = 1] = "MEDIUM";
    Difficulty[Difficulty["HARD"] = 2] = "HARD";
    Difficulty[Difficulty["HARDEST"] = 3] = "HARDEST";
})(Difficulty || (Difficulty = {}));
//# sourceMappingURL=difficulty.js.map

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActionType; });
/* unused harmony export Action */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ValueAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return GuessAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return RemoveAction; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_common__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var ActionType;
(function (ActionType) {
    ActionType[ActionType["SET_VALUE"] = 0] = "SET_VALUE";
    ActionType[ActionType["GUESS_VALUE"] = 1] = "GUESS_VALUE";
    // SET_INITIAL,
    ActionType[ActionType["REMOVE_CANDIDATE"] = 2] = "REMOVE_CANDIDATE";
})(ActionType || (ActionType = {}));
var Action = (function () {
    function Action(type, cell, hint) {
        this._type = type;
        this._cell = cell;
        this._hint = hint;
    }
    Object.defineProperty(Action.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "cell", {
        get: function () {
            return this._cell;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "hint", {
        get: function () {
            return this._hint;
        },
        enumerable: true,
        configurable: true
    });
    Action.prototype.toString = function () {
        return '';
    };
    return Action;
}());

var BaseValueAction = (function (_super) {
    __extends(BaseValueAction, _super);
    function BaseValueAction(type, cell, value, hint) {
        var _this = _super.call(this, type, cell, hint) || this;
        _this._value = value;
        return _this;
    }
    Object.defineProperty(BaseValueAction.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return BaseValueAction;
}(Action));
var ValueAction = (function (_super) {
    __extends(ValueAction, _super);
    function ValueAction(type, cell, value, hint) {
        return _super.call(this, type, cell, value, hint) || this;
    }
    ValueAction.prototype.toString = function () {
        var s = _super.prototype.toString.call(this)
            + __WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].formatString('Set {0} in {1},{2}', [this.value, __WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].userRow(this.cell), __WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].userCol(this.cell)]);
        if (this.hint) {
            s += ' (' + this.hint.toString() + ')';
        }
        else {
            s += ' (User action)';
        }
        return s;
    };
    return ValueAction;
}(BaseValueAction));

var GuessAction = (function (_super) {
    __extends(GuessAction, _super);
    function GuessAction(type, cell, value, possibleValues, hint) {
        var _this = _super.call(this, type, cell, value, hint) || this;
        _this._possibleValues = possibleValues;
        return _this;
    }
    Object.defineProperty(GuessAction.prototype, "possibleValues", {
        get: function () {
            return this._possibleValues;
        },
        enumerable: true,
        configurable: true
    });
    GuessAction.prototype.toString = function () {
        var s = _super.prototype.toString.call(this)
            + __WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].formatString('Guess {0} in {1},{2} with possibles {3}', [this.value, __WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].userRow(this.cell), __WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].userCol(this.cell),
                JSON.stringify(this._possibleValues)]);
        if (this.hint) {
            s += ' (' + this.hint.toString() + ')';
        }
        else {
            s += ' (User action)';
        }
        return s;
    };
    return GuessAction;
}(BaseValueAction));

var RemoveAction = (function (_super) {
    __extends(RemoveAction, _super);
    function RemoveAction(type, cell, candidate, hint) {
        var _this = _super.call(this, type, cell, hint) || this;
        _this._candidate = candidate;
        return _this;
    }
    Object.defineProperty(RemoveAction.prototype, "candidate", {
        get: function () {
            return this._candidate;
        },
        enumerable: true,
        configurable: true
    });
    RemoveAction.prototype.toString = function () {
        var s = _super.prototype.toString.call(this)
            + __WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].formatString('Remove candidate {0} in {1},{2}', [this._candidate, __WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].userRow(this.cell), __WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].userCol(this.cell)]);
        if (this.hint) {
            s += ' (' + this.hint.toString() + ')';
        }
        else {
            s += ' (User action)';
        }
        return s;
    };
    return RemoveAction;
}(Action));

//# sourceMappingURL=action.js.map

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Hint */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ValueHint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return CandidatesHint; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__hint_type__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__action_action__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_difficulty__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_common__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




/**
 * Hint life cycle
 * - created in findX functions, e.g. findNakedSingles()
 * - logged to hintLog in applyHint()
 * - spawn an action in applyHint()
 *
 * Hint life cydle
 * - created and logged to hintLog in guess()
 * - spawn an action in guess()
 */
// abstract
var Hint = (function () {
    function Hint(type) {
        this._type = type;
    }
    Object.defineProperty(Hint.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    return Hint;
}());

var ValueHint = (function (_super) {
    __extends(ValueHint, _super);
    function ValueHint(type, cell, value) {
        var _this = _super.call(this, type) || this;
        _this._cell = cell;
        _this._value = value;
        return _this;
    }
    Object.defineProperty(ValueHint.prototype, "cell", {
        get: function () {
            return this._cell;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueHint.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    ValueHint.prototype.getCell = function () {
        return this._cell;
    };
    ValueHint.prototype.getValue = function () {
        return this._value;
    };
    ValueHint.prototype.getActionType = function () {
        return __WEBPACK_IMPORTED_MODULE_1__action_action__["a" /* ActionType */].SET_VALUE;
    };
    ValueHint.prototype.getDifficultyRating = function () {
        if (this.type === __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].GUESS) {
            return __WEBPACK_IMPORTED_MODULE_2__model_difficulty__["a" /* Difficulty */].HARDEST;
        }
        return __WEBPACK_IMPORTED_MODULE_2__model_difficulty__["a" /* Difficulty */].EASY;
    };
    ValueHint.prototype.toString = function () {
        // convert 0-base rows, cols, boxs to 1-base (1..9)
        var r = __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].userRow(this._cell);
        var c = __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].userCol(this._cell);
        var b = __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].userBox(this._cell);
        switch (this.type) {
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_SINGLE:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Naked single {0} in {1},{2}', [this._value, r, c]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_SINGLE_ROW:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Hidden single {0} in row, {1},{2}', [this._value, r, c]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_SINGLE_COL:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Hidden single {0} in col, {1},{2}', [this._value, r, c]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_SINGLE_BOX:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Hidden single {0} in box, {1},{2}', [this._value, r, c]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].GUESS:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Guess {0} in {1},{2}', [this._value, r, c]);
        } // switch
    }; // toString()
    return ValueHint;
}(Hint));

var CandidatesHint = (function (_super) {
    __extends(CandidatesHint, _super);
    function CandidatesHint(type, cells, candidates, removals) {
        var _this = _super.call(this, type) || this;
        _this._cells = cells;
        _this._candidates = candidates.sort();
        _this._removals = removals;
        return _this;
    }
    Object.defineProperty(CandidatesHint.prototype, "cells", {
        get: function () {
            return this._cells;
        },
        enumerable: true,
        configurable: true
    });
    CandidatesHint.prototype.getCell = function () {
        return this._cells[0];
    };
    CandidatesHint.prototype.getValue = function () {
        return undefined;
    };
    CandidatesHint.prototype.getActionType = function () {
        return __WEBPACK_IMPORTED_MODULE_1__action_action__["a" /* ActionType */].REMOVE_CANDIDATE;
    };
    Object.defineProperty(CandidatesHint.prototype, "candidates", {
        get: function () {
            return this._candidates;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandidatesHint.prototype, "removals", {
        get: function () {
            return this._removals;
        },
        enumerable: true,
        configurable: true
    });
    CandidatesHint.prototype.getDifficultyRating = function () {
        if (this.type >= __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_TRIPLES_ROW) {
            return __WEBPACK_IMPORTED_MODULE_2__model_difficulty__["a" /* Difficulty */].HARD;
        }
        return __WEBPACK_IMPORTED_MODULE_2__model_difficulty__["a" /* Difficulty */].MEDIUM;
    };
    CandidatesHint.prototype.toString = function () {
        // convert 0-base rows, cols, boxs to 1-base (1..9)
        var r = __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].userRow(this._cells[0]);
        var c = __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].userCol(this._cells[0]);
        var b = __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].userBox(this._cells[0]);
        switch (this.type) {
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_PAIRS_ROW:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Naked pairs {0}/{1} in row {2}', [this._candidates[0], this._candidates[1], r]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_PAIRS_COL:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Naked pairs {0}/{1} in col {2}', [this._candidates[0], this._candidates[1], c]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_PAIRS_BOX:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Naked pairs {0}/{1} in box {2}', [this._candidates[0], this._candidates[1], b]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].POINTING_ROW:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Pointing row {0}, box {1}, candidate {2}', [r, b, this._candidates[0]]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].POINTING_COL:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Pointing column {0}, box {1}, candidate {2}', [c, b, this._candidates[0]]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].ROW_BOX_REDUCTION:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Box reduction in box {0}, row {1}, candidate {2}', [b, r, this._candidates[0]]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].COL_BOX_REDUCTION:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Box reduction in box {0}, column {1}, candidate {2}', [b, c, this._candidates[0]]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_TRIPLES_ROW:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Naked triples {0}/{1}/{2} in row {3}', [this._candidates[0], this._candidates[1], this._candidates[2], r]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_TRIPLES_COL:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Naked triples {0}/{1}/{2} in column {3}', [this._candidates[0], this._candidates[1], this._candidates[2], c]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_TRIPLES_BOX:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Naked triples {0}/{1}/{2} in box {3}', [this._candidates[0], this._candidates[1], this._candidates[2], b]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_QUADS_ROW:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Naked quads {0}/{1}/{2}/{3} in row {4}', [this._candidates[0], this._candidates[1], this._candidates[2], this._candidates[3], r]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_QUADS_COL:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Naked quads {0}/{1}/{2}/{3} in column {4}', [this._candidates[0], this._candidates[1], this._candidates[2], this._candidates[3], c]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_QUADS_BOX:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Naked quads {0}/{1}/{2}/{3} in box {4}', [this._candidates[0], this._candidates[1], this._candidates[2], this._candidates[3], b]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_PAIRS_ROW:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Hidden pairs {0}/{1} in row {2}', [this._candidates[0], this._candidates[1], r]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_PAIRS_COL:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Hidden pairs {0}/{1} in column {2}', [this._candidates[0], this._candidates[1], c]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_PAIRS_BOX:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Hidden pairs {0}/{1} in box {2}', [this._candidates[0], this._candidates[1], b]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_TRIPLES_ROW:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Hidden triples {0}/{1}/{2} in row {3}', [this._candidates[0], this._candidates[1], this._candidates[2], r]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_TRIPLES_COL:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Hidden triples {0}/{1}/{2} in column {3}', [this._candidates[0], this._candidates[1], this._candidates[2], c]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_TRIPLES_BOX:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Hidden triples {0}/{1}/{2} in box {3}', [this._candidates[0], this._candidates[1], this._candidates[2], b]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_QUADS_ROW:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Hidden quads {0}/{1}/{2}/{3} in row {4}', [this._candidates[0], this._candidates[1], this._candidates[2], this._candidates[3], r]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_QUADS_COL:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Hidden quads {0}/{1}/{2}/{3} in column {4}', [this._candidates[0], this._candidates[1], this._candidates[2], this._candidates[3], c]);
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_QUADS_BOX:
                return __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].formatString('Hidden quads {0}/{1}/{2}/{3} in box {4}', [this._candidates[0], this._candidates[1], this._candidates[2], this._candidates[3], b]);
        } // switch
    }; // toString()
    return CandidatesHint;
}(Hint));

//# sourceMappingURL=hint.js.map

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(0);

var LogService = (function () {
    function LogService() {
        this._log = [];
    }
    LogService.prototype.initialize = function () {
        this._log = [];
    };
    LogService.prototype.removeAllEntries = function () {
        this._log = [];
    };
    LogService.prototype.addEntry = function (entry) {
        this._log.push(entry);
    };
    LogService.prototype.getLastEntry = function () {
        return this._log.length > 0 ? this._log[this._log.length - 1] : undefined;
    };
    LogService.prototype.getAllEntries = function () {
        return this._log;
    };
    LogService.prototype.getSize = function () {
        return this._log.length;
    };
    LogService.prototype.removeLastEntry = function () {
        this._log.pop();
    };
    LogService.prototype.toStringFirstFirst = function () {
        var s = '';
        var lineNr = 1;
        for (var _i = 0, _a = this._log; _i < _a.length; _i++) {
            var entry = _a[_i];
            s += __WEBPACK_IMPORTED_MODULE_0__common__["a" /* Common */].pad(lineNr++, 3) + '. '
                + entry.toString() + '\n';
        }
        return s;
    };
    LogService.prototype.toStringLastFirst = function () {
        var s = '';
        for (var lineNr = this._log.length; lineNr > 0; lineNr--) {
            s += __WEBPACK_IMPORTED_MODULE_0__common__["a" /* Common */].pad(lineNr, 3) + '. '
                + this._log[lineNr - 1].toString() + '\n';
        }
        return s;
    };
    return LogService;
}());

//# sourceMappingURL=log.service.js.map

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HintCounts; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__hint_type__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_difficulty__ = __webpack_require__(2);


var HintCounts = (function () {
    function HintCounts() {
        this.nakedSingles = 0;
        this.hiddenSinglesRow = 0;
        this.hiddenSinglesCol = 0;
        this.hiddenSinglesBox = 0;
        this.nakedPairsRow = 0;
        this.nakedPairsCol = 0;
        this.nakedPairsBox = 0;
        this.pointingRows = 0;
        this.pointingCols = 0;
        this.rowBoxReductions = 0;
        this.colBoxReductions = 0;
        this.nakedTriplesRow = 0;
        this.nakedTriplesCol = 0;
        this.nakedTriplesBox = 0;
        this.nakedQuadsRow = 0;
        this.nakedQuadsCol = 0;
        this.nakedQuadsBox = 0;
        this.hiddenPairsRow = 0;
        this.hiddenPairsCol = 0;
        this.hiddenPairsBox = 0;
        this.hiddenTriplesRow = 0;
        this.hiddenTriplesCol = 0;
        this.hiddenTriplesBox = 0;
        this.hiddenQuadsRow = 0;
        this.hiddenQuadsCol = 0;
        this.hiddenQuadsBox = 0;
        this.guesses = 0;
    }
    HintCounts.prototype.serialize = function () {
        return JSON.stringify({
            "nakedSingles": this.nakedSingles,
            "hiddenSinglesRow": this.hiddenSinglesRow,
            "hiddenSinglesCol": this.hiddenSinglesCol,
            "hiddenSinglesBox": this.hiddenSinglesBox,
            "nakedPairsRow": this.nakedPairsRow,
            "nakedPairsCol": this.nakedPairsCol,
            "nakedPairsBox": this.nakedPairsBox,
            "pointingRows": this.pointingRows,
            "pointingCols": this.pointingCols,
            "rowBoxReductions": this.rowBoxReductions,
            "colBoxReductions": this.colBoxReductions,
            "nakedTriplesRow": this.nakedTriplesRow,
            "nakedTriplesCol": this.nakedTriplesCol,
            "nakedTriplesBox": this.nakedTriplesBox,
            "nakedQuadsRow": this.nakedQuadsRow,
            "nakedQuadsCol": this.nakedQuadsCol,
            "nakedQuadsBox": this.nakedQuadsBox,
            "hiddenPairsRow": this.hiddenPairsRow,
            "hiddenPairsCol": this.hiddenPairsCol,
            "hiddenPairsBox": this.hiddenPairsBox,
            "hiddenTriplesRow": this.hiddenTriplesRow,
            "hiddenTriplesCol": this.hiddenTriplesCol,
            "hiddenTriplesBox": this.hiddenTriplesBox,
            "hiddenQuadsRow": this.hiddenQuadsRow,
            "hiddenQuadsCol": this.hiddenQuadsCol,
            "hiddenQuadsBox": this.hiddenQuadsBox,
            "guesses": this.guesses
        });
    };
    HintCounts.deserialize = function (hintCountsData) {
        // console.log('hintCountsData: ' + hintCountsData);
        var data = JSON.parse(hintCountsData);
        var hintCounts = new HintCounts();
        hintCounts.nakedSingles = data.nakedSingles;
        hintCounts.hiddenSinglesRow = data.hiddenSinglesRow;
        hintCounts.hiddenSinglesCol = data.hiddenSinglesCol;
        hintCounts.hiddenSinglesBox = data.hiddenSinglesBox;
        hintCounts.nakedPairsRow = data.nakedPairsRow;
        hintCounts.nakedPairsCol = data.nakedPairsCol;
        hintCounts.nakedPairsBox = data.nakedPairsBox;
        hintCounts.pointingRows = data.pointingRows;
        hintCounts.pointingCols = data.pointingCols;
        hintCounts.rowBoxReductions = data.rowBoxReductions;
        hintCounts.colBoxReductions = data.colBoxReductions;
        hintCounts.nakedTriplesRow = data.nakedTriplesRow;
        hintCounts.nakedTriplesCol = data.nakedTriplesCol;
        hintCounts.nakedTriplesBox = data.nakedTriplesBox;
        hintCounts.nakedQuadsRow = data.nakedQuadsRow;
        hintCounts.nakedQuadsCol = data.nakedQuadsCol;
        hintCounts.nakedQuadsBox = data.nakedQuadsBox;
        hintCounts.hiddenPairsRow = data.hiddenPairsRow;
        hintCounts.hiddenPairsCol = data.hiddenPairsCol;
        hintCounts.hiddenPairsBox = data.hiddenPairsBox;
        hintCounts.hiddenTriplesRow = data.hiddenTriplesRow;
        hintCounts.hiddenTriplesCol = data.hiddenTriplesCol;
        hintCounts.hiddenTriplesBox = data.hiddenTriplesBox;
        hintCounts.hiddenQuadsRow = data.hiddenQuadsRow;
        hintCounts.hiddenQuadsCol = data.hiddenQuadsCol;
        hintCounts.hiddenQuadsBox = data.hiddenQuadsBox;
        hintCounts.guesses = data.guesses;
        return hintCounts;
    };
    HintCounts.prototype.incrementHintCount = function (hintType) {
        switch (hintType) {
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_SINGLE:
                this.nakedSingles++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_SINGLE_ROW:
                this.hiddenSinglesRow++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_SINGLE_COL:
                this.hiddenSinglesCol++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_SINGLE_BOX:
                this.hiddenSinglesBox++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_PAIRS_ROW:
                this.nakedPairsRow++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_PAIRS_COL:
                this.nakedPairsCol++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_PAIRS_BOX:
                this.nakedPairsBox++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].POINTING_ROW:
                this.pointingRows++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].POINTING_COL:
                this.pointingCols++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].ROW_BOX_REDUCTION:
                this.rowBoxReductions++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].COL_BOX_REDUCTION:
                this.colBoxReductions++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_TRIPLES_ROW:
                this.nakedTriplesRow++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_TRIPLES_COL:
                this.nakedTriplesCol++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_TRIPLES_BOX:
                this.nakedTriplesBox++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_PAIRS_ROW:
                this.hiddenPairsRow++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_PAIRS_COL:
                this.hiddenPairsCol++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_PAIRS_BOX:
                this.hiddenPairsBox++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_QUADS_ROW:
                this.nakedQuadsRow++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_QUADS_COL:
                this.nakedQuadsCol++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].NAKED_QUADS_BOX:
                this.nakedQuadsBox++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_TRIPLES_ROW:
                this.hiddenTriplesRow++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_TRIPLES_COL:
                this.hiddenTriplesCol++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_TRIPLES_BOX:
                this.hiddenTriplesBox++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_QUADS_ROW:
                this.hiddenQuadsRow++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_QUADS_COL:
                this.hiddenQuadsCol++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].HIDDEN_QUADS_BOX:
                this.hiddenQuadsBox++;
            case __WEBPACK_IMPORTED_MODULE_0__hint_type__["a" /* HintType */].GUESS:
                this.guesses++;
        }
    };
    HintCounts.prototype.getNakedSingles = function () {
        return this.nakedSingles;
    };
    HintCounts.prototype.getHiddenSingles = function () {
        return this.hiddenSinglesRow
            + this.hiddenSinglesCol
            + this.hiddenSinglesBox;
    };
    HintCounts.prototype.getNakedPairs = function () {
        return this.nakedPairsRow
            + this.nakedPairsCol
            + this.nakedPairsBox;
    };
    HintCounts.prototype.getPointingRowsCols = function () {
        return this.pointingRows
            + this.pointingCols;
    };
    HintCounts.prototype.getBoxReductions = function () {
        return this.rowBoxReductions
            + this.colBoxReductions;
    };
    HintCounts.prototype.getNakedTriples = function () {
        return this.nakedTriplesRow
            + this.nakedTriplesCol
            + this.nakedTriplesBox;
    };
    HintCounts.prototype.getNakedQuads = function () {
        return this.nakedQuadsRow
            + this.nakedQuadsCol
            + this.nakedQuadsBox;
    };
    HintCounts.prototype.getHiddenPairs = function () {
        return this.hiddenPairsRow
            + this.hiddenPairsCol
            + this.hiddenPairsBox;
    };
    HintCounts.prototype.getHiddenTriples = function () {
        return this.hiddenTriplesRow
            + this.hiddenTriplesCol
            + this.hiddenTriplesBox;
    };
    HintCounts.prototype.getHiddenQuads = function () {
        return this.hiddenQuadsRow
            + this.hiddenQuadsCol
            + this.hiddenQuadsBox;
    };
    HintCounts.prototype.getGuesses = function () {
        return this.guesses;
    };
    HintCounts.prototype.getTotalHints = function () {
        return 0
            + this.nakedSingles
            + this.hiddenSinglesRow
            + this.hiddenSinglesCol
            + this.hiddenSinglesBox
            + this.nakedPairsRow
            + this.nakedPairsCol
            + this.nakedPairsBox
            + this.pointingRows
            + this.pointingCols
            + this.rowBoxReductions
            + this.colBoxReductions
            + this.nakedTriplesRow
            + this.nakedTriplesCol
            + this.nakedTriplesBox
            + this.nakedQuadsRow
            + this.nakedQuadsCol
            + this.nakedQuadsBox
            + this.hiddenPairsRow
            + this.hiddenPairsCol
            + this.hiddenPairsBox
            + this.hiddenTriplesRow
            + this.hiddenTriplesCol
            + this.hiddenTriplesBox
            + this.hiddenQuadsRow
            + this.hiddenQuadsCol
            + this.hiddenQuadsBox
            + this.guesses;
    };
    /**
     * Determine the difficulty of a sudoku based on the techniques required to
     * achieve the solution.
     */
    HintCounts.prototype.getActualDifficulty = function () {
        // HARDEST
        if (this.guesses > 0) {
            return __WEBPACK_IMPORTED_MODULE_1__model_difficulty__["a" /* Difficulty */].HARDEST;
        }
        // HARD
        if (this.getNakedTriples() > 0
            || this.getNakedQuads() > 0
            || this.getHiddenPairs() > 0
            || this.getHiddenTriples() > 0
            || this.getHiddenQuads() > 0) {
            return __WEBPACK_IMPORTED_MODULE_1__model_difficulty__["a" /* Difficulty */].HARD;
        }
        // MEDIUM
        if (this.getNakedPairs() > 0
            || this.getPointingRowsCols() > 0
            || this.getBoxReductions() > 0) {
            return __WEBPACK_IMPORTED_MODULE_1__model_difficulty__["a" /* Difficulty */].MEDIUM;
        }
        // EASY
        if (this.getHiddenSingles() > 0
            || this.nakedSingles > 0) {
            return __WEBPACK_IMPORTED_MODULE_1__model_difficulty__["a" /* Difficulty */].EASY;
        }
        return __WEBPACK_IMPORTED_MODULE_1__model_difficulty__["a" /* Difficulty */].EASY;
    }; // getDifficultyType()
    /**
     *
     */
    HintCounts.prototype.toString = function () {
        var s = '';
        s += 'NS   : ' + this.nakedSingles + '\n';
        s += 'HS*  : ' + this.hiddenSinglesRow + ', '
            + this.hiddenSinglesCol + ', '
            + this.hiddenSinglesBox + '\n';
        s += 'NP*  : ' + this.nakedPairsRow + ', '
            + this.nakedPairsCol + ', '
            + this.nakedPairsBox + '\n';
        s += 'P*   : ' + this.pointingRows + ', '
            + this.pointingCols + '\n';
        s += '*BR  : ' + this.rowBoxReductions + ', '
            + this.colBoxReductions + '\n';
        s += 'NT*  : ' + this.nakedTriplesRow + ', '
            + this.nakedTriplesCol + ', '
            + this.nakedTriplesBox + '\n';
        s += 'NQ*  : ' + this.nakedQuadsRow + ', '
            + this.nakedQuadsCol + ', '
            + this.nakedQuadsBox + '\n';
        s += 'HP*  : ' + this.hiddenPairsRow + ', '
            + this.hiddenPairsCol + ', '
            + this.hiddenPairsBox + '\n';
        s += 'HT*  : ' + this.hiddenTriplesRow + ', '
            + this.hiddenTriplesCol + ', '
            + this.hiddenTriplesBox + '\n';
        s += 'HQ*  : ' + this.hiddenQuadsRow + ', '
            + this.hiddenQuadsCol + ', '
            + this.hiddenQuadsBox + '\n';
        s += 'G    : ' + this.guesses + '\n';
        s += 'Total: ' + this.getTotalHints();
        return s;
    };
    return HintCounts;
}());

//# sourceMappingURL=hintCounts.js.map

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NakedType; });
var NakedType;
(function (NakedType) {
    NakedType[NakedType["SINGLE"] = 0] = "SINGLE";
    NakedType[NakedType["PAIR"] = 1] = "PAIR";
    NakedType[NakedType["TRIPLE"] = 2] = "TRIPLE";
    NakedType[NakedType["QUAD"] = 3] = "QUAD";
})(NakedType || (NakedType = {}));
//# sourceMappingURL=naked.type.js.map

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Puzzle; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_common__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__difficulty__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__hint_hintCounts__ = __webpack_require__(6);



var Puzzle = (function () {
    function Puzzle() {
        this._initialValues = undefined;
        this._completedPuzzle = undefined;
        this._desiredDifficulty = undefined;
        this._actualDifficulty = undefined;
        this._actualDifficulty = undefined;
        this._solutionsCount = undefined;
        this._stats = undefined;
    }
    Puzzle.prototype.serialize = function () {
        return JSON.stringify({
            "_initialValues": this._initialValues,
            "_completedPuzzle": this._completedPuzzle,
            "_desiredDifficulty": this._desiredDifficulty,
            "_actualDifficulty": this._actualDifficulty,
            "_generatePasses": this._generatePasses,
            "_solutionsCount": this._solutionsCount,
            "_stats": this._stats.serialize()
        });
    }; // serialize()
    Puzzle.deserialize = function (puzzleData) {
        // console.log(puzzleData.getStats());
        var data = JSON.parse(puzzleData);
        var puzzle = new Puzzle();
        puzzle._initialValues = data._initialValues;
        puzzle._completedPuzzle = data._completedPuzzle;
        puzzle._desiredDifficulty = data._desiredDifficulty;
        puzzle._actualDifficulty = data._actualDifficulty;
        puzzle._generatePasses = data._generatePasses;
        puzzle._solutionsCount = data._solutionsCount;
        puzzle._stats = __WEBPACK_IMPORTED_MODULE_2__hint_hintCounts__["a" /* HintCounts */].deserialize(data._stats);
        return puzzle;
    }; // deserialize()
    Object.defineProperty(Puzzle.prototype, "initialValues", {
        get: function () {
            return this._initialValues;
        },
        set: function (initialValues) {
            this._initialValues = initialValues;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Puzzle.prototype, "completedPuzzle", {
        get: function () {
            return this._completedPuzzle;
        },
        set: function (completedPuzzle) {
            this._completedPuzzle = completedPuzzle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Puzzle.prototype, "desiredDifficulty", {
        get: function () {
            return this._desiredDifficulty;
        },
        set: function (difficulty) {
            this._desiredDifficulty = difficulty;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Puzzle.prototype, "actualDifficulty", {
        get: function () {
            return this._actualDifficulty;
        },
        set: function (difficulty) {
            this._actualDifficulty = difficulty;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Puzzle.prototype, "generatePasses", {
        get: function () {
            return this._generatePasses;
        },
        set: function (generatePasses) {
            this._generatePasses = generatePasses;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Puzzle.prototype, "solutionsCount", {
        get: function () {
            return this._solutionsCount;
        },
        set: function (solutionsCount) {
            this._solutionsCount = solutionsCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Puzzle.prototype, "stats", {
        get: function () {
            return this._stats;
        },
        set: function (stats) {
            this._stats = stats;
        },
        enumerable: true,
        configurable: true
    });
    Puzzle.prototype.getInitialEmptyCells = function () {
        var emptyCells = 0;
        for (var _i = 0, _a = this._initialValues; _i < _a.length; _i++) {
            var i = _a[_i];
            if (i === 0) {
                emptyCells++;
            }
        }
        return emptyCells;
    };
    Puzzle.prototype.getInitialFilledCells = function () {
        var filledCells = 0;
        for (var _i = 0, _a = this._initialValues; _i < _a.length; _i++) {
            var i = _a[_i];
            if (i != 0) {
                filledCells++;
            }
        }
        return filledCells;
    };
    Puzzle.getDifficultyLabel = function (difficulty) {
        switch (difficulty) {
            // case Difficulty.UNKNOWN:
            //   return 'Unknown';
            case __WEBPACK_IMPORTED_MODULE_1__difficulty__["a" /* Difficulty */].EASY:
                return 'Easy';
            case __WEBPACK_IMPORTED_MODULE_1__difficulty__["a" /* Difficulty */].MEDIUM:
                return 'Medium';
            case __WEBPACK_IMPORTED_MODULE_1__difficulty__["a" /* Difficulty */].HARD:
                return 'Hard';
            case __WEBPACK_IMPORTED_MODULE_1__difficulty__["a" /* Difficulty */].HARDEST:
                return 'Hardest';
        }
    };
    Puzzle.prototype.toString = function () {
        var s = '';
        s += '-Initial given/empty/total cells: '
            + this.getInitialFilledCells() + '/'
            + this.getInitialEmptyCells() + '/'
            + (this.getInitialFilledCells() + this.getInitialEmptyCells()) + '\n';
        s += '-Initial & finished values:\n';
        s += __WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].valuesArrayToString(this._initialValues) + '\n';
        s += __WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].valuesArrayToString(this._completedPuzzle) + '\n';
        s += '-Creation passes: ' + this._generatePasses + '\n';
        s += '-Difficulty desired/actual: '
            + Puzzle.getDifficultyLabel(this._desiredDifficulty) + '/'
            + Puzzle.getDifficultyLabel(this._actualDifficulty) + '\n';
        if (this._solutionsCount) {
            s += '-Solutions count: ' + this._solutionsCount + '\n';
        }
        if (this._stats) {
            s += '-Stats:\n' + this._stats.toString() + '\n';
        }
        return s;
    };
    return Puzzle;
}());

//# sourceMappingURL=puzzle.js.map

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__creation_service__ = __webpack_require__(14);
// console.log('Creation web worker loaded.');

// prevent TypeScript compile error
var customPostMessage = postMessage;
// the worker has an instance of the CPU-intensive service
var creationService = new __WEBPACK_IMPORTED_MODULE_0__creation_service__["a" /* CreationService */]();
/**
 * onmessage executes when a posted message is received by the web worker.
 */
onmessage = function (event) {
    var difficulty = event.data;
    // let createdSudoku: string = undefined;
    // console.info('creation.worker.onmessage difficullty: ' + difficulty);
    console.info('\nCreation started in background ...');
    // perform CPU-intense task in web worker
    var createdSudoku = creationService.createSudoku(difficulty);
    // console.info('creation.worker created diff: ' + difficulty);
    console.info('\nCreation background completed');
    // post a message with result back to the requester (AppComponent)
    customPostMessage(createdSudoku);
    // customPostMessage('A B C');
};
//# sourceMappingURL=creation.worker.js.map

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActionLogService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_log_service__ = __webpack_require__(5);
// import { Injectable } from '@angular/core';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

// @Injectable()
var ActionLogService = (function (_super) {
    __extends(ActionLogService, _super);
    function ActionLogService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActionLogService.prototype.addEntry = function (entry) {
        _super.prototype.addEntry.call(this, entry);
    };
    ActionLogService.prototype.getLastEntry = function () {
        return _super.prototype.getLastEntry.call(this);
    };
    return ActionLogService;
}(__WEBPACK_IMPORTED_MODULE_0__common_log_service__["a" /* LogService */]));

//# sourceMappingURL=action-log.service.js.map

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HintLogService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_log_service__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__hint_type__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__hintCounts__ = __webpack_require__(6);
// import { Injectable } from '@angular/core';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



// @Injectable()
var HintLogService = (function (_super) {
    __extends(HintLogService, _super);
    function HintLogService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HintLogService.prototype.addEntry = function (entry) {
        _super.prototype.addEntry.call(this, entry);
    };
    HintLogService.prototype.getAllEntries = function () {
        return _super.prototype.getAllEntries.call(this);
    };
    HintLogService.prototype.getLastEntry = function () {
        return _super.prototype.getLastEntry.call(this);
    };
    HintLogService.prototype.getHintCounts = function () {
        var hintCounts = new __WEBPACK_IMPORTED_MODULE_2__hintCounts__["a" /* HintCounts */]();
        for (var _i = 0, _a = this.getAllEntries(); _i < _a.length; _i++) {
            var hint = _a[_i];
            switch (hint.type) {
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].NAKED_SINGLE:
                    hintCounts.nakedSingles++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].HIDDEN_SINGLE_ROW:
                    hintCounts.hiddenSinglesRow++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].HIDDEN_SINGLE_COL:
                    hintCounts.hiddenSinglesCol++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].HIDDEN_SINGLE_BOX:
                    hintCounts.hiddenSinglesBox++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].NAKED_PAIRS_ROW:
                    hintCounts.nakedPairsRow++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].NAKED_PAIRS_COL:
                    hintCounts.nakedPairsCol++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].NAKED_PAIRS_BOX:
                    hintCounts.nakedPairsBox++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].POINTING_ROW:
                    hintCounts.pointingRows++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].POINTING_COL:
                    hintCounts.pointingCols++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].ROW_BOX_REDUCTION:
                    hintCounts.rowBoxReductions++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].COL_BOX_REDUCTION:
                    hintCounts.colBoxReductions++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].NAKED_TRIPLES_ROW:
                    hintCounts.nakedTriplesRow++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].NAKED_TRIPLES_COL:
                    hintCounts.nakedTriplesCol++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].NAKED_TRIPLES_BOX:
                    hintCounts.nakedTriplesBox++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].NAKED_QUADS_ROW:
                    hintCounts.nakedQuadsRow++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].NAKED_QUADS_COL:
                    hintCounts.nakedQuadsCol++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].NAKED_QUADS_BOX:
                    hintCounts.nakedQuadsBox++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].HIDDEN_PAIRS_ROW:
                    hintCounts.hiddenPairsRow++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].HIDDEN_PAIRS_COL:
                    hintCounts.hiddenPairsCol++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].HIDDEN_PAIRS_BOX:
                    hintCounts.hiddenPairsBox++;
                    break;
                case __WEBPACK_IMPORTED_MODULE_1__hint_type__["a" /* HintType */].GUESS:
                    hintCounts.guesses++;
                    break;
                default:
            } // switch
        } // for hints in log
        return hintCounts;
    }; // getHintCounts()
    return HintLogService;
}(__WEBPACK_IMPORTED_MODULE_0__common_log_service__["a" /* LogService */]));

//# sourceMappingURL=hint-log.service.js.map

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HintService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_common__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_naked_type__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_difficulty__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__action_action__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__hint_hint__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__hint_hint_log_service__ = __webpack_require__(11);
// import { Injectable } from '@angular/core';
















/**
 *
 */
// @Injectable()
var HintService = (function () {
    function HintService(
        // private sudokuService: SudokuService,
        // private hintLog: HintLogService
        sudokuService) {
        this.hintLog = new __WEBPACK_IMPORTED_MODULE_6__hint_hint_log_service__["a" /* HintLogService */]();
        this.sudokuService = sudokuService;
    }
    HintService.prototype.initializeHintLog = function () {
        this.hintLog.initialize();
    };
    HintService.prototype.addHintLogEntry = function (hint) {
        this.hintLog.addEntry(hint);
    };
    HintService.prototype.getHintCounts = function () {
        return this.hintLog.getHintCounts();
    };
    HintService.prototype.getActiveHint = function () {
        return this.activeHint;
    };
    /**
     * Check for any hints at this state of the sudoku solution progress. If
     * maxDifficulty is set to EASY only the easy solution techniques will be
     * sought for a hint. Similarly for MEDIUM and HARD.
     */
    HintService.prototype.getHint = function (maxDifficulty) {
        this.activeHint = undefined;
        // first, easy techniques
        if (this.checkNakedSingles()
            || this.checkHiddenSingles()) {
            return this.activeHint;
        }
        if (maxDifficulty === __WEBPACK_IMPORTED_MODULE_2__model_difficulty__["a" /* Difficulty */].EASY) {
            return undefined; // no hints using easy techniques
        }
        // next, medium techniques
        if (this.checkNakedPairs()
            || this.checkPointingRowCol()
            || this.checkRowBoxReductions()
            || this.checkColBoxReductions()) {
            return this.activeHint;
        }
        if (maxDifficulty === __WEBPACK_IMPORTED_MODULE_2__model_difficulty__["a" /* Difficulty */].MEDIUM) {
            return undefined; // no hints using easy and medium techniques
        }
        // finally, hard techniques
        if (this.checkNakedTriples()
            || this.checkNakedQuads()
            || this.checkHiddenPairs()
            || this.checkHiddenTriples()) {
            return this.activeHint;
        }
        return undefined; // no hints using any techniques without guessing
    }; // getHint()
    /**
     * Apply hint toward solution.
     */
    HintService.prototype.applyHint = function () {
        // let args = hint.removals;
        if (this.activeHint == undefined) {
            return; // no hunt to apply
        }
        this.hintLog.addEntry(this.activeHint);
        // switch (hint.action) {
        switch (this.activeHint.type) {
            case __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].NAKED_SINGLE:
            case __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].HIDDEN_SINGLE_ROW:
            case __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].HIDDEN_SINGLE_COL:
            case __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].HIDDEN_SINGLE_BOX:
                var vHint = this.activeHint;
                this.sudokuService.setValue(vHint.cell, vHint.value, __WEBPACK_IMPORTED_MODULE_3__action_action__["a" /* ActionType */].SET_VALUE, undefined, vHint);
                break;
            default:
                var kHint = this.activeHint;
                var removals = kHint.removals;
                for (var _i = 0, removals_1 = removals; _i < removals_1.length; _i++) {
                    var removal = removals_1[_i];
                    this.sudokuService.removeCandidate(removal.c, removal.k, kHint);
                }
        } // switch
        this.activeHint = undefined;
    }; // applyHint()
    /**
     * Apply hint toward solution.
     */
    HintService.prototype.applyGivenHint = function (hint) {
        if (hint == undefined) {
            return; // no hunt to apply
        }
        this.hintLog.addEntry(hint);
        // switch (hint.action) {
        switch (hint.type) {
            case __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].NAKED_SINGLE:
            case __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].HIDDEN_SINGLE_ROW:
            case __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].HIDDEN_SINGLE_COL:
            case __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].HIDDEN_SINGLE_BOX:
                var vHint = hint;
                this.sudokuService.setValue(vHint.cell, vHint.value, __WEBPACK_IMPORTED_MODULE_3__action_action__["a" /* ActionType */].SET_VALUE, undefined, vHint);
                break;
            default:
                var kHint = hint;
                var removals = kHint.removals;
                for (var _i = 0, removals_2 = removals; _i < removals_2.length; _i++) {
                    var removal = removals_2[_i];
                    this.sudokuService.removeCandidate(removal.c, removal.k, kHint);
                }
        } // switch
        hint = undefined;
    }; // applyHint()
    /**
     * Randomly look for cells with a single candidate. If found, create a hint
     * and return true. If none found, return false.
     */
    HintService.prototype.checkNakedSingles = function () {
        for (var _i = 0, _a = __WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].shuffleArray(__WEBPACK_IMPORTED_MODULE_0__common_common__["b" /* CELLS */].slice()); _i < _a.length; _i++) {
            var c = _a[_i];
            var nakedCells = this.sudokuService.findNakedCandidates(c, __WEBPACK_IMPORTED_MODULE_1__model_naked_type__["a" /* NakedType */].SINGLE);
            if (nakedCells.length > 0) {
                this.activeHint = new __WEBPACK_IMPORTED_MODULE_4__hint_hint__["a" /* ValueHint */](__WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].NAKED_SINGLE, c, nakedCells[0]);
                return true;
            }
        } // next random cell
        return false;
    }; // checkNakedSingles()
    /**
     * Check for hidden singles in rows, columns, and boxes. If found, create
     * a hint and return true, otherwise return false.
     */
    HintService.prototype.checkHiddenSingles = function () {
        for (var _i = 0, ROWS_1 = __WEBPACK_IMPORTED_MODULE_0__common_common__["d" /* ROWS */]; _i < ROWS_1.length; _i++) {
            var r = ROWS_1[_i];
            if (this.checkHiddenSinglesGroup(this.sudokuService.getRow(r), __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].HIDDEN_SINGLE_ROW)) {
                return true;
            }
        }
        for (var _a = 0, COLS_1 = __WEBPACK_IMPORTED_MODULE_0__common_common__["e" /* COLS */]; _a < COLS_1.length; _a++) {
            var c = COLS_1[_a];
            if (this.checkHiddenSinglesGroup(this.sudokuService.getCol(c), __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].HIDDEN_SINGLE_COL)) {
                return true;
            }
        }
        for (var _b = 0, BOXS_1 = __WEBPACK_IMPORTED_MODULE_0__common_common__["f" /* BOXS */]; _b < BOXS_1.length; _b++) {
            var b = BOXS_1[_b];
            if (this.checkHiddenSinglesGroup(this.sudokuService.getBox(b), __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].HIDDEN_SINGLE_BOX)) {
                return true;
            }
        }
        return false;
    }; // checkHiddenSingles()
    /**
     * Check for hidden singles in a group (row, column, or box). If found,
     * create a hint and return true, otherwise return false.
     */
    HintService.prototype.checkHiddenSinglesGroup = function (group, hintType) {
        var singleCell = -1;
        NEXT_CANDIDATE: for (var _i = 0, CANDIDATES_1 = __WEBPACK_IMPORTED_MODULE_0__common_common__["g" /* CANDIDATES */]; _i < CANDIDATES_1.length; _i++) {
            var k = CANDIDATES_1[_i];
            if (this.sudokuService.containsValue(group, k)) {
                continue NEXT_CANDIDATE; // candidate cannot be single
            }
            var kCountInGroup = 0;
            for (var _a = 0, _b = group.cells; _a < _b.length; _a++) {
                var c = _b[_a];
                if (this.sudokuService.isCandidate(c, k)) {
                    kCountInGroup++;
                    if (kCountInGroup > 1) {
                        continue NEXT_CANDIDATE; // not single
                    }
                    singleCell = c;
                }
            } // for cells in group
            if (kCountInGroup === 1) {
                this.activeHint = new __WEBPACK_IMPORTED_MODULE_4__hint_hint__["a" /* ValueHint */](hintType, singleCell, k);
                return true;
            }
        } // for candidates
        return false;
    }; // checkGroupHiddenSingles()
    /**
     * Check for naked pairs in rows, columns, and boxes. If found, create a hint
     * and return true, otherwise return false.
     */
    HintService.prototype.checkNakedPairs = function () {
        // get array of cells with 2 and only 2 candidates
        var nakedCells = [];
        for (var _i = 0, CELLS_1 = __WEBPACK_IMPORTED_MODULE_0__common_common__["b" /* CELLS */]; _i < CELLS_1.length; _i++) {
            var c = CELLS_1[_i];
            var nakedCands = this.sudokuService.findNakedCandidates(c, __WEBPACK_IMPORTED_MODULE_1__model_naked_type__["a" /* NakedType */].PAIR);
            if (nakedCands.length > 0) {
                nakedCells.push({ idx: c, cands: nakedCands });
            }
        }
        if (nakedCells.length == 0) {
            return false;
        }
        // find 2 cells that have same 2 candidates
        for (var i1 = 0; i1 < nakedCells.length; i1++) {
            for (var i2 = i1 + 1; i2 < nakedCells.length; i2++) {
                var candidates = [];
                candidates = nakedCells[i1].cands.slice();
                // add unique candidates from nakedCells[i2].candidates
                for (var _a = 0, _b = nakedCells[i2].cands; _a < _b.length; _a++) {
                    var i = _b[_a];
                    if (candidates.indexOf(i) === -1) {
                        candidates.push(i);
                    }
                }
                if (candidates.length != 2) {
                    continue; // must be 2 for naked pair
                }
                // see if cells with common candidates are in same group
                var cells = [nakedCells[i1].idx, nakedCells[i2].idx];
                // look for actions; if none, move on
                if (__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].areCellsInSameRow(cells)) {
                    if (this.checkNakedsRemovals(__WEBPACK_IMPORTED_MODULE_0__common_common__["h" /* ROW_CELLS */][__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].rowIdx(cells[0])], cells, candidates, __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].NAKED_PAIRS_ROW)) {
                        return true;
                    }
                }
                if (__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].areCellsInSameCol(cells)) {
                    if (this.checkNakedsRemovals(__WEBPACK_IMPORTED_MODULE_0__common_common__["i" /* COL_CELLS */][__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].colIdx(cells[0])], cells, candidates, __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].NAKED_PAIRS_COL)) {
                        return true;
                    }
                }
                if (__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].areCellsInSameBox(cells)) {
                    if (this.checkNakedsRemovals(__WEBPACK_IMPORTED_MODULE_0__common_common__["j" /* BOX_CELLS */][__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].boxIdx(cells[0])], cells, candidates, __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].NAKED_PAIRS_BOX)) {
                        return true;
                    }
                }
            } // for i2
        } // for i1
        return false;
    }; // checkNakedPairs()
    /**
     * Check for naked triples in rows, columns, and boxes. If found, create a
     * hint and return true, otherwise return false. A group must have at least
     * 5 open cells to allow a naked triple.
     */
    HintService.prototype.checkNakedTriples = function () {
        // get array of cells with 2 or 3 candidates
        var nakedCells = [];
        for (var _i = 0, CELLS_2 = __WEBPACK_IMPORTED_MODULE_0__common_common__["b" /* CELLS */]; _i < CELLS_2.length; _i++) {
            var c = CELLS_2[_i];
            var nakedCands = this.sudokuService.findNakedCandidates(c, __WEBPACK_IMPORTED_MODULE_1__model_naked_type__["a" /* NakedType */].TRIPLE);
            if (nakedCands.length > 0) {
                nakedCells.push({ idx: c, cands: nakedCands });
            }
        }
        if (nakedCells.length == 0) {
            return false;
        }
        // find 3 cells that have same 2 or 3 candidates
        for (var i1 = 0; i1 < nakedCells.length; i1++) {
            for (var i2 = i1 + 1; i2 < nakedCells.length; i2++) {
                for (var i3 = i2 + 1; i3 < nakedCells.length; i3++) {
                    var candidates = [];
                    candidates = nakedCells[i1].cands.slice();
                    // add unique candidates from nakedCells[i2].candidates
                    for (var _a = 0, _b = nakedCells[i2].cands; _a < _b.length; _a++) {
                        var i = _b[_a];
                        if (candidates.indexOf(i) === -1) {
                            candidates.push(i);
                        }
                    }
                    if (candidates.length > 3) {
                        continue; // must be 3 for naked triple
                    }
                    // add unique candidates from nakedCells[i3].candidates
                    for (var _c = 0, _d = nakedCells[i3].cands; _c < _d.length; _c++) {
                        var i = _d[_c];
                        if (candidates.indexOf(i) === -1) {
                            candidates.push(i);
                        }
                    }
                    if (candidates.length != 3) {
                        continue; // must be 3 for naked triple
                    }
                    // see if cells with common candidates are in same group
                    var cells = [nakedCells[i1].idx,
                        nakedCells[i2].idx, nakedCells[i3].idx];
                    // look for actions; if none, move on
                    if (__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].areCellsInSameRow(cells)) {
                        if (this.checkNakedsRemovals(__WEBPACK_IMPORTED_MODULE_0__common_common__["h" /* ROW_CELLS */][__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].rowIdx(cells[0])], cells, candidates, __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].NAKED_TRIPLES_ROW)) {
                            return true;
                        }
                    }
                    if (__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].areCellsInSameCol(cells)) {
                        if (this.checkNakedsRemovals(__WEBPACK_IMPORTED_MODULE_0__common_common__["i" /* COL_CELLS */][__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].colIdx(cells[0])], cells, candidates, __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].NAKED_TRIPLES_COL)) {
                            return true;
                        }
                    }
                    if (__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].areCellsInSameBox(cells)) {
                        if (this.checkNakedsRemovals(__WEBPACK_IMPORTED_MODULE_0__common_common__["j" /* BOX_CELLS */][__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].boxIdx(cells[0])], cells, candidates, __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].NAKED_TRIPLES_BOX)) {
                            return true;
                        }
                    }
                } // for i3
            } // for i2
        } // for i1
        return false;
    }; // checkNakedTriples()
    /**
     * TODO
     * Check for naked pairs, triples, or quads in a group (row, column, or box).
     * If found, create a
     * hint and return true, otherwise return false. A group must have
     * 5 or more open (4 or fewer closed) cells to allow a naked triple.
     *
     * If only 4 open cells then 5 value
     * cells means only 4 candidates in group. A naked triple takes 3 cells,
     * therefore the 4th cell must be a naked single which would have been
     * already found.
     */
    HintService.prototype.checkNakedPairsGroup = function (group, hintType) {
        if (this.sudokuService.candidateCellsCount(group) >= 4) {
            return false; // see method comment 
        }
        // TODO
        return false;
    };
    HintService.prototype.checkNakedTriplesGroup = function (group, hintType) {
        if (this.sudokuService.candidateCellsCount(group) >= 5) {
            return false; // see method comment 
        }
        // TODO
        return false;
    };
    HintService.prototype.checkNakedQuadsGroup = function (group, hintType) {
        if (this.sudokuService.candidateCellsCount(group) >= 6) {
            return false; // see method comment 
        }
        // TODO
        return false;
    };
    /*
    private checkNakedXXXXsGroup(group: Group, hintType: HintType) : boolean {
      if (this.sudokuService.candidateCellsCount(group) >= 5) {
        return false;   // see method comment
      }
  
      // approach 1 TODO
      // find cells in group with 2 or 3 (<= 3) cands -- cells23 [a, b, c, d, ...]
      // must have at least 3 cells (may be 3, 4, 5, 6, 7, 8, or 9)
      // for cells23, get cands cells23Cands [i, j, k, l, ...]
  
      // get group cells 2 or 3 candidates;
      // there can't be any with 1 which would be naked single
  
      // let cells = []; // cells with 2-3 candidates
      // for (let c of group.groupCells) {
      //   let cell = this.cells[c];
      //   if (!cell.hasValue() && cell.getNumberOfCandidates() <= 3) {
      //     cells.push(cell);
      //   }
      // }
      // if (cells.length < 3) {
      //   return false;   // need at least 3 for naked triple
      // }
  
      let nakedCells: [{ c: number, ks: number[] }];
      for (let c of group.groupCells) {
        let cands = this.cells[c].getCandidates()
        if (cands.length <= 3) {
          nakedCells.push({c: c, ks: cands});
        }
      }
      if (nakedCells.length < 3) {
        return false;   // need at least 3 for naked triple
      }
  
      // does a combo of cells have only 3 cands?
      let it = new CombinationIterator(nakedCells, 3);
      let cands: number[] = [];
      while (it.hasNext()) {
        let combination = it.next();
        for (let c of combination) {
          for (let k of c.ks) {
            if (cands.indexOf(k) == -1) {
              cands.push(k);
            }
          }
        }
        if (cands.length == 3) {
          // 3 cells w/3 cands
          // check for removals
        }
      }
  
  
  
      // get candidates that appear in cells with 2-3 candidates
      // let cands = [];
      // for (let cell of nakedCells) {
      //   for (let k of cell.getCandiates()) {
      //     if (cands.indexOf(k) == -1) {
      //       cands.push(k);
      //     }
      //   }
      // }
  
      // check for 3 cell combinations
  
      // approach 2
      // find cands in group occurring 2 or 3 (<= 3) times -- cands23 [k1, k2, k3, k4, ... ]
      // must have at least 3 cands
  
      return false
    } // checkNakedTriplesGroup()
    */
    /**
     * Check for naked triples in rows, columns, and boxes. If found, create a hint
     * and return true, otherwise return false.
     */
    HintService.prototype.checkNakedQuads = function () {
        // get array of cells with 2, 3, or 4 candidates
        var nakedCells = [];
        for (var _i = 0, CELLS_3 = __WEBPACK_IMPORTED_MODULE_0__common_common__["b" /* CELLS */]; _i < CELLS_3.length; _i++) {
            var c = CELLS_3[_i];
            var nakedCands = this.sudokuService.findNakedCandidates(c, __WEBPACK_IMPORTED_MODULE_1__model_naked_type__["a" /* NakedType */].QUAD);
            if (nakedCands.length > 0) {
                nakedCells.push({ idx: c, cands: nakedCands });
            }
        }
        if (nakedCells.length == 0) {
            return false;
        }
        // find 4 cells that have same 2, 3, or 4 candidates
        for (var i1 = 0; i1 < nakedCells.length; i1++) {
            for (var i2 = i1 + 1; i2 < nakedCells.length; i2++) {
                for (var i3 = i2 + 1; i3 < nakedCells.length; i3++) {
                    for (var i4 = i3 + 1; i4 < nakedCells.length; i4++) {
                        var candidates = [];
                        candidates = nakedCells[i1].cands.slice();
                        // add unique candidates from nakedCells[i2].cands
                        for (var _a = 0, _b = nakedCells[i2].cands; _a < _b.length; _a++) {
                            var i = _b[_a];
                            if (candidates.indexOf(i) === -1) {
                                candidates.push(i);
                            }
                        }
                        if (candidates.length > 4) {
                            continue; // must be 4 for naked quad
                        }
                        // add unique candidates from nakedCells[i3].cands
                        for (var _c = 0, _d = nakedCells[i3].cands; _c < _d.length; _c++) {
                            var i = _d[_c];
                            if (candidates.indexOf(i) === -1) {
                                candidates.push(i);
                            }
                        }
                        if (candidates.length > 4) {
                            continue; // must be 4 for naked quad
                        }
                        // add unique candidates from nakedCells[i4].cands
                        for (var _e = 0, _f = nakedCells[i4].cands; _e < _f.length; _e++) {
                            var i = _f[_e];
                            if (candidates.indexOf(i) === -1) {
                                candidates.push(i);
                            }
                        }
                        if (candidates.length != 4) {
                            continue; // must be 4 for naked quad
                        }
                        // see if cells with common candidates are in same group
                        var cells = [nakedCells[i1].idx,
                            nakedCells[i2].idx, nakedCells[i3].idx, nakedCells[i4].idx];
                        // look for actions; if none, move on
                        if (__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].areCellsInSameRow(cells)) {
                            if (this.checkNakedsRemovals(__WEBPACK_IMPORTED_MODULE_0__common_common__["h" /* ROW_CELLS */][__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].rowIdx(cells[0])], cells, candidates, __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].NAKED_QUADS_ROW)) {
                                return true;
                            }
                        }
                        if (__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].areCellsInSameCol(cells)) {
                            if (this.checkNakedsRemovals(__WEBPACK_IMPORTED_MODULE_0__common_common__["i" /* COL_CELLS */][__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].colIdx(cells[0])], cells, candidates, __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].NAKED_QUADS_COL)) {
                                return true;
                            }
                        }
                        if (__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].areCellsInSameBox(cells)) {
                            if (this.checkNakedsRemovals(__WEBPACK_IMPORTED_MODULE_0__common_common__["j" /* BOX_CELLS */][__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].boxIdx(cells[0])], cells, candidates, __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].NAKED_QUADS_BOX)) {
                                return true;
                            }
                        }
                    } // for i4
                } // for i3
            } // for i2
        } // for i1
        return false;
    }; // checkNakedQuads()
    /**
     * Having cells with common candidates and common group, determine if
     * candidate removals are possible. If so, lodge a hint and return true.
     * Return false to signal that no removal action is possible.
     */
    HintService.prototype.checkNakedsRemovals = function (groupCells, cells, candidates, hintType) {
        // look for removals
        var removals = [];
        for (var _i = 0, groupCells_1 = groupCells; _i < groupCells_1.length; _i++) {
            var c = groupCells_1[_i];
            if (this.sudokuService.hasValue(c) || cells.indexOf(c) > -1) {
                continue;
            }
            for (var _a = 0, candidates_1 = candidates; _a < candidates_1.length; _a++) {
                var k = candidates_1[_a];
                if (this.sudokuService.isCandidate(c, k)) {
                    removals.push({ c: c, k: k });
                }
            } // for k
        } // for c
        // return true and hint if there are actions
        if (removals.length > 0) {
            this.activeHint = new __WEBPACK_IMPORTED_MODULE_4__hint_hint__["b" /* CandidatesHint */](hintType, cells, candidates, removals);
            return true;
        }
        return false;
    }; // checkNakedsRemovals()
    /**
     * Check for hidden pairs in rows, columns, and boxes. If found, create a hint
     * and return true, otherwise return false.
     *
     * A hidden pair occurs when a pair of numbers appears in exactly two
     * squares in a row, column, or box, but those two numbers aren't
     * the only ones in their squares.
     *
     * http://www.thonky.com/sudoku/hidden-pairs-triples-quads/
     */
    HintService.prototype.checkHiddenPairs = function () {
        for (var _i = 0, ROWS_2 = __WEBPACK_IMPORTED_MODULE_0__common_common__["d" /* ROWS */]; _i < ROWS_2.length; _i++) {
            var r = ROWS_2[_i];
            if (this.checkHiddenPairsGroup(this.sudokuService.getRow(r), __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].HIDDEN_PAIRS_ROW)) {
                return true;
            }
        }
        for (var _a = 0, COLS_2 = __WEBPACK_IMPORTED_MODULE_0__common_common__["e" /* COLS */]; _a < COLS_2.length; _a++) {
            var c = COLS_2[_a];
            if (this.checkHiddenPairsGroup(this.sudokuService.getCol(c), __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].HIDDEN_PAIRS_COL)) {
                return true;
            }
        }
        for (var _b = 0, BOXS_2 = __WEBPACK_IMPORTED_MODULE_0__common_common__["f" /* BOXS */]; _b < BOXS_2.length; _b++) {
            var b = BOXS_2[_b];
            if (this.checkHiddenPairsGroup(this.sudokuService.getBox(b), __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].HIDDEN_PAIRS_BOX)) {
                return true;
            }
        }
        return false;
    }; // checkHiddenPairs()
    /**
     * Check for hidden triples in rows, columns, and boxes. If found, create a hint
     * and return true, otherwise return false.
     *
     * A hidden triple occurs when three cells in a row, column, or box
     * contain the same three numbers, or a subset of those three. The
     * three cells also contain other candidates.
     *
     * http://www.thonky.com/sudoku/hidden-pairs-triples-quads/
     */
    HintService.prototype.checkHiddenTriples = function () {
        for (var _i = 0, ROWS_3 = __WEBPACK_IMPORTED_MODULE_0__common_common__["d" /* ROWS */]; _i < ROWS_3.length; _i++) {
            var r = ROWS_3[_i];
            if (this.checkHiddenTriplesGroup(this.sudokuService.getRow(r), __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].HIDDEN_TRIPLES_ROW)) {
                return true;
            }
        }
        for (var _a = 0, COLS_3 = __WEBPACK_IMPORTED_MODULE_0__common_common__["e" /* COLS */]; _a < COLS_3.length; _a++) {
            var c = COLS_3[_a];
            if (this.checkHiddenTriplesGroup(this.sudokuService.getCol(c), __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].HIDDEN_TRIPLES_COL)) {
                return true;
            }
        }
        for (var _b = 0, BOXS_3 = __WEBPACK_IMPORTED_MODULE_0__common_common__["f" /* BOXS */]; _b < BOXS_3.length; _b++) {
            var b = BOXS_3[_b];
            if (this.checkHiddenTriplesGroup(this.sudokuService.getBox(b), __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].HIDDEN_TRIPLES_BOX)) {
                return true;
            }
        }
        return false;
    }; // checkHiddenTriples()
    /**
     * Check for hidden triples in rows, columns, and boxes. If found, create a hint
     * and return true, otherwise return false.
     *
     * Hidden quads are pretty rare, and they can be difficult to spot
     * unless you are specifically looking for them.
     *
     * http://www.thonky.com/sudoku/hidden-pairs-triples-quads/
     */
    HintService.prototype.checkHiddenQuads = function () {
        for (var _i = 0, ROWS_4 = __WEBPACK_IMPORTED_MODULE_0__common_common__["d" /* ROWS */]; _i < ROWS_4.length; _i++) {
            var r = ROWS_4[_i];
            if (this.checkHiddenQuadsGroup(this.sudokuService.getRow(r), __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].HIDDEN_QUADS_ROW)) {
                return true;
            }
        }
        for (var _a = 0, COLS_4 = __WEBPACK_IMPORTED_MODULE_0__common_common__["e" /* COLS */]; _a < COLS_4.length; _a++) {
            var c = COLS_4[_a];
            if (this.checkHiddenQuadsGroup(this.sudokuService.getCol(c), __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].HIDDEN_QUADS_COL)) {
                return true;
            }
        }
        for (var _b = 0, BOXS_4 = __WEBPACK_IMPORTED_MODULE_0__common_common__["f" /* BOXS */]; _b < BOXS_4.length; _b++) {
            var b = BOXS_4[_b];
            if (this.checkHiddenQuadsGroup(this.sudokuService.getBox(b), __WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].HIDDEN_QUADS_BOX)) {
                return true;
            }
        }
        return false;
    }; // checkHiddenTriples()
    /**
     * Check for hidden pairs in a given row, column, or box.
     *
     * (1) Candidates that appear exactly 2 times in group, and
     * (2) 2 times appearing candidates are confined to 2 cells, and,
     * as usual, there are candidate removal actions available.
     */
    HintService.prototype.checkHiddenPairsGroup = function (group, hintType) {
        // number of occurrences of each candidate in group
        var kCounts = [];
        // candidates occurring no more than 3 times in group
        var pairCandidates = [];
        // group cells containing a triple candidate
        var pairCells = [];
        // look for 2 candidates occurring 2 times in group
        kCounts = this.sudokuService.getCandidateCounts(group);
        for (var _i = 0, CANDIDATES_2 = __WEBPACK_IMPORTED_MODULE_0__common_common__["g" /* CANDIDATES */]; _i < CANDIDATES_2.length; _i++) {
            var k = CANDIDATES_2[_i];
            if (kCounts[k] === 2) {
                pairCandidates.push(k);
            }
        }
        if (pairCandidates.length < 2) {
            return false; // no 2 candidates appear 2 times in group
        }
        // find group cells that contain potential pair candidate
        NEXT_CELL: for (var _a = 0, _b = group.cells; _a < _b.length; _a++) {
            var c = _b[_a];
            for (var _c = 0, pairCandidates_1 = pairCandidates; _c < pairCandidates_1.length; _c++) {
                var k = pairCandidates_1[_c];
                if (this.sudokuService.isCandidate(c, k)) {
                    pairCells.push(c);
                    continue NEXT_CELL; // only push cell once
                }
            }
        }
        // examine all combinations of 2 pair cells containing pair candidates
        var pairCellCombinations = __WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].pairwise(pairCells);
        for (var _d = 0, pairCellCombinations_1 = pairCellCombinations; _d < pairCellCombinations_1.length; _d++) {
            var pairCellCombination = pairCellCombinations_1[_d];
            // this set of pair cells
            var _2pairCells = pairCellCombination;
            // candidates in 1 or more of these set of cells
            var _2cands = [];
            // number of occurrences of each candidate in this set of cells
            var _2kCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            // cands in set of cells that match occurrences in full group
            var _2matchedCands = [];
            // get unique pair candidates from pair cells
            for (var _e = 0, pairCandidates_2 = pairCandidates; _e < pairCandidates_2.length; _e++) {
                var k = pairCandidates_2[_e];
                for (var j = 0; j < 2; j++) {
                    if (this.sudokuService.isCandidate(_2pairCells[j], k)) {
                        _2kCounts[k]++;
                        if (_2cands.indexOf(k) === -1) {
                            _2cands.push(k);
                        }
                    }
                }
            }
            // if not 2 candidates, try next combination of pair cells 
            if (_2cands.length < 2) {
                continue; // next combination of pair cells
            }
            // make sure pair candidates don't appear outside pair cells
            for (var _f = 0, _2cands_1 = _2cands; _f < _2cands_1.length; _f++) {
                var k = _2cands_1[_f];
                if (_2kCounts[k] == kCounts[k]) {
                    _2matchedCands.push(k);
                }
            }
            if (_2matchedCands.length != 2) {
                continue; // next combination of pair cells
            }
            // look for removals: other candidates in pair cells
            var removals = this.findHiddenRemovals(pairCellCombination, _2matchedCands);
            // need at least 1 candidate to remove or it's not hidden pair
            if (removals.length > 0) {
                this.activeHint = new __WEBPACK_IMPORTED_MODULE_4__hint_hint__["b" /* CandidatesHint */](hintType, pairCellCombination, _2matchedCands, removals);
                return true;
            }
        } // for pairCellCombinations
        return false;
    }; // checkHiddenPairsGroup()
    /**
     * Check for hidden triples in a given row, column, or box.
     *
     * (1) Candidates that appear exactly 2 or 3 times in group, and
     * (2) 2 or 3 times appearing candidates are confined to 3 cells, and,
     * as usual, there are candidate removal actions available.
     */
    HintService.prototype.checkHiddenTriplesGroup = function (group, hintType) {
        // number of occurrences of each candidate in group
        var kCounts = [];
        // candidates occurring no more than 3 times in group
        var tripCandidates = [];
        // group cells containing a triple candidate
        var tripCells = [];
        // look for at least 3 candidates occurring 2 or 3 times in group
        kCounts = this.sudokuService.getCandidateCounts(group);
        for (var _i = 0, CANDIDATES_3 = __WEBPACK_IMPORTED_MODULE_0__common_common__["g" /* CANDIDATES */]; _i < CANDIDATES_3.length; _i++) {
            var k = CANDIDATES_3[_i];
            if (kCounts[k] >= 2 && kCounts[k] <= 3) {
                tripCandidates.push(k);
            }
        }
        if (tripCandidates.length < 3) {
            return false; // no 3 candidates appear 2 or 3 times in group
        }
        // find group cells contain a potential triple candidate
        NEXT_CELL: for (var _a = 0, _b = group.cells; _a < _b.length; _a++) {
            var c = _b[_a];
            for (var _c = 0, tripCandidates_1 = tripCandidates; _c < tripCandidates_1.length; _c++) {
                var k = tripCandidates_1[_c];
                if (this.sudokuService.isCandidate(c, k)) {
                    tripCells.push(c);
                    continue NEXT_CELL; // only push cell once
                }
            }
        }
        // examine all combinations of 3 triple cells containing triple candidates
        var tripCellCombinations = __WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].tripwise(tripCells);
        for (var _d = 0, tripCellCombinations_1 = tripCellCombinations; _d < tripCellCombinations_1.length; _d++) {
            var tripCellCombination = tripCellCombinations_1[_d];
            // this set of triple cells
            var _3tripCells = tripCellCombination;
            // candidates in 1 or more of these set of cells
            var _3cands = [];
            // number of occurrences of each candidate in this set of cells
            var _3kCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            // cands in set of cells that match occurrences in full group
            var _3matchedCands = [];
            // get unique triple candidates from triple cells
            for (var _e = 0, tripCandidates_2 = tripCandidates; _e < tripCandidates_2.length; _e++) {
                var k = tripCandidates_2[_e];
                for (var j = 0; j < 3; j++) {
                    if (this.sudokuService.isCandidate(_3tripCells[j], k)) {
                        _3kCounts[k]++;
                        if (_3cands.indexOf(k) === -1) {
                            _3cands.push(k);
                        }
                    }
                }
            }
            // if not at least 3 candidates, try next combination of triple cells 
            if (_3cands.length < 3) {
                continue; // next combination of triple cells
            }
            // make sure triple candidates don't appear outside triple cells
            for (var _f = 0, _3cands_1 = _3cands; _f < _3cands_1.length; _f++) {
                var k = _3cands_1[_f];
                if (_3kCounts[k] == kCounts[k]) {
                    _3matchedCands.push(k);
                }
            }
            if (_3matchedCands.length != 3) {
                continue; // next combination of triple cells
            }
            // look for removals: other candidates in triple cellsToValuesArray
            var removals = this.findHiddenRemovals(tripCellCombination, _3matchedCands);
            // need at least 1 candidate to remove or it's not hidden triple
            if (removals.length > 0) {
                this.activeHint = new __WEBPACK_IMPORTED_MODULE_4__hint_hint__["b" /* CandidatesHint */](hintType, tripCellCombination, _3matchedCands, removals);
                return true;
            }
        } // for tripCellCombinations
        return false;
    }; // checkHiddenTriplesGroup()
    /**
     * Check for hidden quads in a given row, column, or box.
     *
     * (1) Candidates that appear exactly 2, 3, or 4 times in group, and
     * (2) 2, 3, or 4 times appearing candidates are confined to 34 cells, and,
     * as usual, there are candidate removal actions available.
     */
    HintService.prototype.checkHiddenQuadsGroup = function (group, hintType) {
        // number of occurrences of each candidate in group
        var kCounts = [];
        // candidates occurring no more than 4 times in group
        var quadCandidates = [];
        // group cells containing a quad candidate
        var quadCells = [];
        kCounts = this.sudokuService.getCandidateCounts(group);
        for (var _i = 0, CANDIDATES_4 = __WEBPACK_IMPORTED_MODULE_0__common_common__["g" /* CANDIDATES */]; _i < CANDIDATES_4.length; _i++) {
            var k = CANDIDATES_4[_i];
            if (kCounts[k] >= 2 && kCounts[k] <= 4) {
                quadCandidates.push(k);
            }
        }
        console.log('kCounts       : ' + JSON.stringify(kCounts));
        console.log('quadCandidates: ' + JSON.stringify(quadCandidates) + ' (need at least 4)');
        // we need at least 4 candidates
        if (quadCandidates.length < 4) {
            return false; // no 4 candidates appear 2, 3, or 4 times in group
        }
        // find group cells that contain a quad candidate
        NEXT_CELL: for (var _a = 0, _b = group.cells; _a < _b.length; _a++) {
            var c = _b[_a];
            for (var _c = 0, quadCandidates_1 = quadCandidates; _c < quadCandidates_1.length; _c++) {
                var k = quadCandidates_1[_c];
                if (this.sudokuService.isCandidate(c, k)) {
                    quadCells.push(c);
                    continue NEXT_CELL; // only push cell once
                }
            }
        }
        console.log('quadCells     : ' + JSON.stringify(quadCells));
        // examine all combinations of 4 quad cells containing quad candidates
        var ln = quadCells.length;
        for (var i1 = 0; i1 < (ln - 3); i1++) {
            for (var i2 = i1 + 1; i2 < (ln - 2); i2++) {
                for (var i3 = i2 + 1; i3 < (ln - 1); i3++) {
                    I4: for (var i4 = i3 + 1; i4 < (ln - 0); i4++) {
                        // this set of quad cells
                        var _4quadCells = [quadCells[i1], quadCells[i2], quadCells[i3], quadCells[i4]];
                        // candidates in 1 or more of these set of cells
                        var _4cands = [];
                        // number of occurrences of each candidate in this set of cells
                        var _4kCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        // cands in set of cells that match occurrences in full group
                        var _4matchedCands = [];
                        // get unique quad candidates from quad cells
                        for (var _d = 0, quadCandidates_2 = quadCandidates; _d < quadCandidates_2.length; _d++) {
                            var k = quadCandidates_2[_d];
                            for (var _e = 0, _f = [i1, i2, i3, i4]; _e < _f.length; _e++) {
                                var i = _f[_e];
                                if (this.sudokuService.isCandidate(quadCells[i], k)) {
                                    _4kCounts[k]++;
                                    if (_4cands.indexOf(k) === -1) {
                                        _4cands.push(k);
                                    }
                                }
                            }
                        }
                        console.log('_4quadCells   : ' + JSON.stringify(_4quadCells));
                        console.log('_4cands       : ' + JSON.stringify(_4cands) + ' (need at least 4)');
                        // make sure quad candidates don't appear outside quad cells -- NO!
                        // for (let k of cands) {
                        //   if (kCounts1[k] != kCounts[k]) {
                        //     continue I4;   // candidate k appears outside of quad cells
                        //   }
                        // }
                        // if not 4 candidates, try next combination of quad cells
                        // if (cands.length != 4) {
                        if (_4cands.length < 4) {
                            continue I4;
                        }
                        // let _4matchedCands: number[] = [];
                        for (var _g = 0, _4cands_1 = _4cands; _g < _4cands_1.length; _g++) {
                            var k = _4cands_1[_g];
                            if (_4kCounts[k] == kCounts[k]) {
                                _4matchedCands.push(k);
                            }
                        }
                        console.log('_4kCounts1    : ' + JSON.stringify(_4kCounts));
                        console.log('_4matchedCands: ' + JSON.stringify(_4matchedCands) + ' (need exactly 4)');
                        if (_4matchedCands.length != 4) {
                            continue I4;
                        }
                        // look for removals: other candidates in quad cellsToValuesArray
                        var removals = this.findHiddenRemovals([quadCells[i1], quadCells[i2], quadCells[i3], quadCells[i4]], 
                        // quadCandidates);
                        _4matchedCands);
                        console.log('removals      : ' + removals.length + ' (need at least 1)');
                        // no candidates to remove, so no hidden quad
                        if (removals.length > 0) {
                            this.activeHint = new __WEBPACK_IMPORTED_MODULE_4__hint_hint__["b" /* CandidatesHint */](hintType, [quadCells[i1], quadCells[i2], quadCells[i3], quadCells[i4]], _4matchedCands, removals);
                            console.log('hint: ' + JSON.stringify(this.activeHint));
                            return true;
                        }
                    } // for i4
                } // for i3
            } // for i2
        } // for i1
        return false;
    }; // checkHiddenQuadsGroup()
    /**
     * Helper method to find candidate removals from hidden pairs, triples, quads.
     */
    HintService.prototype.findHiddenRemovals = function (hiddenCells, hiddenCands) {
        var removals = [];
        for (var _i = 0, hiddenCells_1 = hiddenCells; _i < hiddenCells_1.length; _i++) {
            var hiddenCell = hiddenCells_1[_i];
            // let hiddenCellCands: number[] = this.cells[hiddenCell].getCandidates().slice();
            var hiddenCellCands = this.sudokuService.getCandidates(hiddenCell).slice();
            for (var _a = 0, hiddenCellCands_1 = hiddenCellCands; _a < hiddenCellCands_1.length; _a++) {
                var hiddenCellCand = hiddenCellCands_1[_a];
                if (hiddenCands.indexOf(hiddenCellCand) === -1) {
                    removals.push({ c: hiddenCell, k: hiddenCellCand });
                }
            }
        }
        return removals;
    }; // findHiddenRemovals()
    /**
     * Check for pointing rows and columns. If found, create a hint and return
     * true, otherwise return false.
     *
     * A pointing row (col) occurs when a candidate appears twice or three
     * times in a box, and those occurrences are in the same row (col).
     * This means the candidate MUST occur in one of the two or three cells
     * in the box, and because of that, you can remove that candidate from
     * any other cells in the same row (col) but outside the box.
     *
     * http://www.thonky.com/sudoku/pointing-pairs-triples/
     */
    HintService.prototype.checkPointingRowCol = function () {
        for (var _i = 0, BOXS_5 = __WEBPACK_IMPORTED_MODULE_0__common_common__["f" /* BOXS */]; _i < BOXS_5.length; _i++) {
            var b = BOXS_5[_i];
            CANDS: for (var _a = 0, CANDIDATES_5 = __WEBPACK_IMPORTED_MODULE_0__common_common__["g" /* CANDIDATES */]; _a < CANDIDATES_5.length; _a++) {
                var k = CANDIDATES_5[_a];
                var boxCandOccurrences = []; // [idx, ...]
                if (this.sudokuService.containsValue(this.sudokuService.getBox(b), k)) {
                    continue CANDS; // k cannot be candidate in box
                }
                for (var _b = 0, _c = __WEBPACK_IMPORTED_MODULE_0__common_common__["j" /* BOX_CELLS */][b]; _b < _c.length; _b++) {
                    var c = _c[_b];
                    if (this.sudokuService.isCandidate(c, k)) {
                        boxCandOccurrences.push(c);
                        if (boxCandOccurrences.length > 3) {
                            continue CANDS; // too many for candidate
                        }
                    }
                } // for
                if (boxCandOccurrences.length < 2) {
                    continue CANDS; // too few for candidate
                }
                // we have 2 or 3 occurances of k in b
                // determine if in same row or col
                var sameRow = __WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].areCellsInSameRow(boxCandOccurrences);
                var sameCol = __WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].areCellsInSameCol(boxCandOccurrences);
                if (!sameRow && !sameCol) {
                    continue CANDS; // try next candidate in box
                }
                // look for actions
                var removals = [];
                if (sameRow) {
                    // scan other cells in row outside box
                    for (var _d = 0, _e = __WEBPACK_IMPORTED_MODULE_0__common_common__["h" /* ROW_CELLS */][__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].rowIdx(boxCandOccurrences[0])]; _d < _e.length; _d++) {
                        var c = _e[_d];
                        if (__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].boxIdx(c) === b) {
                            continue; // cell in same box
                        }
                        if (this.sudokuService.isCandidate(c, k)) {
                            removals.push({ c: c, k: k });
                        }
                    } // for
                    // if there are removals, we have hint
                    if (removals.length > 0) {
                        this.activeHint = new __WEBPACK_IMPORTED_MODULE_4__hint_hint__["b" /* CandidatesHint */](__WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].POINTING_ROW, [boxCandOccurrences[0]], [k], removals);
                        return true;
                    }
                }
                else {
                    // scan other cells in col outside box
                    for (var _f = 0, _g = __WEBPACK_IMPORTED_MODULE_0__common_common__["i" /* COL_CELLS */][__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].colIdx(boxCandOccurrences[0])]; _f < _g.length; _f++) {
                        var c = _g[_f];
                        if (__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].boxIdx(c) === b) {
                            continue; // cell in same box
                        }
                        if (this.sudokuService.isCandidate(c, k)) {
                            removals.push({ c: c, k: k });
                        }
                    } // for
                    // if there are removals, we have hint
                    if (removals.length > 0) {
                        this.activeHint = new __WEBPACK_IMPORTED_MODULE_4__hint_hint__["b" /* CandidatesHint */](__WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].POINTING_COL, [boxCandOccurrences[0]], [k], removals);
                        return true;
                    }
                } // else same col
            } // for CANDS
        } // for BOXS
        return false;
    }; // checkPointingRowCol()
    /*
     * Check for row box reductions. If found, create a hint and return
     * true, otherwise return false.
     *
     * In box/line reduction, two or three of the same candidate appear on
     * the same row or column, and that candidate happens to be restricted
     * to a single box. When this happens, you know that the candidate
     * MUST occur in that row or column, so you can eliminate it from other
     * cells in that box.
     *
     * http://www.thonky.com/sudoku/box-line-reduction/
     */
    HintService.prototype.checkRowBoxReductions = function () {
        //ROWS:
        for (var _i = 0, ROWS_5 = __WEBPACK_IMPORTED_MODULE_0__common_common__["d" /* ROWS */]; _i < ROWS_5.length; _i++) {
            var row = ROWS_5[_i];
            CANDS: for (var _a = 0, CANDIDATES_6 = __WEBPACK_IMPORTED_MODULE_0__common_common__["g" /* CANDIDATES */]; _a < CANDIDATES_6.length; _a++) {
                var k = CANDIDATES_6[_a];
                if (this.sudokuService.containsValue(this.sudokuService.getRow(row), k)) {
                    continue CANDS; // not candidate in row
                }
                var rowCandOccurrences = [];
                //CELLS:
                for (var _b = 0, _c = __WEBPACK_IMPORTED_MODULE_0__common_common__["h" /* ROW_CELLS */][row]; _b < _c.length; _b++) {
                    var c = _c[_b];
                    // if (this.cells[c].hasValue[k]) {   REDUNDANT
                    //   continue CELLS;	// k cannot be candidate in col
                    // }
                    if (this.sudokuService.isCandidate(c, k)) {
                        rowCandOccurrences.push(c);
                        if (rowCandOccurrences.length > 3) {
                            continue CANDS; // too many for candidate
                        }
                    }
                } // for CELLS
                if (rowCandOccurrences.length < 2) {
                    continue CANDS; // too few for candidate
                }
                // determine if in same box
                if (!__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].areCellsInSameBox(rowCandOccurrences)) {
                    continue CANDS; // not in same box, next cand
                }
                // must be same box, different row; look for removals
                var removals = [];
                // look for k's in other rows in box 
                // this row is row, this box is box
                for (var _d = 0, _e = __WEBPACK_IMPORTED_MODULE_0__common_common__["j" /* BOX_CELLS */][__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].boxIdx(rowCandOccurrences[0])]; _d < _e.length; _d++) {
                    var c = _e[_d];
                    // if c in row, continue next c
                    if (__WEBPACK_IMPORTED_MODULE_0__common_common__["h" /* ROW_CELLS */][row].indexOf(c) >= 0) {
                        continue; // box cell in same row, next c
                    }
                    // if isCandidate, push to removals
                    if (this.sudokuService.isCandidate(c, k)) {
                        removals.push({ c: c, k: k });
                    }
                } // for
                if (removals.length > 0) {
                    this.activeHint = new __WEBPACK_IMPORTED_MODULE_4__hint_hint__["b" /* CandidatesHint */](__WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].ROW_BOX_REDUCTION, [rowCandOccurrences[0]], [k], removals);
                    return true;
                }
            } // for CANDS
        } // for ROWS
        return false;
    }; // checkRowBoxReductions()
    /**
     * Check for column box reductions. If found, create a hint and return
     * true, otherwise return false.
     */
    HintService.prototype.checkColBoxReductions = function () {
        //COLS:
        for (var _i = 0, COLS_5 = __WEBPACK_IMPORTED_MODULE_0__common_common__["e" /* COLS */]; _i < COLS_5.length; _i++) {
            var col = COLS_5[_i];
            CANDS: for (var _a = 0, CANDIDATES_7 = __WEBPACK_IMPORTED_MODULE_0__common_common__["g" /* CANDIDATES */]; _a < CANDIDATES_7.length; _a++) {
                var k = CANDIDATES_7[_a];
                // if (this.cols[col].containsValue(k)) {
                if (this.sudokuService.containsValue(this.sudokuService.getCol(col), k)) {
                    continue CANDS; // not candidate in col
                }
                var colCandOccurrences = [];
                //CELLS:
                for (var _b = 0, _c = __WEBPACK_IMPORTED_MODULE_0__common_common__["i" /* COL_CELLS */][col]; _b < _c.length; _b++) {
                    var c = _c[_b];
                    // if (this.cells[c].hasValue[k]) {   REDUNDANT!
                    //   continue CELLS;	// k cannot be candidate in row
                    // }
                    if (this.sudokuService.isCandidate(c, k)) {
                        colCandOccurrences.push(c);
                        if (colCandOccurrences.length > 3) {
                            continue CANDS; // too many for candidate
                        }
                    }
                } // for CELLS
                if (colCandOccurrences.length < 2) {
                    continue CANDS; // too few for candidate
                }
                // determine if in same box
                if (!__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].areCellsInSameBox(colCandOccurrences)) {
                    continue CANDS; // not in same box, next cand
                }
                // must be same box, different col; look for removals
                var removals = [];
                // look for k's in other cols in box
                // this col is col, this box is box
                for (var _d = 0, _e = __WEBPACK_IMPORTED_MODULE_0__common_common__["j" /* BOX_CELLS */][__WEBPACK_IMPORTED_MODULE_0__common_common__["a" /* Common */].boxIdx(colCandOccurrences[0])]; _d < _e.length; _d++) {
                    var c = _e[_d];
                    // if c in col, continue next c
                    if (__WEBPACK_IMPORTED_MODULE_0__common_common__["i" /* COL_CELLS */][col].indexOf(c) >= 0) {
                        continue; // box cell in same col, next c
                    }
                    // if isCandidate, push to removals
                    if (this.sudokuService.isCandidate(c, k)) {
                        removals.push({ c: c, k: k });
                    }
                } // for
                if (removals.length > 0) {
                    this.activeHint = new __WEBPACK_IMPORTED_MODULE_4__hint_hint__["b" /* CandidatesHint */](__WEBPACK_IMPORTED_MODULE_5__hint_hint_type__["a" /* HintType */].COL_BOX_REDUCTION, [colCandOccurrences[0]], [k], removals);
                    return true;
                }
            } // for CANDS
        } // for COLS
        return false;
    }; // checkColBoxReductions()
    return HintService;
}());

//# sourceMappingURL=hint.service.js.map

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SudokuService; });
/* unused harmony export Group */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__puzzle__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__naked_type__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__action_action__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_common__ = __webpack_require__(0);




/**
 * This service maintains the sudoku's state: essentially cell values and
 * cell candidates. This class's public methods provide the only access to
 * this state.
 *
 * This application runs (1) a user interface in the foreground (browser)
 * and (2) a web worker (background) that creates and caches sudokus.
 * Therefore there are two instances of this SudokuService: one to provide
 * the user interactive experience in solving a sudoku, and another instance
 * to be building sudokus in the background to be instantly available when
 * the user wants a new sudoku.
 */
var SudokuService = (function () {
    /**
     * Inject the data model and logs.
     */
    function SudokuService(
        // this.actionLog: ActionLogService,
        actionLog) {
        this.currentSudoku = undefined;
        this.sudokuModel = undefined;
        this.actionLog = undefined;
        this.sudokuModel = new SudokuModel();
        // this.actionLog = new ActionLogService();
        this.actionLog = actionLog;
        this.initializeModel();
    } // constructor()
    /**
     * Initialize the entire sudoku.
     */
    SudokuService.prototype.initializeModel = function () {
        for (var _i = 0, CELLS_1 = __WEBPACK_IMPORTED_MODULE_3__common_common__["b" /* CELLS */]; _i < CELLS_1.length; _i++) {
            var c = CELLS_1[_i];
            this.initializeCell(this.sudokuModel.cells[c]);
        }
        for (var _a = 0, GROUPS_1 = __WEBPACK_IMPORTED_MODULE_3__common_common__["k" /* GROUPS */]; _a < GROUPS_1.length; _a++) {
            var g = GROUPS_1[_a];
            this.initializeGroup(this.sudokuModel.rows[g]);
            this.initializeGroup(this.sudokuModel.cols[g]);
            this.initializeGroup(this.sudokuModel.boxs[g]);
        }
        this.initializeActionLog();
    }; // initializeModel()
    /**
     *
     */
    SudokuService.prototype.initializeActionLog = function () {
        this.actionLog.initialize();
    }; // initializeActionLog()
    /**
     *
     */
    SudokuService.prototype.getCurrentSudoku = function () {
        return this.currentSudoku;
    }; // getCurrentSudoku()
    /**
     * Sets up a sudoku puzzle with a set of initial vallues. The initial values
     * will be an array of 81 numbers each 0..9. A zero indicates a blank or
     * empty cell. E.g.
     * [0,0,2,4,0,0,1,0,3,9,1,0,3,0,0,0,6,0,0, ...]
     */
    SudokuService.prototype.loadProvidedSudoku = function (givenValues) {
        var puzzle = new __WEBPACK_IMPORTED_MODULE_0__puzzle__["a" /* Puzzle */]();
        puzzle.initialValues = givenValues;
        this.initializeModel();
        for (var _i = 0, CELLS_2 = __WEBPACK_IMPORTED_MODULE_3__common_common__["b" /* CELLS */]; _i < CELLS_2.length; _i++) {
            var c = CELLS_2[_i];
            var cell = this.sudokuModel.cells[c]; // cell at [c] in cells array
            var givenValue = givenValues[c]; // givenValue at [c] in givenValues array
            if (givenValue === 0) {
                continue;
            }
            // set cell, update row/col/box, lock cell
            this.setValue(c, givenValue, __WEBPACK_IMPORTED_MODULE_2__action_action__["a" /* ActionType */].SET_VALUE);
            cell.locked = true;
        } // for
        this.initializeActionLog();
        return puzzle;
    }; // loadProvidedSudoku()
    /**
     * Sets a given value in every cell and set all groups to complete.
     */
    SudokuService.prototype.setAllValues = function (values) {
        for (var _i = 0, CELLS_3 = __WEBPACK_IMPORTED_MODULE_3__common_common__["b" /* CELLS */]; _i < CELLS_3.length; _i++) {
            var c = CELLS_3[_i];
            var cell = this.sudokuModel.cells[c]; // cell at [c] in cells array
            cell.locked = false;
            cell.value = values[c]; // value at [c] in values array
            this.removeAllCellCandidates(c);
        }
        for (var _a = 0, GROUPS_2 = __WEBPACK_IMPORTED_MODULE_3__common_common__["k" /* GROUPS */]; _a < GROUPS_2.length; _a++) {
            var g = GROUPS_2[_a];
            for (var _b = 0, VALUES_1 = __WEBPACK_IMPORTED_MODULE_3__common_common__["c" /* VALUES */]; _b < VALUES_1.length; _b++) {
                var v = VALUES_1[_b];
                this.sudokuModel.rows[g].vOccurrences[v] = 1;
                this.sudokuModel.cols[g].vOccurrences[v] = 1;
                this.sudokuModel.boxs[g].vOccurrences[v] = 1;
            }
        }
    }; // setAllValues()
    /**
     *
     */
    SudokuService.prototype.isCellLocked = function (c) {
        return this.sudokuModel.cells[c].locked;
    }; // isCellLocked()
    /**
     * Return givenValue of cell. Zero means no givenValue;
     */
    SudokuService.prototype.getValue = function (c) {
        return this.sudokuModel.cells[c].value;
    }; // getValue()
    /**
     * Sets value of a cell to the given value. In the specified cell, all candidates
     * are removed. The candidate, equal to the value being set, is removed from
     * every cell that shares the row, column, and box of the given cell.
     *
     * If the cell is locked or already has the new value, no action will be
     * taken. If the cell has some other value, that old value will be removed
     * first. The new value will be removed as a candidate where it appears in
     * the cell's row, column, and box.
     *
     *
     *
     *
     *
     * Set given givenValue in given cell.
     * - will not affect a locked cell
     * - if cell already has the new givenValue, nothing to do
     * - if cell already has another givenValue, remove it first
     * - set the new givenValue (also removes all candidates from cell)
     * - update givenValues count in cell's row, column, and box
     * - update givenValues used
     * - *TODO* conflict in row, col, box ............. mark invalid
     * - create and log action entry
     * - remove this givenValue as candidate in related cells
     *
     * Called by
     * - setValue_() user key press or right click (playComponent.ts) setCellValue())
     * - applyHint()
     * - undoAction() REMOVE_VALUE
     * - generatePuzzle() step 2 (pare down)
     *
     * Undo notes
     * - remove givenValue
     * - restore old previous givenValue? Down thru a removeValue action?
     * - update givenValues count in cell's row, column, and box
     * - update givenValues used
     * - conflict ................
     * - restore candidates in cell
     * - restore candidates in related CELLS
     * - remove log entry, don't create new one
     */
    SudokuService.prototype.setValue = function (c, newValue, actionType, guessPossibles, hint) {
        var cell = this.sudokuModel.cells[c];
        if (cell.locked) {
            return; // can't change locked cell
        }
        // if cell has givenValue, remove it first
        if (cell.value != 0) {
            if (cell.value === newValue) {
                return; // same as existing givenValue, nothing to do
            }
            this.removeValue(c);
        }
        // set new value, remove candidates
        cell.value = newValue;
        this.removeAllCellCandidates(c);
        // increment occurrences in groups
        this.sudokuModel.rows[cell.row].vOccurrences[newValue]++;
        this.sudokuModel.cols[cell.col].vOccurrences[newValue]++;
        this.sudokuModel.boxs[cell.box].vOccurrences[newValue]++;
        // log action
        var action;
        switch (actionType) {
            case __WEBPACK_IMPORTED_MODULE_2__action_action__["a" /* ActionType */].SET_VALUE:
                action = new __WEBPACK_IMPORTED_MODULE_2__action_action__["b" /* ValueAction */](__WEBPACK_IMPORTED_MODULE_2__action_action__["a" /* ActionType */].SET_VALUE, c, newValue, hint);
                break;
            case __WEBPACK_IMPORTED_MODULE_2__action_action__["a" /* ActionType */].GUESS_VALUE:
                action = new __WEBPACK_IMPORTED_MODULE_2__action_action__["c" /* GuessAction */](__WEBPACK_IMPORTED_MODULE_2__action_action__["a" /* ActionType */].GUESS_VALUE, c, newValue, guessPossibles, hint);
                break;
        } // switch
        this.actionLog.addEntry(action);
        // remove candidate (this new value) from related cells
        for (var _i = 0, _a = __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].getRelatedCells(c); _i < _a.length; _i++) {
            var rc = _a[_i];
            if (this.sudokuModel.cells[rc].value != 0) {
                continue;
            }
            this.sudokuModel.cells[rc].candidates[newValue] = false;
        }
    }; // setValue()
    /**
     * Removes the givenValue of the specified cell to make it empty. This
     * function also reestablishes appropriate candidates in the cell and
     * reestablishes the candidate, equal to the givenValue being removed, in
     * other cells in the same row, column, and box of the given cell. For
     * every cell the candidate is only restored if there is no conflict
     * with its row, column, and box.
     *
     * Remove givenValue from given cell.
     * - will not affect a locked cell
     * - if cell does not have a givenValue, nothing to do
     * - remove old givenValue
     * - update givenValues count in cell's row, column, and box
     * - update givenValues used
     * - create and log action entry
     * - add applicable candidates to cell
     * - add candidate (this cell's old givenValue) to related cells
     *
     * Called by
     * - removeValue_() user key press (playComponent.ts) removeCellValue())
     * - undoAction() SET_VALUE
     * - setValue() (remove existing givenValue)
     * - generatePuzzle() step 2 (pare down)
     *
     * Undo notes
     * - replace prior givenValue
     * - update givenValues count in cell's row, column, and box
     * - update givenValues used
     * - remove candidats from cell
     * - remove this prior givenValue as candidate in related cells
     * - remove log entry, don't create new one'
     *
     * - conflict ................
     */
    SudokuService.prototype.removeValue = function (c) {
        var cell = this.sudokuModel.cells[c];
        // cannot change locked cell
        if (cell.locked) {
            return;
        }
        // get existing givenValue, exit if no existing givenValue
        var oldValue = cell.value;
        if (oldValue === 0) {
            return; // nothing to remove
        }
        cell.value = 0;
        var row = this.sudokuModel.rows[cell.row];
        var col = this.sudokuModel.cols[cell.col];
        var box = this.sudokuModel.boxs[cell.box];
        row.vOccurrences[oldValue]--;
        col.vOccurrences[oldValue]--;
        box.vOccurrences[oldValue]--;
        // add applicable candidates to cell
        for (var _i = 0, VALUES_2 = __WEBPACK_IMPORTED_MODULE_3__common_common__["c" /* VALUES */]; _i < VALUES_2.length; _i++) {
            var v = VALUES_2[_i];
            if (row.vOccurrences[oldValue] > 0
                || col.vOccurrences[oldValue] > 0
                || box.vOccurrences[oldValue] > 0) {
                continue;
            }
            this.addCandidate(c, v);
        }
        // add candidate (this cell's old givenValue) to related cells
        for (var _a = 0, _b = __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].getRelatedCells(c); _a < _b.length; _a++) {
            var rc = _b[_a];
            var relatedCell = this.sudokuModel.cells[rc];
            var rcRow = this.sudokuModel.rows[relatedCell.row];
            var rcCol = this.sudokuModel.cols[relatedCell.col];
            var rcBox = this.sudokuModel.boxs[relatedCell.box];
            if (rcRow.vOccurrences[oldValue] > 0
                || rcCol.vOccurrences[oldValue] > 0
                || rcBox.vOccurrences[oldValue] > 0) {
                continue;
            }
            this.addCandidate(rc, oldValue);
        }
    }; // removeValue()
    /**
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
    SudokuService.prototype.removeCandidate = function (c, k, hint) {
        this.sudokuModel.cells[c].candidates[k] = false;
        var action = new __WEBPACK_IMPORTED_MODULE_2__action_action__["d" /* RemoveAction */](__WEBPACK_IMPORTED_MODULE_2__action_action__["a" /* ActionType */].REMOVE_CANDIDATE, c, k, hint);
        this.actionLog.addEntry(action);
    }; // removeCandidate()
    /**
     * Undoes the last logged action. If the last action resulted from a complex
     * hint that caused multiple candidate removals e.g. nakedPairs, etc.
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
    SudokuService.prototype.undoAction = function (action) {
        var actionType = action.type;
        switch (actionType) {
            case (__WEBPACK_IMPORTED_MODULE_2__action_action__["a" /* ActionType */].SET_VALUE):
            case (__WEBPACK_IMPORTED_MODULE_2__action_action__["a" /* ActionType */].GUESS_VALUE):
                this.removeValue(action.cell);
                break;
            case (__WEBPACK_IMPORTED_MODULE_2__action_action__["a" /* ActionType */].REMOVE_CANDIDATE):
                this.addCandidate(action.cell, action.candidate);
        }
    }; // undoAction()
    /**
     * Returns an array of cell's candidates where the number of candidates is
     * is greater than 0 but less than or equal to the number specified by the
     * naked type. For NakedType.SINGLE, PAIR, TRIPLE, QUAD the number of
     * candidates in the array are 1, 1..2, 1..3, and 1..4.
     */
    SudokuService.prototype.findNakedCandidates = function (c, nakedType) {
        var maxCandidates = 0;
        switch (nakedType) {
            case __WEBPACK_IMPORTED_MODULE_1__naked_type__["a" /* NakedType */].SINGLE:
                maxCandidates = 1;
                break;
            case __WEBPACK_IMPORTED_MODULE_1__naked_type__["a" /* NakedType */].PAIR:
                maxCandidates = 2;
                break;
            case __WEBPACK_IMPORTED_MODULE_1__naked_type__["a" /* NakedType */].TRIPLE:
                maxCandidates = 3;
                break;
            case __WEBPACK_IMPORTED_MODULE_1__naked_type__["a" /* NakedType */].QUAD:
                maxCandidates = 4;
        }
        var nakeds = [];
        if (this.hasValue(c)) {
            return [];
        }
        for (var _i = 0, CANDIDATES_1 = __WEBPACK_IMPORTED_MODULE_3__common_common__["g" /* CANDIDATES */]; _i < CANDIDATES_1.length; _i++) {
            var k = CANDIDATES_1[_i];
            if (this.isCandidate(c, k)) {
                nakeds.push(k);
                if (nakeds.length > maxCandidates) {
                    return []; // to many k's in this cell
                }
            }
        } // next k
        return nakeds; // cell has maxCandidates or fewer
    }; // findNakedCandidates()
    /**
     * Determines if sudoku is fully solved. If every row's every value is used
     * once and only once, the sudoku is completely solved.
     */
    SudokuService.prototype.isSolved = function () {
        for (var _i = 0, ROWS_1 = __WEBPACK_IMPORTED_MODULE_3__common_common__["d" /* ROWS */]; _i < ROWS_1.length; _i++) {
            var r = ROWS_1[_i];
            for (var _a = 0, VALUES_3 = __WEBPACK_IMPORTED_MODULE_3__common_common__["c" /* VALUES */]; _a < VALUES_3.length; _a++) {
                var v = VALUES_3[_a];
                if (this.sudokuModel.rows[r].vOccurrences[v] != 1) {
                    return false;
                }
            }
        }
        return true;
    }; // isSolved()
    /**
     * Returns true if cell has a value;
     */
    SudokuService.prototype.hasValue = function (c) {
        return this.sudokuModel.cells[c].value > 0;
    }; // hasValue()
    /**
     *
     */
    SudokuService.prototype.getRow = function (r) {
        return this.sudokuModel.rows[r];
    }; // getRow()
    /**
     *
     */
    SudokuService.prototype.getCol = function (c) {
        return this.sudokuModel.cols[c];
    }; // getCol()
    /**
     *
     */
    SudokuService.prototype.getBox = function (b) {
        return this.sudokuModel.boxs[b];
    }; // getBox()
    /**
     * Returns true if cell has a value;
     */
    SudokuService.prototype.containsValue = function (group, v) {
        return group.vOccurrences[v] === 1;
    }; // groupContainsValue()
    /**
     * Return the number of cells in the group that do not have a value. That is
     * cells that are open or not filled. A candidate cell cannot have a value.
     * cannot have any candidates. Within a group (row, column, or box),
     * value cells + candidate cells = 9.
     */
    SudokuService.prototype.candidateCellsCount = function (group) {
        var count = 0;
        for (var _i = 0, VALUES_4 = __WEBPACK_IMPORTED_MODULE_3__common_common__["c" /* VALUES */]; _i < VALUES_4.length; _i++) {
            var v = VALUES_4[_i];
            if (group.vOccurrences[v] === 0) {
                count++;
            }
        }
        return count;
    }; // candidateCellsCount()
    /**
     * Count the occurrences of each candidate in a group (row, column, or box).
     * Return an array of the counts. The array is 10 numbers each element
     * being the count of the corresponding candidate. The zero-th element is
     * not used. E.g. [0, 0,0,2, 3,0,0, 0,2,0] means candidate [3] occurs twice,
     * [4] 3 times, [8] twice, and all other candidate are absent in the group.
     */
    SudokuService.prototype.getCandidateCounts = function (group) {
        var kCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var _i = 0, VALUES_5 = __WEBPACK_IMPORTED_MODULE_3__common_common__["c" /* VALUES */]; _i < VALUES_5.length; _i++) {
            var k = VALUES_5[_i];
            if (this.groupContainsValue(group, k)) {
                continue; // next candidate
            }
            for (var _a = 0, _b = group.cells; _a < _b.length; _a++) {
                var c = _b[_a];
                if (this.hasValue(c)) {
                    continue; // next cell in group
                }
                if (this.sudokuModel.cells[c].candidates[k]) {
                    kCounts[k]++;
                }
            } // for cells in group
        } // for candidates
        return kCounts;
    }; // getCandidateCounts()
    /**
     *
     */
    SudokuService.prototype.isImpossible = function () {
        return !this.isSolutionPossible();
    }; // isImpossible()
    /**
     *
     */
    SudokuService.prototype.getCandidates = function (c) {
        if (this.hasValue(c)) {
            return [];
        }
        var candidates = [];
        for (var _i = 0, CANDIDATES_2 = __WEBPACK_IMPORTED_MODULE_3__common_common__["g" /* CANDIDATES */]; _i < CANDIDATES_2.length; _i++) {
            var k = CANDIDATES_2[_i];
            if (this.sudokuModel.cells[c].candidates[k]) {
                candidates.push(k);
            }
        }
        return candidates;
    }; // getCandidates()
    /**
     * Returns true if cell contains the candidate.
     */
    SudokuService.prototype.isCandidate = function (c, k) {
        return this.sudokuModel.cells[c].candidates[k];
    }; // isCandidate()
    /**
     * A cell is valid if its row, column, and box are all valid. In other words,
     * no value occurs more than once in the cell's row, column, and box.
     */
    SudokuService.prototype.isCellValid = function (c) {
        try {
            if (this.isGroupValid(this.sudokuModel.rows[__WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].rowIdx(c)])
                && this.isGroupValid(this.sudokuModel.cols[__WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].colIdx(c)])
                && this.isGroupValid(this.sudokuModel.boxs[__WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].boxIdx(c)])) {
                return true;
            }
        }
        catch (e) {
            console.info('c: ' + c);
            console.info('r: ' + __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].rowIdx(c));
            console.info('c: ' + __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].colIdx(c));
            console.info('b: ' + __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].boxIdx(c));
        }
        return false;
    };
    /**
     * Determines if the given givenValue appears 9 times.
     */
    SudokuService.prototype.isValueComplete = function (v) {
        var valueCount = 0;
        for (var _i = 0, CELLS_4 = __WEBPACK_IMPORTED_MODULE_3__common_common__["b" /* CELLS */]; _i < CELLS_4.length; _i++) {
            var c = CELLS_4[_i];
            if (this.sudokuModel.cells[c].value === v) {
                valueCount++;
            }
        }
        return valueCount === 9;
    }; // isValueComplete()
    /**
     *
     */
    SudokuService.prototype.getNumberOfCandidates = function (c) {
        var count = 0;
        var cell = this.sudokuModel.cells[c];
        for (var _i = 0, CANDIDATES_3 = __WEBPACK_IMPORTED_MODULE_3__common_common__["g" /* CANDIDATES */]; _i < CANDIDATES_3.length; _i++) {
            var k = CANDIDATES_3[_i];
            if (cell.candidates[k]) {
                count++;
            }
        }
        return count;
    }; // getNumberOfCandidates()
    /**
     * Used by SudokoCreationService.
     */
    SudokuService.prototype.removeLastActionLogEntry = function () {
        this.actionLog.removeLastEntry();
    }; // removeLastActionLogEntry()
    /**
     * Represent the values of the sudoku as an array of 81 values.
     */
    SudokuService.prototype.cellsToValuesArray = function () {
        var v = [];
        for (var _i = 0, CELLS_5 = __WEBPACK_IMPORTED_MODULE_3__common_common__["b" /* CELLS */]; _i < CELLS_5.length; _i++) {
            var c = CELLS_5[_i];
            v.push(this.sudokuModel.cells[c].value);
        }
        return v;
    }; // cellsToValuesArray()
    /**
     *
     */
    SudokuService.prototype.getLastAction = function () {
        return this.actionLog.getLastEntry();
    }; // getLastAction()
    /**
     * Called by user button press (playComponent.ts) undoLastAction())
     */
    SudokuService.prototype.undoLastAction = function () {
        var lastAction = this.actionLog.getLastEntry();
        this.undoAction(lastAction);
        this.actionLog.removeLastEntry();
    }; // undoLastAction()
    /**
     *
     */
    SudokuService.prototype.getActionLogAsString = function () {
        return this.actionLog.toStringLastFirst();
    }; // getActionLogAsString()
    /**
     * Refresh all cells candidates by first clearing all then seting
     * appropriate candidates in all cells that do not have a value.
     */
    SudokuService.prototype.refreshAllCandidates = function () {
        for (var _i = 0, CELLS_6 = __WEBPACK_IMPORTED_MODULE_3__common_common__["b" /* CELLS */]; _i < CELLS_6.length; _i++) {
            var c = CELLS_6[_i];
            if (!this.hasValue(c)) {
                this.removeAllCellCandidates(c);
                this.setCellCandidates(c);
            }
        }
    }; // refreshCandidates()
    // -------------------------------------------------------------------------
    // private methods
    // -------------------------------------------------------------------------
    /**
     * Initialize a cell.
     */
    SudokuService.prototype.initializeCell = function (cell) {
        cell.value = 0;
        cell.locked = false;
        for (var _i = 0, CANDIDATES_4 = __WEBPACK_IMPORTED_MODULE_3__common_common__["g" /* CANDIDATES */]; _i < CANDIDATES_4.length; _i++) {
            var k = CANDIDATES_4[_i];
            cell.candidates[k] = true;
        }
    }; // initializeCell()
    /**
     * Initialize a group (row, column, or box).
     */
    SudokuService.prototype.initializeGroup = function (group) {
        for (var _i = 0, VALUES_6 = __WEBPACK_IMPORTED_MODULE_3__common_common__["c" /* VALUES */]; _i < VALUES_6.length; _i++) {
            var v = VALUES_6[_i];
            group.vOccurrences[v] = 0;
        }
    }; // initializeGroup()
    /**
     * Set the appropriate candidates in a cell based on values that exist in
     * the cell's row, column, and box.
     */
    SudokuService.prototype.setCellCandidates = function (c) {
        // skip cells that have value
        if (this.hasValue(c)) {
            return;
        }
        var cell = this.sudokuModel.cells[c];
        var row = this.sudokuModel.rows[cell.row];
        var col = this.sudokuModel.cols[cell.col];
        var box = this.sudokuModel.boxs[cell.box];
        // add candidates to cell when value
        for (var _i = 0, VALUES_7 = __WEBPACK_IMPORTED_MODULE_3__common_common__["c" /* VALUES */]; _i < VALUES_7.length; _i++) {
            var v = VALUES_7[_i];
            if (row.vOccurrences[v] == 0
                && col.vOccurrences[v] == 0
                && box.vOccurrences[v] == 0) {
                this.addCandidate(c, v);
            }
        }
    }; // setCellCandidates()
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
    SudokuService.prototype.isCellStateValid = function (c) {
        return (this.hasValue(c) && !this.hasCandidates(c))
            || (!this.hasValue(c) && this.hasCandidates(c));
    }; // isCellStateValid()
    /**
     * A group (row, column, or box) is valid if values 1..9 occur no more than
     * once in the group.
     */
    SudokuService.prototype.isGroupValid = function (group) {
        for (var _i = 0, VALUES_8 = __WEBPACK_IMPORTED_MODULE_3__common_common__["c" /* VALUES */]; _i < VALUES_8.length; _i++) {
            var v = VALUES_8[_i];
            if (group.vOccurrences[v] > 1) {
                return false;
            }
        }
        return true;
    };
    /**
     * Return true if every cell is in a valid state, and
     * if every row, column, and box in a valid state.
     */
    SudokuService.prototype.isSolutionPossible = function () {
        for (var _i = 0, CELLS_7 = __WEBPACK_IMPORTED_MODULE_3__common_common__["b" /* CELLS */]; _i < CELLS_7.length; _i++) {
            var c = CELLS_7[_i];
            if (!this.isCellStateValid(c)) {
                return false;
            }
        }
        for (var _a = 0, GROUPS_3 = __WEBPACK_IMPORTED_MODULE_3__common_common__["k" /* GROUPS */]; _a < GROUPS_3.length; _a++) {
            var g = GROUPS_3[_a];
            if (!this.isGroupValid(this.sudokuModel.rows[g])) {
                return false;
            }
            if (!this.isGroupValid(this.sudokuModel.cols[g])) {
                return false;
            }
            if (!this.isGroupValid(this.sudokuModel.boxs[g])) {
                return false;
            }
        }
        return true;
    };
    /**
     * Returns true if cell has a value;
     */
    SudokuService.prototype.groupContainsValue = function (group, v) {
        return group.vOccurrences[v] === 1;
    }; // groupContainsValue()
    /**
     * Return the number of cells in the group that have a value. That is cells
     * that are closed or filled. It can be closed by having an initial given
     * value or by having a value assigned in solving the sudoku. A value cell
     * cannot have any candidates. Within a group (row, column, or box),
     *    value cells + candidate cells = 9.
     */
    SudokuService.prototype.valueCellsCount = function (group) {
        var count = 0;
        for (var _i = 0, VALUES_9 = __WEBPACK_IMPORTED_MODULE_3__common_common__["c" /* VALUES */]; _i < VALUES_9.length; _i++) {
            var v = VALUES_9[_i];
            if (group.vOccurrences[v] > 0) {
                count++;
            }
        }
        return count;
    };
    /**
     * Returns true if cell has one or more candidates.
     */
    SudokuService.prototype.hasCandidates = function (c) {
        for (var _i = 0, CANDIDATES_5 = __WEBPACK_IMPORTED_MODULE_3__common_common__["g" /* CANDIDATES */]; _i < CANDIDATES_5.length; _i++) {
            var k = CANDIDATES_5[_i];
            if (this.sudokuModel.cells[c].candidates[k]) {
                return true;
            }
        }
        return false;
    }; // hasCandidates()
    /**
     * Represent the values of the sudoku as an array of 81 values.
     */
    SudokuService.prototype.cellValuesToArray = function () {
        var valuesArray = [];
        for (var _i = 0, CELLS_8 = __WEBPACK_IMPORTED_MODULE_3__common_common__["b" /* CELLS */]; _i < CELLS_8.length; _i++) {
            var c = CELLS_8[_i];
            valuesArray.push(this.sudokuModel.cells[c].value);
        }
        return valuesArray;
    }; // cellsValuesToArray()
    /**
     * Represent the givenValues of the sudoku as a single-line string.
     */
    SudokuService.prototype.toOneLineString = function () {
        var s = '';
        var v;
        for (var _i = 0, CELLS_9 = __WEBPACK_IMPORTED_MODULE_3__common_common__["b" /* CELLS */]; _i < CELLS_9.length; _i++) {
            var c = CELLS_9[_i];
            v = this.sudokuModel.cells[c].value;
            s += (v === 0 ? '.' : v);
        }
        return s;
    }; // toOneLineString()
    /**
     * Represent the givenValues of the sudoku as a grid string.
     */
    SudokuService.prototype.toGridString = function () {
        return this.arrayToGridString(this.cellValuesToArray());
    }; // toGridString()
    /**
     * Represent the state of a row as a string.
     */
    SudokuService.prototype.rowToString = function (r) {
        var s = 'Row' + ' ' + (r + 1) + ': ';
        return s += this.groupToString(this.sudokuModel.rows[r]);
    }; // rowToString()
    /**
     * Represent the state of a column as a string.
     */
    SudokuService.prototype.colToString = function (c) {
        var s = 'Col' + ' ' + (c + 1) + ': ';
        return s += this.groupToString(this.sudokuModel.cols[c]);
    }; // colToString()
    /**
     * Represent the state of a box as a string.
     */
    SudokuService.prototype.boxToString = function (b) {
        var s = 'Box' + ' ' + (b + 1) + ': ';
        return s += this.groupToString(this.sudokuModel.boxs[b]);
    }; // boxToString()
    /**
     * Represent the state of a row, column, or box as a string. The "group"
     * parameter is the individual row, column, or box.
     */
    SudokuService.prototype.groupToString = function (group) {
        var s = '';
        for (var _i = 0, VALUES_10 = __WEBPACK_IMPORTED_MODULE_3__common_common__["c" /* VALUES */]; _i < VALUES_10.length; _i++) {
            var v = VALUES_10[_i];
            s += (group.vOccurrences[v] === 0) ? '.' : group.vOccurrences[v];
            if (v == 3 || v == 6) {
                s += ' ';
            }
        }
        s += ' ';
        for (var i = 0; i < group.cells.length; i++) {
            s += __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].pad(group.cells[i], 2) + ' ';
            if (i == 2 || i == 5) {
                s += ' ';
            }
        }
        return s;
    };
    /**
     * Represent the state of a cell as a string.
     */
    SudokuService.prototype.cellToString = function (c) {
        var cell = this.sudokuModel.cells[c];
        var s = '' + __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].toRowColString(c) + ': ';
        s += 'v:' + (cell.value != 0 ? cell.value : '.');
        s += ' k:';
        for (var _i = 0, CANDIDATES_6 = __WEBPACK_IMPORTED_MODULE_3__common_common__["g" /* CANDIDATES */]; _i < CANDIDATES_6.length; _i++) {
            var k = CANDIDATES_6[_i];
            s += (cell.candidates[k]) ? k : '.';
        }
        s += ' r' + (cell.row + 1) + ' c' + (cell.col + 1) + ' b' + (cell.box + 1);
        // if (!this.isValid()) {
        //   s += ' * * *';
        // }
        return s;
    };
    /**
     * Represent the state of the sudoku as a string.
     */
    SudokuService.prototype.toString = function () {
        var s = '';
        for (var _i = 0, ROWS_2 = __WEBPACK_IMPORTED_MODULE_3__common_common__["d" /* ROWS */]; _i < ROWS_2.length; _i++) {
            var r = ROWS_2[_i];
            s += this.rowToString(r) + '\n';
        }
        for (var _a = 0, COLS_1 = __WEBPACK_IMPORTED_MODULE_3__common_common__["e" /* COLS */]; _a < COLS_1.length; _a++) {
            var c = COLS_1[_a];
            s += this.colToString(c) + '\n';
        }
        for (var _b = 0, BOXS_1 = __WEBPACK_IMPORTED_MODULE_3__common_common__["f" /* BOXS */]; _b < BOXS_1.length; _b++) {
            var b = BOXS_1[_b];
            s += this.boxToString(b) + '\n';
        }
        for (var _c = 0, CELLS_10 = __WEBPACK_IMPORTED_MODULE_3__common_common__["b" /* CELLS */]; _c < CELLS_10.length; _c++) {
            var c = CELLS_10[_c];
            s += this.cellToString(c) + '\n';
        }
        return s;
    };
    /**
     * Represent the state of the sudoku as a string.
     */
    SudokuService.prototype.toStringRow = function (r) {
        var s = '';
        s += this.rowToString(r) + '\n';
        for (var _i = 0, _a = __WEBPACK_IMPORTED_MODULE_3__common_common__["h" /* ROW_CELLS */][r]; _i < _a.length; _i++) {
            var c = _a[_i];
            s += this.cellToString(c) + '\n';
        }
        return s;
    };
    /**
     *
     */
    SudokuService.prototype.getCandidates_ = function (r, c) {
        return this.getCandidates(__WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].urcToCellIdx(r, c));
    };
    /**
     * Add given candidate to given cell.
     * - cannot add candidate to cell that has a givenValue
     * - cannot add candidate if a related cell has that givenValue
     *
     * Called by:
     * - undoAction() - undo REMOVE_CANDIDATE
     * - removeValue()
     */
    SudokuService.prototype.addCandidate = function (c, k) {
        // do not add if givenValue exists
        if (this.sudokuModel.cells[c].value > 0) {
            // console.error('Cannot add candidate to cell with a givenValue.');
            return;
        }
        // do not add if any related cell has that givenValue
        for (var _i = 0, _a = __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].getRelatedCells(c); _i < _a.length; _i++) {
            var rc = _a[_i];
            if (this.sudokuModel.cells[rc].value === k) {
                return;
            }
        }
        // add candidate
        this.sudokuModel.cells[c].candidates[k] = true;
    }; // addCandidate()
    /**
     * Make every value a candidate because all initialized cells do not have
     * values.
     */
    SudokuService.prototype.setAllCellCandidates = function (c) {
        this.sudokuModel.cells[c].setAllCandidates();
    }; // setAllCellCandidates()
    /**
     * Remove all candidates from a cell.
     */
    SudokuService.prototype.removeAllCellCandidates = function (c) {
        this.sudokuModel.cells[c].unsetAllCandidates();
    }; // removeAllCellCandidates()
    /**
     * Represent a givenValues array of sudoku cell givenValues as a grid string.
     */
    SudokuService.prototype.arrayToGridString = function (valuesArray) {
        // private arrayToGridString(valuesArray: number[]) : string {
        var s = '';
        var i = 0;
        var v;
        for (var _i = 0, CELLS_11 = __WEBPACK_IMPORTED_MODULE_3__common_common__["b" /* CELLS */]; _i < CELLS_11.length; _i++) {
            var c = CELLS_11[_i];
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
    }; // arrayToGridString()
    return SudokuService;
}()); // class SudokuService

var SudokuModel = (function () {
    function SudokuModel() {
        this.cells = new Array(81);
        this.rows = new Array(9);
        this.cols = new Array(9);
        this.boxs = new Array(9);
        for (var _i = 0, GROUPS_4 = __WEBPACK_IMPORTED_MODULE_3__common_common__["k" /* GROUPS */]; _i < GROUPS_4.length; _i++) {
            var g = GROUPS_4[_i];
            this.rows[g] = new Group(__WEBPACK_IMPORTED_MODULE_3__common_common__["h" /* ROW_CELLS */][g]);
            this.cols[g] = new Group(__WEBPACK_IMPORTED_MODULE_3__common_common__["i" /* COL_CELLS */][g]);
            this.boxs[g] = new Group(__WEBPACK_IMPORTED_MODULE_3__common_common__["j" /* BOX_CELLS */][g]);
        }
        for (var _a = 0, CELLS_12 = __WEBPACK_IMPORTED_MODULE_3__common_common__["b" /* CELLS */]; _a < CELLS_12.length; _a++) {
            var c = CELLS_12[_a];
            this.cells[c] = new Cell(__WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].rowIdx(c), __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].colIdx(c), __WEBPACK_IMPORTED_MODULE_3__common_common__["a" /* Common */].boxIdx(c));
        }
    }
    return SudokuModel;
}()); // class SudokuModel
var Cell = (function () {
    /**
     * Initialize the cell to empty: no value and all candidates. Give the cell
     * a reference to its row, column, and box.
     * @param row
     * @param col
     * @param box
     */
    function Cell(row, col, box) {
        this.value = 0; // no value
        this.candidates = new Array(10);
        this.setAllCandidates(); // every value is candidate
        this.row = row;
        this.col = col;
        this.box = box;
    }
    /**
     * Make every value a candidate.
     */
    Cell.prototype.setAllCandidates = function () {
        for (var _i = 0, CANDIDATES_7 = __WEBPACK_IMPORTED_MODULE_3__common_common__["g" /* CANDIDATES */]; _i < CANDIDATES_7.length; _i++) {
            var k = CANDIDATES_7[_i];
            this.candidates[k] = true;
        }
    }; // setAllCandidates()
    /**
     * Clear all candidates.
     */
    Cell.prototype.unsetAllCandidates = function () {
        for (var _i = 0, CANDIDATES_8 = __WEBPACK_IMPORTED_MODULE_3__common_common__["g" /* CANDIDATES */]; _i < CANDIDATES_8.length; _i++) {
            var k = CANDIDATES_8[_i];
            this.candidates[k] = false;
        }
    }; // unsetAllCandidates()
    return Cell;
}()); // class Cell
var Group = (function () {
    function Group(groupCells) {
        this.vOccurrences = new Array(10);
        for (var _i = 0, VALUES_11 = __WEBPACK_IMPORTED_MODULE_3__common_common__["c" /* VALUES */]; _i < VALUES_11.length; _i++) {
            var v = VALUES_11[_i];
            this.vOccurrences[v] = 0;
        }
        this.cells = groupCells;
    }
    return Group;
}()); // class Group

//# sourceMappingURL=sudoku.service.js.map

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreationService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_common_common__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_model_difficulty__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_model_puzzle__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_action_action__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_action_action_log_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_hint_hint__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_hint_hint_type__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_hint_hint_service__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_model_sudoku_service__ = __webpack_require__(13);











// @Injectable()
var CreationService = (function () {
    function CreationService() {
        this.actionLog = new __WEBPACK_IMPORTED_MODULE_4__app_action_action_log_service__["a" /* ActionLogService */]();
        this.sudokuService = new __WEBPACK_IMPORTED_MODULE_8__app_model_sudoku_service__["a" /* SudokuService */](this.actionLog);
        this.hintService = new __WEBPACK_IMPORTED_MODULE_7__app_hint_hint_service__["a" /* HintService */](this.sudokuService);
    }
    /**
     *
     */
    CreationService.prototype.createSudoku = function (difficulty) {
        console.info('In creationService.createSudoku() difficulty: ' + difficulty);
        var sudoku = new __WEBPACK_IMPORTED_MODULE_2__app_model_puzzle__["a" /* Puzzle */]();
        sudoku.desiredDifficulty = difficulty;
        // step 1 - generate random finished sudoku
        // sudoku.completedPuzzle = this.makeRandomSolution();
        sudoku.completedPuzzle = this.makeRandomSolution();
        var pass = 0;
        // loop until we get sudoku of desired difficulty
        var desiredDifficulty = sudoku.desiredDifficulty;
        while (sudoku.actualDifficulty != desiredDifficulty) {
            pass++;
            // step 2 - create starting values by paring cells
            console.log('Pass: ' + pass);
            this.getStartingValues(sudoku);
            if (sudoku.initialValues === undefined) {
                continue; // desired difficulty has not been attained
            }
            // step 3 - solve puzzle to get stats and actual difficulty
            this.completePuzzle(sudoku);
            console.log('Pass ' + pass + ' diff ' + sudoku.actualDifficulty);
        } // while not getting desired difficulty
        sudoku.generatePasses = pass;
        // console.info('In creationService.createSudoku() sudoku: ' + sudoku);
        // console.info('In creationService.createSudoku() serialized: ' + sudoku.serialize());
        console.info('Created difficulty: ' + sudoku.actualDifficulty
            + ' in ' + sudoku.generatePasses + ' passes');
        return sudoku.serialize();
    }; // createSudoku()
    /**
     *
     */
    CreationService.prototype.initializeLogs = function () {
        this.sudokuService.initializeActionLog();
        this.hintService.initializeHintLog();
    };
    /**
     * [Step 1]
     * Start by seeding values 1..9 in 9 random cells. Then using standard
     * solving and guessing techniques create a random, consistent, fully
     * filled-in solution. Return the full solution as a cell values array.
     */
    CreationService.prototype.makeRandomSolution = function () {
        var start = Date.now(); // for elapsed time
        this.sudokuService.initializeModel();
        this.initializeLogs();
        this.randomCellIndexes = __WEBPACK_IMPORTED_MODULE_0__app_common_common__["a" /* Common */].shuffleArray(__WEBPACK_IMPORTED_MODULE_0__app_common_common__["b" /* CELLS */].slice());
        this.randomValues = __WEBPACK_IMPORTED_MODULE_0__app_common_common__["a" /* Common */].shuffleArray(__WEBPACK_IMPORTED_MODULE_0__app_common_common__["c" /* VALUES */].slice());
        // testing
        // this.randomCellIndexes = Common.RANDOM_CELLS_1;
        // this.randomValues = Common.RANDOM_VALUES_1;
        for (var _i = 0, VALUES_1 = __WEBPACK_IMPORTED_MODULE_0__app_common_common__["c" /* VALUES */]; _i < VALUES_1.length; _i++) {
            var v = VALUES_1[_i];
            this.sudokuService.setValue(this.randomCellIndexes[v], v, __WEBPACK_IMPORTED_MODULE_3__app_action_action__["a" /* ActionType */].GUESS_VALUE);
        }
        this.solve();
        var elapsed = Date.now() - start;
        console.info('Step 1 elapsed: ' + elapsed + 'ms');
        return this.sudokuService.cellsToValuesArray();
    }; // makeRandomSolution()
    /**
     * [Step 1]
     * Start by seeding values 1..9 in 9 random cells. Then using standard
     * solving and guessing techniques create a random, consistent, fully
     * filled-in solution. Return the full solution as a cell values array.
     */
    // private makeRandomSolution1() : number[] {
    //   let start: number = Date.now();   // for elapsed time
    //   this.sudokuService.setAllValues(ROOT_VALUES);
    //   this.randomizeFullSudoku();
    //   let elapsed: number = Date.now() - start;
    //   console.info('Step 1-1 elapsed: ' + elapsed + 'ms');
    //   return this.sudokuService.cellsToValuesArray();
    // } // makeRandomSolution()
    /**
     * [Step 2]
     */
    CreationService.prototype.getStartingValues = function (puzzle) {
        var start = Date.now(); // for elapsed time
        this.sudokuService.setAllValues(puzzle.completedPuzzle);
        this.initializeLogs();
        this.randomCellIndexes = __WEBPACK_IMPORTED_MODULE_0__app_common_common__["a" /* Common */].shuffleArray(__WEBPACK_IMPORTED_MODULE_0__app_common_common__["b" /* CELLS */].slice());
        this.randomValues = __WEBPACK_IMPORTED_MODULE_0__app_common_common__["a" /* Common */].shuffleArray(__WEBPACK_IMPORTED_MODULE_0__app_common_common__["c" /* VALUES */].slice());
        var randomParingCells = __WEBPACK_IMPORTED_MODULE_0__app_common_common__["a" /* Common */].shuffleArray(__WEBPACK_IMPORTED_MODULE_0__app_common_common__["b" /* CELLS */].slice(0, 41));
        // testing
        // this.randomCellIndexes = Common.RANDOM_CELLS_2;
        // this.randomValues = Common.RANDOM_VALUES_2;
        // let randomParingCells = Common.RANDOM_PARING_CELLS_2;
        var hardCount = 0;
        // just scan half (plus center) cells (0..40); symC is in other half
        var pairsRemoved = 0;
        NEXT_CELL: for (var _i = 0, randomParingCells_1 = randomParingCells; _i < randomParingCells_1.length; _i++) {
            var c = randomParingCells_1[_i];
            // cell & sym cell are 180deg rotationally symmetric
            var symC = 80 - c;
            // save then remove values of symmetric twins 
            var savedValue = this.sudokuService.getValue(c);
            var savedSymValue = this.sudokuService.getValue(symC);
            this.sudokuService.removeValue(c);
            this.sudokuService.removeValue(symC);
            // pare first 9 pairs without solving (for speed)
            if (++pairsRemoved <= 9) {
                continue NEXT_CELL;
            }
            switch (puzzle.desiredDifficulty) {
                // no guessing cases
                case __WEBPACK_IMPORTED_MODULE_1__app_model_difficulty__["a" /* Difficulty */].EASY:
                case __WEBPACK_IMPORTED_MODULE_1__app_model_difficulty__["a" /* Difficulty */].MEDIUM:
                case __WEBPACK_IMPORTED_MODULE_1__app_model_difficulty__["a" /* Difficulty */].HARD:
                    var hard = false;
                    while (this.hintService.getHint(puzzle.desiredDifficulty)) {
                        // count difficulty hard hints
                        if (this.hintService.getActiveHint().getDifficultyRating() === __WEBPACK_IMPORTED_MODULE_1__app_model_difficulty__["a" /* Difficulty */].HARD) {
                            hard = true;
                        }
                        this.hintService.applyHint();
                    }
                    var solved = this.sudokuService.isSolved();
                    this.rollbackAll();
                    if (solved) {
                        if (hard) {
                            hardCount++; // a hard hint was used
                        }
                        continue NEXT_CELL; // don't restore sym cells
                    } // if not solved, fall through to restore pared cells
                // guess when no hints available
                case __WEBPACK_IMPORTED_MODULE_1__app_model_difficulty__["a" /* Difficulty */].HARDEST:
                    var localSolutionsCount = this.countSolutions();
                    this.rollbackAll();
                    if (localSolutionsCount <= 1) {
                        continue NEXT_CELL; // don't restore sym cells
                    } // if multiple solutions, fall through to restore pared cells
            } // switch
            this.sudokuService.setValue(c, savedValue, __WEBPACK_IMPORTED_MODULE_3__app_action_action__["a" /* ActionType */].SET_VALUE);
            this.sudokuService.setValue(symC, savedSymValue, __WEBPACK_IMPORTED_MODULE_3__app_action_action__["a" /* ActionType */].SET_VALUE);
            this.sudokuService.removeLastActionLogEntry(); // keep restores out of action log
            this.sudokuService.removeLastActionLogEntry(); // keep restores out of action log
        } // for next random symmetric pairs of cells to pare
        // TODO
        // at end of step 2 no initial values is a signal that desired difficulty
        // is not being attained, so no use going on to step 3
        if (puzzle.desiredDifficulty === __WEBPACK_IMPORTED_MODULE_1__app_model_difficulty__["a" /* Difficulty */].HARD
            && hardCount === 0) {
            puzzle.initialValues = undefined;
        }
        else {
            puzzle.initialValues = this.sudokuService.cellsToValuesArray();
        }
        // activate to get and log step 2 elapsed times
        // let elapsed: number = Date.now() - start;
        // console.info('Step 2 elapsed: ' + elapsed + 'ms');
    }; // getStartingValues() [step 2 - no guesses]
    /**
     * [Step 3]
     * Now having a full solution and initial values, solve the sudoku using
     * hints and guessing. While doing this, count the specific solution
     * tehcniques (types of hints, and guesses) to properly determine the
     * actual difficulty rating.
     */
    CreationService.prototype.completePuzzle = function (puzzle) {
        var start = Date.now(); // for elapsed time
        this.initializeLogs();
        this.randomCellIndexes = __WEBPACK_IMPORTED_MODULE_0__app_common_common__["a" /* Common */].shuffleArray(__WEBPACK_IMPORTED_MODULE_0__app_common_common__["b" /* CELLS */].slice());
        this.randomValues = __WEBPACK_IMPORTED_MODULE_0__app_common_common__["a" /* Common */].shuffleArray(__WEBPACK_IMPORTED_MODULE_0__app_common_common__["c" /* VALUES */].slice());
        // testing
        // this.randomCellIndexes = Common.RANDOM_CELLS_3;
        // this.randomValues = Common.RANDOM_VALUES_3;
        this.solve();
        puzzle.completedPuzzle = this.sudokuService.cellsToValuesArray();
        puzzle.stats = this.hintService.getHintCounts();
        puzzle.actualDifficulty = puzzle.stats.getActualDifficulty();
        var elapsed = Date.now() - start;
        // console.log('Step 3 elapsed: ' + elapsed + 'ms');
    }; // completePuzzle() [step 3]
    /**
     * The basic solving "machine". From any point of an incomplete or empty
     * sudoku, this recursive method will (1) produce a solution, or
     * (2) conclude that a solution is impossible. This method will not look for
     * multiple solutions.
     *
     * At every step the method first looks for hints and applies them. If no
     * hint is found, it falls back on making a guess in a random cell that has
     * the fewest number of candidates. After a guess, it goes back to the
     * hint/apply loop until (1) a solution, (2) an impasse, or (3) another guess
     * is required. When an impasse is reached, the method will unwind back to
     * the last guess and try an alternative guess in that cell. When all
     * alternatives are exhausted, it will unwind further to any previous guess
     * and repeat the process until a solution is obtained or it determines that
     * there is no possible solution.
     *
     * In the recursions, whenever true is returned it means a solution has been.
     * Whenever false is returned it means any guesses have to be unwound or
     * finally there is no possible solution.
     */
    CreationService.prototype.solve = function () {
        while (this.hintService.getHint(__WEBPACK_IMPORTED_MODULE_1__app_model_difficulty__["a" /* Difficulty */].HARDEST) != undefined) {
            this.hintService.applyHint();
            if (this.sudokuService.isSolved()) {
                return true; // done
            }
            if (this.sudokuService.isImpossible()) {
                return false; // no value, no candidate cell exists
            }
        } // while -- no hint, try guess
        // now we have to resort to guessing
        var lastGuess = undefined;
        while (this.guess(lastGuess)) {
            if (this.solve()) {
                // recursive call returned true -> solved!
                return true;
            }
            else {
                // recursive call returned false -> (1) impossible. (2) no guesses left
                lastGuess = this.rollbackToLastGuess();
            }
        } // while guess()
        return false;
    }; // solve()
    /**
     * This method is a close parallel with the solve() method except that this
     * method will look for alternative solutions. The goal is to assure that
     * there is only one possible solution. If two possible solutions are found,
     * this is enough to conclude that there is no *unique* solution since a
     * sudoku requirement that a proper sudoku has only a single unique solution.
     *
     * In contrast to the parallel recursive solve() method, at each step this
     * method returns 1 if a solution is found. A return of 0 implies an impasse
     * at the recursion step or that there is no possible solution. The recustion
     * cycle will stop when 2 solutions are found ...............
     *
     * This method is used in step 2 in which a starting sudoku is produced from
     * step 1's full random solution. Step 2 and this method assure a unique
     * solution using hint and guess techniques appropriate to the target
     * difficulty rating desired.
     */
    CreationService.prototype.countSolutions = function () {
        while (this.hintService.getHint(__WEBPACK_IMPORTED_MODULE_1__app_model_difficulty__["a" /* Difficulty */].HARDEST) != undefined) {
            this.hintService.applyHint();
            if (this.sudokuService.isSolved()) {
                this.rollbackToLastGuess();
                return 1;
            }
            if (this.sudokuService.isImpossible()) {
                this.rollbackToLastGuess();
                return 0;
            }
        } // while getHint() -- no hint, try guess
        // now we have to resort to guessing
        var localSolutionsCount = 0;
        var lastGuess = undefined;
        while (this.guess(lastGuess)) {
            localSolutionsCount += this.countSolutions(); // recursive call
            if (localSolutionsCount >= 2) {
                this.rollbackToLastGuess();
                return localSolutionsCount;
            }
            else {
                lastGuess = this.rollbackToLastGuess();
            }
        } // while guess()
        this.rollbackToLastGuess();
        return localSolutionsCount;
    }; // countSolutions()
    /**
     * Makes a guess for a cell value. If a lastGuess is not provided, a cell
     * with the fewest number is selected. The first guess in a cell is the
     * first available candidate. If rollbacks dictate a subsequent guess, the
     * next available candidate is used.
     */
    CreationService.prototype.guess = function (lastGuess) {
        var guessCell = undefined;
        var possibleValues = [];
        var guessValue = undefined;
        if (lastGuess == undefined) {
            guessCell = this.findFewestCandidatesCell();
            possibleValues = this.sudokuService.getCandidates(guessCell);
        }
        else {
            guessCell = lastGuess.cell;
            possibleValues = lastGuess.possibleValues;
            this.sudokuService.removeLastActionLogEntry(); // remove previous action
            if (possibleValues.length === 0) {
                return false;
            }
        }
        guessValue = possibleValues[0]; // try 1st available candidate
        possibleValues = possibleValues.slice(1); // remove guess value
        this.hintService.addHintLogEntry(new __WEBPACK_IMPORTED_MODULE_5__app_hint_hint__["a" /* ValueHint */](__WEBPACK_IMPORTED_MODULE_6__app_hint_hint_type__["a" /* HintType */].GUESS, guessCell, guessValue));
        this.sudokuService.setValue(guessCell, guessValue, __WEBPACK_IMPORTED_MODULE_3__app_action_action__["a" /* ActionType */].GUESS_VALUE, possibleValues);
        return true;
    }; // guess()
    /**
     * Find and return the cell index that has the fewest candidates. The cound
     * cell should never have less than two candidates because zero would mean
     * the cell has a value, and one would have been earlier identified as a
     * naked single. Most of the time the fewest candidate cell will have only
     * two candidates. The cells are searched randomly.
     */
    CreationService.prototype.findFewestCandidatesCell = function () {
        var minCands = 10;
        var minCandsCell = -1;
        var currentCellCands;
        for (var _i = 0, _a = this.randomCellIndexes; _i < _a.length; _i++) {
            var c = _a[_i];
            if (this.sudokuService.hasValue(c)) {
                continue;
            }
            currentCellCands = this.sudokuService.getNumberOfCandidates(c);
            if (currentCellCands === 2) {
                return c; // can't get lower than 2
            }
            if (currentCellCands < minCands) {
                minCands = currentCellCands;
                minCandsCell = c;
            }
            // needed?
            if (minCands <= 2) {
                break; // 0 --> value, 1 --> naked single
            }
        }
        return minCandsCell;
    }; // findFewestCandidatesCell()
    /**
     * Working backwards undo every action until a guess action
     */
    CreationService.prototype.rollbackToLastGuess = function () {
        // undo entries that are not guesses
        var lastAction = this.actionLog.getLastEntry();
        while (lastAction && lastAction.type != __WEBPACK_IMPORTED_MODULE_3__app_action_action__["a" /* ActionType */].GUESS_VALUE) {
            this.sudokuService.undoAction(lastAction);
            this.actionLog.removeLastEntry();
            lastAction = this.actionLog.getLastEntry();
        }
        if (this.actionLog.getLastEntry() &&
            this.actionLog.getLastEntry().type === __WEBPACK_IMPORTED_MODULE_3__app_action_action__["a" /* ActionType */].GUESS_VALUE) {
            this.sudokuService.undoAction(this.actionLog.getLastEntry());
            return this.actionLog.getLastEntry(); // last GUESS_VALUE action
        }
        return undefined;
    }; // rollbackToLastGuess()
    /**
     * Called in step 3 to clear everything except initial (given) values
     */
    CreationService.prototype.rollbackAll = function () {
        while (this.actionLog.getLastEntry()) {
            this.sudokuService.undoAction(this.actionLog.getLastEntry());
            this.actionLog.removeLastEntry();
        }
    }; // rollbackAll()
    return CreationService;
}());

//# sourceMappingURL=creation.service.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9);


/***/ })
/******/ ]);
//# sourceMappingURL=creation.worker.bundle.js.map