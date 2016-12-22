/**
 * This follows standard math combinations: "n choose k" or "C(n, k)". In other
 * words, from a set of n elements choose k elements from the set; this 
 * constitutes a "combination". The number of possible combinations is given by
 *        n!
 *   -------------
 *   k! * (n - k)!
 * For example if n = 5 and k = 3, there are 10 unique combinations of 
 * 3 elements from a set of 5 elements.
 */
export class CombinationIterator {
  // private nSet: number[];
  private nSet: any[];
  private n: number;
  private k: number;
  private nCombinations: number;
  private combinationI: number;
  private combinations: any[][];

  // constructor(nSet: number[], k: number) {
  constructor(nSet: any[], k: number) {
    this.nSet = nSet;
    this.n = nSet.length;
    this.k = k;
    this.nCombinations = this.factorialize(this.n) 
        / (this.factorialize(this.k) * this.factorialize(this.n - this.k));
    this.combinationI = 0;

    console.log('nSet: ' + JSON.stringify(this.nSet));
    console.log('C(n,k): C(' + this.n + ',' + this.k + ')');
    console.log('nCombinations: ' + this.nCombinations);

    let c0 = 0;
    this.combinations = [];
    for     (let i1 = 0;      i1 < (this.n - this.k + 1); i1++) {
      for   (let i2 = i1 + 1; i2 < (this.n - this.k + 2); i2++) {
        for (let i3 = i2 + 1; i3 < (this.n - this.k + 3); i3++) {
          this.combinations[c0] = [nSet[i1], nSet[i2], nSet[i3]];
          // console.log('combinations[c0]: ' + c0 + ' ' + JSON.stringify(this.combinations[c0]));
          // console.log('combinations: ' + JSON.stringify(this.combinations));
          c0++;
        }
      }
    }
    // console.log('final combinations: ' + JSON.stringify(this.combinations));
  }

  hasNext() : boolean {
    return this.combinationI < this.nCombinations;
  }

  next() : any[] {
    return this.combinations[this.combinationI++];
  }

  /*
  /*  
  5 choose 3 (n=5, k=3); count = 10   i1 = i + 1 div 5; 
    0 - nSet[0], nSet[1], nSet[2]
    1 - nSet[0], nSet[1], nSet[3]
    2 - nSet[0], nSet[1], nSet[4]

    3 - nSet[0], nSet[2], nSet[3]
    4 - nSet[0], nSet[2], nSet[4]

    5 - nSet[0], nSet[3], nSet[4]

    6 - nset[1], nSet[2], nSet[3]
    7 - nset[1], nSet[2], nSet[4]

    8 - nset[1], nSet[3], nSet[4]

    9 - nset[2], nSet[3], nSet[4]
  6 choose 3 (n=6, k=3); count = 20
    0 - nSet[0], nSet[1], nSet[2]
    1 - nSet[0], nSet[1], nSet[3]
    2 - nSet[0], nSet[1], nSet[4]
    3 - nSet[0], nSet[1], nSet[5]

    4 - nSet[0], nSet[2], nSet[3]
    5 - nSet[0], nSet[2], nSet[4]
    6 - nSet[0], nSet[2], nSet[5]

    7 - nSet[0], nSet[3], nSet[4]
    8 - nSet[0], nSet[3], nSet[5]

    9 - nSet[0], nSet[4], nSet[5]

   10 - nset[1], nSet[2], nSet[3]
   11 - nset[1], nSet[2], nSet[4]
   12 - nset[1], nSet[2], nSet[5]

   13 - nset[1], nSet[3], nSet[4]
   14 - nset[1], nSet[3], nSet[5]

   15 - nset[1], nSet[4], nSet[5]

   16 - nset[2], nSet[3], nSet[4]
   17 - nset[2], nSet[3], nSet[5]

   18 - nset[2], nSet[4], nSet[5]

   19 - nset[3], nSet[4], nSet[4]

    for     (let i1 = 0;      i1 < (n-k+1); i1++)   5,3 < 3   6,3 < 4
      for   (let i2 = i1 + 1; i2 < (n-k+2); i2++)   5,3 < 4   6,3 < 5
        for (let i3 = i2 + 1; i3 < (n-k+3); i3++)   5,3 < 5   6,3 < 6
  */

  private factorialize(n: number) : number {
    if (n < 0) {
      return -1;
    } else if (n == 0) { 
      return 1;
    } else {
      return (n * this.factorialize(n - 1));
    }
  }

}  
