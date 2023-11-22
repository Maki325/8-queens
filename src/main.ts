import Board from "./Board";
import Inputs from "./Inputs";
import './style.css';

const inputs = new Inputs(
  document.getElementById('timestep') as HTMLInputElement,
  document.getElementById('generateBtn') as HTMLInputElement,
  document.getElementById('startBtn') as HTMLInputElement,
);

const canvas = document.getElementById('board')! as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

new Board(
  canvas,
  document.getElementById('status') as HTMLHeadingElement,
  document.getElementById('moreInfo') as HTMLHeadingElement,
  inputs,
);

