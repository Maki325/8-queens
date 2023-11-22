import { calculateAttacks } from "./common";
import { moveOnlyInRow } from "./hillClimbing";
import { queenInEachRow } from "./initialState";
import type { State } from "./state";

// Print the chessboard
function printChessboard(state: State): void {
  const table: boolean[][] = [];

  for(const queen of state) {
    table[queen.y] = table[queen.y] || [];
    table[queen.y][queen.x] = true;
  }

  for (let i = 0; i < 8; i++) {
    let row = '';
    for (let j = 0; j < 8; j++) {
      row += table[i] && table[i][j] ? 'Q ' : '. ';
    }
    console.log(row);
  }

  const attacks = calculateAttacks(state);
  if(attacks === 0) {
    console.log('Solution found!');
  } else {
    console.log(`Attacks: ${attacks}`);
  }
}

// Run the hill climbing algorithm and print the result
const solution = moveOnlyInRow({
  initialStateGenerator: queenInEachRow,
  maxSidemoves: 100,
});
console.log('Solution:');
printChessboard(solution.state);
