export class Logger {
  constructor(
    private _enable: boolean,
    public prefix?: any[],
    public suffix?: any[]
  ) {}

  enable() {
    this._enable = true
  }
  disable() {
    this._enable = false
  }
  setPrefix(...args: any[]) {
    this.prefix = args
  }
  setSuffix(...args: any[]) {
    this.suffix = args
  }
  log(...args: any[]) {
    if (this._enable)
      console.log(...(this.prefix ?? []), ...args, ...(this.suffix ?? []))
  }
}
