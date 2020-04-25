// filename : corefunc/syslog.js
// author   : TheSnowfield
// date     : 04/10/2020
// comment  : log system

const TAG = 'corefunc/syslog.js';

const path = require('path');
const file = require('fs');

const _level_table = ['V', 'I', 'W', 'E', 'F'];
const _color_table = [
  '\x1b[39m',        // V FgGrey
  '\x1b[32m\x1b[1m', // I FgGreen
  '\x1b[33m\x1b[1m', // W FgYellow
  '\x1b[35m\x1b[1m', // E FgMagenta
  '\x1b[31m\x1b[1m'  // F FgRed
];

class SystemLog {

  static _internal_log = console.log;
  static _internal_log_debug = console.debug;
  static _internal_log_info = console.info;
  static _internal_log_warn = console.warn;
  static _internal_log_error = console.error;
  static _internal_log_assert = console.assert;

  /**
   * Base function for Logx, using directly is not recommend.
   * @param {number} level log level
   * @param {string} tag tag for code
   * @param {string} message print somthing
   */
  static log(level, tag, ...message) {
    if (typeof level != 'number' || typeof tag != 'string')
      throw new TypeError('invalid arguments');
    if (level < 0 || level > 5)
      throw new RangeError('invalid loglevel');
    if (level < LOG_LEVEL)
      return;

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
      `${_level_table[level]} ${tag}\t${message}`;
    this._internal_log(`${_color_table[level]}${_log_content}`);

    // write to log file
    const _log_file = LOG_PATH +
      `${_time.getFullYear()}_` +
      `${String(_time.getMonth() + 1).padStart(2, '0')}_` +
      `${String(_time.getDate()).padStart(2, '0')}.log`;
    file.promises.appendFile(_log_file, `${_log_content}\n`, { flag: 'a' })
  }

  /**
  * Log Verbose
  * @param {string} tag tag for code
  * @param {string} message print somthing
  */
  static v(tag, ...message) {
    this.log(0, tag, message);
  }

  /**
  * Log Information
  * @param {string} tag tag for code
  * @param {string} message print somthing
  */
  static i(tag, ...message) {
    this.log(1, tag, message);
  }

  /**
   * Log Warning
   * @param {string} tag tag for code
   * @param {string} message print somthing
   */
  static w(tag, ...message) {
    this.log(2, tag, message);
  }

  /**
   * Log Error
   * @param {string} tag tag for code
   * @param {string} message print somthing
   */
  static e(tag, ...message) {
    this.log(3, tag, message);
  }

  /**
   * Log Fatal
   * @param {string} tag tag for code
   * @param {string} message print somthing
   */
  static f(tag, ...message) {
    this.log(4, tag, message);
  }

  /**
   * Log Debug (debug only)
   * @param  {...any} args
   */
  static d(...args) {
    this._internal_log(args);
  }

  /**
   * Overriding console object
   * @param {number} level
   * @param  {...any} args
   */
  static _console(level, ...args) {
    let _caller_name = !module.parent.filename ?
      'unknown' : module.parent.filename.replace(/\\/g, '/').split('/').slice(-2).join('/');
    this.log(level, _caller_name, args);
  }
}

const startLogging = () => {

  // create folder first
  const _path_to_savelog = path.resolve(__dirname, LOG_PATH);
  const _first_run = !file.existsSync(_path_to_savelog);
  if (_first_run)
    file.mkdirSync(_path_to_savelog);

  // map object to global space
  Object.defineProperty(global, 'syslog',
    { value: SystemLog, writable: false, configurable: false });
  Object.defineProperty(console, 'log',
    { value: (...args) => { syslog._console(0, args) }, writable: false, configurable: false });
  Object.defineProperty(console, 'debug',
    { value: (...args) => { syslog._console(0, args) }, writable: false, configurable: false });
  Object.defineProperty(console, 'info',
    { value: (...args) => { syslog._console(1, args) }, writable: false, configurable: false });
  Object.defineProperty(console, 'warn',
    { value: (...args) => { syslog._console(2, args) }, writable: false, configurable: false });
  Object.defineProperty(console, 'error',
    { value: (...args) => { syslog._console(3, args) }, writable: false, configurable: false });
  Object.defineProperty(console, 'assert',
    { value: (...args) => { syslog._console(4, args) }, writable: false, configurable: false });

  syslog.i(TAG, `System log started.`);
  syslog.i(TAG, `Welcome to BotArcAPI (｡･∀･)ﾉﾞhi~`);
  syslog.i(TAG, `Current version is ${BOTARCAPI_VERSTR}`);
  syslog.i(TAG, '** Start Service **');
}

const stop = () => {
  // do nothing
}

module.exports.stop = stop;
module.exports.startLogging = startLogging;
