"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcrecord.byuserid.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = (userid, count) => {
    const _sql = 'SELECT * FROM `records` WHERE `uid` == ? ' +
        'ORDER BY `time_played` DESC LIMIT ?';
    syslog_1.default.v(TAG, _sql);
    return DATABASE_ARCRECORD.all(_sql, [userid, count])
        .then((data) => {
        if (!data)
            return null;
        return data.map((element) => {
            element.rating /= 10000;
            return element;
        });
    });
    ;
};
//# sourceMappingURL=database.arcrecord.byuserid.js.map