"use strict";
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
exports.HintCounts = HintCounts;
//# sourceMappingURL=hintCounts.js.map