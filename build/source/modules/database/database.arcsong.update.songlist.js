"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'database.arcsong.update.songlist.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = (songlist) => {
    return Promise.resolve()
        .then(() => {
        const _promises = songlist.songs.map((element) => {
            var _a, _b, _c, _d, _e, _f;
            const _sqlbinding = {
                sid: element.id,
                name_en: element.title_localized.en,
                name_jp: (_a = element.title_localized.ja) !== null && _a !== void 0 ? _a : '',
                bpm: element.bpm,
                bpm_base: element.bpm_base,
                pakset: element.set,
                artist: element.artist,
                side: element.side,
                date: element.date,
                version: (_b = element.version) !== null && _b !== void 0 ? _b : '',
                world_unlock: element.world_unlock == true ? 'true' : 'false',
                remote_download: element.remote_dl == true ? 'true' : 'false',
                difficultly_pst: element.difficulties[0].rating * 2,
                difficultly_prs: element.difficulties[1].rating * 2,
                difficultly_ftr: element.difficulties[2].rating * 2,
                difficultly_byn: element.difficulties[3] ? element.difficulties[3].rating * 2 : -1,
                chart_designer_pst: element.difficulties[0].chartDesigner,
                chart_designer_prs: element.difficulties[1].chartDesigner,
                chart_designer_ftr: element.difficulties[2].chartDesigner,
                chart_designer_byn: element.difficulties[3] ? element.difficulties[3].chartDesigner : '',
                jacket_designer_pst: element.difficulties[0].jacketDesigner,
                jacket_designer_prs: element.difficulties[1].jacketDesigner,
                jacket_designer_ftr: element.difficulties[2].jacketDesigner,
                jacket_designer_byn: element.difficulties[3] ? element.difficulties[3].jacketDesigner : '',
                jacket_override_pst: element.difficulties[0].jacketOverride == true ? 'true' : 'false',
                jacket_override_prs: element.difficulties[1].jacketOverride == true ? 'true' : 'false',
                jacket_override_ftr: element.difficulties[2].jacketOverride == true ? 'true' : 'false',
                jacket_override_byn: (element.difficulties[3] && element.difficulties[3].jacketOverride == true) ? 'true' : 'false',
            };
            if (((_c = element.difficulties[0]) === null || _c === void 0 ? void 0 : _c.ratingPlus) == true)
                ++_sqlbinding.difficultly_pst;
            if (((_d = element.difficulties[1]) === null || _d === void 0 ? void 0 : _d.ratingPlus) == true)
                ++_sqlbinding.difficultly_prs;
            if (((_e = element.difficulties[2]) === null || _e === void 0 ? void 0 : _e.ratingPlus) == true)
                ++_sqlbinding.difficultly_ftr;
            if (((_f = element.difficulties[3]) === null || _f === void 0 ? void 0 : _f.ratingPlus) == true)
                ++_sqlbinding.difficultly_byn;
            const _binding_keys = Object.keys(_sqlbinding).join();
            const _binding_vals = new Array(Object.keys(_sqlbinding).length).fill('?').join(',');
            const _binding_conflicts = (() => {
                let _array = [];
                Object.keys(_sqlbinding).forEach((v, i) => {
                    if (v != 'sid')
                        _array.push(`${v} = excluded.${v}`);
                });
                return _array.join(', ');
            })();
            const _sql = 'INSERT INTO ' +
                `\`songs\`(${_binding_keys}) VALUES(${_binding_vals})` +
                `ON CONFLICT(\`sid\`) DO UPDATE SET ${_binding_conflicts}`;
            syslog_1.default.v(TAG, _sql);
            return DATABASE_ARCSONG.run(_sql, Object.values(_sqlbinding));
        });
        return Promise.all(_promises);
    })
        .then(() => {
        const _sql = 'DELETE FROM `charts`; ' +
            'INSERT INTO `charts` (`sid`, `rating_class`, `difficultly`, `rating`) ' +
            '  SELECT `sid`, 0, `difficultly_pst`, `rating_pst` FROM `songs`; ' +
            'INSERT INTO `charts` (`sid`, `rating_class`, `difficultly`, `rating`) ' +
            '  SELECT `sid`, 1, `difficultly_prs`, `rating_prs` FROM `songs`; ' +
            'INSERT INTO `charts` (`sid`, `rating_class`, `difficultly`, `rating`) ' +
            '  SELECT `sid`, 2, `difficultly_ftr`, `rating_ftr` FROM `songs`; ' +
            'INSERT OR IGNORE INTO `charts` (`sid`, `rating_class`, `difficultly`, `rating`) ' +
            '  SELECT `sid`, 3, `difficultly_byn`, `rating_byn` FROM `songs`;';
        syslog_1.default.v(TAG, _sql);
        return DATABASE_ARCSONG.exec(_sql);
    });
};
//# sourceMappingURL=database.arcsong.update.songlist.js.map