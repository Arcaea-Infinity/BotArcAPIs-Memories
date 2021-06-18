"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcsong.init.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = () => {
    return Promise.resolve()
        .then(() => {
        const _sql = 'CREATE TABLE IF NOT EXISTS `songs` (' +
            '`sid`       TEXT NOT NULL,' +
            '`name_en`  TEXT NOT NULL,' +
            '`name_jp`  TEXT NOT NULL DEFAULT "",' +
            '`bpm`      TEXT NOT NULL DEFAULT "",' +
            '`bpm_base` INTEGER NOT NULL DEFAULT 0,' +
            '`pakset`    TEXT NOT NULL DEFAULT "",' +
            '`artist` TEXT NOT NULL DEFAULT "",' +
            '`time`   INTEGER NOT NULL DEFAULT 0,' +
            '`side`   INTEGER NOT NULL CHECK(`side` IN(0, 1)) DEFAULT 0,' +
            '`date`   INTEGER NOT NULL DEFAULT 0,' +
            '`version`   TEXT NOT NULL DEFAULT "",' +
            '`world_unlock`     TEXT NOT NULL CHECK(`world_unlock` IN("true", "false")) DEFAULT "false",' +
            '`remote_download`  TEXT NOT NULL CHECK(`remote_download` IN("true", "false")) DEFAULT "false",' +
            '`rating_pst` INTEGER NOT NULL DEFAULT 0,' +
            '`rating_prs` INTEGER NOT NULL DEFAULT 0,' +
            '`rating_ftr` INTEGER NOT NULL DEFAULT 0,' +
            '`rating_byn` INTEGER NOT NULL DEFAULT 0,' +
            '`difficultly_pst` INTEGER NOT NULL DEFAULT 0,' +
            '`difficultly_prs` INTEGER NOT NULL DEFAULT 0,' +
            '`difficultly_ftr` INTEGER NOT NULL DEFAULT 0,' +
            '`difficultly_byn` INTEGER NOT NULL DEFAULT 0,' +
            '`notes_pst` INTEGER NOT NULL DEFAULT 0, ' +
            '`notes_prs` INTEGER NOT NULL DEFAULT 0, ' +
            '`notes_ftr` INTEGER NOT NULL DEFAULT 0, ' +
            '`notes_byn` INTEGER NOT NULL DEFAULT 0, ' +
            '`chart_designer_pst` TEXT NOT NULL DEFAULT "",' +
            '`chart_designer_prs` TEXT NOT NULL DEFAULT "",' +
            '`chart_designer_ftr` TEXT NOT NULL DEFAULT "",' +
            '`chart_designer_byn` TEXT NOT NULL DEFAULT "",' +
            '`jacket_designer_pst` TEXT NOT NULL DEFAULT "",' +
            '`jacket_designer_prs` TEXT NOT NULL DEFAULT "",' +
            '`jacket_designer_ftr` TEXT NOT NULL DEFAULT "",' +
            '`jacket_designer_byn` TEXT NOT NULL DEFAULT "",' +
            '`jacket_override_pst` TEXT NOT NULL CHECK(`jacket_override_pst` IN("true", "false")) DEFAULT "false",' +
            '`jacket_override_prs` TEXT NOT NULL CHECK(`jacket_override_prs` IN("true", "false")) DEFAULT "false",' +
            '`jacket_override_ftr` TEXT NOT NULL CHECK(`jacket_override_ftr` IN("true", "false")) DEFAULT "false",' +
            '`jacket_override_byn` TEXT NOT NULL CHECK(`jacket_override_byn` IN("true", "false")) DEFAULT "false",' +
            'PRIMARY KEY ("sid" ASC))';
        syslog_1.default.v(TAG, _sql);
        return DATABASE_ARCSONG.exec(_sql);
    })
        .then(() => {
        const _sql = 'CREATE TABLE IF NOT EXISTS `alias` (' +
            '`sid`    TEXT NOT NULL,' +
            '`alias`  TEXT NOT NULL,' +
            'PRIMARY KEY(`sid` ASC, `alias` ASC), ' +
            'FOREIGN KEY(`sid`) REFERENCES `songs`(`sid`))';
        syslog_1.default.v(TAG, _sql);
        return DATABASE_ARCSONG.exec(_sql);
    })
        .then(() => {
        const _sql = 'CREATE TABLE IF NOT EXISTS `charts` (' +
            '`sid`          TEXT NOT NULL,' +
            '`rating_class` INTEGER NOT NULL CHECK(`rating_class` IN (0, 1, 2, 3)),' +
            '`difficultly`  INTEGER NOT NULL CHECK(`difficultly` != -1),' +
            '`rating`       INTEGER NOT NULL CHECK(`rating` != -1),' +
            'FOREIGN KEY(`sid`) REFERENCES `songs`(`sid`))';
        syslog_1.default.v(TAG, _sql);
        return DATABASE_ARCSONG.exec(_sql);
    });
};
//# sourceMappingURL=database.arcsong.init.js.map