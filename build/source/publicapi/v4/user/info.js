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
const TAG = 'v4/user/info.ts\t';
const syslog_1 = __importDefault(require("../../../modules/syslog/syslog"));
const apierror_1 = __importDefault(require("../../../modules/apierror/apierror"));
const arcapi_friend_add_1 = __importDefault(require("../../../modules/arcfetch/arcapi.friend.add"));
const arcapi_friend_clear_1 = __importDefault(require("../../../modules/arcfetch/arcapi.friend.clear"));
const alloc_1 = __importDefault(require("../../../modules/account/alloc"));
const recycle_1 = __importDefault(require("../../../modules/account/recycle"));
const database_arcrecord_update_1 = __importDefault(require("../../../modules/database/database.arcrecord.update"));
const database_arcplayer_update_1 = __importDefault(require("../../../modules/database/database.arcplayer.update"));
const database_arcrecord_byuserid_1 = __importDefault(require("../../../modules/database/database.arcrecord.byuserid"));
const database_arcplayer_byany_1 = __importDefault(require("../../../modules/database/database.arcplayer.byany"));
exports.default = (argument) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if ((typeof argument.user == 'undefined' || argument.user == '')
                && typeof argument.usercode == 'undefined' || argument.usercode == '')
                throw new apierror_1.default(-1, 'invalid username or usercode');
            if (argument.usercode && !(/\d{9}/g.test(argument.usercode)))
                throw new apierror_1.default(-2, 'invalid usercode');
            if (typeof argument.recent == 'undefined' || argument.recent == '')
                argument.recent = 0;
            else if (isNaN(parseFloat(argument.recent)))
                throw new apierror_1.default(-3, 'invalid recent number');
            else
                argument.recent = parseFloat(argument.recent);
            if (argument.recent < 0 || argument.recent > 7)
                throw new apierror_1.default(-4, 'invalid recent number');
            let _arc_ucode = "";
            let _arc_account = null;
            let _arc_friendlist = null;
            let _arc_friend = null;
            if (argument.usercode) {
                _arc_ucode = argument.usercode;
            }
            else if (argument.user) {
                let users;
                try {
                    users = yield database_arcplayer_byany_1.default(argument.user);
                }
                catch (e) {
                    throw new apierror_1.default(-5, 'internal error occurred');
                }
                if (users.length <= 0)
                    throw new apierror_1.default(-6, 'user not found');
                if (users.length > 1)
                    throw new apierror_1.default(-7, 'too many users');
                _arc_ucode = users[0].code;
            }
            if (!_arc_ucode)
                throw new apierror_1.default(-8, 'internal error occurred');
            try {
                _arc_account = yield alloc_1.default();
            }
            catch (e) {
                throw new apierror_1.default(-9, 'allocate an arc account failed');
            }
            try {
                try {
                    yield arcapi_friend_clear_1.default(_arc_account);
                }
                catch (e) {
                    syslog_1.default.e(TAG, e.stack);
                    throw new apierror_1.default(-10, 'clear friend list failed');
                }
                try {
                    _arc_friendlist = yield arcapi_friend_add_1.default(_arc_account, _arc_ucode);
                }
                catch (e) {
                    throw new apierror_1.default(-11, 'add friend failed');
                }
                if (_arc_friendlist.length != 1)
                    throw new apierror_1.default(-12, 'internal error occurred');
                _arc_friend = _arc_friendlist[0];
                _arc_friend.code = _arc_ucode;
                const _return = JSON.parse(JSON.stringify(_arc_friend));
                if (_arc_friend.recent_score.length)
                    yield database_arcrecord_update_1.default(_arc_friend.user_id, _arc_friend.recent_score)
                        .catch((error) => { syslog_1.default.e(error.stack); });
                if (argument.recent == 0) {
                    delete _return.recent_score;
                }
                else {
                    _return.recent_score = yield database_arcrecord_byuserid_1.default(_arc_friend.user_id, argument.recent);
                }
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
        }
        catch (e) {
            if (e instanceof apierror_1.default)
                return reject(e);
            syslog_1.default.e(TAG, e.stack);
            return reject(new apierror_1.default(-233, 'unknown error occurred'));
        }
    }));
};
//# sourceMappingURL=info.js.map