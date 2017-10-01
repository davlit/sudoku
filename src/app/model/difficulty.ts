export enum Difficulty {
  EASY,
  MEDIUM,
  HARD,
  HARDEST
}

export const DIFFICULTIES = [
  Difficulty.EASY, 
  Difficulty.MEDIUM, 
  Difficulty.HARD, 
  Difficulty.HARDEST
]

export const DIFFICULTY_LABELS = [
  { label: 'Easy',    padded: 'Easy   ' },
  { label: 'Medium',  padded: 'Meduim ' },
  { label: 'Hard',    padded: 'Hard   ' },
  { label: 'Hardest', padded: 'Hardest' }
]