import { NgModule}                     from '@angular/core';
import { Component }                   from '@angular/core';
import { WorkerAppModule }             from '@angular/platform-webworker';
import { ServiceMessageBrokerFactory } from '@angular/platform-webworker';
import { PRIMITIVE }                   from '@angular/platform-webworker';
import { platformWorkerAppDynamic    } from '@angular/platform-webworker-dynamic';

import { Difficulty } from './difficulty';

const SUDOKU_CHANNEL = "SUDOKU";

@Component({
})
class Worker {

  constructor(private _serviceBrokerFactory: ServiceMessageBrokerFactory) {
    let broker = _serviceBrokerFactory.createMessageBroker(SUDOKU_CHANNEL, false);
    broker.registerMethod("sudoku", [PRIMITIVE], this.makeSudoku, PRIMITIVE);
  }

  private makeSudoku(difficulty: Difficulty) {
    if (difficulty) {
      let result = 1775;
      return Promise.resolve(result);
    }
    return Promise.resolve('');
  } // makeSudoku()

} // class Worker

@NgModule({
  declarations: [Worker],
  imports: [WorkerAppModule],   // from @angular
  bootstrap: [Worker]
})
class WorkerModule {
}

platformWorkerAppDynamic().bootstrapModule(WorkerModule);
