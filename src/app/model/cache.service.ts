import { Injectable } from '@angular/core';

import { Difficulty,
         DIFFICULTY_LABELS,
         DIFFICULTY_LABELS_PADDED }  from './difficulty';
import { Puzzle }       from './puzzle';

import * as CreationWorker from 
  'worker-loader!../../web-workers/creation-worker/creation.worker.bundle.js';

import { MessageService } from '../common/message.service';

/*  
localStorage API - keys and stored data are all strings
see https://html.spec.whatwg.org/multipage/webstorage.html#the-storage-interface
----------------
localStorage.setItem(key: string, item: string) : void
  -- checks if key/value pair exists
  -- if no, key/value pair is added
  -- if yes, value is updated
localStorage.getItem(key: string) : string 
  -- if key/value pair exists
  -- if yes, returns value (string) associated with key
  -- if no, returns null (not undefined!)
localStorage.length : number 
  --  returns number of keys
localStorage.key(i: number) : string 
  -- returns the ith key
localStorage.removeItem(key: string) : void 
  -- removes key/value pair
localStorage.clear() : void 
  -- removes all key/value pairs
 */

const USE_WEBWORKER = true;
const DIFFICULTIES = [Difficulty.EASY, 
                      Difficulty.MEDIUM, 
                      Difficulty.HARD, 
                      Difficulty.HARDEST];
const KEYS: string[][] = [['00', '01', '02'],   // easy    1st, 2d, 3d
                          ['10', '11', '12'],   // medium  1st, 2d, 3d
                          ['20', '21', '22'],   // hard    1st, 2d, 3d
                          ['30', '31', '32']];  // hardest 1st, 2d, 3d
// const KEYS: string[][] = [['00', '01', '02'],   // easy    1st, 2d, 3d
//                           ['10', '11', '12'],   // medium  1st, 2d, 3d
//                           ['20', '21', '22']];  // hard    1st, 2d, 3d

/**
 * This establishes a priority for creating sudokus. The "hard" cand take
 * considerably more time to create than the other difficulties. Therefore we
 * quickly create 1 each of the 3 faster ones before creating the 1st "hard."
 * After we have 1 of all the difficulties, we quickly finish out the set of
 * the faster ones, then finish with additional "hard" ones.
 */                          
// const CREATE_PRIORITIES = [KEYS[0][0], KEYS[1][0], KEYS[3][0], KEYS[2][0], 
//                            KEYS[0][1], KEYS[1][1], KEYS[3][1], 
//                            KEYS[0][2], KEYS[1][2], KEYS[3][2],
//                            KEYS[2][1], KEYS[2][2]];
                          //  KEYS[0][1], KEYS[0][2], 
                          //  KEYS[3][1], KEYS[3][2], 
                          //  KEYS[1][1], KEYS[1][2], 
                          //  KEYS[2][1], KEYS[2][2]];
const CREATE_PRIORITIES = [KEYS[0][0], KEYS[1][0], KEYS[2][0], 
                           KEYS[0][1], KEYS[1][1],  
                           KEYS[0][2], KEYS[1][2], 
                           KEYS[2][1], KEYS[2][2]];

/**
 * Manages the cache of prepared sudokus of varying difficulty.
 */
@Injectable()
export class CacheService {

  private creationWorker: Worker = undefined;
  private webWorkerRunning: boolean = false;
  // private activeKey: string = undefined;
  private activeDifficulty: Difficulty = undefined;

  constructor(private messageService: MessageService) {
      this.creationWorker = new CreationWorker();
      this.init();
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

    for (let key of KEYS[difficulty]) {
      if (localStorage.getItem(key)) {
        return true;
      }
    }
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

    let sudoku: string = undefined;
    for (let key of KEYS[difficulty]) {
      sudoku = this.retrieveAndRemoveCacheItem(key);
      if (sudoku) {

console.info('\n2. ' + DIFFICULTY_LABELS[difficulty] + ' sudoku pulled from cache')

        // move backup versions forward
        this.moveItem(KEYS[difficulty][1], KEYS[difficulty][0]);
        this.moveItem(KEYS[difficulty][2], KEYS[difficulty][1]);

console.info('\n3. Message to app: Cache changed');

        this.sendMessage('Cache changed');

console.info('\n4. Call: replenishCache()');

        // as soon as a cached sudoku is used, replace it
        this.replenishCache();
        return sudoku;
      } // if
    } // for
    return sudoku;
  } // getSudoku()

  /**
   * Replenish the cache by creating and cacheing sudokus.
   */
  public replenishCache() : void {

    // let web worker do one creation at a time
    if (this.webWorkerRunning) {
      return;   // try again later
    }
    
console.info('\n5. Cache before webworker replenishment: ' 
  + this.activeCachesToString());

    // priority seach to find first empty key
    // if none found, fall through - nothing to replenish
    for (let key of CREATE_PRIORITIES) {
      if (this.isEmpty(key)) {
        this.activeDifficulty = this.getDifficulty(key);
        this.webWorkerRunning = true;

console.info('\n6. Trigger web worker to create replacement for cache');

        // send message to web worker to create a sudoku
        this.creationWorker.postMessage(this.activeDifficulty);
        return;
      } // if
    } // for
    return;
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
   * Receive web worker output
   */
  private init() {
console.info('\ninit()');
    this.creationWorker.onmessage = ((event: MessageEvent) => {

console.info('\n7. Replacement received to replenish cache');

// console.info('keys: ' + this.activeCachesToString());

      let newDifficulty: Difficulty = this.activeDifficulty;
      let newKey: string = this.findFirstEmptyKey(newDifficulty);

      // mark web worker as not running, cache returned sudoku,
      // set active difficulty to null
      this.webWorkerRunning = false;
      this.activeDifficulty = null;

console.info('\n8. Replacement sudoku cached');

      localStorage.setItem(newKey, event.data);

console.info('\n9. Cache after webworker replenishment: ' 
  + this.activeCachesToString());

console.info('\n10. Message to app: Cache changed');

    // notify AppComponent that cache has changed
    this.sendMessage('Cache changed');

      // This is a loop. Since replenishCache() engages a web worker to
      // create a sudoku, and this function, creationWorker.onmessage(),
      // is called unpon the web worker's completion, calling 
      // replenish.cache() here creates a loop. However, replenishCache()
      // stops when the cache is full. So whenever replenishCache() finds
      // an empty cache slot, the loop will continue. The cycle will stop
      // when all cache slots are full.
      this.replenishCache();
    });
  } // init()
  
  // /**
  //  * Get an array of current localStorage keys.
  //  */
  // private getCacheKeys() : string[] {
  //   let keys: string[] = [];
  //   for (let i = 0; i < localStorage.length; i++) {
  //     keys.push(localStorage.key(i));
  //   }
  //   return keys;
  // } // getCacheKeys()

  /**
   * Within each difficulty move caches forward in the queue so that the queue
   * is FIFO (first in, first out). In other words created and cached sudokus
   * should be "consumed" in order.
   */
  private advanceCaches() {
    for (let diff of DIFFICULTIES) {

      // if 1 is empty, move 2 -> 1
      if (this.isEmpty(KEYS[diff][0])) {
        this.moveItem(KEYS[diff][1], KEYS[diff][0]);
      }

      // if 2 is empty, move 3 -> 2
      if (this.isEmpty(KEYS[diff][1])) {
        this.moveItem(KEYS[diff][2], KEYS[diff][1]);
      }

      // if 1 is empty, move 2 -> 1
      if (this.isEmpty(KEYS[diff][0])) {
        this.moveItem(KEYS[diff][1], KEYS[diff][0]);
      }
    } // for
  } //advanCeaches()

  /**
   * Remove the cached item with given key;
   */
  private removeCacheItem(key: string) {
    localStorage.removeItem(key);
  } // removeCacheItem

  /**
   * Send message to subscribers via observable subject
   * 
   * @param message 
   */
  private sendMessage(message: string): void {
    this.messageService.sendMessage(message);
  }

  /**
   * Retrieve sudoku specified by key from the cache. The item is removed
   * from the cache.
   */
  private retrieveAndRemoveCacheItem(key: string) : string {
    let item: string = localStorage.getItem(key);
    this.removeCacheItem(key);
    return item;
  } // retrieveAndRemoveCacheItem()

  /**
   * Find the first available cache slot for a given difficulty. If none,
   * reutrn null.
   * 
   * @param difficulty 
   */
  private findFirstEmptyKey(difficulty: Difficulty) : string {
    for (let i of [0, 1, 2]) {
      if (this.isEmpty(KEYS[difficulty][i])) {
        return KEYS[difficulty][i];
      }
    }
    return null;
  }

  /**
   * Move an item from one key to another.
   * 
   * @param oldKey 
   * @param newKey 
   */ 
  private moveItem(oldKey: string, newKey: string) : void {
    // case 1:  localStorage.getItem(oldKey) != null -- oldKey has an item
    //          localStorage.getItem(newKey) == null
    //        normal case -- result: item moved
    //    setItem(newKey, localStorage.getItem(oldKey));
    //    removeItem(oldKey);
    // case 2:  localStorage.getItem(oldKey) != null -- oldKey has an item
    //          localStorage.getItem(newKey) != null
    //        unexpected case -- result: item moved, old value at new key is wiped out!
    //    setItem(newKey, localStorage.getItem(oldKey));
    //    removeItem(oldKey);
    // case 3:  localStorage.getItem(oldKey) == null
    //    no action -- nothing to move
    //  
    if (this.hasItem(oldKey)) {
      localStorage.setItem(newKey, localStorage.getItem(oldKey));
      localStorage.removeItem(oldKey);
    }  
  } // moveItem()

  /**
   * Is an item stored under the given key.
   * 
   * @param key 
   */
  private hasItem(key: string) : boolean {
    return localStorage.getItem(key) != null;
  } // hasItem()

  /**
   * Is the location at the given key empty.
   * 
   * @param key 
   */
  private isEmpty(key: string) : boolean {
    return localStorage.getItem(key) == null;
  } // isEmpty()

  /**
   * Convert the first character of the key to an int which correlates to the
   * difficulty.
   * 
   * @param key 
   */
  private getDifficulty(key: string) : number {
    return parseInt(key.charAt(0));
  } // getDifficulty()

} // class CreateService

