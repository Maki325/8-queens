import type { State } from "./state";

// Calculate the number of attacking queens for a given state
export function calculateAttacks(state: State): number {
  let attacks = 0;

  for(let i = 0; i < 8; i++) {
    const queen = state[i];
    for(let j = i + 1; j < 8; j++) {
      const otherQueen = state[j];
      if(queen.x === otherQueen.x || queen.y === otherQueen.y) {
        // If the queens are in the same row or column
        attacks++;
      } else if(Math.abs(queen.x - otherQueen.x) === Math.abs(queen.y - otherQueen.y)) {
        // If the queens are in the same diagonal
        attacks++;
      }
    }
  }

  return attacks;
}
