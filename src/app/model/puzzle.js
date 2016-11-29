"use strict";
var common_1 = require('../common/common');
var difficulty_1 = require('./difficulty');
var Puzzle = (function () {
    function Puzzle() {
        this._initialValues = null;
        this._completedPuzzle = null;
        this._difficultyRequested = difficulty_1.DifficultyType.UNKNOWN;
        this._difficultyDelivered = difficulty_1.DifficultyType.UNKNOWN;
        this._solutionsCount = null;
        this._stats = null;
    }
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
    Object.defineProperty(Puzzle.prototype, "difficultyRequested", {
        get: function () {
            return this._difficultyRequested;
        },
        set: function (difficulty) {
            this._difficultyRequested = difficulty;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Puzzle.prototype, "difficultyDelivered", {
        get: function () {
            return this._difficultyDelivered;
        },
        set: function (difficulty) {
            this._difficultyDelivered = difficulty;
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
            case difficulty_1.DifficultyType.UNKNOWN:
                return 'Unknown';
            case difficulty_1.DifficultyType.EASY:
                return 'Easy';
            case difficulty_1.DifficultyType.MEDIUM:
                return 'Medium';
            case difficulty_1.DifficultyType.HARD:
                return 'Hard';
            case difficulty_1.DifficultyType.HARDEST:
                return 'Hardest';
        }
    };
    Puzzle.prototype.toString = function () {
        var s = '';
        if (this._initialValues) {
            s += '-Initial values:\n' + common_1.Common.valuesArrayToString(this._initialValues) + '\n';
            s += '-Initial empty  cells: ' + this.getInitialEmptyCells() + '\n';
            s += '-Initial filled cells: ' + this.getInitialFilledCells() + '\n';
        }
        if (this._completedPuzzle) {
            s += '-Completed puzzle:\n' + common_1.Common.valuesArrayToString(this._completedPuzzle) + '\n';
        }
        if (this._generatePasses) {
            s += '-Generate passes: ' + this._generatePasses + '\n';
        }
        s += '-Difficulty requested/delivered: '
            + Puzzle.getDifficultyLabel(this._difficultyRequested) + '/'
            + Puzzle.getDifficultyLabel(this._difficultyDelivered) + '\n';
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
exports.Puzzle = Puzzle;
//# sourceMappingURL=puzzle.js.map