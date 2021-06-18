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
const TAG = 'account/alloc.managed.ts';
const crypto_1 = __importDefault(require("crypto"));
const syslog_1 = __importDefault(require("../syslog/syslog"));
const alloc_1 = __importDefault(require("./alloc"));
const recycle_managed_1 = __importDefault(require("./recycle.managed"));
const arcapi_friend_clear_1 = __importDefault(require("../arcfetch/arcapi.friend.clear"));
exports.default = (valid_time, clear = false) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        if (valid_time < BOTARCAPI_FORWARD_TIMESEC_DEFAULT
            || valid_time > BOTARCAPI_FORWARD_TIMESEC_MAX)
            return reject(new Error('Invalid time'));
        let _account;
        try {
            _account = yield alloc_1.default();
        }
        catch (e) {
            return reject(new Error('Allocate account failed'));
        }
        if (clear) {
            try {
                yield arcapi_friend_clear_1.default(_account);
            }
            catch (e) {
                return reject(new Error('Clear friend failed'));
            }
        }
        const _token = crypto_1.default.randomBytes(16).toString('hex');
        ARCPERSISTENT[_token] = {
            feed: 1,
            feeded: 0,
            account: _account,
            validtime: valid_time * 1000
        };
        check_recycle(_token);
        resolve(_token);
    }));
};
const check_recycle = (token) => {
    if (!ARCPERSISTENT[token]) {
        syslog_1.default.w(TAG, 'Token not exists while recycling.');
        return;
    }
    if (--ARCPERSISTENT[token].feed < 0) {
        recycle_managed_1.default(token)
            .catch((e) => { });
        return;
    }
    ARCPERSISTENT[token].proc =
        setTimeout(() => check_recycle(token), ARCPERSISTENT[token].validtime);
};
//# sourceMappingURL=alloc.managed.js.map