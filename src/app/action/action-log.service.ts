import { LogService } from '../common/log.service';
import { Action } from './action';

export class ActionLogService extends LogService {
  
  public addEntry(entry: Action) : void {
    super.addEntry(entry);
  }

  public getLastEntry() : Action {
    return super.getLastEntry();
  }

}
