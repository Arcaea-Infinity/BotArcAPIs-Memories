"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcsong.alias.byid.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = (songid) => {
    const _sql = 'SELECT * FROM `alias` WHERE `sid` == ?';
    syslog_1.default.v(TAG, _sql);
    return DATABASE_ARCSONG.all(_sql, [songid]);
};
//# sourceMappingURL=database.arcsong.alias.byid.js.map