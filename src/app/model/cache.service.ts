import { Injectable } from '@angular/core';

import { Difficulty }       from './difficulty';
import { CreationService }  from '../../web-workers/creation-worker/creation.service';

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
  -- if yes, returns value associated with key
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
// const KEYS: string[][] = [['easy-1',    'easy-2',    'easy-3'   ],
//                           ['medium-1',  'medium-2',  'medium-3' ],
//                           ['hard-1',    'hard-2',    'hard-3'   ],
//                           ['hardest-1', 'hardest-2', 'hardest-3']];
// xy - x(0..3) 0-easy, 1-medium, 2-hard, 3-hardest
//      y(1..3) 3 cached sudokus of each difficulty
// const KEYS: string[][] = [['01', '02', '03'],
//                           ['11', '12', '13'],
//                           ['21', '22', '23'],
//                           ['31', '32', '33']];
const KEYS: string[][] = [['00', '01', '02'],   // easy    1st, 2d, 3d
                          ['10', '11', '12'],   // medium  1st, 2d, 3d
                          ['20', '21', '22'],   // hard    1st, 2d, 3d
                          ['30', '31', '32']];  // hardest 1st, 2d, 3d

/**
 * This establishes a priority for creating sudokus. The "hard" cand take
 * considerably more time to create than the other difficulties. Therefore we
 * quickly create 1 each of the 3 faster ones before creating the 1st "hard."
 * After we have 1 of all the difficulties, we quickly finish out the set of
 * the faster ones, then finish with additional "hard" ones.
 */                          
const CREATE_PRIORITIES = [KEYS[0][0], KEYS[1][0], KEYS[3][0], KEYS[2][0], 
                           KEYS[0][1], KEYS[1][1], KEYS[3][1], 
                           KEYS[0][2], KEYS[1][2], KEYS[3][2],
                           KEYS[2][1], KEYS[2][2]];

/**
 * Manages the cache of prepared sudokus of varying difficulty.
 */
@Injectable()
export class CacheService {

  // private creationService: CreationService = undefined;
  private creationWorker: Worker = undefined;
  private webworkerResult: string = undefined;  
  private webworkerStartTime: number = undefined;

  private webworkerWorking: boolean = false;

  private localStorageKey: string = undefined;

  constructor(
      private messageService: MessageService
  ) {
      // this.creationService = new CreationService();
      this.creationWorker = new CreationWorker();
      this.init();
  }

  // -------------------------------------------------------------------------
  //  Public methods
  // -------------------------------------------------------------------------

  /**
   * Returns true if a sudoku of given difficulty is cached.
   */
  public isSudokuAvailable(difficulty: Difficulty) : boolean {
    for (let key of KEYS[difficulty]) {
      if (localStorage.getItem(key)) {
        return true;
      }
    }
    return false;
  } // isSudokuAvailable()

  /**
   * Get a sudoku from the cache. If none available, create one.
   */  
  public getSudoku(difficulty: Difficulty) : string {
    let sudoku: string = undefined;
    for (let key of KEYS[difficulty]) {
      sudoku = this.retrieveAndRemoveCacheItem(key);
      if (sudoku) {
        if (USE_WEBWORKER) {

          this.sendMessage('Cache withdrawl');
          this.sendMessage('Cache changed');

          // as soon as a cached sudoku is used, replace it
          this.replenishCache();
        }
        return sudoku;
      }
    }
    // sudoku = this.creationService.createSudoku(DIFFICULTIES[difficulty]);
    return sudoku;
  } // getSudoku()

  /**
   * Get a sudoku from the cache.
   */  
  public getSudoku1(difficulty: Difficulty) : string {
    let sudoku: string = undefined;
    // sudoku = localStorage.getItem(KEYS[difficulty][0]);
    sudoku = this.retrieveAndRemoveCacheItem(KEYS[difficulty][0]);
    if (sudoku) {

      // move backup versions forward

      // replenish cache


      return sudoku;
    }

    






    for (let key of KEYS[difficulty]) {
      sudoku = this.retrieveAndRemoveCacheItem(key);
      if (sudoku) {
        if (USE_WEBWORKER) {

          this.sendMessage('Cache withdrawl');
          this.sendMessage('Cache changed');

          // as soon as a cached sudoku is used, replace it
          this.replenishCache();
        }
        return sudoku;
      }
    }
    // sudoku = this.creationService.createSudoku(DIFFICULTIES[difficulty]);
    return sudoku;
  } // getSudoku()

  /**
   * Replenish the cache by creating and cacheing sudokus.
   */
  public replenishCache() : void {

    // this.sendMessage('Replenishing cache');

    let key: string = this.getFirstEmptyKey();
    if (key) {
      this.createAndCache(this.getDifficulty(key), key)
    }

    // this.sendMessage('Replenished cache');

    // if (!this.isSudokuAvailable(Difficulty.EASY)) {
    //   this.createAndCache(Difficulty.EASY, KEYS[Difficulty.EASY][0]);
    //   return;
    // }

    // if (!this.isSudokuAvailable(Difficulty.MEDIUM)) {
    //   this.createAndCache(Difficulty.MEDIUM, KEYS[Difficulty.MEDIUM][0]);
    //   return;
    // }

    // if (!this.isSudokuAvailable(Difficulty.HARDEST)) {
    //   this.createAndCache(Difficulty.HARDEST, KEYS[Difficulty.HARDEST][0]);
    //   return;
    // }

    // if (!this.isSudokuAvailable(Difficulty.HARD)) {
    //   this.createAndCache(Difficulty.HARD, KEYS[Difficulty.HARD][0]);
    //   return;
    // }

    // for (let diff = 0; diff < KEYS.length; diff++) {
    //   for (let key of KEYS[diff]) {
    //     if (!localStorage.getItem(key)) {

  //         // key is not in localStorage; create a sudoku
  //         if (USE_WEBWORKER) {

  //           // WEB WORKER Option
  //           if (!this.webworkerWorking) {
  //             this.startWebworkerCreation(diff, key);
  // //             this.localStorageKey = key;
  // //             this.webworkerStartTime = Date.now();
  // //             this.webworkerWorking = true;
  // // console.info('Calling startWebworkerCreation() key: ' + this.localStorageKey);
  // //             this.creationWorker.postMessage(diff);
  //           }

  //         } else {

  //           // BROWSER Option
  //           let sudoku: string = this.creationService.createSudoku(DIFFICULTIES[diff]);
  //           localStorage.setItem(key, sudoku);
  //         }
      //     this.createAndCache(diff, key);

      //   } else {

      //   }
      // }
    // }

    // this.sendMessage('Replenished cache');
  } // replenishCache()

  /**
   * Empty the cache. Used for testing.
   */
  public emptyCache() : void {
    localStorage.clear()
  } // emptyCache()

  // -------------------------------------------------------------------------
  //  Private methods
  // -------------------------------------------------------------------------

  /**
   * Receive web worker output
   */
  private init() {
    this.creationWorker.onmessage = ((event: MessageEvent) => {
// console.info('\ncacheService.init() creationWorker.onmessage');
      this.webworkerWorking = false;
      localStorage.setItem(this.localStorageKey, event.data);

console.info('\nCache keys after webworker replenishment: ' 
  + JSON.stringify(this.getCacheKeys()));

    this.sendMessage('Cache addition');
    this.sendMessage('Cache changed');

      // This is a loop. Since replenishCache() engages a web worker to
      // create a sudoku, and this method, creationWorker.onmessage(), is
      // is called unpon the web worker's completion, calling 
      // replenish.cache() here creates a loop. However, replenishCache()
      // stops when the cache is full. So whenever replenishCache() is the
      // loop will continue until the cache is full.
      this.replenishCache();
    });
  } // init()
  
  /**
   * Get an array of current localStorage keys.
   */
  private getCacheKeys() : string[] {
    let keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      keys.push(localStorage.key(i));
    }
    return keys;
  } // getCacheKeys()

  /**
   * Remove the cached item with given key;
   */
  private removeCacheItem(key: string) {
    localStorage.removeItem(key);
  } // removeCacheItem

  private sendMessage(message: string): void {
    // send message to subscribers via observable subject
    this.messageService.sendMessage(message);
  }

  private clearMessage(): void {
    // clear message
    this.messageService.clearMessage();
  }

  /**
   * Create and cache a sudoku.
   * 
   * @param diff desired difficulty
   * @param key storage key
   */
  private createAndCache(difficulty: Difficulty, key: string) {

    // key is not in localStorage; create a sudoku
    if (USE_WEBWORKER) {

      // WEB WORKER Option
      if (!this.webworkerWorking) {
        // this.startWebworkerCreation(diff, key);
        this.localStorageKey = key;
        this.webworkerStartTime = Date.now();
        this.webworkerWorking = true;
// console.info('\nCalling startWebworkerCreation() key: ' + this.localStorageKey);
        this.creationWorker.postMessage(difficulty);
      }

    } else {

      // BROWSER Option
      // let sudoku: string = this.creationService.createSudoku(DIFFICULTIES[difficulty]);
      // localStorage.setItem(key, sudoku);
    }
  } // createAndCache()

   /**
   * Post a message to a web worker. The message contains the desired difficulty.
   * This message triggers the web worker which works in background. The 
   * result of the background task is posted by the web worker and this
   * service is alerted and reacts in the ngOnInit() function above.
   * 
   * Called by: TODO ... cacheService
   */
//   private startWebworkerCreation(difficulty: Difficulty, key: string) {
//     this.localStorageKey = key;
//     this.webworkerStartTime = Date.now();
//     this.webworkerWorking = true;
// console.info('Calling startWebworkerCreation() key: ' + this.localStorageKey);
//     this.creationWorker.postMessage(difficulty);
//   } // startWebworkerCreation()

  /**
   * Get a list of cache keys for cached sudokus.
   */
  private allCacheKeys() : string {
    let list = '';
    for (let i = 0; i < localStorage.length; i++) {
      list += localStorage.key(i) + ' ';
    }
    return list;
  } // allCacheKeys()

  /**
   * Retrieve sudoku specified by key from the cache. The item remains 
   * in the cache.
   */
  private retrieveCacheItem(key: string) : string {
    return localStorage.getItem(key);
  } // retrieveCacheItem()

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
   * 
   */
  private getFirstEmptyKey() : string {
    for (let key of CREATE_PRIORITIES) {
      if (this.isEmpty(key)) {
        return key;
      }
    }
    return null;
  } // getFirstEmptyKey()

  /**
   * Convert the first character of the key to an int which correlates to the
   * difficulty.
   * 
   * @param key 
   */
  private getDifficulty(key: string) : number {
    return parseInt(key.charAt(0));
  }

}

