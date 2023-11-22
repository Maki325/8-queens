type State = number[];

// Generate a random initial state
function generateInitialState(): State {
  const initialState: State = [];
  for (let i = 0; i < 8; i++) {
    initialState.push(Math.floor(Math.random() * 8));
  }
  return initialState;
}

// Calculate the number of attacking queens for a given state
function calculateAttacks(state: State): number {
  let attacks = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 8; j++) {
      if (
        state[i] === state[j] ||
        state[i] - i === state[j] - j ||
        state[i] + i === state[j] + j
      ) {
        attacks++;
      }
    }
  }
  return attacks;
}

// Move a queen to a new position and return the new state
function moveQueen(state: State, queenIndex: number, newPosition: number): State {
  const newState = state.slice();
  newState[queenIndex] = newPosition;
  return newState;
}

// Hill climbing algorithm to solve the 8-Queens problem with a limit on side moves
function hillClimbing(): State {
  let currentState: State = generateInitialState();
  let currentAttacks = calculateAttacks(currentState);
  let sideMoves = 0;

  while (currentAttacks > 0 && sideMoves < 100) {
    let bestState = currentState;
    let bestAttacks = currentAttacks;
    let foundBetterMove = false;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (j !== currentState[i]) {
          const newState = moveQueen(currentState, i, j);
          const newAttacks = calculateAttacks(newState);

          if (newAttacks < bestAttacks) {
            bestState = newState;
            bestAttacks = newAttacks;
            foundBetterMove = true;
          }
        }
      }
    }

    if (!foundBetterMove) {
      // Increment the side move counter
      sideMoves++;
    } else {
      currentState = bestState;
      currentAttacks = bestAttacks;
      // sideMoves = 0; // Reset the side move counter
    }

    if(sideMoves === 100) {
      return currentState;
    }
  }

  return currentState;
}

// Print the chessboard
function printChessboard(state: State): void {
  for (let i = 0; i < 8; i++) {
    let row = '';
    for (let j = 0; j < 8; j++) {
      row += state[i] === j ? 'Q ' : '. ';
    }
    console.log(row);
  }
}

// Run the hill climbing algorithm and print the result
const solution = hillClimbing();
console.log('Solution:');
printChessboard(solution);
