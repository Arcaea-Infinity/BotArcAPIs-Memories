const TAG: string = 'syslog.ts\t';

class SystemLog {

  private static _internal_log: Function = console.log;
  private static _internal_log_debug: Function = console.debug;
  private static _internal_log_info: Function = console.info;
  private static _internal_log_warn: Function = console.warn;
  private static _internal_log_error: Function = console.error;
  private static _internal_log_assert: Function = console.assert;

  private static _file = require('fs');
  private static _level_table = ['V', 'I', 'W', 'E', 'F'];
  private static _color_table = [
    '\x1b[39m',        // V FgGrey
    '\x1b[32m\x1b[1m', // I FgGreen
    '\x1b[33m\x1b[1m', // W FgYellow
    '\x1b[35m\x1b[1m', // E FgMagenta
    '\x1b[31m\x1b[1m'  // F FgRed
  ];

  public static startLogging() {

    // create folder first
    if (!this._file.existsSync(LOG_PATH))
      this._file.mkdirSync(LOG_PATH);

    // set object to global space
    Object.defineProperty(global, 'syslog',
      { value: SystemLog, writable: false, configurable: false });

    // hack the console output function
    console.log = (...args: Array<any>) => { this._console(0, args) };
    console.debug = (...args: Array<any>) => { this._console(0, args) };
    console.info = (...args: Array<any>) => { this._console(1, args) };
    console.warn = (...args: Array<any>) => { this._console(2, args) };
    console.error = (...args: Array<any>) => { this._console(3, args) };
    console.assert = (...args: Array<any>) => { this._console(4, args) };

    this.i(TAG, `System log started.`);
    this.i(TAG, `Welcome to BotArcAPI (｡･∀･)ﾉﾞhi~`);
    this.i(TAG, `Current version is ${BOTARCAPI_VERSTR}`);
    this.i(TAG, '** Start Service **');
  }

  public static stop(): void {
    // do nothing
  }

  /**
   * base function for logx, pls do not using directly.
   * @param {number} level log level
   * @param {string} tag tag for code
   * @param {Array<any>} message print somthing
   */
  private static log(level: number, tag: string, ...message: Array<any>): void {
    if (level < 0 || level > 5)
      throw new RangeError('invalid loglevel');
    if (level < LOG_LEVEL) return;

    // format date time
    const _time = new Date();
    const _time_string =
      `[${_time.getFullYear()}-` +
      `${String(_time.getMonth() + 1).padStart(2, '0')}-` +
      `${String(_time.getDate()).padStart(2, '0')} ` +
      `${String(_time.getHours()).padStart(2, '0')}:` +
      `${String(_time.getMinutes()).padStart(2, '0')}:` +
      `${String(_time.getSeconds()).padStart(2, '0')}]`;

    // print log string to screen
    const _log_content = `${_time_string} ` +
      `${this._level_table[level]} ${tag}\t${message}`;
    this._internal_log(`${this._color_table[level]}${_log_content}`);

    // write to log file
    const _log_file = LOG_PATH + '/' +
      `${_time.getFullYear()}_` +
      `${String(_time.getMonth() + 1).padStart(2, '0')}_` +
      `${String(_time.getDate()).padStart(2, '0')}.log`;
    this._file.promises.appendFile(_log_file, `${_log_content}\n`, { flag: 'a' });
  }

  /**
  * Log Verbose
  * @param {string} tag tag for code
  * @param {Array<any>} message print somthing
  */
  public static v(tag: string, ...message: Array<any>): void {
    this.log(0, tag, message);
  }

  /**
  * Log Information
  * @param {string} tag tag for code
  * @param {Array<any>} message print somthing
  */
  public static i(tag: string, ...message: Array<any>): void {
    this.log(1, tag, message);
  }

  /**
   * Log Warning
   * @param {string} tag tag for code
   * @param {Array<any>} message print somthing
   */
  public static w(tag: string, ...message: Array<any>): void {
    this.log(2, tag, message);
  }

  /**
   * Log Error
   * @param {string} tag tag for code
   * @param {Array<any>} message print somthing
   */
  public static e(tag: string, ...message: Array<any>): void {
    this.log(3, tag, message);
  }

  /**
   * Log Fatal
   * @param {string} tag tag for code
   * @param {Array<any>} message print somthing
   */
  public static f(tag: string, ...message: Array<any>): void {
    this.log(4, tag, message);
  }

  /**
   * log debug (debug only)
   * @param  {Array<any>} args
   */
  public static d(...args: Array<any>): void {
    this._internal_log(args);
  }

  /**
   * overriding console object
   * @param {number} level
   * @param  {...any} args
   */
  private static _console(level: number, ...args: Array<any>): void {
    this.log(level, 'unknown', args);
  }
}



export default { SystemLog };