import { Injectable, Injector } from '@angular/core';
// import { Injectable }          from '@angular/core';
import { bootstrapWorkerUi }          from '@angular/platform-webworker';
import { ClientMessageBrokerFactory } from '@angular/platform-webworker';
import { ClientMessageBroker }        from '@angular/platform-webworker';
import { UiArguments }                from '@angular/platform-webworker';
import { FnArg }                      from '@angular/platform-webworker';
import { PRIMITIVE }                  from '@angular/platform-webworker';
import { Difficulty }                 from './difficulty';

const SUDOKU_CHANNEL = 'SUDOKU';

@Injectable()
export class WebWorkerClient {
  private loaderScript: string; // '....../loader.js'

  constructor(loaderScript: string) {
    this.loaderScript = loaderScript;
  }

  createSerializedSudoku(difficulty: Difficulty) : string {
    let serializedSudoku: string = undefined;
    bootstrapWorkerUi(this.loaderScript, []).then((ref: any) => {
      let brokerFactory: ClientMessageBrokerFactory = 
          ref.injector.get(ClientMessageBrokerFactory);
      let broker: ClientMessageBroker = 
          brokerFactory.createMessageBroker(SUDOKU_CHANNEL, false);
      let fnArgs: FnArg[] = [new FnArg(difficulty, PRIMITIVE)];
      let uiArguments: UiArguments = new UiArguments(
          'creationService.createSudoku', fnArgs);
      let serializedSudoku: any = undefined;
      broker.runOnService(uiArguments, PRIMITIVE).then(result => {serializedSudoku = result});
    }); // bootstrapWorkerUi().then()
    return serializedSudoku;
  } // createSerializedSudoku()
} // class WebWorkerClient
