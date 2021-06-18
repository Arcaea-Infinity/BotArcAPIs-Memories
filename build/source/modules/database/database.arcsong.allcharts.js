"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcsong.allcharts.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = () => {
    const _sql = 'SELECT * FROM `charts` ORDER BY `rating` DESC';
    syslog_1.default.v(TAG, _sql);
    return DATABASE_ARCSONG.all(_sql)
        .then((data) => {
        if (!data)
            return null;
        return data.map((element) => {
            element.rating /= 10;
            return element;
        });
    });
};
//# sourceMappingURL=database.arcsong.allcharts.js.map