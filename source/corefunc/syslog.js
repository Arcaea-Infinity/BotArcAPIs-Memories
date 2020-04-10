// filename : corefunc/syslog.js
// author   : CirnoBakaBOT
// date     : 04/10/2020
// comment  : log system

const TAG = 'corefunc/syslog.js';
const _color_table = [
  '\x1b[2m\x1b[1m',    // V Dim
  '\x1b[32m\x1b[1m',   // I FgGreen
  '\x1b[33m\x1b[1m',   // W FgYellow
  '\x1b[36m\x1b[1m',   // E FgCyan
  '\x1b[31m\x1b[1m'    // F FgRed
];
const _level_table = ['V', 'I', 'W', 'E', 'F'];
const _internal_log = console.log;

class SystemLog {

  /**
   * Base function for Logx, not recommend using directly.
   * @param {number} level log level
   * @param {string} tag tag for code
   * @param {string} message print somthing
   */
  static log(level, tag, ...message) {
    if (typeof level != 'number' || typeof tag != 'string')
      throw new TypeError('invalid arguments');
    if (level < 0 || level > 5)
      throw new RangeError('invalid loglevel');

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
    _internal_log(`${_color_table[level]}${_time_string} ${_level_table[level]} ${tag}\t${message}`);

    // write to log file, not implemented

  }

  /**
  * Log Verbose
  * @param {string} tag tag for code
  * @param {string} message print somthing
  */
  static logv(tag, ...message) {
    this.log(0x00, tag, message);
  }

  /**
  * Log Information
  * @param {string} tag tag for code
  * @param {string} message print somthing
  */
  static logi(tag, ...message) {
    this.log(0x01, tag, message);
  }

  /**
   * Log Warning
   * @param {string} tag tag for code
   * @param {string} message print somthing
   */
  static logw(tag, ...message) {
    this.log(0x02, tag, message);
  }

  /**
   * Log Error
   * @param {string} tag tag for code
   * @param {string} message print somthing
   */
  static loge(tag, ...message) {
    this.log(0x03, tag, message);
  }

  /**
   * Log Fatal
   * @param {string} tag tag for code
   * @param {string} message print somthing
   */
  static logf(tag, ...message) {
    this.log(0x04, tag, message);
  }

  /**
   * Overriding console
   * @param {number} level
   * @param  {...any} args
   */
  static _console(level, ...args) {
    let _caller_name = !module.parent.filename ?
      'unknwon' : module.parent.filename.split('/').slice(-2).join('/');
    syslog.log(level, _caller_name, args);
  }
}

// this is a hack to load
// objects into global space
module.exports.startLog = () => {
  Object.defineProperty(global, 'syslog',
    { value: SystemLog, writable: false, configurable: false });
  Object.defineProperty(console, 'debug',
    { value: (...args) => { syslog._console(0, args) }, writable: false, configurable: false });
  Object.defineProperty(console, 'info',
    { value: (...args) => { syslog._console(1, args) }, writable: false, configurable: false });
  Object.defineProperty(console, 'log',
    { value: (...args) => { syslog._console(0, args) }, writable: false, configurable: false });
  Object.defineProperty(console, 'warn',
    { value: (...args) => { syslog._console(2, args) }, writable: false, configurable: false });
  Object.defineProperty(console, 'error',
    { value: (...args) => { syslog._console(3, args) }, writable: false, configurable: false });

  syslog.logi(TAG, `System log started.`);
  syslog.logi(TAG, `Welcome to BotArcAPI (｡･∀･)ﾉﾞhi~`);
  syslog.logi(TAG, `Current version is ${BOTARCAPI_VERSTR}`);
  for (let i = 0; i < 5; ++i) {
    syslog.log(i, TAG, `Print something for test.`);
  }
}
