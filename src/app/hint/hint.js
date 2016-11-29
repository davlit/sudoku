"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var difficulty_1 = require('../model/difficulty');
var common_1 = require('../common/common');
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
    Hint.prototype.getDifficultyRating = function () {
        switch (this.type) {
            case 0 /* NAKED_SINGLE */:
            case 1 /* HIDDEN_SINGLE_ROW */:
            case 2 /* HIDDEN_SINGLE_COL */:
            case 3 /* HIDDEN_SINGLE_BOX */:
                return difficulty_1.DifficultyType.EASY;
            default:
                return difficulty_1.DifficultyType.MEDIUM;
        }
    };
    return Hint;
}());
exports.Hint = Hint;
var ValueHint = (function (_super) {
    __extends(ValueHint, _super);
    function ValueHint(type, cell, value) {
        _super.call(this, type);
        this._cell = cell;
        this._value = value;
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
        return 0 /* SET_VALUE */;
    };
    ValueHint.prototype.toString = function () {
        // convert 0-base rows, cols, boxs to 1-base (1..9)
        var r = common_1.Common.rowNr(this._cell);
        var c = common_1.Common.colNr(this._cell);
        var b = common_1.Common.boxNr(this._cell);
        switch (this.type) {
            case 0 /* NAKED_SINGLE */:
                return common_1.Common.formatString('Naked single {0} in {1},{2}', [this._value, r, c]);
            case 1 /* HIDDEN_SINGLE_ROW */:
                return common_1.Common.formatString('Hidden single {0} in row, {1},{2}', [this._value, r, c]);
            case 2 /* HIDDEN_SINGLE_COL */:
                return common_1.Common.formatString('Hidden single {0} in col, {1},{2}', [this._value, r, c]);
            case 3 /* HIDDEN_SINGLE_BOX */:
                return common_1.Common.formatString('Hidden single {0} in box, {1},{2}', [this._value, r, c]);
            case 26 /* GUESS */:
                return common_1.Common.formatString('Guess {0} in {1},{2}', [this._value, r, c]);
        } // switch
    }; // toString()
    return ValueHint;
}(Hint));
exports.ValueHint = ValueHint;
var CandidatesHint = (function (_super) {
    __extends(CandidatesHint, _super);
    function CandidatesHint(type, cells, candidates, removals) {
        _super.call(this, type);
        this._cells = cells;
        this._candidates = candidates.sort();
        this._removals = removals;
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
        return null;
    };
    CandidatesHint.prototype.getActionType = function () {
        return 2 /* REMOVE_CANDIDATE */;
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
    CandidatesHint.prototype.toString = function () {
        // convert 0-base rows, cols, boxs to 1-base (1..9)
        var r = common_1.Common.rowNr(this._cells[0]);
        var c = common_1.Common.colNr(this._cells[0]);
        var b = common_1.Common.boxNr(this._cells[0]);
        switch (this.type) {
            case 4 /* NAKED_PAIRS_ROW */:
                return common_1.Common.formatString('Naked pairs {0}/{1} in row {2}', [this._candidates[0], this._candidates[1], r]);
            case 5 /* NAKED_PAIRS_COL */:
                return common_1.Common.formatString('Naked pairs {0}/{1} in col {2}', [this._candidates[0], this._candidates[1], c]);
            case 6 /* NAKED_PAIRS_BOX */:
                return common_1.Common.formatString('Naked pairs {0}/{1} in box {2}', [this._candidates[0], this._candidates[1], b]);
            case 7 /* POINTING_ROW */:
                return common_1.Common.formatString('Pointing row {0}, box {1}, candidate {2}', [r, b, this._candidates[0]]);
            case 8 /* POINTING_COL */:
                return common_1.Common.formatString('Pointing column {0}, box {1}, candidate {2}', [c, b, this._candidates[0]]);
            case 9 /* ROW_BOX_REDUCTION */:
                return common_1.Common.formatString('Box reduction in box {0}, row {1}, candidate {2}', [b, r, this._candidates[0]]);
            case 10 /* COL_BOX_REDUCTION */:
                return common_1.Common.formatString('Box reduction in box {0}, column {1}, candidate {2}', [b, c, this._candidates[0]]);
            case 11 /* NAKED_TRIPLES_ROW */:
                return common_1.Common.formatString('Naked triples {0}/{1}/{2} in row {3}', [this._candidates[0], this._candidates[1], this._candidates[2], r]);
            case 12 /* NAKED_TRIPLES_COL */:
                return common_1.Common.formatString('Naked triples {0}/{1}/{2} in column {3}', [this._candidates[0], this._candidates[1], this._candidates[2], c]);
            case 13 /* NAKED_TRIPLES_BOX */:
                return common_1.Common.formatString('Naked triples {0}/{1}/{2} in box {3}', [this._candidates[0], this._candidates[1], this._candidates[2], b]);
            case 17 /* NAKED_QUADS_ROW */:
                return common_1.Common.formatString('Naked quads {0}/{1}/{2}/{3} in row {4}', [this._candidates[0], this._candidates[1], this._candidates[2], this._candidates[3], r]);
            case 18 /* NAKED_QUADS_COL */:
                return common_1.Common.formatString('Naked quads {0}/{1}/{2}/{3} in column {4}', [this._candidates[0], this._candidates[1], this._candidates[2], this._candidates[3], c]);
            case 19 /* NAKED_QUADS_BOX */:
                return common_1.Common.formatString('Naked quads {0}/{1}/{2}/{3} in box {4}', [this._candidates[0], this._candidates[1], this._candidates[2], this._candidates[3], b]);
            case 14 /* HIDDEN_PAIRS_ROW */:
                return common_1.Common.formatString('Hidden pairs {0}/{1} in row {2}', [this._candidates[0], this._candidates[1], r]);
            case 15 /* HIDDEN_PAIRS_COL */:
                return common_1.Common.formatString('Hidden pairs {0}/{1} in column {2}', [this._candidates[0], this._candidates[1], c]);
            case 16 /* HIDDEN_PAIRS_BOX */:
                return common_1.Common.formatString('Hidden pairs {0}/{1} in box {2}', [this._candidates[0], this._candidates[1], b]);
            case 20 /* HIDDEN_TRIPLES_ROW */:
                return common_1.Common.formatString('Hidden triples {0}/{1}/{2} in row {3}', [this._candidates[0], this._candidates[1], this._candidates[2], r]);
            case 21 /* HIDDEN_TRIPLES_COL */:
                return common_1.Common.formatString('Hidden triples {0}/{1}/{2} in column {3}', [this._candidates[0], this._candidates[1], this._candidates[2], c]);
            case 22 /* HIDDEN_TRIPLES_BOX */:
                return common_1.Common.formatString('Hidden triples {0}/{1}/{2} in box {3}', [this._candidates[0], this._candidates[1], this._candidates[2], b]);
            case 23 /* HIDDEN_QUADS_ROW */:
                return common_1.Common.formatString('Hidden quads {0}/{1}/{2}/{3} in row {4}', [this._candidates[0], this._candidates[1], this._candidates[2], this._candidates[3], r]);
            case 24 /* HIDDEN_QUADS_COL */:
                return common_1.Common.formatString('Hidden quads {0}/{1}/{2}/{3} in column {4}', [this._candidates[0], this._candidates[1], this._candidates[2], this._candidates[3], c]);
            case 25 /* HIDDEN_QUADS_BOX */:
                return common_1.Common.formatString('Hidden quads {0}/{1}/{2}/{3} in box {4}', [this._candidates[0], this._candidates[1], this._candidates[2], this._candidates[3], b]);
        } // switch
    }; // toString()
    return CandidatesHint;
}(Hint));
exports.CandidatesHint = CandidatesHint;
//# sourceMappingURL=hint.js.map