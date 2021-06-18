"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcplayer.init.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = () => {
    const _sql = 'CREATE TABLE IF NOT EXISTS `players` (' +
        '`uid`  INTEGER NOT NULL,' +
        '`code` TEXT NOT NULL,' +
        '`name` TEXT NOT NULL,' +
        '`ptt`  INTEGER DEFAULT -1,' +
        '`join_date` INTEGER NOT NULL,' +
        'PRIMARY KEY (`uid` ASC));';
    syslog_1.default.v(TAG, _sql);
    return DATABASE_ARCPLAYER.exec(_sql);
};
//# sourceMappingURL=database.arcplayer.init.js.map