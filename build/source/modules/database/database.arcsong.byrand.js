"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcsong.byrand.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = (start, end) => {
    const _sqlbinding = {
        start: start,
        end: end
    };
    if (end == 0)
        delete _sqlbinding.end;
    const _sql = 'SELECT `sid`, `rating_class` FROM `charts` AS c WHERE ' +
        `${end == 0 ? `c.difficultly==?` : `c.difficultly>=? AND c.difficultly<=?`} ` +
        'ORDER BY RANDOM() LIMIT 1';
    syslog_1.default.v(TAG, _sql);
    return DATABASE_ARCSONG.get(_sql, Object.values(_sqlbinding));
};
//# sourceMappingURL=database.arcsong.byrand.js.map