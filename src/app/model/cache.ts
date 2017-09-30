import { Injectable } from '@angular/core';

import { Difficulty,
         DIFFICULTY_LABELS,
         DIFFICULTY_LABELS_PADDED }  from './difficulty';

import { MessageService } from '../common/message.service';

import * as CacheWorker from 
  'worker-loader!../../web-workers/creation-worker/cache.worker.bundle.js';
// import { CacheWorker } from '../../web-workers/creation-worker/cache.worker';

// export const KEYS: string[][] = 
//     [['00', '01', '02'],   // easy    1st, 2d, 3d
//      ['10', '11', '12'],   // medium  1st, 2d, 3d
//      ['20', '21', '22'],   // hard    1st, 2d, 3d
//      ['30', '31', '32']];  // hardest 1st, 2d, 3d
import { KEYS } from '../common/common';
import { DIFFICULTIES } from '../common/common';

// @Injectable()
export class Cache {

  // private cacheWorker: Worker;
  // private cacheWorker: any;
  // private cacheWorker: Worker = undefined;
  private cacheWorker: Worker = new CacheWorker();
  private webWorkerRunning: boolean;
  private messageService: MessageService

  // constructor(private messageService: MessageService) {
  constructor() {
    this.messageService = new MessageService();
    // this.cacheWorker = new CacheWorker();
    this.webWorkerRunning = false;
  }

  // -------------------------------------------------------------------------
  //  Public methods
  // -------------------------------------------------------------------------

  /**
   * Get an array of current localStorage keys.
   */
  public getCacheKeys() : string[] {
    let keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      keys.push(localStorage.key(i));
    }
    return keys;
  } // getCacheKeys()

  /**
   * Returns true if a sudoku of given difficulty is cached.
   */
  public isSudokuAvailable(difficulty: Difficulty) : boolean {

    // TEMP TESTING
    if (difficulty == Difficulty.HARDEST) {
      return false;
    }

    if (localStorage.getItem(KEYS[difficulty][0])) {
      return true;
    } 

    this.replenishCache();
    return false;
  } // isSudokuAvailable()

  /**
   * Get a sudoku from the cache. This will use the first item of the given
   * difficulty -- usually the [difficulty][0]. To make this a FIFO queue,
   * we move cached sudokus forward and add the latest sudokus to the end 
   * of the queus. 
   */  
  public getSudoku(difficulty: Difficulty) : string {

console.info('\n1. ' + DIFFICULTY_LABELS[difficulty] + ' sudoku requested by user')

    let key: string = KEYS[difficulty][0];
    let item: string = localStorage.getItem(key);
    if (item) {
      localStorage.removeItem(key);
    }
    this.replenishCache();
    return item;
  } // getSudoku()

  /**
   * Trigger the web worker.
   */
  public replenishCache() : void {

console.info('\nReplenishCache() 1');    
    if (!this.webWorkerRunning) {
console.info('\nReplenishCache() 2');    
      this.cacheWorker.postMessage('replenish cache');
      this.webWorkerRunning = true;
    }
  } // replenishCache()

  /**
   * Empty the cache. Used for testing.
   */
  public emptyCache() : void {
    localStorage.clear()
  } // emptyCache()

  /**
   * 
   */
  public activeCachesToString() : string {
    let s: string = '\n';
    for (let diff of DIFFICULTIES) {
      // s += Puzzle.getDifficultyLabelPadded(diff) + ': ';
      s += DIFFICULTY_LABELS_PADDED[diff] + ': ';
      for (let i of [0, 1, 2]) {
        if (this.hasItem(KEYS[diff][i])) {
          s += (i + 1) + ',';
        }
      }
      s = s.replace(/,\s*$/, ''); // remove trailing comma
      s += '\n';
    }
    return s;
  } // activeCachesToString()

  // -------------------------------------------------------------------------
  //  Private methods
  // -------------------------------------------------------------------------

  /**
   * When (any) message received from cache web worker, notify AppComponent 
   * that the cache may have changed.
   */
  private ngOnInit() {
    this.cacheWorker.onmessage = ((event: MessageEvent) => {
      this.webWorkerRunning = false;
      this.messageService.sendMessage('cache changed');
    });
  } // ngOnInit()

  /**
   * Is an item stored under the given key.
   * 
   * @param key 
   */
  private hasItem(key: string) : boolean {
    return localStorage.getItem(key) != null;
  } // hasItem()

}
