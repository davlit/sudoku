import { Difficulty } from './difficulty';

export class Result {
  constructor(
    public difficulty: Difficulty, 
    public sudoku: string, 
    public running: boolean) {

    // for fib (fibanacci)
    // public number: number, 
    // public result: number, 
    // public loading: boolean) {
  }
}
