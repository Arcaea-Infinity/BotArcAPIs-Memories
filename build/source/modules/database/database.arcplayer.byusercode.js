"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcplayer.byusercode.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = (usercode) => {
    const _sql = 'SELECT * FROM `players` WHERE `code` == ?';
    syslog_1.default.v(TAG, _sql);
    return DATABASE_ARCPLAYER.get(_sql, [usercode]);
};
//# sourceMappingURL=database.arcplayer.byusercode.js.map