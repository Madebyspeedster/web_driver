import colorLogger from 'node-color-log';

// TODO: custom log if needed

export class Logger {
  public info(msg: string | object | number): void {
    return colorLogger.info(this.stringifyMsg(msg));
  }

  public debug(msg: string | object | number): void {
    return colorLogger.debug(this.stringifyMsg(msg));
  }

  public error(msg: string | object | number): void {
    return colorLogger.error(this.stringifyMsg(msg));
  }

  public warn(msg: string | object | number): void {
    return colorLogger.warn(this.stringifyMsg(msg));
  }

  private stringifyMsg(msg: string | object | number): string {
    if (typeof msg === 'string') {
      return msg;
    }
    return JSON.stringify(msg, undefined, 2);
  }
}
