import { NgModule } from '@angular/core';

import { SharedModule } from './shared.module';
import { SudokuService }         from './model/sudoku.service';
import { CreationService }         from './model/creation.service';
import { SudokuModel }         from './model/sudoku.model';
import { ActionLogService }      from './action/action-log.service';
import { HintService }        from './hint/hint.service';
import { HintLogService }        from './hint/hint-log.service';

@NgModule({
  imports: [
    SharedModule
  ],
  providers: [
    CreationService
  ]
})
export class CreationModule { }
