import { Common } from '../../app/common/common';
import { Difficulty } from '../../app/model/difficulty';
import { CreationService } from './creation.service';

// import { KEYS } from '../../app/model/cache';
import { KEYS } from '../../app/common/common';

const DIFFICULTIES = [Difficulty.EASY, 
                      Difficulty.MEDIUM, 
                      Difficulty.HARD, 
                      Difficulty.HARDEST];
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

/**
 * The cache contains pre-created sudokus of varying difficulty. When a user
 * requests a new sudokuof a desired level of difficulty, one from the cache
 * is instantly provided to the user. The cache is replenished to insure there
 * is always a sudoku of any difficuly immediately available. The cache is
 * replenished by creating and caching sudoku to keep the cache full.
 * 
 * The cached sudokus are stored in HTML5 localstorage (aka browser storage)
 * which is persistent between sessions.
 * 
 * 
 */
export class CacheManager {

  private creationService: CreationService;

  constructor() {
    this.creationService = new CreationService();
  }
  
  // -------------------------------------------------------------------------
  //  Public methods
  // -------------------------------------------------------------------------

  /**
   * 1. Any empty cache location must be filled by creating a new sudoku of
   * the desired diffuculty.
   * 
   * - move up -- FIFO
   * - fill holes
   * - order is determined by specified priority
   */
  public replenishCache() {

console.info('\nreplenishCache() 1');    
    // fill in "holes" to maintain FIFO queue for each difficulty
    this.advanceCaches();

    // priority seach to find first empty key
    // if none found, fall through - nothing to replenish
    for (let key of CREATE_PRIORITIES) {
      if (this.isEmpty(key)) {
        this.creationService.createSudoku(this.getDifficulty(key));
      } // if
    } // for
  } // replenishCache()

  // -------------------------------------------------------------------------
  //  Private methods
  // -------------------------------------------------------------------------

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

}
