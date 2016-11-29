"use strict";
var common_1 = require('../common/common');
/**
 * Cell is one of the 81 cells in a standard sudoku.
 *
 * State:
 * - value
 * - candidates
 * - locked (boolean)
 */
var Cell = (function () {
    function Cell() {
        this.initialize();
    }
    /**
     *
     */
    Cell.prototype.initialize = function () {
        this.value = 0; // value 1..9, 0 means no value
        this.locked = false; // cell has original given value
        this.initializeCandidates();
    };
    // TESTING ONLY
    Cell.prototype.setCandidates = function (candidates) {
        this.candidates = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
            var k = candidates_1[_i];
            this.candidates[k] = 1;
        }
    };
    /**
     * Cell must have a value. candidates[0] is not used.
     */
    Cell.prototype.unsetAllCandidates = function () {
        if (this.value != 0) {
            this.candidates = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
    };
    /**
     * Every value is a candidate. candidates[0] is not used.
     */
    Cell.prototype.initializeCandidates = function () {
        if (this.value === 0) {
            this.candidates = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        }
    };
    /**
     * Set cell value to 1..9. Remove existing candidates.
     */
    Cell.prototype.setValue = function (newValue) {
        this.value = newValue; // set cell's new value
        for (var _i = 0, CANDIDATES_1 = common_1.CANDIDATES; _i < CANDIDATES_1.length; _i++) {
            var k = CANDIDATES_1[_i];
            if (this.candidates[k] === 1) {
                this.candidates[k] = 0;
            }
        }
    };
    /**
     * Set cell value to 1..9. Remove existing candidates.
     */
    Cell.prototype.setInitialValue = function (newValue) {
        this.value = newValue; // set cell's new value
        this.unsetAllCandidates();
        this.locked = true;
    };
    /**
     * Remove cell value. WARNING: 1 or more candidates must be added.
     */
    Cell.prototype.removeValue = function () {
        this.value = 0;
    };
    /**
     * Get the value in this cell. Zero means no value.
     */
    Cell.prototype.getValue = function () {
        return this.value;
    };
    /**
     * Determine if cell is valid. If the cell has a value, it cannot have any
     * candidates. If the cell does not have a value, it must have one or more
     * candidates.
     */
    Cell.prototype.isValid = function () {
        var cands = false;
        for (var _i = 0, CANDIDATES_2 = common_1.CANDIDATES; _i < CANDIDATES_2.length; _i++) {
            var k = CANDIDATES_2[_i];
            if (this.candidates[k] === 1) {
                cands = true;
                break;
            }
        }
        var value = this.hasValue();
        if (value && cands) {
            // console.log('Cell has value and candidate(s)!');
            return false;
        }
        if (!value && !cands) {
            // console.log('Cell has no value and no candidate(s)!');
            return false;
        }
        return true;
    }; // isValid()
    /**
     *
     */
    Cell.prototype.isImpossible = function () {
        return this.value === 0 && this.getNumberOfCandidates() === 0;
    };
    /**
     * Get an array of candidates.
     */
    Cell.prototype.getCandidates = function () {
        var candidates = [];
        for (var _i = 0, CANDIDATES_3 = common_1.CANDIDATES; _i < CANDIDATES_3.length; _i++) {
            var k = CANDIDATES_3[_i];
            if (this.candidates[k] === 1) {
                candidates.push(k);
            }
        }
        return candidates;
    };
    /**
     * Returns the number of candidates in cell.
     */
    Cell.prototype.getNumberOfCandidates = function () {
        var count = 0;
        for (var _i = 0, CANDIDATES_4 = common_1.CANDIDATES; _i < CANDIDATES_4.length; _i++) {
            var k = CANDIDATES_4[_i];
            if (this.candidates[k] === 1) {
                count++;
            }
        }
        return count;
    };
    /**
     * Determine if the cell is locked. A locked cell has a value that cannot
     * be changed. Cells with initial or given values are locked.
     */
    Cell.prototype.isLocked = function () {
        return this.locked;
    };
    /**
     * Lock the cell. When initialized, the cell is not locked.
     */
    Cell.prototype.setLocked = function () {
        if (this.hasValue()) {
            this.locked = true;
        }
    };
    /**
     * Determines if cell has a value 1..9.
     */
    Cell.prototype.hasValue = function () {
        return this.value > 0;
    };
    /**
     * Add a cell candidate.
     * - candidate cannot add candidate if cell has a value
     */
    Cell.prototype.addCandidate = function (k) {
        if (this.value > 0) {
            console.error('Cannot add candidate; cell has a value.');
            return;
        }
        if (this.candidates[k] < 1) {
            this.candidates[k] = 1;
        }
    };
    /**
     *
     */
    // new
    // removeCandidate(k: number, round: number) {
    Cell.prototype.removeCandidate = function (k) {
        if (this.candidates[k] === 1) {
            this.candidates[k] = 0;
        }
    };
    /**
     *
     */
    Cell.prototype.restoreCandidate = function (k) {
        this.candidates[k] = 1;
    };
    /**
     *
     */
    Cell.prototype.isCandidate = function (k) {
        return this.candidates[k] === 1;
    };
    /**
     * Given a candidate, or zero if none, return the next available candidate.
     */
    Cell.prototype.getNextCandidate = function (n) {
        for (var k = n + 1; k < common_1.CANDIDATES.length; k++) {
            if (this.candidates[k] === 1) {
                return k;
            }
        }
        return null;
    };
    /**
     * Returns an array of cell's candidates where the number of candidates is
     * is greater than 0 but less than or equal to the number specified by the
     * naked type. For NakedType.SINGLE, PAIR, TRIPLE, QUAD the number of
     * candidates in the array are 1, 1..2, 1..3, and 1..4.
     */
    Cell.prototype.findNakedCandidates = function (nakedType) {
        var maxCandidates = 0;
        switch (nakedType) {
            case 0 /* SINGLE */:
                maxCandidates = 1;
                break;
            case 1 /* PAIR */:
                maxCandidates = 2;
                break;
            case 2 /* TRIPLE */:
                maxCandidates = 3;
                break;
            case 3 /* QUAD */:
                maxCandidates = 4;
        }
        var nakeds = [];
        if (this.value > 0) {
            return nakeds;
        }
        for (var _i = 0, CANDIDATES_5 = common_1.CANDIDATES; _i < CANDIDATES_5.length; _i++) {
            var k = CANDIDATES_5[_i];
            if (this.candidates[k] === 1) {
                nakeds.push(k);
                if (nakeds.length > maxCandidates) {
                    return []; // to many k's in this cell
                }
            }
        } // next k
        return nakeds; // cell has maxCandidates or fewer
    };
    /**
     * Represent the state of the cell as a string.
     */
    Cell.prototype.toString = function () {
        var s = 'v:' + (this.value != 0 ? this.value : '.');
        s += ' k:';
        for (var _i = 0, CANDIDATES_6 = common_1.CANDIDATES; _i < CANDIDATES_6.length; _i++) {
            var k = CANDIDATES_6[_i];
            s += (this.candidates[k] === 1) ? k : '.';
        }
        if (!this.isValid()) {
            s += ' * * *';
        }
        return s;
    };
    return Cell;
}());
exports.Cell = Cell;
//# sourceMappingURL=cell.js.map