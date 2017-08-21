/**
 * An instance of this class represents a cell and one of its candidates.
 */
export class CellCandidate {
  private _cell: number;        // 0..80
  private _candidate: number;   // 1..9 - candidate may or may not be active

  constructor(cell: number, candidate: number) {
    this._cell = cell;
    this._candidate = candidate;
  }

  set cell(cell: number) {
    this._cell = cell;
  }
  
  get cell() {
    return this._cell;
  }
  
  set candidate(candidate: number) {
    this._candidate = candidate;
  }
  
  get candidate() {
    return this._candidate;
  }
  
}

