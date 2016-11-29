"use strict";
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
var common_1 = require('../common/common');
var sudoku_1 = require('../model/sudoku');
var puzzle_1 = require('../model/puzzle');
var PrintComponent = (function () {
    function PrintComponent(board) {
        this.board = board;
    }
    PrintComponent.prototype.ngOnInit = function () { };
    PrintComponent.prototype.getDifficulty = function () {
        return puzzle_1.Puzzle.getDifficultyLabel(this.board.getCurrentSudoku().difficultyDelivered);
    };
    /**
     * Function based on view's cell indexes in html code.
     */
    PrintComponent.prototype.valueToChar_ = function (br, bc, cr, cc) {
        var value = this.getValue_(br, bc, cr, cc);
        return value == 0 ? '' : value.toString();
    };
    /**
     * Function based on view's cell indexes in html code.
     */
    PrintComponent.prototype.getValue_ = function (br, bc, cr, cc) {
        return this.board.getValue_(common_1.Common.viewToModelRow(br, cr), common_1.Common.viewToModelCol(bc, cc));
    };
    /**
     * Function based on view's cell indexes in html code.
     */
    PrintComponent.prototype.isCellLocked_ = function (br, bc, cr, cc) {
        return this.isCellLocked(common_1.Common.viewToModelRow(br, cr), common_1.Common.viewToModelCol(bc, cc));
    };
    PrintComponent.prototype.isCellLocked = function (r, c) {
        return this.board.isCellLocked(r, c);
    };
    PrintComponent.prototype.printGrid = function () {
        var printContents = document.getElementById('printcontent').innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    };
    PrintComponent = __decorate([
        core_1.Component({
            selector: 'app-container',
            templateUrl: 'app/print/print.component.html',
            // styleUrls: ['app/print/print.component.css', 'app/play/play.component.css']
            styleUrls: ['app/print/print.component.css']
        }), 
        __metadata('design:paramtypes', [sudoku_1.Sudoku])
    ], PrintComponent);
    return PrintComponent;
}());
exports.PrintComponent = PrintComponent;
//# sourceMappingURL=print.component.js.map