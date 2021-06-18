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
const TAG = 'account/alloc.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
const arcapi_login_1 = __importDefault(require("../arcfetch/arcapi.login"));
const arcapi_userme_1 = __importDefault(require("../arcfetch/arcapi.userme"));
const database_arcaccount_update_1 = __importDefault(require("../database/database.arcaccount.update"));
exports.default = () => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        let _account;
        while (true) {
            if (!ARCACCOUNT.length)
                return reject(new Error('ARCACCOUNT length is zero'));
            _account = ARCACCOUNT.shift();
            if (typeof _account == 'undefined')
                return reject(new Error('Element is undefined?'));
            if (_account.token == '') {
                try {
                    _account.token = yield arcapi_login_1.default(_account.name, _account.passwd, _account.device);
                }
                catch (e) {
                    if (e == 106) {
                        _account.banned = true;
                        syslog_1.default.w(TAG, `This account has been banned. remove from pool => ${_account.name}`);
                    }
                    syslog_1.default.e(TAG, e.stack);
                }
                finally {
                    if (!_account.banned && (_account.uid == 0 && _account.ucode == '')) {
                        const _info = yield arcapi_userme_1.default(_account);
                        _account.uid = _info.user_id;
                        _account.ucode = _info.user_code;
                    }
                    database_arcaccount_update_1.default(_account);
                    if (!_account.banned && _account.token != '')
                        break;
                }
            }
            else
                break;
        }
        resolve(_account);
        syslog_1.default.i(TAG, `Allocated account => ${_account.name} ${_account.token}`);
    }));
};
//# sourceMappingURL=alloc.js.map