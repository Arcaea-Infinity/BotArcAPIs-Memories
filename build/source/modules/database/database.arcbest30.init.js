"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcbest30.init.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = () => {
    const _sql = 'CREATE TABLE IF NOT EXISTS `cache` (' +
        '`uid`          INTEGER NOT NULL,' +
        '`last_played`  INTEGER NOT NULL DEFAULT 0,' +
        '`best30_avg`   INTEGER NOT NULL DEFAULT 0,' +
        '`recent10_avg` INTEGER NOT NULL DEFAULT 0,' +
        '`best30_list`  TEXT DEFAULT "",' +
        '`best30_overflow`  TEXT DEFAULT "",' +
        'PRIMARY KEY (`uid` ASC));';
    syslog_1.default.v(TAG, _sql);
    return DATABASE_ARCBEST30.exec(_sql);
};
//# sourceMappingURL=database.arcbest30.init.js.map