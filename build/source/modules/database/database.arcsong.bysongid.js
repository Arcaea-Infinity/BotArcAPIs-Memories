"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcsong.bysongid.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = (songid) => {
    const _sql = 'SELECT * FROM `songs` WHERE `sid` == ?';
    syslog_1.default.v(TAG, _sql);
    return DATABASE_ARCSONG.get(_sql, [songid])
        .then((data) => {
        if (!data)
            return null;
        data.rating_pst /= 10;
        data.rating_prs /= 10;
        data.rating_ftr /= 10;
        if (data.rating_byn != -1)
            data.rating_byn /= 10;
        return data;
    });
};
//# sourceMappingURL=database.arcsong.bysongid.js.map