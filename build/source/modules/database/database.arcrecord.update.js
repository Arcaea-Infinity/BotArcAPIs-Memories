"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcrecord.update.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = (userid, records) => {
    let _wrapper;
    if (records instanceof Array)
        _wrapper = records;
    else
        _wrapper = [records];
    const _promises = _wrapper.map((element) => {
        const _sqlbinding = {
            uid: userid,
            score: element.score,
            health: element.health,
            rating: Math.floor(element.rating * 10000),
            song_id: element.song_id,
            modifier: element.modifier,
            difficulty: element.difficulty,
            clear_type: element.clear_type,
            best_clear_type: element.best_clear_type,
            time_played: element.time_played,
            near_count: element.near_count,
            miss_count: element.miss_count,
            perfect_count: element.perfect_count,
            shiny_perfect_count: element.shiny_perfect_count,
        };
        const _sql = 'INSERT OR IGNORE INTO ' +
            `\`records\`(${Object.keys(_sqlbinding).join()}) ` +
            `VALUES(${new Array(Object.keys(_sqlbinding).length).fill('?').join(',')});`;
        syslog_1.default.v(TAG, _sql);
        return DATABASE_ARCRECORD.run(_sql, Object.values(_sqlbinding));
    });
    return Promise.all(_promises);
};
//# sourceMappingURL=database.arcrecord.update.js.map