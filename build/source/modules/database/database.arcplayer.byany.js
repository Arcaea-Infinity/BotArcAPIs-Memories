"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcplayer.byany.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = (user) => {
    const _sql = 'SELECT * FROM `players` WHERE `code` == ? OR `name`== ?';
    syslog_1.default.v(TAG, _sql);
    return DATABASE_ARCPLAYER.all(_sql, [user, user]);
};
//# sourceMappingURL=database.arcplayer.byany.js.map