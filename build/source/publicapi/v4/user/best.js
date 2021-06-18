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
const TAG = 'v4/user/best.ts\t';
const utils_1 = __importDefault(require("../../../corefunc/utils"));
const syslog_1 = __importDefault(require("../../../modules/syslog/syslog"));
const apierror_1 = __importDefault(require("../../../modules/apierror/apierror"));
const arcapi_friend_add_1 = __importDefault(require("../../../modules/arcfetch/arcapi.friend.add"));
const arcapi_friend_clear_1 = __importDefault(require("../../../modules/arcfetch/arcapi.friend.clear"));
const arcapi_rank_friend_1 = __importDefault(require("../../../modules/arcfetch/arcapi.rank.friend"));
const alloc_1 = __importDefault(require("../../../modules/account/alloc"));
const recycle_1 = __importDefault(require("../../../modules/account/recycle"));
const database_arcplayer_byany_1 = __importDefault(require("../../../modules/database/database.arcplayer.byany"));
const database_arcsong_bysongid_1 = __importDefault(require("../../../modules/database/database.arcsong.bysongid"));
const database_arcsong_sid_byany_1 = __importDefault(require("../../../modules/database/database.arcsong.sid.byany"));
const database_arcrecord_update_1 = __importDefault(require("../../../modules/database/database.arcrecord.update"));
const database_arcplayer_update_1 = __importDefault(require("../../../modules/database/database.arcplayer.update"));
exports.default = (argument) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if ((typeof argument.user == 'undefined' || argument.user == '')
                && typeof argument.usercode == 'undefined' || argument.usercode == '')
                throw new apierror_1.default(-1, 'invalid username or usercode');
            if (argument.usercode && !(/\d{9}/g.test(argument.usercode)))
                throw new apierror_1.default(-2, 'invalid usercode');
            if (typeof argument.songname == 'undefined' || argument.songname == '')
                throw new apierror_1.default(-3, 'invalid songname');
            if (typeof argument.difficulty == 'undefined' || argument.difficulty == '')
                throw new apierror_1.default(-4, 'invalid difficulty');
            let _arc_difficulty = utils_1.default.arcMapDiffFormat(argument.difficulty, 0);
            if (!_arc_difficulty)
                throw new apierror_1.default(-5, 'invalid difficulty');
            let _arc_ucode = "";
            let _arc_account = null;
            let _arc_songid = null;
            let _arc_songinfo = null;
            let _arc_friendlist = null;
            let _arc_friend = null;
            let _arc_ranklist = null;
            let _arc_rank = null;
            try {
                _arc_songid = yield database_arcsong_sid_byany_1.default(argument.songname);
            }
            catch (e) {
                syslog_1.default.e(TAG, e.stack);
                throw new apierror_1.default(-6, 'this song is not recorded in the database');
            }
            if (_arc_songid.length > 1)
                throw new apierror_1.default(-7, 'too many records');
            _arc_songid = _arc_songid[0];
            try {
                _arc_songinfo = yield database_arcsong_bysongid_1.default(_arc_songid);
            }
            catch (e) {
                syslog_1.default.e(TAG, e.stack);
                throw new apierror_1.default(-8, 'internal error');
            }
            if (_arc_songinfo.difficultly_byn == -1 && _arc_difficulty == 3) {
                throw new apierror_1.default(-9, 'this song has no beyond level');
            }
            if (argument.usercode) {
                _arc_ucode = argument.usercode;
            }
            else if (argument.user) {
                let users;
                try {
                    users = yield database_arcplayer_byany_1.default(argument.user);
                }
                catch (e) {
                    throw new apierror_1.default(-10, 'internal error occurred');
                }
                if (users.length <= 0)
                    throw new apierror_1.default(-11, 'user not found');
                if (users.length > 1)
                    throw new apierror_1.default(-12, 'too many users');
                _arc_ucode = users[0].code;
            }
            if (!_arc_ucode)
                throw new apierror_1.default(-13, 'internal error occurred');
            try {
                _arc_account = yield alloc_1.default();
            }
            catch (e) {
                syslog_1.default.e(TAG, e.stack);
                throw new apierror_1.default(-14, 'allocate an arc account failed');
            }
            try {
                try {
                    yield arcapi_friend_clear_1.default(_arc_account);
                }
                catch (e) {
                    syslog_1.default.e(TAG, e.stack);
                    throw new apierror_1.default(-15, 'clear friend list failed');
                }
                try {
                    _arc_friendlist = yield arcapi_friend_add_1.default(_arc_account, _arc_ucode);
                }
                catch (e) {
                    syslog_1.default.e(TAG, e.stack);
                    throw new apierror_1.default(-16, 'add friend failed');
                }
                if (_arc_friendlist.length != 1)
                    throw new apierror_1.default(-17, 'internal error occurred');
                _arc_friend = _arc_friendlist[0];
                _arc_friend.code = _arc_ucode;
                try {
                    _arc_ranklist = yield arcapi_rank_friend_1.default(_arc_account, _arc_songid, _arc_difficulty);
                }
                catch (e) {
                    syslog_1.default.e(TAG, e.stack);
                    throw new apierror_1.default(-18, 'internal error occurred');
                }
                if (!_arc_ranklist.length)
                    throw new apierror_1.default(-19, 'not played yet');
                _arc_rank = _arc_ranklist[0];
                _arc_rank.rating = utils_1.default.arcCalcSongRating(_arc_rank.score, _arc_songinfo[`rating_${utils_1.default.arcMapDiffFormat(argument.difficulty, 1)}`]);
                const _return = _arc_rank;
                delete _return.name;
                delete _return.user_id;
                delete _return.user_code;
                resolve(_return);
            }
            catch (e) {
                if (_arc_account)
                    recycle_1.default(_arc_account);
                throw e;
            }
            recycle_1.default(_arc_account);
            database_arcplayer_update_1.default(_arc_friend)
                .catch((error) => { syslog_1.default.e(error.stack); });
            if (_arc_friend.recent_score.length)
                database_arcrecord_update_1.default(_arc_friend.user_id, _arc_friend.recent_score)
                    .catch((error) => { syslog_1.default.e(error.stack); });
            database_arcrecord_update_1.default(_arc_friend.user_id, _arc_rank)
                .catch((error) => { syslog_1.default.e(error.stack); });
        }
        catch (e) {
            if (e instanceof apierror_1.default)
                return reject(e);
            syslog_1.default.e(TAG, e.stack);
            return reject(new apierror_1.default(-233, 'unknown error occurred'));
        }
    }));
};
//# sourceMappingURL=best.js.map