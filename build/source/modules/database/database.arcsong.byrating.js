"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcsong.byrating.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = (rating_start, rating_end) => {
    rating_start *= 10;
    rating_end = !rating_end ? rating_start : rating_end * 10;
    const _sql = 'SELECT * FROM `charts` WHERE `rating` >= ? AND `rating` <= ? ORDER BY `rating` ASC';
    syslog_1.default.v(TAG, _sql);
    return DATABASE_ARCSONG.all(_sql, [rating_start, rating_end]);
};
//# sourceMappingURL=database.arcsong.byrating.js.map