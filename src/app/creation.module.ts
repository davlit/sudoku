import { NgModule } from '@angular/core';

import { SharedModule } from './shared.module';
import { SudokuService }         from './model/sudoku.service';
import { CreationService }         from './model/creation.service';
import { SudokuModel }         from './model/sudoku.model';
import { ActionLog }      from './action/actionLog';
import { HintService }        from './hint/hint.service';
import { HintLog }        from './hint/hintLog';

@NgModule({
  imports: [
    SharedModule
  ],
  providers: [
    CreationService
  ]
})
export class CreationModule { }
