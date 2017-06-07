import { Injectable, Injector } from '@angular/core';

import { Difficulty }       from './difficulty';
import { Puzzle }           from './puzzle';
import { CreationService }  from '../../web-workers/creation-worker/creation.service';
import { Result }           from './result';

// for web worker
import { ActionLogService }           from '../action/action-log.service';
import { HintLogService }           from '../hint/hint-log.service';
import { HintService }           from '../hint/hint.service';
// import { SudokuModel }           from '../model/sudoku.model';
import { SudokuService }           from '../model/sudoku.service';

// import { WebWorkerClient }  from './web-worker-client';

// webWorker element
import { WebWorkerService } from 'angular2-web-worker';

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

  // webWorker element
  // private promises: Promise<any>[] = [];
  // private webWorkerResults: any[] = [];
  private promise: Promise<any> = undefined;
  private webWorkerResult: Result = undefined;
  private _webWorkerService = new WebWorkerService();

  // private wwActionLog = new ActionLogService();
  // private wwSudokuService = new SudokuService(this.wwActionLog);
  // private wwHintService = new HintService(this.wwSudokuService, 
  //     new HintLogService());
  // private wwCreationService = new CreationService(this.wwActionLog, 
  //     this.wwSudokuService, this.wwHintService)
  // private wwCreationService: CreationService;

  private creationService: CreationService;

  constructor (
    // private creationService: CreationService
    // private webWorkerClient: WebWorkerClient

    // webWorker element
    // private _webWorkerService: WebWorkerService) {
    ) {
      // let wwActionLog = new ActionLogService();
      // let wwSudokuService = new SudokuService(wwActionLog);
      // let wwHintService = new HintService(
      //     wwSudokuService, 
      //     new HintLogService());
      // this.wwCreationService = new CreationService(
      //     wwActionLog, 
      //     wwSudokuService, 
      //     wwHintService)
      this.creationService = new CreationService();
  }
  
  ngOnInit() {

  }

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
      sudoku = this.creationService.createSudokuZ(difficulty);
    }

    // replace any sudoku pulled from cache
    this.startWebWorkerCreation(difficulty, keys[0]);      

    return Puzzle.deserialize(sudoku);
  } // getSudoku()

  /**
   * Get a list of cache keys for cached sudokus.
   */
  public allCacheKeys() : string {
    let list = '';
    for (let i = 0; i < localStorage.length; i++) {
      list += localStorage.key(i) + ' ';
    }
    return list;
  } // allCacheKeys()

  /**
   * Replenish the cache by creating and cacheing sudokus.
   */
  public replenishCache() : void {
console.info('Replenishment - begin');    
    let sudoku: Puzzle;
    for (let i = 0; i < KEYS.length; i++) {
    // for (let i = 0; i < 1; i++) {        // testing
      for (let j = 0; j < KEYS[i]. length; j++) {
        if (!localStorage.getItem(KEYS[i][j])) {
          // key is not in localStorage
          // create a sudoku
          let sudoku: string = this.creationService.createSudokuZ(DIFFICULTIES[i]);
console.info('Sudoku string: ' + sudoku);

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
console.info('Replenishment - end');    
  } // replenishCache()

  // replenishCache1() : String {
  //   return 'Cache replenished';
  // }

  // webWorker element
  // startWebWorkerCacheReplenishment() {
  //   this.stopWebWorkerCacheReplenishment();
  //   this.webWorkerReplenishCache();
  // }
  
  // webWorker element
  // private stopWebWorkerCacheReplenishment() {
  //   // this.promises.forEach(promise => {
  //   //     this._webWorkerService.terminate(promise);
  //   // });
  //   // this.promises.length = 0;
  //   // this.webWorkerResults.length = 0;
  //   this._webWorkerService.terminate(this.promise);
  //   this.promise = undefined;
  //   this.webWorkerResult = undefined;
  // }

  // webWorker element
  /**
   * 
   */
  private webWorkerReplenishCache() {

    // (1) works
    this.replenishCache();

    // (1a)


    // (2) new
    // const promise = this._webWorkerService.run(this.replenishCache(), undefined);
    // const promise = this._webWorkerService.run(this.replenishCache());
    // const result = new Result(undefined, undefined, true);
    // this.webWorkerResults.push(result);
    // this.promises.push(promise);
    
    // // promise.then(function (response: any) {
    // promise.then((response: any) => {
    //   result.result = response;
    //   result.loading = false;
    // });

    // (3) new new
    // this.promise = this._webWorkerService.run(this.replenishCache);
    // this.webWorkerResult = new Result(undefined, undefined, true);
    // this.promise.then((response: any) => {
    //   this.webWorkerResult.result = response;
    //   this.webWorkerResult.loading = false;
    // });
    // this.promise.catch((err) => {
    //     console.error('I get called:', err.message); // I get called: 'Something awful happened'
    // });
  }
    
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
   * 
   * @param difficulty 
   * @param localStorageKey 
   */
  private startWebWorkerCreation(difficulty, localStorageKey) {
console.info('wwStarting startWebWorkerCreation()');
console.info('wwCache: ' + this.allCacheKeys());
    this.stopWebWorkerCreation();
    this.webWorkerCreateY(difficulty, localStorageKey);
  }

  /**
   * 
   */
  private stopWebWorkerCreation() {
console.info('wwStarting stopWebWorkerCreation()');
    if (this.promise) {
      this._webWorkerService.terminate(this.promise);
      this.promise = undefined;
    }
    this.webWorkerResult = undefined;
console.info('wwEnding stopWebWorkerCreation()');
  }

  /**
   * 
   * @param difficulty 
   * @param localStorageKey 
   */
  private webWorkerCreateY(difficulty: Difficulty, localStorageKey: string) {
console.info('wwStarting webWorkerCreate()');
    let actionLog = new ActionLogService();
    let sudokuService = new SudokuService(actionLog);
    let creationService = new CreationService();
    const localPromise = this._webWorkerService.run(this.createSudokuX, 
        [difficulty, 
        // actionLog, 
        // sudokuService, 
        // new HintService(sudokuService),
        creationService]);
    // const localPromise = this._webWorkerService.run(this.fib, 44);
    const result = new Result(difficulty, undefined, true);
    this.webWorkerResult = result;
    this.promise = localPromise;

    localPromise.then((response: any) => {
console.info('wwCache: response: ' + response);
      let creationResponse = response;
console.info('wwCache: creationResponse: ' + creationResponse);
      // this.webWorkerResult = new Result(difficulty, '', false);
      // this.webWorkerResult.sudoku = response;
      // response.sudoku = response;
      // response.result.running = false;
      // localStorage.setItem(localStorageKey, response.result.sudoku);
      localStorage.setItem(localStorageKey, creationResponse);
console.info('wwCache: ' + this.allCacheKeys());
    });
    localPromise.catch((err) => {
      console.error('wwCache: ', err.message);
    });
  }

  /**
   * 
   * @param difficulty 
   */
  private createSudokuX(difficulty: Difficulty, 
      // wwActionLog: ActionLogService,
      // wwSudokuService: SudokuService,
      // wwHintService: HintService,
      wwCreationService: CreationService) : string {
console.info('wwStarting cacheSvc.createSudoku()');
console.info('cacheSvc.createSudoku() cp1');
    // let sudokuModel = new SudokuModel();
    // let sudokuService = new SudokuService(sudokuModel, new ActionLogService());
    // let actionLog = new ActionLogService();
    // let sudokuService = new SudokuService(this.actionLog);
    // let creationService = new CreationService(
    //   new ActionLogService(), 
    //   sudokuService, 
    //   new HintService(sudokuService, new HintLogService()));
      // let wwActionLog = new ActionLogService();
console.info('cacheSvc.createSudoku() cp2');
      // let wwSudokuService = new SudokuService(wwActionLog);
console.info('cacheSvc.createSudoku() cp3');
      // let wwHintService = new HintService(
      //     wwSudokuService, 
      //     new HintLogService());
      // let wwHintService = new HintService(wwSudokuService);
      // let wwCreationService = new CreationService(
          // wwActionLog, 
          // wwSudokuService, 
          // wwHintService
      // );
console.info('cacheSvc.createSudoku() cp4');

    let sudoku: string = wwCreationService.createSudokuZ(difficulty);
console.info('cacheSvc.createSudoku() cp5');
// let sudoku: string = '{"_initialValues":[4,9,0,0,0,0,0,6,7,0,2,0,3,0,7,0,0,0,0,0,7,0,8,0,0,0,0,0,0,0,0,0,2,0,4,0,7,8,4,0,0,0,2,1,6,0,5,0,7,0,0,0,0,0,0,0,0,0,9,0,6,0,0,0,0,0,4,0,8,0,3,0,9,3,0,0,0,0,0,5,4],"_completedPuzzle":[4,9,3,5,2,1,8,6,7,8,2,6,3,4,7,5,9,1,5,1,7,6,8,9,4,2,3,3,6,9,8,1,2,7,4,5,7,8,4,9,3,5,2,1,6,1,5,2,7,6,4,3,8,9,2,4,5,1,9,3,6,7,8,6,7,1,4,5,8,9,3,2,9,3,8,2,7,6,1,5,4],"_desiredDifficulty":0,"_actualDifficulty":0,"_generatePasses":1,"_stats":"{"nakedSingles":36,\"hiddenSinglesRow\":12,\"hiddenSinglesCol\":4,\"hiddenSinglesBox\":1,\"nakedPairsRow\":0,\"nakedPairsCol\":0,\"nakedPairsBox\":0,\"pointingRows\":0,\"pointingCols\":0,\"rowBoxReductions\":0,\"colBoxReductions\":0,\"nakedTriplesRow\":0,\"nakedTriplesCol\":0,\"nakedTriplesBox\":0,\"nakedQuadsRow\":0,\"nakedQuadsCol\":0,\"nakedQuadsBox\":0,\"hiddenPairsRow\":0,\"hiddenPairsCol\":0,\"hiddenPairsBox\":0,\"hiddenTriplesRow\":0,\"hiddenTriplesCol\":0,\"hiddenTriplesBox\":0,\"hiddenQuadsRow\":0,\"hiddenQuadsCol\":0,\"hiddenQuadsBox\":0,\"guesses\":0}"}';
  // let actionLogService = new ActionLogService(); 
console.info('wwEnding cacheSvc.createSudoku()');
    return sudoku;
  }

  /**
   * 
   * @param n 
   */
  private fib(n: number) {
console.log('fib() start ' + n);
    const fib = (n: number): number => {
      if (n < 2) return 1;
      return fib(n - 1) + fib(n - 2);
    };
    
    return fib(n);
    // return n + 1;
  }

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

