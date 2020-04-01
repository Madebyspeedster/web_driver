// implementations for these are in config/custom-commands.ts

declare namespace WebdriverIO {
  // adding command to `browser`
  export interface Browser {
    multiClick(selector: string, all?: boolean, optional?: boolean): boolean;
  }

  // adding command to `element`
  export interface Element {
    waitAndClick(
      condition: string,
      delay?: number,
      optional?: boolean
    ): boolean;
  }
}
