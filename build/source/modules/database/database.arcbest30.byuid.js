"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcbest30.byuid.ts';
const abab_1 = require("abab");
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = (userid) => {
    const _sql = 'SELECT * FROM `cache` WHERE `uid` == ?';
    syslog_1.default.v(TAG, _sql);
    return DATABASE_ARCBEST30.get(_sql, [userid])
        .then((data) => {
        var _a, _b;
        return data ? {
            last_played: data.last_played,
            best30_avg: data.best30_avg / 10000,
            recent10_avg: data.recent10_avg / 10000,
            best30_list: JSON.parse((_a = abab_1.atob(data.best30_list)) !== null && _a !== void 0 ? _a : '[]'),
            best30_overflow: JSON.parse((_b = abab_1.atob(data.best30_overflow)) !== null && _b !== void 0 ? _b : '[]')
        } : null;
    });
};
//# sourceMappingURL=database.arcbest30.byuid.js.map