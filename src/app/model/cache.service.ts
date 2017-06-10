import { Injectable, Injector } from '@angular/core';

import { Difficulty }       from './difficulty';
import { Puzzle }           from './puzzle';
import { CreationService }  from '../../web-workers/creation-worker/creation.service';
import { Result }           from './result';

import * as CreationWorker from 
  'worker-loader!../../web-workers/creation-worker/creation.worker.bundle.js';

/*
localStorage.setItem(key: string, item: string) : void
localStorage.getItem(key: string) : string
localStorage.length : number
localStorage.key(i: number) : string
localStorage.removeItem(key: string) : void
localStorage.clear() : void
 */

const KEYS: string[][] = [['easy-1',    'easy-2',    'easy-3'   ],
                          ['medium-1',  'medium-2',  'medium-3' ],
                          ['hard-1',    'hard-2',    'hard-3'   ],
                          ['hardest-1', 'hardest-2', 'hardest-3']];
const DIFFICULTIES = [Difficulty.EASY, 
                      Difficulty.MEDIUM, 
                      Difficulty.HARD, 
                      Difficulty.HARDEST];
const USE_WEBWORKER = true;

/**
 * Manages the cache of prepared sudokus of varying difficulty.
 */
@Injectable()
export class CacheService {

  private creationService: CreationService;

  // private creationWorker: Worker = new CreationWorker();
  private creationWorker: Worker = undefined;
  private webworkerResult: string = undefined;  
  private webworkerStartTime: number = undefined;
  private webworkerDuration: number = 0;

  private webworkerWorking: boolean = false;

  private localStorageKey: string = undefined;

  constructor() {
      this.creationService = new CreationService();
      this.creationWorker = new CreationWorker();
      this.init();
  }

  init() {
    this.creationWorker.onmessage = ((event: MessageEvent) => {
console.info('cacheService.init() creationWorker.onmessage');
      this.webworkerWorking = false;

      // that.zone.run(() => {   // for change detection
        this.webworkerDuration = ((new Date()).getTime() - this.webworkerStartTime) / 1000;
        // that.webworkerResult = event.data.result;
// console.info('cp50 - webworker reault: ' + event.data);
        localStorage.setItem(this.localStorageKey, event.data);
// console.info('cp51 - cache keys after web worker: ' 
//     + JSON.stringify(this.getCacheKeys()));
console.info('Cache keys after webworker replenishment: ' + JSON.stringify(this.getCacheKeys()));

      // });
    });
  }
  
  /**
   * Receive web worker output
   */
//   ngOnInit() {
// console.info('cacheService ngOnInit()');
//     const that = this;  // see https://stackoverflow.com/questions/24634484/javascript-that-vs-this
//     this.creationWorker.onmessage = ((event: MessageEvent) => {
// console.info('cacheService ngOnInit onmessage');
//       this.webworkerWorking = false;

//       // that.zone.run(() => {   // for change detection
//         that.webworkerDuration = ((new Date()).getTime() - that.webworkerStartTime) / 1000;
//         // that.webworkerResult = event.data.result;
//         localStorage.setItem(this.localStorageKey, event.data.result);

//       // });
//     });
//   } // ngOnInit();

  /**
   * Empty the cache.
   */
  public emptyCache() : void {
    localStorage.clear()
  } // clearCache()

  /**
   * Get cache size.
   */
  public getCacheSize() : number {
    return localStorage.length;
  } // getCacheSize()

  /**
   * Get cache size by difficulty.
   */
  public getCacheSizeByDifficulty(difficulty: Difficulty) : number {
    let count = 0;
    for (let key of KEYS[difficulty]) {
      if (localStorage.getItem(key)) {
        count++;
      }
    }
    return count;
  } // getCacheSizeByDifficulty()

  /**
   * 
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
    for (let key of KEYS[difficulty]) {
      if (localStorage.getItem(key)) {
        return true;
      }
    }
    return false;
  } // isSudokuAvailable

  /**
   * Get a sudoku from the cache. If none available, create one.
   */  
  public getSudoku(difficulty: Difficulty) : string {
    let sudoku: string = undefined;
    for (let key of KEYS[difficulty]) {
      sudoku = this.retrieveAndRemoveCacheItem(key);
      if (sudoku) {

        // TODO if WW not running, trigger WEB WORKER to replace

        return sudoku;
      }
    }
    sudoku = this.creationService.createSudoku(DIFFICULTIES[difficulty]);
    return sudoku;

//     let keys = this.availableCacheKeys(difficulty);
// console.info(Puzzle.getDifficultyLabel(difficulty) + ' keys: ' 
//         + JSON.stringify(keys));
//     let sudoku: string = undefined;
//     if (keys.length > 0) {
//       sudoku = this.retrieveAndRemoveCacheItem(keys[0]);
//     } else {

//           // BROWSER Option
//       sudoku = this.creationService.createSudoku(difficulty);

//           // WEB WORKER Option
//       // this.startWebworkerCreation(difficulty);
//     }

//     // TODO replace any sudoku pulled from cache
// console.info('getSudoku() sudoku: ' + sudoku);

//     return Puzzle.deserialize(sudoku);
  } // getSudoku()

  /**
   * Replenish the cache by creating and cacheing sudokus.
   */
  public replenishCache() : void {
    for (let diff = 0; diff < KEYS.length; diff++) {
      for (let key of KEYS[diff]) {
        if (!localStorage.getItem(key)) {

          // key is not in localStorage; create a sudoku

          if (USE_WEBWORKER) {

            // WEB WORKER Option
            if (!this.webworkerWorking) {
              this.localStorageKey = key;
              this.webworkerStartTime = Date.now();
              this.webworkerWorking = true;
  console.info('Calling startWebworkerCreation() key: ' + this.localStorageKey);
              this.creationWorker.postMessage(diff);
            }

          } else {
            // BROWSER Option
            let sudoku: string = this.creationService.createSudoku(DIFFICULTIES[diff]);
            localStorage.setItem(key, sudoku);
          }

        }
      }
    }
  } // replenishCache()

  /**
   * Remove the cached item with given key;
   */
  public removeCacheItem(key: string) {
    localStorage.removeItem(key);
  } // removeCacheItem

  // -------------------------------------------------------------------------
  //  Private methods
  // -------------------------------------------------------------------------

    /**
   * Post a message to a web worker. The message contains the desired difficulty.
   * This message triggers the web worker which works in background. The 
   * result of the background task is posted by the web worker and this
   * service is alerted and reacts in the ngOnInit() function above.
   * 
   * Called by: TODO ... cacheService
   */
//   private startWebworkerCreation(difficulty: Difficulty) {
// console.info('In startWebworkerCreation difficulty: ' + difficulty);
//     this.webworkerStartTime = Date.now();
//     this.webworkerWorking = true;
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
  private retrieveAndRemoveCacheItem(key: string) {
    let sudoku: string = localStorage.getItem(key);
    this.removeCacheItem(key);
    return sudoku;
  } // retrieveAndRemoveCacheItem()

  /**
   * Get the available keys for caches of the specified difficulty.
   */
  private availableCacheKeys(difficulty: Difficulty) : string[] {
    let keys = [];
    let key = '';
    let ch = '';
    for (let i = 0; i < localStorage.length; i++) {
      key = localStorage.key(i);
      ch = key.charAt(0);
      switch (difficulty) {
        case Difficulty.EASY:
          if (ch === 'e') {
            keys.push(key)
          }
          break;
        case Difficulty.MEDIUM:
          if (ch === 'm') {
            keys.push(key)
          }
          break;
        case Difficulty.HARD:
          if (ch === 'h') {
            keys.push(key)
          }
          break;
        case Difficulty.HARDEST:
          if (ch === 'd') {
            keys.push(key)
          }
          break;
        } // switch
    } // for
    return keys;
  } // availableCacheKeys()

}

