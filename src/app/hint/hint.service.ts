// import { Injectable } from '@angular/core';

import { SudokuService } from '../model/sudoku.service';
import { Group } from '../model/group';
import { Common } from '../common/common';
import { CellCandidate } from '../common/cell.candidate';
import { CombinationIterator } from '../common/combination.iterator';
import { NakedType }  from '../model/naked.type';
import { Difficulty }  from '../model/difficulty';
import { ActionType } from '../action/action';
import { Hint } from '../hint/hint';
import { ValueHint } from '../hint/hint';
import { CandidatesHint } from '../hint/hint';
import { HintType } from '../hint/hint.type';
import { HintLogService } from '../hint/hint-log.service';
import { HintCounts } from '../hint/hintCounts';
import { CANDIDATES } from '../common/common';
import { ROWS } from       '../common/common';
import { COLS } from       '../common/common';
import { BOXS } from       '../common/common';
import { CELLS } from      '../common/common';
import { ROW_CELLS } from  '../common/common';
import { COL_CELLS } from  '../common/common';
import { BOX_CELLS } from  '../common/common';

/**
 * 
 */

// @Injectable()
export class HintService {

  private activeHint: Hint;
  private hintLog: HintLogService;
  private sudokuService: SudokuService;

  constructor(
    // private sudokuService: SudokuService,
    // private hintLog: HintLogService
    sudokuService: SudokuService
    ) {
      this.hintLog = new HintLogService();
      this.sudokuService = sudokuService;
  }

  /**
   * 
   */
  public initializeHintLog() : void {
    this.hintLog.initialize();
  }

  /**
   * 
   */
  public addHintLogEntry(hint: Hint) : void {
    this.hintLog.addEntry(hint);
  }

  /**
   * 
   */
  public getHintCounts() : HintCounts {
    return this.hintLog.getHintCounts();
  }

  /**
   * 
   */
  public getActiveHint() {
    return this.activeHint;
  }

  /**
   * Check for any hints at this state of the sudoku solution progress. If
   * maxDifficulty is set to EASY only the easy solution techniques will be
   * sought for a hint. Similarly for MEDIUM and HARD.
   */
  public getHint(maxDifficulty : Difficulty) : Hint {
    this.activeHint = undefined;
    
    // first, easy techniques
    if (   this.checkNakedSingles()
        || this.checkHiddenSingles()) {
      return this.activeHint;
    }
    if (maxDifficulty === Difficulty.EASY) {
      return undefined;  // no hints using easy techniques
    }

    // next, medium techniques
    if (   this.checkNakedPairs()
        || this.checkPointingRowCol()
        || this.checkRowBoxReductions()
        || this.checkColBoxReductions()) {
      return this.activeHint;
    }
    if (maxDifficulty === Difficulty.MEDIUM) {
      return undefined;  // no hints using easy and medium techniques
    }

    // finally, hard techniques
    if (   this.checkNakedTriples()
        || this.checkNakedQuads()
        || this.checkHiddenPairs()
        || this.checkHiddenTriples()
        // || this.checkHiddenQuads()
        ) {
      return this.activeHint;
    }
    return undefined;  // no hints using any techniques without guessing
  } // getHint()

  /**
   * Apply hint toward solution.
   */
  public applyHint() : void {
    if (this.activeHint == undefined) {
      return;   // no hint to apply
    }
    this.hintLog.addEntry(this.activeHint);

    // switch (hint.action) {
    switch (this.activeHint.type) {
      case HintType.NAKED_SINGLE:
      case HintType.HIDDEN_SINGLE_ROW:
      case HintType.HIDDEN_SINGLE_COL:
      case HintType.HIDDEN_SINGLE_BOX:
        let vHint: ValueHint = <ValueHint> this.activeHint;
        this.sudokuService.setValue(vHint.cell, vHint.value, ActionType.SET_VALUE, undefined, 
            vHint);
        break;
      default:
        let kHint: CandidatesHint = <CandidatesHint> this.activeHint;
        let removes = kHint.removes;
        for (let remove of removes) {
          this.sudokuService.removeCandidate(remove.cell, remove.candidate, kHint);
        }
    } // switch
    this.activeHint = undefined;
  } // applyHint()

  // -------------------------------------------------------------------------
  // private methods
  // -------------------------------------------------------------------------

  /**
   * Apply hint toward solution.
   */
  private applyGivenHint(hint: Hint) : void {
    if (hint == undefined) {
      return;   // no hunt to apply
    }
    this.hintLog.addEntry(hint);

    // switch (hint.action) {
    switch (hint.type) {
      case HintType.NAKED_SINGLE:
      case HintType.HIDDEN_SINGLE_ROW:
      case HintType.HIDDEN_SINGLE_COL:
      case HintType.HIDDEN_SINGLE_BOX:
        let vHint: ValueHint = <ValueHint> hint;
        this.sudokuService.setValue(vHint.cell, vHint.value, ActionType.SET_VALUE, undefined, 
            vHint);
        break;
      default:
        let kHint: CandidatesHint = <CandidatesHint> hint;
        let removes = kHint.removes;
        for (let remove of removes) {
          this.sudokuService.removeCandidate(remove.cell, remove.candidate, kHint);
        }
    } // switch
    hint = undefined;
  } // applyHint()

  /**
   * Randomly look for cells with a single candidate. If found, create a hint
   * and return true. If none found, return false.
   */
  private checkNakedSingles() : boolean {
    for (let c of Common.shuffleArray(CELLS.slice())) {
      let nakedCells: number[] = 
          this.sudokuService.findNakedCandidates(c, NakedType.SINGLE);
      if (nakedCells.length > 0) {
        this.activeHint = new ValueHint(HintType.NAKED_SINGLE, c, nakedCells[0]);
        return true;
      }
    } // next random cell
    return false;
  } // checkNakedSingles()

  /**
   * Check for hidden singles in rows, columns, and boxes. If found, create
   * a hint and return true, otherwise return false.
   */
  private checkHiddenSingles() : boolean {
    for (let r of ROWS) {
      if (this.checkHiddenSinglesGroup(this.sudokuService.getRow(r), HintType.HIDDEN_SINGLE_ROW)) {
        return true;
      }
    }
    for (let c of COLS) {
      if (this.checkHiddenSinglesGroup(this.sudokuService.getCol(c), HintType.HIDDEN_SINGLE_COL)) {
        return true;
      }
    }
    for (let b of BOXS) {
      if (this.checkHiddenSinglesGroup(this.sudokuService.getBox(b), HintType.HIDDEN_SINGLE_BOX)) {
        return true;
      }
    }
    return false;
  } // checkHiddenSingles()

  /**
   * Check for hidden singles in a group (row, column, or box). If found, 
   * create a hint and return true, otherwise return false. 
   */
  private checkHiddenSinglesGroup(group: Group, hintType: HintType) : boolean {
    let singleCell = -1;
    NEXT_CANDIDATE:
    for (let k of CANDIDATES) {
      if (this.sudokuService.containsValue(group, k)) {
        continue NEXT_CANDIDATE;  // candidate cannot be single
      }
      let kCountInGroup = 0;
      for (let c of group.cells) {
        if (this.sudokuService.isCandidate(c, k)) {
          kCountInGroup++;
          if (kCountInGroup > 1) {
            continue NEXT_CANDIDATE;  // not single
          }
          singleCell = c;
        }
      } // for cells in group
      if (kCountInGroup === 1) {  // candidate occurs once in group
        this.activeHint = new ValueHint(hintType, singleCell, k);
        return true;
      }
    } // for candidates
    return false;
  } // checkGroupHiddenSingles()
        
  /**
   * Check for naked pairs in rows, columns, and boxes. If found, create a hint
   * and return true, otherwise return false.
   */
  private checkNakedPairs() : boolean {
      
    // get array of cells with 2 and only 2 candidates
    let nakedCells: {idx: number, cands: number[]}[] = [];
    for (let c of CELLS) {
      let nakedCands: number[] = 
          this.sudokuService.findNakedCandidates(c, NakedType.PAIR);
      if (nakedCands.length > 0) {
        nakedCells.push({idx: c, cands: nakedCands});
      }
    }
    if (nakedCells.length == 0) {
        return false;
    }
          
    // find 2 cells that have same 2 candidates
    for (let i1 = 0; i1 < nakedCells.length; i1++) {
      for (let i2 = i1 + 1; i2 < nakedCells.length; i2++) {

        let candidates: number[] = [];
        candidates = nakedCells[i1].cands.slice();

        // add unique candidates from nakedCells[i2].candidates
        for (let i of nakedCells[i2].cands) {
          if (candidates.indexOf(i) === -1) {
            candidates.push(i);
          }
        }
        if (candidates.length != 2) {
          continue;   // must be 2 for naked pair
        }

        // see if cells with common candidates are in same group
        let cells: number[] = [nakedCells[i1].idx, nakedCells[i2].idx]

        // look for actions; if none, move on
        if (Common.areCellsInSameRow(cells)) {
          if (this.checkNakedsRemoves(ROW_CELLS[Common.rowIdx(cells[0])],
              cells, candidates, HintType.NAKED_PAIRS_ROW)) {
            return true;    
          }
        }
        if (Common.areCellsInSameCol(cells)) {
          if (this.checkNakedsRemoves(COL_CELLS[Common.colIdx(cells[0])],
              cells, candidates, HintType.NAKED_PAIRS_COL)) {
            return true;
          }
        }
        if (Common.areCellsInSameBox(cells)) {
          if (this.checkNakedsRemoves(BOX_CELLS[Common.boxIdx(cells[0])],
              cells, candidates, HintType.NAKED_PAIRS_BOX)) {
            return true;
          }
        }

      } // for i2
    } // for i1
    return false;
  } // checkNakedPairs()

  /**
   * Check for naked triples in rows, columns, and boxes. If found, create a 
   * hint and return true, otherwise return false. A group must have at least 
   * 5 open cells to allow a naked triple.
   */
  private checkNakedTriples() : boolean {

    // get array of cells with 2 or 3 candidates
    let nakedCells: {idx: number, cands: number[]}[] = [];
    for (let c of CELLS) {
      let nakedCands: number[] = 
          this.sudokuService.findNakedCandidates(c, NakedType.TRIPLE);
      if (nakedCands.length > 0) {
        nakedCells.push({idx: c, cands: nakedCands});
      }
    }
    if (nakedCells.length == 0) {
        return false;
    }

    // find 3 cells that have same 2 or 3 candidates
    for (let i1 = 0; i1 < nakedCells.length; i1++) {
      for (let i2 = i1 + 1; i2 < nakedCells.length; i2++) {
        for (let i3 = i2 + 1; i3 < nakedCells.length; i3++) {

          let candidates: number[] = [];
          candidates = nakedCells[i1].cands.slice();

          // add unique candidates from nakedCells[i2].candidates
          for (let i of nakedCells[i2].cands) {
            if (candidates.indexOf(i) === -1) {
              candidates.push(i);
            }
          }
          if (candidates.length > 3) {
            continue;   // must be 3 for naked triple
          }

          // add unique candidates from nakedCells[i3].candidates
          for (let i of nakedCells[i3].cands) {
            if (candidates.indexOf(i) === -1) {
              candidates.push(i);
            }
          }
          if (candidates.length != 3) {
            continue;   // must be 3 for naked triple
          }

          // see if cells with common candidates are in same group
          let cells: number[] = [nakedCells[i1].idx, 
              nakedCells[i2].idx, nakedCells[i3].idx]

          // look for actions; if none, move on
          if (Common.areCellsInSameRow(cells)) {
            if (this.checkNakedsRemoves(ROW_CELLS[Common.rowIdx(cells[0])],
                cells, candidates, HintType.NAKED_TRIPLES_ROW)) {
              return true;    
            }
          }
          if (Common.areCellsInSameCol(cells)) {
            if (this.checkNakedsRemoves(COL_CELLS[Common.colIdx(cells[0])],
                cells, candidates, HintType.NAKED_TRIPLES_COL)) {
              return true;
            }
          }
          if (Common.areCellsInSameBox(cells)) {
            if (this.checkNakedsRemoves(BOX_CELLS[Common.boxIdx(cells[0])],
                cells, candidates, HintType.NAKED_TRIPLES_BOX)) {
              return true;
            }
          }

        } // for i3
      } // for i2
    } // for i1
    return false;
  } // checkNakedTriples()

  /**
   * TODO
   * Check for naked pairs, triples, or quads in a group (row, column, or box). 
   * If found, create a 
   * hint and return true, otherwise return false. A group must have  
   * 5 or more open (4 or fewer closed) cells to allow a naked triple. 
   * 
   * If only 4 open cells then 5 value
   * cells means only 4 candidates in group. A naked triple takes 3 cells,
   * therefore the 4th cell must be a naked single which would have been 
   * already found.
   */
  private checkNakedPairsGroup(group: Group, hintType: HintType) : boolean {
    if (this.sudokuService.candidateCellsCount(group) >= 4) {
      return false;   // see method comment 
    }
    // TODO
    return false;
  }

  private checkNakedTriplesGroup(group: Group, hintType: HintType) : boolean {
    if (this.sudokuService.candidateCellsCount(group) >= 5) {
      return false;   // see method comment 
    }
    // TODO
    return false;
  }

  private checkNakedQuadsGroup(group: Group, hintType: HintType) : boolean {
    if (this.sudokuService.candidateCellsCount(group) >= 6) {
      return false;   // see method comment 
    }
    // TODO
    return false;
  }

  /*
  private checkNakedXXXXsGroup(group: Group, hintType: HintType) : boolean {
    if (this.sudokuService.candidateCellsCount(group) >= 5) {
      return false;   // see method comment 
    }

    // approach 1 TODO
    // find cells in group with 2 or 3 (<= 3) cands -- cells23 [a, b, c, d, ...]
    // must have at least 3 cells (may be 3, 4, 5, 6, 7, 8, or 9)
    // for cells23, get cands cells23Cands [i, j, k, l, ...]

    // get group cells 2 or 3 candidates; 
    // there can't be any with 1 which would be naked single

    // let cells = []; // cells with 2-3 candidates
    // for (let c of group.groupCells) {
    //   let cell = this.cells[c];
    //   if (!cell.hasValue() && cell.getNumberOfCandidates() <= 3) {
    //     cells.push(cell);
    //   }
    // }
    // if (cells.length < 3) {
    //   return false;   // need at least 3 for naked triple
    // }

    let nakedCells: [{ c: number, ks: number[] }];
    for (let c of group.groupCells) {
      let cands = this.cells[c].getCandidates()
      if (cands.length <= 3) {
        nakedCells.push({c: c, ks: cands});
      }
    }
    if (nakedCells.length < 3) {
      return false;   // need at least 3 for naked triple
    }

    // does a combo of cells have only 3 cands?
    let it = new CombinationIterator(nakedCells, 3);
    let cands: number[] = [];
    while (it.hasNext()) {
      let combination = it.next();
      for (let c of combination) {
        for (let k of c.ks) {
          if (cands.indexOf(k) == -1) {
            cands.push(k);
          }
        }
      }
      if (cands.length == 3) {
        // 3 cells w/3 cands
        // check for removes
      }
    }



    // get candidates that appear in cells with 2-3 candidates
    // let cands = [];
    // for (let cell of nakedCells) {
    //   for (let k of cell.getCandiates()) {
    //     if (cands.indexOf(k) == -1) {
    //       cands.push(k);
    //     }
    //   }
    // }

    // check for 3 cell combinations

    // approach 2
    // find cands in group occurring 2 or 3 (<= 3) times -- cands23 [k1, k2, k3, k4, ... ]
    // must have at least 3 cands

    return false
  } // checkNakedTriplesGroup()
  */

  /**
   * Check for naked triples in rows, columns, and boxes. If found, create a hint
   * and return true, otherwise return false.
   */
  private checkNakedQuads() : boolean {

    // get array of cells with 2, 3, or 4 candidates
    let nakedCells: {idx: number, cands: number[]}[] = [];
    for (let c of CELLS) {
      let nakedCands: number[] = 
          this.sudokuService.findNakedCandidates(c, NakedType.QUAD);
      if (nakedCands.length > 0) {
        nakedCells.push({idx: c, cands: nakedCands});
      }
    }
    if (nakedCells.length == 0) {
        return false;
    }

    // find 4 cells that have same 2, 3, or 4 candidates
    for (let i1 = 0; i1 < nakedCells.length; i1++) {
      for (let i2 = i1 + 1; i2 < nakedCells.length; i2++) {
        for (let i3 = i2 + 1; i3 < nakedCells.length; i3++) {
          for (let i4 = i3 + 1; i4 < nakedCells.length; i4++) {

            let candidates: number[] = [];
            candidates = nakedCells[i1].cands.slice();

            // add unique candidates from nakedCells[i2].cands
            for (let i of nakedCells[i2].cands) {
              if (candidates.indexOf(i) === -1) {
                candidates.push(i);
              }
            }
            if (candidates.length > 4) {
              continue;   // must be 4 for naked quad
            }

            // add unique candidates from nakedCells[i3].cands
            for (let i of nakedCells[i3].cands) {
              if (candidates.indexOf(i) === -1) {
                candidates.push(i);
              }
            }
            if (candidates.length > 4) {
              continue;   // must be 4 for naked quad
            }

            // add unique candidates from nakedCells[i4].cands
            for (let i of nakedCells[i4].cands) {
              if (candidates.indexOf(i) === -1) {
                candidates.push(i);
              }
            }
            if (candidates.length != 4) {
              continue;   // must be 4 for naked quad
            }

            // see if cells with common candidates are in same group
            let cells: number[] = [nakedCells[i1].idx, 
                nakedCells[i2].idx, nakedCells[i3].idx, nakedCells[i4].idx]

            // look for actions; if none, move on
            if (Common.areCellsInSameRow(cells)) {
              if (this.checkNakedsRemoves(ROW_CELLS[Common.rowIdx(cells[0])],
                  cells, candidates, HintType.NAKED_QUADS_ROW)) {
                return true;    
              }
            }
            if (Common.areCellsInSameCol(cells)) {
              if (this.checkNakedsRemoves(COL_CELLS[Common.colIdx(cells[0])],
                  cells, candidates, HintType.NAKED_QUADS_COL)) {
                return true;
              }
            }
            if (Common.areCellsInSameBox(cells)) {
              if (this.checkNakedsRemoves(BOX_CELLS[Common.boxIdx(cells[0])],
                  cells, candidates, HintType.NAKED_QUADS_BOX)) {
                return true;
              }
            }

          } // for i4
        } // for i3
      } // for i2
    } // for i1
    return false;
  } // checkNakedQuads()

  /**
   * Having cells with common candidates and common group, determine if
   * candidate removes are possible. If so, lodge a hint and return true.
   * Return false to signal that no remove action is possible.
   */
  private checkNakedsRemoves(groupCells: number[], cells: number[], 
      candidates: number[], hintType: HintType) : boolean {

    // look for removes
    let removes: CellCandidate[] = [];

    for (let c of groupCells) {
      if (this.sudokuService.hasValue(c) || cells.indexOf(c) > -1) {
        continue;
      }
      for (let k of candidates) {
        if (this.sudokuService.isCandidate(c, k)) {
            removes.push(new CellCandidate(c, k));
        }
      } // for k
    } // for c

    // return true and hint if there are actions
    if (removes.length > 0) {
      this.activeHint = new CandidatesHint(hintType, cells, candidates, removes);
      return true;
    }
    return false;
  } // checkNakedsRemoves()

  /**
   * Check for hidden pairs in rows, columns, and boxes. If found, create a hint
   * and return true, otherwise return false.
   * 
   * A hidden pair occurs when a pair of numbers appears in exactly two 
   * squares in a row, column, or box, but those two numbers aren't 
   * the only ones in their squares.
   * 
   * http://www.thonky.com/sudoku/hidden-pairs-triples-quads/
   */
  private checkHiddenPairs() : boolean {
    for (let r of ROWS) {
      if (this.checkHiddenPairsGroup(this.sudokuService.getRow(r), HintType.HIDDEN_PAIRS_ROW)) {
        return true;
      }
    }
    for (let c of COLS) {
      if (this.checkHiddenPairsGroup(this.sudokuService.getCol(c), HintType.HIDDEN_PAIRS_COL)) {
        return true;
      }
    }
    for (let b of BOXS) {
      if (this.checkHiddenPairsGroup(this.sudokuService.getBox(b), HintType.HIDDEN_PAIRS_BOX)) {
        return true;
      }
    }
    return false;
  } // checkHiddenPairs()

  /**
   * Check for hidden triples in rows, columns, and boxes. If found, create a hint
   * and return true, otherwise return false.
   * 
   * A hidden triple occurs when three cells in a row, column, or box 
   * contain the same three numbers, or a subset of those three. The 
   * three cells also contain other candidates.
   * 
   * http://www.thonky.com/sudoku/hidden-pairs-triples-quads/
   */
  private checkHiddenTriples() : boolean {
    for (let r of ROWS) {
      if (this.checkHiddenTriplesGroup(this.sudokuService.getRow(r), HintType.HIDDEN_TRIPLES_ROW)) {
        return true;
      }
    }
    for (let c of COLS) {
      if (this.checkHiddenTriplesGroup(this.sudokuService.getCol(c), HintType.HIDDEN_TRIPLES_COL)) {
        return true;
      }
    }
    for (let b of BOXS) {
      if (this.checkHiddenTriplesGroup(this.sudokuService.getBox(b), HintType.HIDDEN_TRIPLES_BOX)) {
        return true;
      }
    }
    return false;
  } // checkHiddenTriples()

  /**
   * Check for hidden triples in rows, columns, and boxes. If found, create a hint
   * and return true, otherwise return false.
   * 
   * Hidden quads are pretty rare, and they can be difficult to spot 
   * unless you are specifically looking for them.
   * 
   * http://www.thonky.com/sudoku/hidden-pairs-triples-quads/
   */
  private checkHiddenQuads() : boolean {
    for (let r of ROWS) {
      if (this.checkHiddenQuadsGroup(this.sudokuService.getRow(r), 
          HintType.HIDDEN_QUADS_ROW)) {
        return true;
      }
    }
    for (let c of COLS) {
      if (this.checkHiddenQuadsGroup(this.sudokuService.getCol(c), 
          HintType.HIDDEN_QUADS_COL)) {
        return true;
      }
    }
    for (let b of BOXS) {
      if (this.checkHiddenQuadsGroup(this.sudokuService.getBox(b), 
          HintType.HIDDEN_QUADS_BOX)) {
        return true;
      }
    }
    return false;
  } // checkHiddenTriples()

  /**
   * Check for hidden pairs in a given row, column, or box.
   * 
   * (1) Candidates that appear exactly 2 times in group, and
   * (2) 2 times appearing candidates are confined to 2 cells, and,
   * as usual, there are candidate remove actions available.
   */
  private checkHiddenPairsGroup(group: Group, hintType: HintType) : boolean {

    // number of occurrences of each candidate in group
    let kCounts: number[] = [];

    // candidates occurring no more than 3 times in group
    let pairCandidates: number[] = [];   

    // group cells containing a triple candidate
    let pairCells: number[] = [];

    // look for 2 candidates occurring 2 times in group
    kCounts = this.sudokuService.getCandidateCounts(group);
    for (let k of CANDIDATES) {
      if (kCounts[k] === 2) {
        pairCandidates.push(k);
      }
    }
    if (pairCandidates.length < 2) {
      return false;   // no 2 candidates appear 2 times in group
    }

    // find group cells that contain potential pair candidate
    NEXT_CELL:
    for (let c of group.cells) {
      for (let k of pairCandidates) {
        if (this.sudokuService.isCandidate(c, k)) {
          pairCells.push(c);
          continue NEXT_CELL;   // only push cell once
        }
      }
    }

    // examine all combinations of 2 pair cells containing pair candidates
    let pairCellCombinations: number[][] = Common.pairwise(pairCells);
    for (let pairCellCombination of pairCellCombinations) {

      // this set of pair cells
      let _2pairCells: number[] = pairCellCombination;

      // candidates in 1 or more of these set of cells
      let _2cands: number[] = [];

      // number of occurrences of each candidate in this set of cells
      let _2kCounts: number[] = [0,   0, 0, 0,   0, 0, 0,   0, 0, 0];

      // cands in set of cells that match occurrences in full group
      let _2matchedCands: number[] = [];

      // get unique pair candidates from pair cells
      for (let k of pairCandidates) {
        for (let j = 0; j < 2; j++) {
          if (this.sudokuService.isCandidate(_2pairCells[j], k)) {
            _2kCounts[k]++;
            if (_2cands.indexOf(k) === -1) {
              _2cands.push(k);
            }
          }
        }
      }

      // if not 2 candidates, try next combination of pair cells 
      if (_2cands.length < 2) {
        continue;  // next combination of pair cells
      }

      // make sure pair candidates don't appear outside pair cells
      for (let k of _2cands) {
        if (_2kCounts[k] == kCounts[k]) {
          _2matchedCands.push(k);
        }
      }
      if (_2matchedCands.length != 2) {
        continue;  // next combination of pair cells
      }

      // look for removes: other candidates in pair cells
      let removes: CellCandidate[] = this.findHiddenRemoves(
          pairCellCombination, _2matchedCands);

      // need at least 1 candidate to remove or it's not hidden pair
      if (removes.length > 0) {
        this.activeHint = new CandidatesHint(hintType, pairCellCombination, 
            _2matchedCands, removes);
        return true;
      }
          
    } // for pairCellCombinations

    return false;
  } // checkHiddenPairsGroup()

  /**
   * Check for hidden triples in a given row, column, or box.
   * 
   * (1) Candidates that appear exactly 2 or 3 times in group, and
   * (2) 2 or 3 times appearing candidates are confined to 3 cells, and,
   * as usual, there are candidate remove actions available.
   */
  private checkHiddenTriplesGroup(group: Group, hintType: HintType) : boolean {

    // number of occurrences of each candidate in group
    let kCounts: number[] = [];

    // candidates occurring no more than 3 times in group
    let tripCandidates: number[] = [];   

    // group cells containing a triple candidate
    let tripCells: number[] = [];

    // look for at least 3 candidates occurring 2 or 3 times in group
    kCounts = this.sudokuService.getCandidateCounts(group);
    for (let k of CANDIDATES) {
      if (kCounts[k] >= 2 && kCounts[k] <= 3) {
        tripCandidates.push(k);
      }
    }
    if (tripCandidates.length < 3) {
      return false;   // no 3 candidates appear 2 or 3 times in group
    }

    // find group cells contain a potential triple candidate
    NEXT_CELL:
    for (let c of group.cells) {
      for (let k of tripCandidates) {
        if (this.sudokuService.isCandidate(c, k)) {
          tripCells.push(c);
          continue NEXT_CELL;   // only push cell once
        }
      }
    }

    // examine all combinations of 3 triple cells containing triple candidates
    let tripCellCombinations: number[][] = Common.tripwise(tripCells);
    for (let tripCellCombination of tripCellCombinations) {

      // this set of triple cells
      let _3tripCells: number[] = tripCellCombination;

      // candidates in 1 or more of these set of cells
      let _3cands: number[] = [];

      // number of occurrences of each candidate in this set of cells
      let _3kCounts: number[] = [0,   0, 0, 0,   0, 0, 0,   0, 0, 0];

      // cands in set of cells that match occurrences in full group
      let _3matchedCands: number[] = [];

      // get unique triple candidates from triple cells
      for (let k of tripCandidates) {
        for (let j = 0; j < 3; j++) {
          if (this.sudokuService.isCandidate(_3tripCells[j], k)) {
            _3kCounts[k]++;
            if (_3cands.indexOf(k) === -1) {
              _3cands.push(k);
            }
          }
        }
      }

      // if not at least 3 candidates, try next combination of triple cells 
      if (_3cands.length < 3) {
        continue;  // next combination of triple cells
      }

      // make sure triple candidates don't appear outside triple cells
      for (let k of _3cands) {
        if (_3kCounts[k] == kCounts[k]) {
          _3matchedCands.push(k);
        }
      }
      if (_3matchedCands.length != 3) {
        continue;  // next combination of triple cells
      }

      // look for removes: other candidates in triple cellsToValuesArray
      let removes: CellCandidate[] = this.findHiddenRemoves(
          tripCellCombination, _3matchedCands);

      // need at least 1 candidate to remove or it's not hidden triple
      if (removes.length > 0) {
        this.activeHint = new CandidatesHint(hintType, tripCellCombination, 
            _3matchedCands, removes);
        return true;
      }
          
    } // for tripCellCombinations

    return false;
  } // checkHiddenTriplesGroup()

  /**
   * Check for hidden quads in a given row, column, or box.
   * 
   * (1) Candidates that appear exactly 2, 3, or 4 times in group, and
   * (2) 2, 3, or 4 times appearing candidates are confined to 34 cells, and,
   * as usual, there are candidate remove actions available.
   */
  private checkHiddenQuadsGroup(group: Group, hintType: HintType) : boolean {

    // number of occurrences of each candidate in group
    let kCounts: number[] = [];

    // candidates occurring no more than 4 times in group
    let quadCandidates: number[] = [];   

    // group cells containing a quad candidate
    let quadCells: number[] = [];

    kCounts = this.sudokuService.getCandidateCounts(group);
    for (let k of CANDIDATES) {
      if (kCounts[k] >= 2 && kCounts[k] <= 4) {
        quadCandidates.push(k);
      }
    }

    console.log('kCounts       : ' + JSON.stringify(kCounts));            
    console.log('quadCandidates: ' + JSON.stringify(quadCandidates) + ' (need at least 4)');            

    // we need at least 4 candidates
    if (quadCandidates.length < 4) {
      return false;   // no 4 candidates appear 2, 3, or 4 times in group
    }

    // find group cells that contain a quad candidate
    NEXT_CELL:
    for (let c of group.cells) {
      for (let k of quadCandidates) {
        if (this.sudokuService.isCandidate(c, k)) {
          quadCells.push(c);
          continue NEXT_CELL;   // only push cell once
        }
      }
    }

    console.log('quadCells     : ' + JSON.stringify(quadCells));            

    // examine all combinations of 4 quad cells containing quad candidates
    let ln = quadCells.length
    for (let     i1 = 0;      i1 < (ln - 3); i1++) {
      for (let   i2 = i1 + 1; i2 < (ln - 2); i2++) {
        for (let i3 = i2 + 1; i3 < (ln - 1); i3++) {
          I4:
          for (let i4 = i3 + 1; i4 < (ln - 0); i4++) {

            // this set of quad cells
            let _4quadCells = [quadCells[i1], quadCells[i2], quadCells[i3], quadCells[i4]];

            // candidates in 1 or more of these set of cells
            let _4cands: number[] = [];

            // number of occurrences of each candidate in this set of cells
            let _4kCounts: number[] = [0,   0, 0, 0,   0, 0, 0,   0, 0, 0];

            // cands in set of cells that match occurrences in full group
            let _4matchedCands: number[] = [];

            // get unique quad candidates from quad cells
            for (let k of quadCandidates) {
              for (let i of [i1, i2, i3, i4]) {
                if (this.sudokuService.isCandidate(quadCells[i], k)) {
                  _4kCounts[k]++;
                  if (_4cands.indexOf(k) === -1) {
                    _4cands.push(k);
                  }
                }
              }
            }

    console.log('_4quadCells   : ' + JSON.stringify(_4quadCells));            
    console.log('_4cands       : ' + JSON.stringify(_4cands) + ' (need at least 4)');            

            // if not 4 candidates, try next combination of quad cells
            if (_4cands.length < 4) {
              continue I4;
            }

            // let _4matchedCands: number[] = [];
            for (let k of _4cands) {
              if (_4kCounts[k] == kCounts[k]) {
                _4matchedCands.push(k);
              }
            }

    console.log('_4kCounts1    : ' + JSON.stringify(_4kCounts));            
    console.log('_4matchedCands: ' + JSON.stringify(_4matchedCands) + ' (need exactly 4)');  

            if (_4matchedCands.length != 4) {
              continue I4;
            }

            // look for removes: other candidates in quad cellsToValuesArray
            // let removes: {c: number, k: number}[] = this.findHiddenRemoves(
            let removes: CellCandidate[] = this.findHiddenRemoves(
                [quadCells[i1], quadCells[i2], quadCells[i3], quadCells[i4]],
                _4matchedCands);

    console.log('removes      : ' + removes.length + ' (need at least 1)');  

            // no candidates to remove, so no hidden quad
            if (removes.length > 0) {
              this.activeHint = new CandidatesHint(hintType, 
                  [quadCells[i1], quadCells[i2], quadCells[i3], quadCells[i4]], 
                  _4matchedCands, removes);
    console.log('hint: ' + JSON.stringify(this.activeHint));
              return true;
            }
          
          } // for i4
        } // for i3
      } // for i2
    } // for i1
    return false;
  } // checkHiddenQuadsGroup()

  /**
   * Helper method to find candidate removes from hidden pairs, triples, quads.
   */
  private findHiddenRemoves(hiddenCells: number[], hiddenCands: number[]) 
      : CellCandidate[] {
    let removes: CellCandidate[] = [];
    for (let hiddenCell of hiddenCells) {
      let hiddenCellCands: number[] = this.sudokuService.getCandidates(hiddenCell).slice();
      for (let hiddenCellCand of hiddenCellCands) {
        if (hiddenCands.indexOf(hiddenCellCand) === -1) {
          removes.push(new CellCandidate(hiddenCell, hiddenCellCand));
        }
      }
    }
    return removes;
  } // findHiddenRemoves()

  /**
   * Check for pointing rows and columns. If found, create a hint and return 
   * true, otherwise return false.
   * 
   * A pointing row (col) occurs when a candidate appears twice or three 
   * times in a box, and those occurrences are in the same row (col).
   * This means the candidate MUST occur in one of the two or three cells 
   * in the box, and because of that, you can remove that candidate from 
   * any other cells in the same row (col) but outside the box.
   * 
   * http://www.thonky.com/sudoku/pointing-pairs-triples/
   */
  private checkPointingRowCol() : boolean {
    for (let b of BOXS) {
  
      CANDS:		// within box, iterate over 9 candidate values
      for (let k of CANDIDATES) {
        let boxCandOccurrences: number[] = []; 	// [idx, ...]
        if (this.sudokuService.containsValue(this.sudokuService.getBox(b), k)) {  
          continue CANDS;	// k cannot be candidate in box
        }
        for (let c of BOX_CELLS[b]) {   // for each cell in box
          if (this.sudokuService.isCandidate(c, k)) {
            boxCandOccurrences.push(c);
            if (boxCandOccurrences.length > 3) {
              continue CANDS;	// too many for candidate
            }
          }
        } // for
        if (boxCandOccurrences.length < 2) {
          continue CANDS;			// too few for candidate
        }
        
        // we have 2 or 3 occurances of k in b
        // determine if in same row or col
        let sameRow = Common.areCellsInSameRow(boxCandOccurrences);
        let sameCol = Common.areCellsInSameCol(boxCandOccurrences);
        if (!sameRow && !sameCol) {
          continue CANDS;		// try next candidate in box
        }

        // look for actions
        let removes: CellCandidate[] = [];
        if (sameRow) {
            
          // scan other cells in row outside box
          for (let c of ROW_CELLS[Common.rowIdx(boxCandOccurrences[0])]) {
            if (Common.boxIdx(c) === b) {
              continue; // cell in same box
            }
            if (this.sudokuService.isCandidate(c, k)) {
              removes.push(new CellCandidate(c, k));
            }
          } // for

          // if there are removes, we have hint
          if (removes.length > 0) {
            this.activeHint = new CandidatesHint(HintType.POINTING_ROW, 
                [boxCandOccurrences[0]], [k], removes);
            return true;
          }
        } else {	// same column
            
          // scan other cells in col outside box
          for (let c of COL_CELLS[Common.colIdx(boxCandOccurrences[0])]) {
            if (Common.boxIdx(c) === b) {
              continue; // cell in same box
            }
            if (this.sudokuService.isCandidate(c, k)) {
              removes.push(new CellCandidate(c, k));
            }
          } // for

          // if there are removes, we have hint
          if (removes.length > 0) {
            this.activeHint = new CandidatesHint(HintType.POINTING_COL, 
                [boxCandOccurrences[0]], [k], removes);
            return true;
          }
        } // else same col

      } // for CANDS
    } // for BOXS
    return false;
  } // checkPointingRowCol()

  /*
   * Check for row box reductions. If found, create a hint and return 
   * true, otherwise return false.
   * 
   * In box/line reduction, two or three of the same candidate appear on 
   * the same row or column, and that candidate happens to be restricted 
   * to a single box. When this happens, you know that the candidate 
   * MUST occur in that row or column, so you can eliminate it from other 
   * cells in that box.
   * 
   * http://www.thonky.com/sudoku/box-line-reduction/
   */
  private checkRowBoxReductions() : boolean {
          
    //ROWS:
    for (let row of ROWS) {
        
      CANDS:
      for (let k of CANDIDATES) {
        if (this.sudokuService.containsValue(this.sudokuService.getRow(row), k)) {
          continue CANDS;		// not candidate in row
        }
        
        let rowCandOccurrences: number[] = [];
    
        //CELLS:
        for (let c of ROW_CELLS[row]) {
          // if (this.cells[c].hasValue[k]) {   REDUNDANT
          //   continue CELLS;	// k cannot be candidate in col
          // }
          if (this.sudokuService.isCandidate(c, k)) {
            rowCandOccurrences.push(c);
            if (rowCandOccurrences.length > 3) {
              continue CANDS;	// too many for candidate
            }
          }
        } // for CELLS
        
        if (rowCandOccurrences.length < 2) {
          continue CANDS;			// too few for candidate
        }
        
        // determine if in same box
        if (!Common.areCellsInSameBox(rowCandOccurrences)) {
          continue CANDS;   // not in same box, next cand
        }
        
        // must be same box, different row; look for removes
        let removes: CellCandidate[] = [];

        // look for k's in other rows in box 
        // this row is row, this box is box
        for (let c of BOX_CELLS[Common.boxIdx(rowCandOccurrences[0])]) {

          // if c in row, continue next c
          if (ROW_CELLS[row].indexOf(c) >= 0) {
            continue;   // box cell in same row, next c
          }

          // if isCandidate, push to removes
          if (this.sudokuService.isCandidate(c, k)) {
            removes.push(new CellCandidate(c, k));
          }
        } // for
        if (removes.length > 0) {
          this.activeHint = new CandidatesHint(HintType.ROW_BOX_REDUCTION, 
              [rowCandOccurrences[0]], [k], removes);
          return true;
        }
      } // for CANDS
    } // for ROWS
    return false;    	
  } // checkRowBoxReductions()

  /**
   * Check for column box reductions. If found, create a hint and return 
   * true, otherwise return false.
   */
  private checkColBoxReductions() : boolean {
          
    //COLS:
    for (let col of COLS) {
        
      CANDS:
      for (let k of CANDIDATES) {
        // if (this.cols[col].containsValue(k)) {
        if (this.sudokuService.containsValue(this.sudokuService.getCol(col), k)) {
          continue CANDS;		// not candidate in col
        }
        
        let colCandOccurrences: number[] = [];

        //CELLS:
        for (let c of COL_CELLS[col]) {
          // if (this.cells[c].hasValue[k]) {   REDUNDANT!
          //   continue CELLS;	// k cannot be candidate in row
          // }
          if (this.sudokuService.isCandidate(c, k)) {
            colCandOccurrences.push(c);
            if (colCandOccurrences.length > 3) {
              continue CANDS;	// too many for candidate
            }
          }
        } // for CELLS
        
        if (colCandOccurrences.length < 2) {
            continue CANDS;			// too few for candidate
        }
        
        // determine if in same box
        if (!Common.areCellsInSameBox(colCandOccurrences)) {
          continue CANDS;   // not in same box, next cand
        }
        
        // must be same box, different col; look for removes
        let removes: CellCandidate[] = [];

        // look for k's in other cols in box
        // this col is col, this box is box
        for (let c of BOX_CELLS[Common.boxIdx(colCandOccurrences[0])]) {

          // if c in col, continue next c
          if (COL_CELLS[col].indexOf(c) >= 0) {
            continue;   // box cell in same col, next c
          }

          // if isCandidate, push to removes
          if (this.sudokuService.isCandidate(c, k)) {
            removes.push(new CellCandidate(c, k));
          }
        } // for
        if (removes.length > 0) {
          this.activeHint = new CandidatesHint(HintType.COL_BOX_REDUCTION, 
              [colCandOccurrences[0]], [k], removes);
          return true;
        }
      } // for CANDS
    } // for COLS
    return false;    	
  } // checkColBoxReductions()
        
}

