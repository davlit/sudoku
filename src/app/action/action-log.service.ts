import { Injectable } from '@angular/core';

import { LogService } from '../common/log.service';
import { Action } from './action';

@Injectable()
export class ActionLogService extends LogService {
  
  addEntry(entry: Action) : void {
    super.addEntry(entry);
  }

  getLastEntry() : Action {
    return super.getLastEntry();
  }

}