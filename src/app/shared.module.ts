import { NgModule } from '@angular/core';
import { SudokuService }         from './model/sudoku.service';
import { SudokuModel }         from './model/sudoku.model';
import { ActionLog }      from './action/actionLog';
import { HintService }        from './hint/hint.service';
import { HintLog }        from './hint/hintLog';

@NgModule({
  providers: [
    SudokuService,
      SudokuModel, 
      ActionLog, 
    HintService, 
      HintLog
  ]
})
export class SharedModule { }
