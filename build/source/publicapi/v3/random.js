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
const TAG = 'v3/random.ts\t';
const syslog_1 = __importDefault(require("../../modules/syslog/syslog"));
const apierror_1 = __importDefault(require("../../modules/apierror/apierror"));
const database_arcsong_byrand_1 = __importDefault(require("../../modules/database/database.arcsong.byrand"));
const database_arcsong_bysongid_1 = __importDefault(require("../../modules/database/database.arcsong.bysongid"));
exports.default = (argument) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            argument.start = parseInt(argument.start);
            if (isNaN(argument.start))
                argument.start = 0;
            argument.end = parseInt(argument.end);
            if (isNaN(argument.end))
                argument.end = 0;
            if (argument.start == 0 && argument.end == 0) {
                argument.start = 2;
                argument.end = 23;
            }
            if (argument.start < 2 || argument.start > 23)
                throw new apierror_1.default(-1, 'invalid range of start');
            if (argument.end != 0 && (argument.end < argument.start || argument.end > 23))
                throw new apierror_1.default(-2, 'invalid range of end');
            let _arc_song = null;
            let _arc_songinfo = {};
            let _return = {};
            try {
                _arc_song = yield database_arcsong_byrand_1.default(argument.start, argument.end);
                _return.id = _arc_song.sid;
                _return.rating_class = _arc_song.rating_class;
            }
            catch (e) {
                throw new apierror_1.default(-3, 'internal error');
            }
            if (argument.info == 'true') {
                try {
                    _arc_songinfo = yield database_arcsong_bysongid_1.default(_arc_song.sid);
                    _return.song_info = {
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
                        _return.song_info.difficulties[3] = {
                            ratingClass: 3,
                            chartDesigner: _arc_songinfo.chart_designer_byn,
                            jacketDesigner: _arc_songinfo.jacket_designer_byn,
                            rating: _arc_songinfo.difficultly_byn,
                            ratingReal: _arc_songinfo.rating_byn,
                            ratingPlus: (_arc_songinfo.difficultly_byn % 2 != 0),
                            totalNotes: _arc_songinfo.notes_byn
                        };
                    }
                    _return.song_info.difficulties.map((element) => {
                        element.rating = Math.floor(element.rating / 2);
                        if (!element.ratingPlus)
                            delete element.ratingPlus;
                        return element;
                    });
                    if (_return.song_info.title_localized.ja == '')
                        delete _return.song_info.title_localized.ja;
                }
                catch (e) {
                    throw new apierror_1.default(-4, 'internal error');
                }
            }
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
//# sourceMappingURL=random.js.map