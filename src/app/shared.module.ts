import { NgModule } from '@angular/core';
import { SudokuService }         from './model/sudoku.service';
import { SudokuModel }         from './model/sudoku.model';
import { ActionLogService }      from './action/action-log.service';
import { HintService }        from './hint/hint.service';
import { HintLogService }        from './hint/hint-log.service';

@NgModule({
  providers: [
    SudokuService,
      SudokuModel, 
      ActionLogService, 
    HintService, 
      HintLogService
  ]
})
export class SharedModule { }
