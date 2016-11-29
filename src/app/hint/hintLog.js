"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var log_1 = require('../common/log');
var hintCounts_1 = require('./hintCounts');
var HintLog = (function (_super) {
    __extends(HintLog, _super);
    function HintLog() {
        _super.apply(this, arguments);
    }
    HintLog.prototype.addEntry = function (entry) {
        _super.prototype.addEntry.call(this, entry);
    };
    HintLog.prototype.getAllEntries = function () {
        return _super.prototype.getAllEntries.call(this);
    };
    HintLog.prototype.getLastEntry = function () {
        return _super.prototype.getLastEntry.call(this);
    };
    HintLog.prototype.getHintCounts = function () {
        var hintCounts = new hintCounts_1.HintCounts();
        for (var _i = 0, _a = this.getAllEntries(); _i < _a.length; _i++) {
            var hint = _a[_i];
            switch (hint.type) {
                case 0 /* NAKED_SINGLE */:
                    hintCounts.nakedSingles++;
                    break;
                case 1 /* HIDDEN_SINGLE_ROW */:
                    hintCounts.hiddenSinglesRow++;
                    break;
                case 2 /* HIDDEN_SINGLE_COL */:
                    hintCounts.hiddenSinglesCol++;
                    break;
                case 3 /* HIDDEN_SINGLE_BOX */:
                    hintCounts.hiddenSinglesBox++;
                    break;
                case 4 /* NAKED_PAIRS_ROW */:
                    hintCounts.nakedPairsRow++;
                    break;
                case 5 /* NAKED_PAIRS_COL */:
                    hintCounts.nakedPairsCol++;
                    break;
                case 6 /* NAKED_PAIRS_BOX */:
                    hintCounts.nakedPairsBox++;
                    break;
                case 7 /* POINTING_ROW */:
                    hintCounts.pointingRows++;
                    break;
                case 8 /* POINTING_COL */:
                    hintCounts.pointingCols++;
                    break;
                case 9 /* ROW_BOX_REDUCTION */:
                    hintCounts.rowBoxReductions++;
                    break;
                case 10 /* COL_BOX_REDUCTION */:
                    hintCounts.colBoxReductions++;
                    break;
                case 11 /* NAKED_TRIPLES_ROW */:
                    hintCounts.nakedTriplesRow++;
                    break;
                case 12 /* NAKED_TRIPLES_COL */:
                    hintCounts.nakedTriplesCol++;
                    break;
                case 13 /* NAKED_TRIPLES_BOX */:
                    hintCounts.nakedTriplesBox++;
                    break;
                case 17 /* NAKED_QUADS_ROW */:
                    hintCounts.nakedQuadsRow++;
                    break;
                case 18 /* NAKED_QUADS_COL */:
                    hintCounts.nakedQuadsCol++;
                    break;
                case 19 /* NAKED_QUADS_BOX */:
                    hintCounts.nakedQuadsBox++;
                    break;
                case 14 /* HIDDEN_PAIRS_ROW */:
                    hintCounts.hiddenPairsRow++;
                    break;
                case 15 /* HIDDEN_PAIRS_COL */:
                    hintCounts.hiddenPairsCol++;
                    break;
                case 16 /* HIDDEN_PAIRS_BOX */:
                    hintCounts.hiddenPairsBox++;
                    break;
                case 26 /* GUESS */:
                    hintCounts.guesses++;
                    break;
                default:
            } // switch
        } // for hints in log
        return hintCounts;
    }; // getHintCounts()
    HintLog = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], HintLog);
    return HintLog;
}(log_1.Log));
exports.HintLog = HintLog;
//# sourceMappingURL=hintLog.js.map