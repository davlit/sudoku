import { Component, OnInit } from '@angular/core';

import { Common } from '../common/common';
import { Sudoku } from '../model/sudoku';
import { Puzzle } from '../model/puzzle';

@Component({
  selector: 'app-container',
  templateUrl: './print.component.html',
  // styleUrls: ['app/print/print.component.css', 'app/play/play.component.css']
  styleUrls: ['./print.component.css']
})

export class PrintComponent implements OnInit {

  constructor(
    private board: Sudoku
  ) {}

  ngOnInit() {}

  getActualDifficulty() {
    return Puzzle.getDifficultyLabel(this.board.getCurrentSudoku().actualDifficulty);
  }

  /**
   * Function based on view's cell indexes in html code.
   */
  valueToChar_(br: number, bc: number, cr: number, cc: number) {
    var value = this.getValue_(br, bc, cr, cc);
    return value == 0 ? '' : value.toString(); 
  }

  /**
   * Function based on view's cell indexes in html code.
   */
  getValue_(br: number, bc: number, cr: number, cc: number) {
      return this.board.getValue_(Common.viewToModelRow(br, cr), 
          Common.viewToModelCol(bc, cc));
  }
  
  /**
   * Function based on view's cell indexes in html code.
   */
  isCellLocked_(br: number, bc: number, cr: number, cc: number) {
    return this.isCellLocked(Common.viewToModelRow(br, cr), Common.viewToModelCol(bc, cc));
  }
  
  private isCellLocked(r: number, c: number) : boolean {
    return this.board.isCellLocked(r, c);
  }
  
  printGrid() {
    var printContents = document.getElementById('printcontent').innerHTML;     
    var originalContents = document.body.innerHTML;       
    document.body.innerHTML = printContents;      
    window.print();      
    document.body.innerHTML = originalContents;
  }

}