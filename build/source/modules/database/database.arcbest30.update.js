"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcbest30.update.ts';
const abab_1 = require("abab");
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = (userid, best30) => {
    var _a, _b;
    const _sqlbinding = {
        uid: userid,
        last_played: best30.last_played,
        best30_avg: Math.floor(best30.best30_avg * 10000),
        recent10_avg: Math.floor(best30.recent10_avg * 10000),
        best30_list: best30.best30_list ? ((_a = abab_1.btoa(JSON.stringify(best30.best30_list))) !== null && _a !== void 0 ? _a : 'W10=') : 'W10=',
        best30_overflow: best30.best30_overflow ? ((_b = abab_1.btoa(JSON.stringify(best30.best30_overflow))) !== null && _b !== void 0 ? _b : 'W10=') : 'W10=',
    };
    const _sql = 'INSERT OR REPLACE INTO ' +
        `\`cache\`(${Object.keys(_sqlbinding).join()}) ` +
        `VALUES(${new Array(Object.keys(_sqlbinding).length).fill('?').join(',')});`;
    syslog_1.default.v(TAG, _sql);
    return DATABASE_ARCBEST30.run(_sql, Object.values(_sqlbinding));
};
//# sourceMappingURL=database.arcbest30.update.js.map