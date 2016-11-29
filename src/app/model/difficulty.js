"use strict";
(function (DifficultyType) {
    DifficultyType[DifficultyType["UNKNOWN"] = 0] = "UNKNOWN";
    DifficultyType[DifficultyType["EASY"] = 1] = "EASY";
    DifficultyType[DifficultyType["MEDIUM"] = 2] = "MEDIUM";
    DifficultyType[DifficultyType["HARD"] = 3] = "HARD";
    DifficultyType[DifficultyType["HARDEST"] = 4] = "HARDEST";
    DifficultyType[DifficultyType["ANY"] = 5] = "ANY";
})(exports.DifficultyType || (exports.DifficultyType = {}));
var DifficultyType = exports.DifficultyType;
var Difficulty = (function () {
    function Difficulty() {
    }
    /**
     *
     */
    Difficulty.getDifficultyName = function (type) {
        switch (type) {
            case DifficultyType.EASY:
                return 'Easy';
            case DifficultyType.MEDIUM:
                return 'Medium';
            case DifficultyType.HARD:
                return 'Hard';
            case DifficultyType.HARDEST:
                return 'Hardest';
            case DifficultyType.ANY:
                return 'Any';
            case DifficultyType.UNKNOWN:
                return 'Unknown';
            default:
                return 'Unknown';
        }
    };
    /**
     * Determine the difficulty of a sudoku based on the techniques required to
     * achieve the solution.
     */
    Difficulty.getDifficulty = function (hintCounts) {
        // HARDEST
        if (hintCounts.guesses > 0) {
            return DifficultyType.HARDEST;
        }
        // HARD
        if (hintCounts.getNakedTriples() > 0
            || hintCounts.getNakedQuads() > 0
            || hintCounts.getHiddenPairs() > 0
            || hintCounts.getHiddenTriples() > 0
            || hintCounts.getHiddenQuads() > 0) {
            return DifficultyType.HARD;
        }
        // MEDIUM
        if (hintCounts.getNakedPairs() > 0
            || hintCounts.getPointingRowsCols() > 0
            || hintCounts.getBoxReductions() > 0) {
            return DifficultyType.MEDIUM;
        }
        // EASY
        if (hintCounts.getHiddenSingles() > 0
            || hintCounts.nakedSingles > 0) {
            return DifficultyType.EASY;
        }
        return DifficultyType.EASY;
    }; // getDifficultyType()
    return Difficulty;
}());
exports.Difficulty = Difficulty;
//# sourceMappingURL=difficulty.js.map