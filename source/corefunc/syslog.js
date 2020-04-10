// filename : others/syslog.js
// author   : CirnoBakaBOT
// date     : 04/10/2020
// comment  : log system

class SystemLog {

  /**
   * Base function for Logx, not recommend using directly.
   * @param {number} level log level
   * @param {string} tag tag for code
   * @param {string} message print somthing
   */
  static log(level, tag, message) {
    const _time = new Date();
    const _time_string =
      `[${_time.getFullYear()}-${_time.getMonth() + 1}-${_time.getDate()} ` +
      `${_time.getHours()}:${_time.getMinutes()}:${_time.getSeconds()}] `;

  }

  /**
  * Log Verbose.
  * @param {string} tag tag for code
  * @param {string} message print somthing
  */
  static logv(tag, message) {
    this.log(0x00, tag, message);
  }

  /**
  * Log Information
  * @param {string} tag tag for code
  * @param {string} message print somthing
  */
  static logi(tag, message) {
    this.log(0x01, tag, message);
  }

  /**
   * Log Warning
   * @param {string} tag tag for code
   * @param {string} message print somthing
   */
  static logo(tag, message) {
    this.log(0x02, tag, message);
  }

  /**
   * Log Warning
   * @param {string} tag tag for code
   * @param {string} message print somthing
   */
  static logw(tag, message) {
    this.log(0x03, tag, message);
  }

  /**
   * Log Error
   * @param {string} tag tag for code
   * @param {string} message print somthing
   */
  static loge(tag, message) {
    this.log(0x04, tag, message);
  }

  /**
   * Log Fatal
   * @param {string} tag tag for code
   * @param {string} message print somthing
   */
  static logf(tag, message) {
    this.log(0x05, tag, message);
  }

}

// this is a hack to load
// object into global space
module.exports.startLog = () => {
  Object.defineProperty(global, syslog, { value: SystemLog, writable: false, configurable: false });
}
