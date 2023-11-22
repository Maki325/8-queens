import type { Position, State } from "./state";

export type InitialStateId = 'queenInEachRow' | 'randomQueen';

export type InitialStateFunction = () => State;

export function queenInEachRow(): State {
  const initialState: Position[] = [];

  for (let i = 0; i < 8; i++) {
    initialState.push({
      y: i,
      x: Math.floor(Math.random() * 8),
    });
  }

  return initialState as State;
}

function randomQueen(): State {
  const initialState: Position[] = [];

  for (let i = 0; i < 8; i++) {
    while(true) {
      const position = {
        x: Math.floor(Math.random() * 8),
        y: Math.floor(Math.random() * 8),
      };

      if(initialState.some(queen => queen.x === position.x && queen.y === position.y)) {
        continue;
      }
      initialState.push(position);
      break;
    }
  }

  return initialState as State;
}

type Version = {
  id: InitialStateId;
  name: string;
  func: () => State;
};
export const versions: Version[] = [
  {
    id: 'queenInEachRow',
    name: 'One queen in each row at random position',
    func: queenInEachRow,
  },
  {
    id: 'randomQueen',
    name: 'Random distribution of queens',
    func: randomQueen,
  },
];
