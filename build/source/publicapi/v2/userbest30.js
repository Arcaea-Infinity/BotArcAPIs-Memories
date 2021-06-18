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
const TAG = 'v2/userbest30.ts\t';
const syslog_1 = __importDefault(require("../../modules/syslog/syslog"));
const utils_1 = __importDefault(require("../../corefunc/utils"));
const apierror_1 = __importDefault(require("../../modules/apierror/apierror"));
const arcapi_friend_add_1 = __importDefault(require("../../modules/arcfetch/arcapi.friend.add"));
const arcapi_friend_clear_1 = __importDefault(require("../../modules/arcfetch/arcapi.friend.clear"));
const arcapi_aggregate_1 = __importDefault(require("../../modules/arcfetch/arcapi.aggregate"));
const alloc_1 = __importDefault(require("../../modules/account/alloc"));
const recycle_1 = __importDefault(require("../../modules/account/recycle"));
const database_arcrecord_update_1 = __importDefault(require("../../modules/database/database.arcrecord.update"));
const database_arcplayer_update_1 = __importDefault(require("../../modules/database/database.arcplayer.update"));
const database_arcbest30_byuid_1 = __importDefault(require("../../modules/database/database.arcbest30.byuid"));
const database_arcbest30_update_1 = __importDefault(require("../../modules/database/database.arcbest30.update"));
const database_arcsong_allcharts_1 = __importDefault(require("../../modules/database/database.arcsong.allcharts"));
exports.default = (argument) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (typeof argument.usercode == 'undefined' || argument.usercode == '')
                throw new apierror_1.default(-1, 'invalid usercode');
            let _arc_account = null;
            let _arc_friendlist = null;
            let _arc_friend = null;
            let _arc_best30 = null;
            let _arc_best30_cache = null;
            try {
                _arc_account = yield alloc_1.default();
            }
            catch (e) {
                throw new apierror_1.default(-2, 'allocate an arc account failed');
            }
            try {
                try {
                    yield arcapi_friend_clear_1.default(_arc_account);
                }
                catch (e) {
                    throw new apierror_1.default(-3, 'clear friend list failed');
                }
                try {
                    _arc_friendlist = yield arcapi_friend_add_1.default(_arc_account, argument.usercode);
                }
                catch (e) {
                    throw new apierror_1.default(-4, 'add friend failed');
                }
                if (_arc_friendlist.length != 1)
                    throw new apierror_1.default(-5, 'internal error occurred');
                _arc_friend = _arc_friendlist[0];
                _arc_friend.code = argument.usercode;
                if (!_arc_friend.recent_score.length)
                    throw new apierror_1.default(-6, 'not played yet');
                try {
                    _arc_best30_cache = yield database_arcbest30_byuid_1.default(_arc_friend.user_id);
                }
                catch (e) {
                    throw new apierror_1.default(-7, 'internal error occurred');
                }
                if (!_arc_best30_cache ||
                    _arc_best30_cache.last_played < _arc_friend.recent_score[0].time_played) {
                    _arc_best30 = yield do_fetch_userbest30(_arc_account, _arc_friend);
                    _arc_best30.best30_list.forEach((_, index) => {
                        delete _arc_best30.best30_list[index].name;
                        delete _arc_best30.best30_list[index].user_id;
                    });
                    database_arcbest30_update_1.default(_arc_friend.user_id, _arc_best30)
                        .catch((e) => { syslog_1.default.e(TAG, e.stack); });
                    database_arcrecord_update_1.default(_arc_friend.user_id, _arc_best30.best30_list)
                        .catch((e) => { syslog_1.default.e(TAG, e.stack); });
                }
                else
                    _arc_best30 = _arc_best30_cache;
                resolve({
                    best30_avg: _arc_best30.best30_avg,
                    recent10_avg: _arc_best30.recent10_avg,
                    best30_list: _arc_best30.best30_list
                });
            }
            catch (e) {
                if (_arc_account)
                    recycle_1.default(_arc_account);
                throw e;
            }
            recycle_1.default(_arc_account);
            database_arcplayer_update_1.default(_arc_friend)
                .catch((e) => { syslog_1.default.e(TAG, e.stack); });
            if (_arc_friend.recent_score.length)
                database_arcrecord_update_1.default(_arc_friend.user_id, _arc_friend.recent_score)
                    .catch((e) => { syslog_1.default.e(TAG, e.stack); });
        }
        catch (e) {
            if (e instanceof apierror_1.default)
                return reject(e);
            syslog_1.default.e(TAG, e.stack);
            return reject(new apierror_1.default(-233, 'unknown error occurred'));
        }
    }));
};
const do_fetch_userbest30 = (account, userinfo) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let _arc_chartlist = null;
            let _arc_chartuser = [];
            try {
                _arc_chartlist = yield database_arcsong_allcharts_1.default();
            }
            catch (e) {
                throw new apierror_1.default(-8, 'internal error occurred');
            }
            if (!_arc_chartlist) {
                syslog_1.default.f(TAG, 'Fatal error occured when read charts');
                syslog_1.default.f(TAG, 'Consider to update the song database?');
                throw new apierror_1.default(-9, 'internal error occurred');
            }
            try {
                const _chartheap = _arc_chartlist.splice(0, 30);
                for (let i = 0; i < 6; ++i) {
                    const _endpoints = [];
                    for (let j = 0; j < 5; ++j) {
                        const v = _chartheap[i * 5 + j];
                        _endpoints.push(`/score/song/friend?song_id=${v.sid}&difficulty=${v.rating_class}&start=0&limit=1`);
                    }
                    const _result = yield arcapi_aggregate_1.default(account, _endpoints);
                    for (let j = 0; j < 5; ++j) {
                        if (!_result[j])
                            continue;
                        const v = _chartheap[i * 5 + j];
                        if (_result[j].song_id != v.sid || _result[j].difficulty != v.rating_class)
                            return reject(new apierror_1.default(-10, 'internal error occurred'));
                        _result[j].rating = utils_1.default.arcCalcSongRating(_result[j].score, v.rating);
                        _arc_chartuser.push(_result[j]);
                    }
                }
                do_charts_sort(_arc_chartuser);
            }
            catch (e) {
                syslog_1.default.e(TAG, e.stack);
                return reject(new apierror_1.default(-11, 'querying best30 failed'));
            }
            try {
                while (true) {
                    const _chartheap = [];
                    const _endpoints = [];
                    for (let i = 0; i < 5; ++i) {
                        if (_arc_chartlist.length != 0 && (_arc_chartuser.length < 30 ||
                            _arc_chartuser[_arc_chartuser.length - 1].rating - 2 <= _arc_chartlist[0].rating)) {
                            const v = _arc_chartlist.shift();
                            _endpoints.push(`/score/song/friend?song_id=${v.sid}&difficulty=${v.rating_class}&start=0&limit=1`);
                            _chartheap.push(v);
                        }
                        else
                            break;
                    }
                    if (!_endpoints.length)
                        break;
                    const _result = yield arcapi_aggregate_1.default(account, _endpoints);
                    for (let i = 0; i < _chartheap.length; ++i) {
                        if (!_result[i])
                            continue;
                        if (_result[i].song_id != _chartheap[i].sid ||
                            _result[i].difficulty != _chartheap[i].rating_class)
                            return reject(new apierror_1.default(-12, 'internal error occurred'));
                        _result[i].rating = utils_1.default.arcCalcSongRating(_result[i].score, _chartheap[i].rating);
                        if (_arc_chartuser.length < 30) {
                            _arc_chartuser.push(_result[i]);
                            do_charts_sort(_arc_chartuser);
                        }
                        else if (_result[i].rating > _arc_chartuser[_arc_chartuser.length - 1].rating) {
                            _arc_chartuser[_arc_chartuser.length - 1] = _result[i];
                            do_charts_sort(_arc_chartuser);
                        }
                    }
                }
                do_charts_sort(_arc_chartuser);
            }
            catch (e) {
                syslog_1.default.e(TAG, e.stack);
                return reject(new apierror_1.default(-13, 'querying best30 failed'));
            }
            let _best30_sum = 0;
            _arc_chartuser.forEach((element) => { _best30_sum += element.rating; });
            syslog_1.default.d(_best30_sum, userinfo.rating);
            const _best30_avg = _best30_sum / 30;
            const _recent10_avg = userinfo.rating == -1 ? 0 : (userinfo.rating / 100) * 4 - _best30_avg * 3;
            resolve({
                last_played: userinfo.recent_score[0].time_played,
                best30_avg: Math.floor(_best30_avg * 1000) / 1000,
                recent10_avg: Math.floor(_recent10_avg * 1000) / 1000,
                best30_list: _arc_chartuser
            });
        }
        catch (e) {
            return reject(e);
        }
    }));
};
const do_charts_sort = (charts) => {
    charts.sort((x, y) => {
        return y.rating - x.rating;
    });
};
//# sourceMappingURL=userbest30.js.map