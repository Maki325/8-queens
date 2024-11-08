export type Position = {
  x: number;
  y: number;
};

// List of positions for each queen
export type State = [Position, Position, Position, Position, Position, Position, Position, Position];

export type Move = {
  queenIndex: number;
  oldPosition: Position;
  newPosition: Position;
  isSideMove: boolean;
};
