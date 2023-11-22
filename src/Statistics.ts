import Inputs from "./Inputs";
import { HillClimbingResult, moveOnlyInRow } from "./hillClimbing";
import { queenInEachRow } from "./initialState";

export default class Statistics {
  private results: HillClimbingResult[] = [];

  constructor(
    private readonly container: HTMLDivElement,
    private readonly status: HTMLHeadingElement,
    private readonly moreInfo: HTMLHeadingElement,

    private readonly numberOfSuccesses: HTMLHeadingElement,
    private readonly numberOfFails: HTMLHeadingElement,
    private readonly percentSuccess: HTMLHeadingElement,
    private readonly averageSidesteps: HTMLHeadingElement,
    private readonly winsWithNoSidesteps: HTMLHeadingElement,

    inputs: Inputs,
  ) {
    this.start = this.start.bind(this);

    inputs.statistics.addEventListener('click', this.start);
  }

  private async wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async start() {
    this.container.setAttribute('data-visible', 'true');

    this.numberOfSuccesses.setAttribute('data-visible', 'false');
    this.numberOfFails.setAttribute('data-visible', 'false');
    this.percentSuccess.setAttribute('data-visible', 'false');
    this.averageSidesteps.setAttribute('data-visible', 'false');
    this.winsWithNoSidesteps.setAttribute('data-visible', 'false');

    this.status.innerText = 'Loading...';
    this.status.style.display = 'initial';
    this.moreInfo.innerText = '0 / 200';
    this.moreInfo.style.display = 'initial';
    this.results = [];

    await this.wait(1);

    for(let i = 0; i < 200; i++) {
      const startState = queenInEachRow();
      const result = moveOnlyInRow({
        startState,
        maxSidemoves: 100,
      });
      this.results.push(result);
      this.moreInfo.innerText = `${i + 1} / 200`;
      await this.wait(1);
    }

    await this.wait(250);
    this.show();
  }

  private show() {
    this.status.style.display = 'none';
    this.moreInfo.style.display = 'none';

    let numberOfSuccesses = 0;
    let numberOfFails = 0;
    let numberOfSidesteps = 0;
    let numberOfWinsWithNoSidesteps = 0;
    for(const result of this.results) {
      if(result.numberOfAttacks === 0) {
        numberOfSuccesses++;
        if(result.sideMoves === 0) {
          numberOfWinsWithNoSidesteps++;
        }
      } else {
        numberOfFails++;
      }
      numberOfSidesteps += result.sideMoves;
    }

    const percentSuccess = numberOfSuccesses / 200 * 100;

    this.numberOfSuccesses.setAttribute('data-visible', 'true');
    this.numberOfFails.setAttribute('data-visible', 'true');
    this.percentSuccess.setAttribute('data-visible', 'true');
    this.averageSidesteps.setAttribute('data-visible', 'true');
    this.winsWithNoSidesteps.setAttribute('data-visible', 'true');

    this.numberOfSuccesses.innerText = `Number of successes: ${numberOfSuccesses}`;
    this.numberOfFails.innerText = `Number of fails: ${numberOfFails}`;
    this.percentSuccess.innerText = `Successes percentage: ${percentSuccess.toFixed(2)}%`;
    this.averageSidesteps.innerText = `Average number of secondary steps: ${(numberOfSidesteps / 200).toFixed(2)} per round`;
    this.winsWithNoSidesteps.innerText = `Number of wins without secondary steps: ${numberOfWinsWithNoSidesteps}`;
  }
}
