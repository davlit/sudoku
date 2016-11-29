import { Injectable } from '@angular/core';

import { Common } from './common';

@Injectable()
export abstract class Log {
  
  private _log: any[] = [];
  
  constructor() {}

  initialize() {
    this._log = [];
  }

  removeAllEntries() {
    this._log = [];
  }

  addEntry(entry: any) {
    this._log.push(entry);
  }

  getLastEntry() : any {
    return this._log.length > 0 ? this._log[this._log.length - 1] : null;
  }

  getAllEntries() : any[] {
    return this._log;
  }
  
  getSize() : number {
    return this._log.length
  }
  
  removeLastEntry() : void {
    this._log.pop();
  }
  
  toStringFirstFirst() : string {
    let s = '';
    let lineNr = 1;
    for (let entry of this._log) {
      s += Common.pad(lineNr++, 3) + '. ' 
          + entry.toString() + '\n';
    }
    return s;
  }
  
  toStringLastFirst() : string {
    let s = '';
    for (let lineNr = this._log.length; lineNr > 0; lineNr--) {
      s += Common.pad(lineNr, 3) + '. ' 
          + this._log[lineNr - 1].toString() + '\n';
    }
    return s;

  }
  
}
