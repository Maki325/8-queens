export default class Inputs {
  private timestepValue = 250;

  constructor(
    private readonly timestepEl: HTMLInputElement,
    public readonly generate: HTMLInputElement,
    public readonly start: HTMLInputElement,
  ) {
    this.timestepEl.addEventListener('change', (e) => {
      const value = (e.target as HTMLInputElement).value;
      this.timestepValue = parseInt(value, 10);
    });
    this.timestepEl.value = this.timestepValue.toString();
  }

  public get timestep() {
    return this.timestepValue;
  }
}
