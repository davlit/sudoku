import { Injectable, Injector } from '@angular/core';

import { Difficulty }       from './difficulty';
import { Puzzle }           from './puzzle';
import { CreationService }  from '../../web-workers/creation-worker/creation.service';
import { Result }           from './result';

// import * as CreationWorker from 
  // 'worker-loader!../../web-workers/creation-worker/creation.worker.bundle.js';

const KEYS: string[][] = [['e0', 'e1', 'e2'],
                          ['m0', 'm1', 'm2'],
                          ['h0', 'h1', 'h2'],
                          ['d0', 'd1', 'd2']];
const DIFFICULTIES = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD, Difficulty.HARDEST];

/**
 * Manages the cache of prepared sudokus of varying difficulty.
 */
@Injectable()
export class CacheService {

  private creationService: CreationService;

  // private creationWorker: Worker = new CreationWorker();
  private webworkerResult: string = undefined;  
  private webworkerStartTime: any = undefined;
  private webworkerDuration = 0;

  constructor() {
      this.creationService = new CreationService();
  }
  
  /**
   * Receive web worker output
   */
  // ngOnInit() {
  //   const that = this;  // see https://stackoverflow.com/questions/24634484/javascript-that-vs-this
  //   this.creationWorker.onmessage = ((event: MessageEvent) => {
  //     // that.zone.run(() => {   // for change detection
  //       that.webworkerDuration = ((new Date()).getTime() - that.webworkerStartTime) / 1000;
  //       that.webworkerResult = event.data.result;
  //     // });
  //   });
  // } // ngOnInit();

    /**
   * Post a message to a web worker. The message contains the desired difficulty.
   * This message triggers the web worker which works in background. The 
   * result of the background task is posted by the web worker and this
   * service is alerted and reacts in the ngOnInit() function above.
   * 
   * Called by: TODO ... cacheService
   */
  // private startWebworkerCreation() {
  //   this.webworkerStartTime = new Date();
  //   this.creationWorker.postMessage(this.difficulty);
  // } // startWebworkerCreation()

  /**
   * Get a sudoku from the cache. If none available, create one.
   */  
  public getSudoku(difficulty: Difficulty) : Puzzle {
    let keys = this.cacheKeys(difficulty);
console.info(Puzzle.getDifficultyLabel(difficulty) + ' keys: ' 
        + JSON.stringify(keys));
    let sudoku: string = undefined;
    if (keys.length > 0) {
      sudoku = this.retrieve(keys[0]);
    } else {
      sudoku = this.creationService.createSudoku(difficulty);
    }

    // TODO replace any sudoku pulled from cache

    return Puzzle.deserialize(sudoku);
  } // getSudoku()

  /**
   * Replenish the cache by creating and cacheing sudokus.
   */
  public replenishCache() : void {
console.info('Cache before replenishment: ' + this.allCacheKeys());
// console.info('Replenishment - begin');    
    let sudoku: Puzzle;
    for (let i = 0; i < KEYS.length; i++) {
    // for (let i = 0; i < 1; i++) {        // testing
      for (let j = 0; j < KEYS[i]. length; j++) {
        if (!localStorage.getItem(KEYS[i][j])) {

          // key is not in localStorage
          // create a sudoku
          let sudoku: string = this.creationService.createSudoku(DIFFICULTIES[i]);
console.info('Sudoku string: ' + sudoku);
          localStorage.setItem(KEYS[i][j], sudoku);
        }
      }
    }
// console.info('Replenishment - end');    
console.info('Cache after replenishment: ' + this.allCacheKeys());
  } // replenishCache()

  // -------------------------------------------------------------------------
  //  Private methods
  // -------------------------------------------------------------------------

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
   * Display cached sudokus on the console.
   */
  private keysToConsole() : void {
    let sudoku: Puzzle;
    for (let i = 0; i < KEYS.length; i++) {
      for (let j = 0; j < KEYS[i]. length; j++) {
        console.info(KEYS[i][j]);
        console.info(JSON.stringify(localStorage.getItem(KEYS[i][j])));
      }
    }
  } // keysToConsole()

  /**
   * Retrieve sudoku specified by key from the cache. The also removes the
   * sudoku from the cache.
   */
  private retrieve(key: string) {
    let sudoku: string = localStorage.getItem(key);
    if (sudoku) {
      localStorage.removeItem(key);
    }
    return sudoku;
  } // retrieve()

  /**
   * Get the available keys for caches of the specified difficulty.
   */
  private cacheKeys(difficulty: Difficulty) : string[] {
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
  } // cacheKeys()

  /**
   * Empty the cache.
   */
  private clearCache() : void {
    localStorage.clear()
  } // clearCache()

}

