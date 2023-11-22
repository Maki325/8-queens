import { calculateAttacks } from "./common";
import type { InitialStateId } from "./initialState";
import type { Move, Position, State } from "./state";

export type HillClimbingId = 'onlyMoveInRow';

export class HillClimbingOptions {
  constructor(
    public readonly startState: State,
    public readonly maxSidemoves: number,
  ) {}
}

export type HillClimbingFunction = (options: HillClimbingOptions) => HillClimbingResult;

export class HillClimbingResult {
  constructor(
    public readonly state: State,
    public readonly moves: Move[],
  ) {}
}

// Move a queen to a new position and return the new state
function moveQueen(state: State, queenIndex: number, newPosition: Position): State {
  const newState = state.slice() as State;
  newState[queenIndex] = newPosition;
  return newState;
}

// Hill climbing algorithm to solve the 8-Queens problem with a limit on side moves
export function moveOnlyInRow({maxSidemoves = 100, startState}: HillClimbingOptions): HillClimbingResult {
  let currentState: State = startState.slice() as State;
  let currentAttacks = calculateAttacks(currentState);
  let sideMoves = 0; // On sidemoves, move a queen randomly to a new position

  const moves: Move[] = [];

  while (currentAttacks > 0 && sideMoves < maxSidemoves) {
    let bestState = currentState;
    let bestAttacks = currentAttacks;
    let bestMove: null | Move = null;
    let foundBetterMove = false;

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const index = currentState.findIndex(queen => queen.y === y);
        const queen = currentState[index];
        if (x !== queen.x) {
          const newPosition = { x, y };
          const newState = moveQueen(currentState, index, newPosition);
          const newAttacks = calculateAttacks(newState);

          if (newAttacks < bestAttacks) {
            bestState = newState;
            bestAttacks = newAttacks;
            foundBetterMove = true;

            bestMove = {
              queenIndex: index,
              oldPosition: queen,
              newPosition,
              isSideMove: false,
            };
          }
        }
      }
    }

    if (!foundBetterMove) {
      // Increment the side move counter
      sideMoves++;

      // Move a random queen to a random new position
      const index = Math.floor(Math.random() * 8);
      const queen = currentState[index];

      let newPosition: Position;
      do {
        newPosition = {
          x: Math.floor(Math.random() * 8),
          y: queen.y,
        };
      } while (newPosition.x === queen.x);

      const newState = moveQueen(currentState, index, newPosition);
      const newAttacks = calculateAttacks(newState);

      currentState = newState;
      currentAttacks = newAttacks;

      moves.push({
        queenIndex: index,
        oldPosition: queen,
        newPosition,
        isSideMove: true,
      });
    } else {
      currentState = bestState;
      currentAttacks = bestAttacks;
      moves.push(bestMove!);
    }
  }

  return new HillClimbingResult(currentState, moves);
}

type Version = {
  id: HillClimbingId;
  name: string;
  func: HillClimbingFunction;
  usableInitialStateFilter?: InitialStateId[];
}
export const versions: Version[] = [
  {
    id: 'onlyMoveInRow',
    name: 'Only move queens in the same row',
    func: moveOnlyInRow,
    usableInitialStateFilter: ['queenInEachRow']
  },
];
