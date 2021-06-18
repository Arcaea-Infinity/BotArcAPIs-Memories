"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcplayer.update.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = (userinfos) => {
    let _wrapper;
    if (userinfos instanceof Array)
        _wrapper = userinfos;
    else
        _wrapper = [userinfos];
    const _promises = _wrapper.map((element) => {
        const _sqlbinding = {
            uid: element.user_id,
            code: element.code,
            name: element.name,
            ptt: element.rating,
            join_date: element.join_date,
        };
        if (element.rating == -1)
            delete _sqlbinding.ptt;
        const _sql = `INSERT OR REPLACE INTO ` +
            `\`players\`(${Object.keys(_sqlbinding).join()}) ` +
            `VALUES(${new Array(Object.keys(_sqlbinding).length).fill('?').join(',')});`;
        syslog_1.default.v(TAG, _sql);
        return DATABASE_ARCPLAYER.run(_sql, Object.values(_sqlbinding));
    });
    return Promise.all(_promises);
};
//# sourceMappingURL=database.arcplayer.update.js.map