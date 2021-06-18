"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcaccount.all.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = () => {
    const _sql = 'SELECT * FROM `accounts` WHERE `banned` == "false"';
    syslog_1.default.v(TAG, _sql);
    return DATABASE_ARCACCOUNT.all(_sql)
        .then((data) => {
        if (!data)
            return null;
        return data.map((element) => {
            element.banned = element.banned == 'true' ? true : false;
            return element;
        });
    });
};
//# sourceMappingURL=database.arcaccount.all.js.map