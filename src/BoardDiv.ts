import Inputs from "./Inputs";
import { calculateAttacks } from "./common";
import { moveOnlyInRow } from "./hillClimbing";
import { queenInEachRow } from "./initialState";
import type { Move, Position, State } from "./state";

type Color = 'white' | 'black';
class Square {
  constructor(public readonly el: HTMLDivElement, public readonly color: Color) {}
}

export default class Board {
  private board: Square[] = [];
  private queens: Position[] = [];
  private state: State = queenInEachRow();
  private moves: Move[] = [];

  private moveIndex = 0;
  private drawId = 0;

  constructor(private readonly boardEl: HTMLDivElement, private inputs: Inputs) {
    this.regenerateBoard = this.regenerateBoard.bind(this);
    this.start = this.start.bind(this);
    this.draw = this.draw.bind(this);

    this.initBoard();
    this.regenerateBoard();

    this.inputs.generate.addEventListener('click', this.regenerateBoard);
    this.inputs.start.addEventListener('click', this.start);
  }

  private initBoard() {
    let color: Color = 'white';
    for(let y = 0; y < 8; y++) {
      const row = document.createElement('div');
      row.classList.add('row');
      for(let x = 0; x < 8; x++) {
        const square = document.createElement('div');
        square.classList.add('square');
        row.appendChild(square);
        this.board.push({
          el: square,
          color,
        });
        color = color === 'white' ? 'black' : 'white';
      }
      color = color === 'white' ? 'black' : 'white';
      this.boardEl.appendChild(row);
    }
  }

  private addQueen(square: Square) {
    const queen = document.createElement('img');
    queen.classList.add('queen');
    queen.src = square.color === 'white' ? '/queen.svg' : '/queen-white.svg';
    square.el.append(queen);
  }

  private regenerateBoard() {
    this.state = queenInEachRow();
    this.queens.forEach((queen) => this.board[queen.y * 8 + queen.x].el.innerHTML = '');
    this.queens = [];
    for(const queen of this.state) {
      this.queens.push(queen);
      this.addQueen(this.board[queen.y * 8 + queen.x]);
    }
  }

  private start() {
    this.drawId += 1;
    this.moveIndex = 0;
    this.moves = moveOnlyInRow({
      startState: this.state,
      maxSidemoves: 5,
    }).moves;
    this.draw(this.drawId);
  }

  private draw(drawId: number) {
    if(drawId !== this.drawId) {
      return;
    }
    const move = this.moves[this.moveIndex++];
    console.log('move', move);
    if(move) {
      const oldSquare = this.board[move.oldPosition.y * 8 + move.oldPosition.x];
      const newSquare = this.board[move.newPosition.y * 8 + move.newPosition.x];
      oldSquare.el.innerText = '';
      newSquare.el.innerText = '';
      this.addQueen(newSquare);
    }
    if(this.moveIndex < this.moves.length) {
      setTimeout(() => this.draw(drawId), this.inputs.timestep);
    }
  }
}
