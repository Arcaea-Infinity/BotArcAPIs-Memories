"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcplayer.byuserid.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = (userid) => {
    const _sql = 'SELECT * FROM `players` WHERE `uid` == ?';
    syslog_1.default.v(TAG, _sql);
    return DATABASE_ARCPLAYER.get(_sql, [userid]);
};
//# sourceMappingURL=database.arcplayer.byuserid.js.map