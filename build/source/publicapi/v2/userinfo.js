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
const TAG = 'v2/userinfo.ts\t';
const syslog_1 = __importDefault(require("../../modules/syslog/syslog"));
const apierror_1 = __importDefault(require("../../modules/apierror/apierror"));
const arcapi_friend_add_1 = __importDefault(require("../../modules/arcfetch/arcapi.friend.add"));
const arcapi_friend_clear_1 = __importDefault(require("../../modules/arcfetch/arcapi.friend.clear"));
const alloc_1 = __importDefault(require("../../modules/account/alloc"));
const recycle_1 = __importDefault(require("../../modules/account/recycle"));
const database_arcrecord_update_1 = __importDefault(require("../../modules/database/database.arcrecord.update"));
const database_arcplayer_update_1 = __importDefault(require("../../modules/database/database.arcplayer.update"));
exports.default = (argument) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (typeof argument.usercode == 'undefined' || argument.usercode == '')
                throw new apierror_1.default(-1, 'invalid usercode');
            let _arc_account = null;
            let _arc_friendlist = null;
            let _arc_friend = null;
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
                    syslog_1.default.e(TAG, e.stack);
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
                const _return = JSON.parse(JSON.stringify(_arc_friend));
                _return.recent_score = _arc_friend.recent_score[0];
                if (argument.recent != 'true' || !_arc_friend.recent_score.length)
                    delete _return.recent_score;
                delete _return.code;
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
        }
        catch (e) {
            if (e instanceof apierror_1.default)
                return reject(e);
            syslog_1.default.e(TAG, e.stack);
            return reject(new apierror_1.default(-233, 'unknown error occurred'));
        }
    }));
};
//# sourceMappingURL=userinfo.js.map