// import { Injectable } from '@angular/core';

import { LogService } from '../common/log.service';
import { Hint } from './hint';
import { HintType } from './hint.type';
import { HintCounts } from './hintCounts';

// @Injectable()
export class HintLogService extends LogService {
  
  public addEntry(entry: Hint) : void {
    super.addEntry(entry);
  }

  public getAllEntries() : Hint[] {
    return super.getAllEntries();
  }

  public getLastEntry() : Hint {
    return super.getLastEntry();
  }
  
  public getHintCounts() : HintCounts {
    let hintCounts = new HintCounts();
    for (let hint of this.getAllEntries()) {
      switch (hint.type) {
        case HintType.NAKED_SINGLE:
          hintCounts.nakedSingles++;
          break;

        case HintType.HIDDEN_SINGLE_ROW:
          hintCounts.hiddenSinglesRow++;
          break;
        case HintType.HIDDEN_SINGLE_COL:
          hintCounts.hiddenSinglesCol++;
          break;
        case HintType.HIDDEN_SINGLE_BOX:
          hintCounts.hiddenSinglesBox++;
          break;

        case HintType.NAKED_PAIRS_ROW:
          hintCounts.nakedPairsRow++;
          break;
        case HintType.NAKED_PAIRS_COL:
          hintCounts.nakedPairsCol++;
          break;
        case HintType.NAKED_PAIRS_BOX:
          hintCounts.nakedPairsBox++;
          break;

        case HintType.POINTING_ROW:
          hintCounts.pointingRows++;
          break;
        case HintType.POINTING_COL:
          hintCounts.pointingCols++;
          break;

        case HintType.ROW_BOX_REDUCTION:
          hintCounts.rowBoxReductions++;
          break;
        case HintType.COL_BOX_REDUCTION:
          hintCounts.colBoxReductions++;
          break;

        case HintType.NAKED_TRIPLES_ROW:
          hintCounts.nakedTriplesRow++;
          break;
        case HintType.NAKED_TRIPLES_COL:
          hintCounts.nakedTriplesCol++;
          break;
        case HintType.NAKED_TRIPLES_BOX:
          hintCounts.nakedTriplesBox++;
          break;

        case HintType.NAKED_QUADS_ROW:
          hintCounts.nakedQuadsRow++;
          break;
        case HintType.NAKED_QUADS_COL:
          hintCounts.nakedQuadsCol++;
          break;
        case HintType.NAKED_QUADS_BOX:
          hintCounts.nakedQuadsBox++;
          break;

        case HintType.HIDDEN_PAIRS_ROW:
          hintCounts.hiddenPairsRow++;
          break;
        case HintType.HIDDEN_PAIRS_COL:
          hintCounts.hiddenPairsCol++;
          break;
        case HintType.HIDDEN_PAIRS_BOX:
          hintCounts.hiddenPairsBox++;
          break;

        case HintType.GUESS:
          hintCounts.guesses++;
          break;
          
        default:
      } // switch
    } // for hints in log
    return hintCounts;
  } // getHintCounts()

}
