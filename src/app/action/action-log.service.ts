// import { Injectable } from '@angular/core';

import { LogService } from '../common/log.service';
import { Action } from './action';

// @Injectable()
export class ActionLogService extends LogService {
  
  public addEntry(entry: Action) : void {
    super.addEntry(entry);
  }

  public getLastEntry() : Action {
    return super.getLastEntry();
  }

}