import { Injectable } from '@angular/core';

import { Log } from '../common/log';
import { Action } from './action';

@Injectable()
export class ActionLog extends Log {
  
  addEntry(entry: Action) : void {
    super.addEntry(entry);
  }

  getLastEntry() : Action {
    return super.getLastEntry();
  }

}