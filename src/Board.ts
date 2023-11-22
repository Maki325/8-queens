import Inputs from "./Inputs";
import { calculateAttacks } from "./common";
import { moveOnlyInRow } from "./hillClimbing";
import { queenInEachRow } from "./initialState";
import type { Move, Position, State } from "./state";

type Color = 'white' | 'black';

const QUEEN_PATH_STRING = "M28.553 4.694c-1.104 0-1.998 0.895-1.998 1.999 0 0.669 0.329 1.26 0.833 1.623l-3.16 4.962c0.673 0.357 1.132 1.064 1.132 1.879 0 1.173-0.951 2.125-2.124 2.125s-2.124-0.951-2.124-2.125c0-1.067 0.786-1.95 1.811-2.102l-2.168-5.088c0.954-0.223 1.665-1.078 1.665-2.1 0-1.191-0.965-2.157-2.156-2.157s-2.156 0.966-2.156 2.157c0 0.923 0.58 1.711 1.396 2.019l-2.777 4.737c0.912 0.282 1.574 1.132 1.574 2.137 0 1.235-1.001 2.237-2.236 2.237s-2.236-1.001-2.236-2.237c0-0.946 0.587-1.754 1.416-2.081l-2.755-4.785c0.826-0.302 1.416-1.095 1.416-2.027 0-1.191-0.965-2.157-2.156-2.157s-2.156 0.966-2.156 2.157c0 1.003 0.685 1.847 1.613 2.088l-2.204 5.112c0.99 0.181 1.74 1.047 1.74 2.090 0 1.173-0.951 2.125-2.124 2.125s-2.124-0.951-2.124-2.125c0-0.834 0.481-1.556 1.18-1.904l-3.17-4.943c0.5-0.363 0.825-0.952 0.825-1.617 0-1.104-0.895-1.999-1.998-1.999s-1.998 0.895-1.998 1.999 0.895 1.999 1.998 1.999c0.046 0 0.092-0.002 0.138-0.005l2.826 15.312c-1.712 0.045-1.717 2.507 0.048 2.507h0.415l0.004 0.020h18.364l0.004-0.020h0.475c1.718 0 1.749-2.508 0-2.508h-0.013l2.826-15.311c0.045 0.003 0.091 0.005 0.137 0.005 1.104 0 1.998-0.895 1.998-1.999s-0.895-1.999-1.998-1.999z";
const QUEEN_PATH = new Path2D(QUEEN_PATH_STRING);


export default class Board {
  public ctx: CanvasRenderingContext2D;

  private state: State = queenInEachRow();
  private moves: Move[] = [];

  private moveIndex = 0;
  private drawId = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly status: HTMLHeadingElement,
    private readonly moreInfo: HTMLHeadingElement,
    private inputs: Inputs,
  ) {
    this.ctx = this.canvas.getContext('2d')!;

    this.regenerateBoard = this.regenerateBoard.bind(this);
    this.start = this.start.bind(this);
    this.draw = this.draw.bind(this);
    this.initBoard = this.initBoard.bind(this);
    this.getSquareColor = this.getSquareColor.bind(this);

    this.regenerateBoard();

    this.inputs.generate.addEventListener('click', this.regenerateBoard);
    this.inputs.start.addEventListener('click', this.start);
  }

  private initBoard() {
    let color: Color = 'white';
    for(let y = 0; y < 8; y++) {
      for(let x = 0; x < 8; x++) {
        const startX = x * 64;
        const startY = y * 64;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(startX, startY, 64, 64);
        color = color === 'white' ? 'black' : 'white';
      }
      color = color === 'white' ? 'black' : 'white';
    }
  }

  private getSquareColor({x, y}: Position): Color {
    const evenRow = y % 2 === 0;
    const color = x % 2 === 0 ? evenRow ? 'white' : 'black' : evenRow ? 'black' : 'white';

    return color;
  }

  private getPieceColor({x, y}: Position): Color {
    const evenRow = y % 2 === 0;
    const color = x % 2 === 0 ? evenRow ? 'black' : 'white' : evenRow ? 'white' : 'black';

    return color;
  }

  private addQueen({x, y}: Position) {
    const {ctx} = this;

    const startX = x * 64;
    const startY = y * 64;

    ctx.translate(startX, startY);
    ctx.scale(2, 2);
    ctx.strokeStyle = this.getPieceColor({x, y});
    ctx.stroke(QUEEN_PATH);
    ctx.scale(0.5, 0.5);
    ctx.translate(-startX, -startY);
  }

  private regenerateBoard() {
    this.drawId++;
    this.initBoard();
    this.state = queenInEachRow();

    for(const queen of this.state) {
      this.addQueen(queen);
    }
    this.status.innerText = 'Generated';
    this.moreInfo.innerText = '';
  }

  private start() {
    this.drawId += 1;
    this.moveIndex = 0;
    this.moves = moveOnlyInRow({
      startState: this.state,
      maxSidemoves: 100,
    }).moves;

    this.status.innerText = 'In progress';
    this.draw(this.drawId);
  }

  private async draw(drawId: number) {
    if(drawId !== this.drawId) {
      return;
    }
    const move = this.moves[this.moveIndex++];
    if(move) {
      const queen = this.state.findIndex(queen => queen.y === move.oldPosition.y && queen.x === move.oldPosition.x);
      this.state[queen] = move.newPosition;

      await this.animate(drawId, move.oldPosition, move.newPosition);
    }

    if(this.moveIndex < this.moves.length) {
      setTimeout(() => this.draw(drawId), this.inputs.timestep);
    } else {
      const attacks = calculateAttacks(this.state);

      this.initBoard();
      for(const queen of this.state) {
        this.addQueen(queen);
      }

      if(attacks === 0) {
        this.status.innerText = `Successful`;
      } else {
        this.status.innerText = `Unsuccessful`;
        this.moreInfo.innerText = `Attacks left: ${calculateAttacks(this.state)}`;
      }
    }
  }

  private async wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async animate(drawId: number, from: Position, to: Position) {
    const {ctx} = this;

    const waitTime = 10;
    const numberOfSteps = this.inputs.timestep / waitTime;
    const movePerTick = -(from.x - to.x) / numberOfSteps * 64;

    let x = from.x * 64;
    const startY = from.y * 64;
    for(let i = 0;i < numberOfSteps;i++) {
      const squareX = Math.floor(x / 64);

      const color = this.getSquareColor({x: squareX, y: from.y});
      this.ctx.fillStyle = color;
      this.ctx.fillRect(squareX * 64, from.y * 64, 64, 64);

      if(from.x % 64 !== 0) {
        const color = this.getSquareColor({x: (squareX + 1), y: from.y});
        this.ctx.fillStyle = color;
        this.ctx.fillRect((squareX + 1) * 64, from.y * 64, 64, 64);
      }

      x += movePerTick;

      ctx.translate(x, startY);
      ctx.scale(2, 2);
      ctx.strokeStyle = 'red';
      ctx.stroke(QUEEN_PATH);
      ctx.scale(0.5, 0.5);
      ctx.translate(-x, -startY);

      await this.wait(waitTime);
      if(drawId !== this.drawId) {
        return;
      }
    }

    if(to.x !== 0) {
      const color = this.getSquareColor({x: (to.x - 1), y: from.y});
      this.ctx.fillStyle = color;
      this.ctx.fillRect((to.x - 1) * 64, to.y * 64, 64, 64);
      this.addQueen(to);
    }
    {
      const color = this.getSquareColor({x: to.x, y: from.y});
      this.ctx.fillStyle = color;
      this.ctx.fillRect(to.x * 64, to.y * 64, 64, 64);
      this.addQueen(to);
    }
    if(to.x !== 7) {
      const color = this.getSquareColor({x: (to.x + 1), y: from.y});
      this.ctx.fillStyle = color;
      this.ctx.fillRect((to.x + 1) * 64, to.y * 64, 64, 64);
      this.addQueen(to);
    }
  }
}
