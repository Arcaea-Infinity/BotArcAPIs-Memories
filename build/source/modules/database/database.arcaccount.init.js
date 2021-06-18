"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcaccount.init.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = () => {
    const _sql = 'CREATE TABLE IF NOT EXISTS `accounts` (' +
        '`name`   TEXT NOT NULL,' +
        '`passwd` TEXT NOT NULL,' +
        '`device` TEXT NOT NULL DEFAULT (LOWER(HEX(RANDOMBLOB(8)))),' +
        '`uid`    INTEGER NOT NULL DEFAULT 0,' +
        '`ucode`  TEXT NOT NULL DEFAULT "", ' +
        '`token`  TEXT NOT NULL DEFAULT "",' +
        '`banned` TEXT NOT NULL DEFAULT "false" CHECK(`banned` IN("true", "false")),' +
        'PRIMARY KEY (`name` ASC));';
    syslog_1.default.v(TAG, _sql);
    return DATABASE_ARCACCOUNT.exec(_sql);
};
//# sourceMappingURL=database.arcaccount.init.js.map