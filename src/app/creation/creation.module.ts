import { NgModule } from '@angular/core';

import { SharedModule }     from '../shared.module';
import { SudokuService }    from '../model/sudoku.service';
import { CreationService }  from './creation.service';
import { SudokuModel }      from '../model/sudoku.model';
import { ActionLogService } from '../action/action-log.service';
import { HintService }      from '../hint/hint.service';
import { HintLogService }   from '../hint/hint-log.service';
// import { WebWorkerService } from 'angular2-web-worker';

@NgModule({
  imports: [
    SharedModule
  ],
  providers: [
    CreationService,
    // WebWorkerService
  ]
})
export class CreationModule { }
