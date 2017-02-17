import { Injectable, Injector } from '@angular/core';

import { Difficulty }       from './difficulty';
import { Puzzle }           from './puzzle';
import { CreationService }  from '../creation/creation.service';
// import { WebWorkerClient }  from './web-worker-client';
// import { WebWorkerService } from 'angular2-web-worker';

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

  constructor (
    private creationService: CreationService,
    // private webWorkerClient: WebWorkerClient
    // private _webWorkerService: WebWorkerService
  ) {}

  /**
   * Get a sudoku from the cache. If none available, create one.
   */  
  getSudoku(difficulty: Difficulty) : Puzzle {
    let keys = this.cacheKeys(difficulty);
console.log(Puzzle.getDifficultyLabel(difficulty) + ' keys: ' 
        + JSON.stringify(keys));
    let sudoku: string = undefined;
    if (keys.length > 0) {
      sudoku = this.retrieve(keys[0]);
    } else {
      sudoku = this.creationService.createSudoku(difficulty);
    }
    return Puzzle.deserialize(sudoku);
  } // getSudoku()

  /**
   * Get a list of cache keys for cached sudokus.
   */
  allCacheKeys() : string {
    let list = '';
    for (let i = 0; i < localStorage.length; i++) {
      list += localStorage.key(i) + ' ';
    }
    return list;
  } // allCacheKeys()

  /**
   * Replenish the cache by creating and cacheing sudokus.
   */
  replenishCache() : void {
console.log('Replenishment - begin');    
    let sudoku: Puzzle;
    for (let i = 0; i < KEYS.length; i++) {
    // for (let i = 0; i < 1; i++) {        // testing
      for (let j = 0; j < KEYS[i]. length; j++) {
        if (!localStorage.getItem(KEYS[i][j])) {
          // key is not in localStorage
          // create a sudoku
          let sudoku: string = this.creationService.createSudoku(DIFFICULTIES[i]);

          // let sudoku: string = undefined;
          // let promise: Promise<string> = this._webWorkerService.run(
          //     this.creationService.createSudoku, DIFFICULTIES[i]);
          // promise.then((response: any) => {
          //   sudoku = response;
          //   localStorage.setItem(KEYS[i][j], sudoku);
          // });



          localStorage.setItem(KEYS[i][j], sudoku);
        }
      }
    }
console.log('Replenishment - end');    
  } // replenishCache()

  /**
   * Display cached sudokus on the console.
   */
  keysToConsole() : void {
    let sudoku: Puzzle;
    for (let i = 0; i < KEYS.length; i++) {
      for (let j = 0; j < KEYS[i]. length; j++) {
        console.log(KEYS[i][j]);
        console.log(JSON.stringify(localStorage.getItem(KEYS[i][j])));
      }
    }
  } // keysToConsole()

  // -------------------------------------------------------------------------
  //  Private methods
  // -------------------------------------------------------------------------

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

