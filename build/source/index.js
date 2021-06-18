"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'source/index.ts';
const http_1 = __importDefault(require("http"));
const config_1 = __importDefault(require("./corefunc/config"));
const syslog_1 = __importDefault(require("./modules/syslog/syslog"));
const database_1 = __importDefault(require("./corefunc/database"));
const __loader__1 = __importDefault(require("./__loader__"));
(function main() {
    config_1.default.loadConfigs();
    process.title = `${BOTARCAPI_VERSTR}`;
    syslog_1.default.startLogging();
    config_1.default.printConfigs();
    database_1.default.initDataBases();
    const service = http_1.default.createServer(__loader__1.default).listen(SERVER_PORT);
    syslog_1.default.i(`Http server started at 0.0.0.0:${SERVER_PORT}`);
    process.on('exit', (code) => {
        syslog_1.default.i(TAG, '** Stop Service **');
        service.close();
        syslog_1.default.i(TAG, 'Stop http server');
        database_1.default.close();
        syslog_1.default.i(TAG, 'Stop all database access');
        syslog_1.default.i(TAG, 'Stop logging');
        syslog_1.default.stop();
    });
    process.on('SIGINT', () => {
        syslog_1.default.w(`You pressed ctrl + c`);
        process.exit(0);
    });
    process.on('warning', (w) => {
        syslog_1.default.w(`warning => ${w.message}`);
    });
    process.on('uncaughtException', (reason) => {
        var _a, _b;
        syslog_1.default.f(`unhandledRejection => ${(_b = (_a = reason) === null || _a === void 0 ? void 0 : _a.stack) !== null && _b !== void 0 ? _b : 'unknown'}`);
    });
    process.on('unhandledRejection', (reason, promise) => {
        var _a, _b;
        syslog_1.default.f(`unhandledRejection => ${(_b = (_a = reason) === null || _a === void 0 ? void 0 : _a.stack) !== null && _b !== void 0 ? _b : 'unknown'}`);
    });
})();
//# sourceMappingURL=index.js.map