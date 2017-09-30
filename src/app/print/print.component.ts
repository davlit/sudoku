import { Component, OnInit } from '@angular/core';

import { Common } from '../common/common';
// import { Sudoku } from '../model/sudoku';
import { SudokuService } from '../model/sudoku.service';
// import { Puzzle } from '../model/puzzle';
import { DIFFICULTY_LABELS } from '../model/difficulty';

@Component({
  selector: 'app-container',
  templateUrl: './print.component.html',
  // styleUrls: ['app/print/print.component.css', 'app/play/play.component.css']
  styleUrls: ['./print.component.scss']
})

export class PrintComponent implements OnInit {

  constructor(
    private sudokuService: SudokuService
  ) {}

  ngOnInit() {}

  getActualDifficulty() {
    // return Puzzle.getDifficultyLabel(this.sudokuService.getCurrentSudoku().difficulty);
    return DIFFICULTY_LABELS[this.sudokuService.getCurrentSudoku().difficulty];
  }

  /**
   * Function based on view's cell indexes in html code.
   */
  valueToChar_(br: number, bc: number, cr: number, cc: number) {
    var value = this.getValue_(br, bc, cr, cc);
    // return value == 0 ? '' : value.toString(); 
  }

  /**
   * Function based on view's cell indexes in html code.
   */
  getValue_(br: number, bc: number, cr: number, cc: number) {
      // return this.sudokuService.getValue_(Common.viewToModelRow(br, cr), 
      //     Common.viewToModelCol(bc, cc));
  }
  
  printGrid() {
    var printContents = document.getElementById('printcontent').innerHTML;     
    var originalContents = document.body.innerHTML;       
    document.body.innerHTML = printContents;      
    window.print();      
    document.body.innerHTML = originalContents;
  }

}