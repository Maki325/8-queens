import type { Position, State } from "./state";

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
