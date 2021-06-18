"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'v3/songinfo.ts\t';
const syslog_1 = __importDefault(require("../../modules/syslog/syslog"));
const apierror_1 = __importDefault(require("../../modules/apierror/apierror"));
const database_arcsong_sid_byany_1 = __importDefault(require("../../modules/database/database.arcsong.sid.byany"));
const database_arcsong_bysongid_1 = __importDefault(require("../../modules/database/database.arcsong.bysongid"));
exports.default = (argument) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (typeof argument.songname == 'undefined' || argument.songname == '')
                throw new apierror_1.default(-1, 'invalid songname');
            let _arc_songid = null;
            let _arc_songinfo = null;
            try {
                _arc_songid = yield database_arcsong_sid_byany_1.default(argument.songname);
            }
            catch (e) {
                syslog_1.default.e(TAG, e.stack);
                throw new apierror_1.default(-2, 'this song is not recorded in the database');
            }
            if (_arc_songid.length > 1)
                throw new apierror_1.default(-3, 'too many records');
            _arc_songid = _arc_songid[0];
            try {
                _arc_songinfo = yield database_arcsong_bysongid_1.default(_arc_songid);
            }
            catch (e) {
                syslog_1.default.e(TAG, e.stack);
                throw new apierror_1.default(-4, 'internal error');
            }
            const _return = {
                id: _arc_songinfo.sid,
                title_localized: {
                    en: _arc_songinfo.name_en,
                    ja: _arc_songinfo.name_jp
                },
                artist: _arc_songinfo.artist,
                bpm: _arc_songinfo.bpm,
                bpm_base: _arc_songinfo.bpm_base,
                set: _arc_songinfo.pakset,
                audioTimeSec: _arc_songinfo.time,
                side: _arc_songinfo.side,
                remote_dl: _arc_songinfo.remote_download == 'true' ? true : false,
                world_unlock: _arc_songinfo.world_unlock == 'true' ? true : false,
                date: _arc_songinfo.date,
                difficulties: [
                    {
                        ratingClass: 0,
                        chartDesigner: _arc_songinfo.chart_designer_pst,
                        jacketDesigner: _arc_songinfo.jacket_designer_pst,
                        rating: _arc_songinfo.difficultly_pst,
                        ratingReal: _arc_songinfo.rating_pst,
                        ratingPlus: (_arc_songinfo.difficultly_pst % 2 != 0),
                        totalNotes: _arc_songinfo.notes_pst
                    },
                    {
                        ratingClass: 1,
                        chartDesigner: _arc_songinfo.chart_designer_prs,
                        jacketDesigner: _arc_songinfo.jacket_designer_prs,
                        rating: _arc_songinfo.difficultly_prs,
                        ratingReal: _arc_songinfo.rating_prs,
                        ratingPlus: (_arc_songinfo.difficultly_prs % 2 != 0),
                        totalNotes: _arc_songinfo.notes_prs
                    },
                    {
                        ratingClass: 2,
                        chartDesigner: _arc_songinfo.chart_designer_ftr,
                        jacketDesigner: _arc_songinfo.jacket_designer_ftr,
                        rating: _arc_songinfo.difficultly_ftr,
                        ratingReal: _arc_songinfo.rating_ftr,
                        ratingPlus: (_arc_songinfo.difficultly_ftr % 2 != 0),
                        totalNotes: _arc_songinfo.notes_ftr
                    }
                ]
            };
            if (_arc_songinfo.difficultly_byn != -1) {
                _return.difficulties[3] = {
                    ratingClass: 3,
                    chartDesigner: _arc_songinfo.chart_designer_byn,
                    jacketDesigner: _arc_songinfo.jacket_designer_byn,
                    rating: _arc_songinfo.difficultly_byn,
                    ratingReal: _arc_songinfo.rating_byn,
                    ratingPlus: (_arc_songinfo.difficultly_byn % 2 != 0),
                    totalNotes: _arc_songinfo.notes_byn
                };
            }
            _return.difficulties.map((element) => {
                element.rating = Math.floor(element.rating / 2);
                if (!element.ratingPlus)
                    delete element.ratingPlus;
                return element;
            });
            if (_return.title_localized.ja == '')
                delete _return.title_localized.ja;
            resolve(_return);
        }
        catch (e) {
            if (e instanceof apierror_1.default)
                return reject(e);
            syslog_1.default.e(TAG, e.stack);
            return reject(new apierror_1.default(-233, 'unknown error occurred'));
        }
    }));
};
//# sourceMappingURL=songinfo.js.map