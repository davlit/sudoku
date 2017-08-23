import { Injectable } from '@angular/core';

import { Difficulty }       from './difficulty';
import { CreationService }  from '../../web-workers/creation-worker/creation.service';

import * as CreationWorker from 
  'worker-loader!../../web-workers/creation-worker/creation.worker.bundle.js';

import { MessageService } from '../common/message.service';

/*  localStorage API - keys and stored data are all strings
localStorage.setItem(key: string, item: string) : void
localStorage.getItem(key: string) : string
localStorage.length : number
localStorage.key(i: number) : string
localStorage.removeItem(key: string) : void
localStorage.clear() : void
 */

const USE_WEBWORKER = true;
const DIFFICULTIES = [Difficulty.EASY, 
                      Difficulty.MEDIUM, 
                      Difficulty.HARD, 
                      Difficulty.HARDEST];
const KEYS: string[][] = [['easy-1',    'easy-2',    'easy-3'   ],
                          ['medium-1',  'medium-2',  'medium-3' ],
                          ['hard-1',    'hard-2',    'hard-3'   ],
                          ['hardest-1', 'hardest-2', 'hardest-3']];

/**
 * Manages the cache of prepared sudokus of varying difficulty.
 */
@Injectable()
export class CacheService {

  private creationService: CreationService = undefined;
  private creationWorker: Worker = undefined;
  private webworkerResult: string = undefined;  
  private webworkerStartTime: number = undefined;

  private webworkerWorking: boolean = false;

  private localStorageKey: string = undefined;

  constructor(
      private messageService: MessageService
  ) {
      this.creationService = new CreationService();
      this.creationWorker = new CreationWorker();
      this.init();
  }

  sendMessage(message: string): void {
    // send message to subscribers via observable subject
    this.messageService.sendMessage(message);
  }

  clearMessage(): void {
    // clear message
    this.messageService.clearMessage();
  }
  // -------------------------------------------------------------------------
  //  Public methods
  // -------------------------------------------------------------------------

  /**
   * Receive web worker output
   */
  init() {
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
    sudoku = this.creationService.createSudoku(DIFFICULTIES[difficulty]);
    return sudoku;
  } // getSudoku()

  /**
   * Replenish the cache by creating and cacheing sudokus.
   */
  public replenishCache() : void {

    this.sendMessage('Replenishing cache');

    if (!this.isSudokuAvailable(Difficulty.EASY)) {
      this.createAndCache(Difficulty.EASY, KEYS[Difficulty.EASY][0]);
      return;
    }

    if (!this.isSudokuAvailable(Difficulty.MEDIUM)) {
      this.createAndCache(Difficulty.MEDIUM, KEYS[Difficulty.MEDIUM][0]);
      return;
    }

    if (!this.isSudokuAvailable(Difficulty.HARDEST)) {
      this.createAndCache(Difficulty.HARDEST, KEYS[Difficulty.HARDEST][0]);
      return;
    }

    if (!this.isSudokuAvailable(Difficulty.HARD)) {
      this.createAndCache(Difficulty.HARD, KEYS[Difficulty.HARD][0]);
      return;
    }

    for (let diff = 0; diff < KEYS.length; diff++) {
      for (let key of KEYS[diff]) {
        if (!localStorage.getItem(key)) {

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
          this.createAndCache(diff, key);

        } else {

        }
      }
    }

    this.sendMessage('Replenished cache');

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
   * Create and cache a sudoku.
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
      let sudoku: string = this.creationService.createSudoku(DIFFICULTIES[difficulty]);
      localStorage.setItem(key, sudoku);
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
  private retrieveAndRemoveCacheItem(key: string) {
    let item: string = localStorage.getItem(key);
    this.removeCacheItem(key);
    return item;
  } // retrieveAndRemoveCacheItem()

}

