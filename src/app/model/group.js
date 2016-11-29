"use strict";
var common_1 = require('../common/common');
/*
 * A Group is a sub-element of a sudoku. A Group can be a sudoku row, column,
 * or box. A Group contains 9 integer values called occurrences. Each
 * occurrence represents a value 1..9 and the integer value (0..n) of each
 * occurrence is the count of the number of times the value appears in the
 * group. (The occurrences array size is 10 but occurrencs[0] is not used.)
 *
 * A sudoku will have 27 groups (9 each of rows, columns, and boxes).
 *
 * - If a Group at, say, index 4 (occurrences[4]) has a value of 0, that
 * means the cell value of 4 does not appear in the Group object.
 * - If the Group value at index 4 is 1. The cell value of 4 appears once
 * in the Group object. Note that every sudoku cell containing will appear
 * in 3 Group objects: the row, column, and box that contain the cell.
 * - If the Group value at index 4 is greater than 1. The cell value of 4
 * appears more than once in the Group object -- possibly in the row,
 * column, and box. This is an invalid entry and must be corrected.
 *
 * Again, index 0 is not used.
 *
 * State:
 * - vOccurrences (can be derived from cells)
 */
var Group = (function () {
    function Group(groupCells) {
        this.initialize();
        this._groupCells = groupCells;
    }
    Object.defineProperty(Group.prototype, "groupCells", {
        get: function () {
            return this._groupCells;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initialize value occurrences to no values in group.
     * _vOccurrences[0] is not used.
     */
    Group.prototype.initialize = function () {
        this._vOccurrences = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this._kOccurrences = [0, 9, 9, 9, 9, 9, 9, 9, 9, 9];
    };
    // TESTING ONLY
    Group.prototype.setVOccurrences = function (vOccurrences) {
        this._vOccurrences = vOccurrences;
    };
    /**
     * Increment the count of times corresponding value is in group.
     * Typically this will be 0 -> 1.
     */
    Group.prototype.addValue = function (value) {
        this._vOccurrences[value]++;
    };
    /**
     * Decrement number of times corresponding value is in group.
     * Typically this will be 1 -> 0.
     */
    Group.prototype.removeValue = function (value) {
        this._vOccurrences[value]--;
    };
    /**
     * Returns true if given value appears in the group.
     */
    Group.prototype.containsValue = function (value) {
        return this._vOccurrences[value] > 0;
    };
    /**
     * A group is valid if any value if no values occur more than once
     * in the group.
     */
    Group.prototype.isValid = function () {
        for (var _i = 0, VALUES_1 = common_1.VALUES; _i < VALUES_1.length; _i++) {
            var v = VALUES_1[_i];
            if (this._vOccurrences[v] > 1) {
                return false; // stop and return group not valid
            }
        }
        return true;
    };
    /**
     * Determines if group is complete. That is, if any occurrence in
     * the group does not hold a value of 1, then the group is not
     * complete or is invalid. Equivalently, if every occurrence (1..9)
     * contains a 1, the group is complete (and valid).
     *
     * Returns true if group is complete (and valid).
     */
    Group.prototype.isComplete = function () {
        for (var _i = 0, VALUES_2 = common_1.VALUES; _i < VALUES_2.length; _i++) {
            var v = VALUES_2[_i];
            if (this._vOccurrences[v] != 1) {
                return false;
            }
        }
        return true;
    };
    Group.prototype.getValueCellsCount = function () {
        var count = 0;
        for (var _i = 0, VALUES_3 = common_1.VALUES; _i < VALUES_3.length; _i++) {
            var v = VALUES_3[_i];
            count += this._vOccurrences[v];
            // or
            if (this._vOccurrences[v] > 0) {
                count++;
            }
        }
        return count;
    };
    /**
     * Increment the count of times corresponding candidate is in group.
     */
    Group.prototype.addCandidate = function (candidate) {
        this._kOccurrences[candidate]++;
    };
    /**
     * Decrement number of times corresponding candidate is in group.
     */
    Group.prototype.removeCandidate = function (candidate) {
        this._kOccurrences[candidate]--;
    };
    /**
     * Represent the state of the group as a string.
     */
    Group.prototype.toString = function () {
        var s = '';
        for (var _i = 0, VALUES_4 = common_1.VALUES; _i < VALUES_4.length; _i++) {
            var v = VALUES_4[_i];
            s += (this._vOccurrences[v] === 0) ? '.' : this._vOccurrences[v];
            if (v == 3 || v == 6) {
                s += ' ';
            }
        }
        s += '|';
        for (var _a = 0, VALUES_5 = common_1.VALUES; _a < VALUES_5.length; _a++) {
            var k = VALUES_5[_a];
            s += (this._kOccurrences[k] === 0) ? '.' : this._kOccurrences[k];
            if (k == 3 || k == 6) {
                s += ' ';
            }
        }
        if (!this.isValid()) {
            s += ' * * *';
        }
        return s;
    };
    return Group;
}());
exports.Group = Group;
//# sourceMappingURL=group.js.map