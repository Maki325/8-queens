import Board from "./Board";
import Inputs from "./Inputs";
import Statistics from "./Statistics";
import './style.css';

const inputs = new Inputs(
  document.getElementById('timestep') as HTMLInputElement,
  document.getElementById('generateBtn') as HTMLInputElement,
  document.getElementById('startBtn') as HTMLInputElement,
  document.getElementById('statisticsBtn') as HTMLInputElement,
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

new Statistics(
  document.getElementById('statisticsContainer') as HTMLDivElement,
  document.getElementById('statisticsStatus') as HTMLHeadingElement,
  document.getElementById('statisticsMoreInfo') as HTMLHeadingElement,
  
  document.getElementById('statisticsNumberOfSuccesses') as HTMLHeadingElement,
  document.getElementById('statisticsNumberOfFails') as HTMLHeadingElement,
  document.getElementById('statisticsPercentSuccess') as HTMLHeadingElement,
  document.getElementById('statisticsAverageSidesteps') as HTMLHeadingElement,
  document.getElementById('statisticsWinsWithNoSidesteps') as HTMLHeadingElement,

  inputs,
);
