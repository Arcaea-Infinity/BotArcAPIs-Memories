"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'syslog.ts\t';
class SystemLog {
    constructor() { }
    static startLogging() {
        if (!this._file.existsSync(LOG_PATH))
            this._file.mkdirSync(LOG_PATH);
        Object.defineProperty(global, 'syslog', { value: SystemLog, writable: false, configurable: false });
        console.log = (...args) => { this._console(0, args); };
        console.debug = (...args) => { this._console(0, args); };
        console.info = (...args) => { this._console(1, args); };
        console.warn = (...args) => { this._console(2, args); };
        console.error = (...args) => { this._console(3, args); };
        console.assert = (...args) => { this._console(4, args); };
        this.i(TAG, `System log started.`);
        this.i(TAG, `Welcome to BotArcAPI (｡･∀･)ﾉﾞhi~`);
        this.i(TAG, `Current version is ${BOTARCAPI_VERSTR}`);
        this.i(TAG, '** Start Service **');
    }
    static stop() {
    }
    static log(level, tag, ...message) {
        if (level < 0 || level > 5)
            throw new RangeError('invalid loglevel');
        if (level < LOG_LEVEL)
            return;
        const _time = new Date();
        const _time_string = `[${_time.getFullYear()}-` +
            `${String(_time.getMonth() + 1).padStart(2, '0')}-` +
            `${String(_time.getDate()).padStart(2, '0')} ` +
            `${String(_time.getHours()).padStart(2, '0')}:` +
            `${String(_time.getMinutes()).padStart(2, '0')}:` +
            `${String(_time.getSeconds()).padStart(2, '0')}.` +
            `${String(_time.getMilliseconds()).padStart(3, '0')}]`;
        const _log_content = `${_time_string} ` +
            `${this._level_table[level]} ${tag}\t${message}`;
        this._internal_log(`${this._color_table[level]}${_log_content}`);
        const _log_file = LOG_PATH + '/' +
            `${_time.getFullYear()}_` +
            `${String(_time.getMonth() + 1).padStart(2, '0')}_` +
            `${String(_time.getDate()).padStart(2, '0')}.log`;
        this._file.promises.appendFile(_log_file, `${_log_content}\n`, { flag: 'a' });
    }
    static v(tag, ...message) {
        this.log(0, tag, message);
    }
    static i(tag, ...message) {
        this.log(1, tag, message);
    }
    static w(tag, ...message) {
        this.log(2, tag, message);
    }
    static e(tag, ...message) {
        this.log(3, tag, message);
    }
    static f(tag, ...message) {
        this.log(4, tag, message);
    }
    static d(...args) {
        this._internal_log(args);
    }
    static _console(level, ...args) {
        this.log(level, 'unknown\t\t', args);
    }
}
SystemLog._internal_log = console.log;
SystemLog._internal_log_debug = console.debug;
SystemLog._internal_log_info = console.info;
SystemLog._internal_log_warn = console.warn;
SystemLog._internal_log_error = console.error;
SystemLog._internal_log_assert = console.assert;
SystemLog._file = require('fs');
SystemLog._level_table = ['V', 'I', 'W', 'E', 'F'];
SystemLog._color_table = [
    '\x1b[39m',
    '\x1b[32m\x1b[1m',
    '\x1b[33m\x1b[1m',
    '\x1b[35m\x1b[1m',
    '\x1b[31m\x1b[1m'
];
exports.default = SystemLog;
//# sourceMappingURL=syslog.js.map